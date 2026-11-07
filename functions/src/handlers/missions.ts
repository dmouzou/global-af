import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {db} from "../lib/db";
import {getCountryConfig} from "../lib/config";
import {writeAudit} from "../lib/audit";
import {notify} from "../lib/notify";
import {enforceRateLimit} from "../lib/rateLimit";
import {guard} from "../lib/errors";
import {asObject, optString, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {applyPosting} from "../domain/ledger";
import {accessStateFromDoc, resolveAccess} from "../domain/subscription";
import {Role, ROLES} from "../domain/types";
import {
  assertEligible, assertSubmissionTransition, canManageMissions,
  canReviewSubmissions, decideOnSubmit, MISSION_STATUSES, MissionStatus,
  submissionId, SubmissionStatus, validateMissionInput, validateProof,
} from "../domain/mission";
import {readBalances, writeWalletAndLedger} from "../lib/walletStore";

const missionRef = (id: string) => db.collection("missions").doc(id);
const secretRef = (id: string) => db.collection("missionSecrets").doc(id);
const submissionRef = (id: string) => db.collection("submissions").doc(id);

function roleOf(request: CallableRequest): Role {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Connexion requise.");
  }
  const role = request.auth.token.role as Role | undefined;
  return role && ROLES.includes(role) ? role : "member";
}

function reqCurrency(data: Record<string, unknown>): string {
  const c = typeof data.currency === "string" ? data.currency.trim() : "XOF";
  if (!/^[A-Z]{3}$/.test(c)) {
    throw new DomainError("invalid_mission", "Devise invalide.");
  }
  return c;
}

interface MissionDoc {
  title: string; status: MissionStatus; startDate: string; endDate: string;
  countries: string[]; requiredLevel: string; isPremiumOnly: boolean;
  quotaMax: number; quotaCurrent: number; rewardAmount: number;
  currency: string; verificationType: "automatic" | "manual" | "hybrid";
}

/**
 * Création / modification d'une mission (sections 10 et 25). Une fois qu'un
 * membre a participé, la récompense et le mode de vérification ne changent
 * plus : la récompense est publiée à l'avance (section 15).
 */
export const adminSaveMission = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    const role = roleOf(request);
    if (!canManageMissions(role)) {
      throw new HttpsError("permission-denied", "Action non autorisée.");
    }
    const actorUid = request.auth!.uid;
    const data = asObject(request.data);
    const input = validateMissionInput(data.mission);
    const currency = reqCurrency(asObject(data.mission));
    const existingId = optString(data, "missionId", 128);
    const ref = existingId ? missionRef(existingId) : db.collection("missions")
      .doc();

    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (existingId && !snap.exists) {
        throw new DomainError("not_found", "Mission introuvable.");
      }
      const {completionCode, ...pub} = input;
      if (snap.exists) {
        const cur = snap.data() as MissionDoc;
        if (cur.quotaCurrent > 0 && (cur.rewardAmount !== input.rewardAmount ||
          cur.verificationType !== input.verificationType ||
          cur.currency !== currency)) {
          throw new DomainError("mission_locked",
            "Des membres ont déjà participé : la récompense, la devise et " +
            "le mode de vérification ne sont plus modifiables.");
        }
        if (input.quotaMax < cur.quotaCurrent) {
          throw new DomainError("invalid_mission",
            "Le quota ne peut pas être inférieur aux participations.");
        }
        tx.update(ref, {
          ...pub, currency, updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        tx.create(ref, {
          ...pub, currency, quotaCurrent: 0, createdBy: actorUid,
          createdAt: FieldValue.serverTimestamp(),
        });
      }
      if (completionCode) {
        tx.set(secretRef(ref.id), {completionCode});
      } else {
        tx.delete(secretRef(ref.id));
      }
      await writeAudit({
        actorUid, actorRole: role,
        action: snap.exists ? "mission.updated" : "mission.created",
        target: ref.id, rule: "section 10",
        details: {status: input.status, reward: input.rewardAmount},
      }, tx);
      return {missionId: ref.id, status: input.status};
    });
  });
});

/** Publication, pause ou archivage d'une mission. */
export const adminSetMissionStatus = onCall(
  async (request: CallableRequest) => {
    return guard(async () => {
      const role = roleOf(request);
      if (!canManageMissions(role)) {
        throw new HttpsError("permission-denied", "Action non autorisée.");
      }
      const data = asObject(request.data);
      const missionId = reqString(data, "missionId", 128);
      const status = reqString(data, "status", 20) as MissionStatus;
      if (!MISSION_STATUSES.includes(status)) {
        throw new DomainError("invalid_mission", "Statut invalide.");
      }
      return db.runTransaction(async (tx) => {
        const snap = await tx.get(missionRef(missionId));
        if (!snap.exists) {
          throw new DomainError("not_found", "Mission introuvable.");
        }
        const cur = snap.data() as MissionDoc;
        if (cur.status === "archived") {
          throw new DomainError("invalid_transition",
            "Une mission archivée ne peut plus être modifiée.");
        }
        tx.update(missionRef(missionId), {
          status, updatedAt: FieldValue.serverTimestamp(),
        });
        await writeAudit({
          actorUid: request.auth!.uid, actorRole: role,
          action: "mission.status", target: missionId, rule: "section 10",
          details: {from: cur.status, to: status},
        }, tx);
        return {missionId, status};
      });
    });
  });

/**
 * Soumission d'une preuve par un membre. Un identifiant déterministe
 * (mission + membre) garantit UNE seule participation (section 26 : double
 * participation). La récompense n'est créditée que sur validation, via le
 * ledger (idempotent).
 */
export const submitMissionProof = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    if (request.auth.token.email_verified !== true) {
      throw new DomainError("email_not_verified",
        "Vérifiez votre adresse e-mail avant de participer.");
    }
    const uid = request.auth.uid;
    const data = asObject(request.data);
    const missionId = reqString(data, "missionId", 128);
    const proof = validateProof(data.proofType, data.proofContent, uid);
    await enforceRateLimit("mission_submit", `${uid}:${missionId}`, 5, 3600);

    const subId = submissionId(missionId, uid);
    const now = new Date();

    return db.runTransaction(async (tx) => {
      const [mSnap, sSecret, uSnap, existing, balances] = await Promise.all([
        tx.get(missionRef(missionId)),
        tx.get(secretRef(missionId)),
        tx.get(db.collection("users").doc(uid)),
        tx.get(submissionRef(subId)),
        readBalances(tx, uid),
      ]);
      if (!mSnap.exists) {
        throw new DomainError("not_found", "Mission introuvable.");
      }
      if (existing.exists) {
        throw new DomainError("already_participated",
          "Vous avez déjà participé à cette mission.");
      }
      if (!uSnap.exists) {
        throw new DomainError("user_not_found", "Compte introuvable.");
      }
      const mission = mSnap.data() as MissionDoc;
      const user = uSnap.data() as {
        status: string; country: string; level?: string;
        firstName?: string; lastName?: string;
        entryPass?: boolean; subscriptionPlan?: string | null;
        subscriptionExpiresAt?: unknown;
      };
      const access = resolveAccess(accessStateFromDoc(user), now);
      assertEligible(mission, {
        status: user.status, country: user.country,
        level: user.level ?? "Starter", isActivated: access.isActivated,
        plan: access.plan,
      }, now);
      const country = await getCountryConfig(user.country, tx);
      if (country.currency !== mission.currency) {
        throw new DomainError("country_not_eligible",
          "Cette mission n'est pas ouverte dans votre pays.");
      }

      const code = sSecret.exists ?
        (sSecret.data() as {completionCode?: string}).completionCode :
        undefined;
      const decision: SubmissionStatus =
        decideOnSubmit(mission.verificationType, code, proof.content);

      tx.create(submissionRef(subId), {
        missionId, missionTitle: mission.title, userId: uid,
        userName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        proofType: proof.type, proofContent: proof.content,
        status: decision, rewardAmount: mission.rewardAmount,
        currency: mission.currency,
        submittedAt: FieldValue.serverTimestamp(),
        ...(decision === "approved" ? {
          reviewedAt: FieldValue.serverTimestamp(), reviewedBy: "system",
          feedback: "Code de fin vérifié automatiquement.",
        } : {}),
      });
      tx.update(missionRef(missionId), {
        quotaCurrent: mission.quotaCurrent + 1,
      });

      if (decision === "approved") {
        const posting = {
          from: "external" as const, to: "available" as const,
          amount: mission.rewardAmount,
        };
        writeWalletAndLedger(tx, uid, mission.currency,
          applyPosting(balances, posting), [{
            entryId: `${subId}_reward`, userId: uid, type: "reward",
            phase: "validate", posting, currency: mission.currency,
            origin: `Mission : ${mission.title}`,
            ref: {kind: "submission", id: subId},
          }]);
        notify(tx, uid, "Mission validée",
          `Votre participation à « ${mission.title} » est validée : ` +
          `${mission.rewardAmount} ${mission.currency} ajoutés à votre solde.`);
      } else {
        notify(tx, uid, "Preuve reçue",
          `Votre participation à « ${mission.title} » est en cours de ` +
          "vérification.");
      }
      await writeAudit({
        actorUid: uid, actorRole: "member", action: "mission.submitted",
        target: subId, rule: "section 10", details: {decision},
      }, tx);
      return {submissionId: subId, status: decision};
    });
  });
});

/**
 * Revue d'une preuve par la modération / le contenu / l'administration.
 * Validation = récompense créditée via le ledger (clé d'idempotence unique) ;
 * refus = motif obligatoire et place rendue au quota.
 */
export const adminReviewSubmission = onCall(
  async (request: CallableRequest) => {
    return guard(async () => {
      const role = roleOf(request);
      if (!canReviewSubmissions(role)) {
        throw new HttpsError("permission-denied", "Action non autorisée.");
      }
      const actorUid = request.auth!.uid;
      const data = asObject(request.data);
      const subId = reqString(data, "submissionId", 300);
      const action = reqString(data, "action", 10);
      if (action !== "approve" && action !== "reject") {
        throw new DomainError("invalid_action", "Action inconnue.");
      }
      const feedback = optString(data, "feedback", 300);
      if (action === "reject" && !feedback) {
        throw new DomainError("reason_required",
          "Un motif est obligatoire pour un refus.");
      }
      const to: SubmissionStatus = action === "approve" ? "approved" :
        "rejected";

      return db.runTransaction(async (tx) => {
        const sSnap = await tx.get(submissionRef(subId));
        if (!sSnap.exists) {
          throw new DomainError("not_found", "Participation introuvable.");
        }
        const sub = sSnap.data() as {
          missionId: string; missionTitle: string; userId: string;
          status: SubmissionStatus; rewardAmount: number; currency: string;
        };
        if (sub.userId === actorUid) {
          throw new DomainError("self_review",
            "Vous ne pouvez pas valider votre propre participation.");
        }
        assertSubmissionTransition(sub.status, to);
        const mSnap = await tx.get(missionRef(sub.missionId));
        const balances = to === "approved" ?
          await readBalances(tx, sub.userId) : null;

        tx.update(submissionRef(subId), {
          status: to, reviewedAt: FieldValue.serverTimestamp(),
          reviewedBy: actorUid, feedback: feedback ?? FieldValue.delete(),
        });
        if (to === "approved" && balances) {
          const posting = {
            from: "external" as const, to: "available" as const,
            amount: sub.rewardAmount,
          };
          writeWalletAndLedger(tx, sub.userId, sub.currency,
            applyPosting(balances, posting), [{
              entryId: `${subId}_reward`, userId: sub.userId,
              type: "reward", phase: "validate", posting,
              currency: sub.currency, origin: `Mission : ${sub.missionTitle}`,
              ref: {kind: "submission", id: subId},
            }]);
          notify(tx, sub.userId, "Mission validée",
            `Votre participation à « ${sub.missionTitle} » est validée : ` +
            `${sub.rewardAmount} ${sub.currency} ajoutés à votre solde.`);
        } else {
          if (mSnap.exists) {
            const cur = (mSnap.data() as MissionDoc).quotaCurrent;
            tx.update(missionRef(sub.missionId), {
              quotaCurrent: Math.max(0, cur - 1),
            });
          }
          notify(tx, sub.userId, "Mission refusée",
            `Votre participation à « ${sub.missionTitle} » a été refusée : ` +
            `${feedback}`);
        }
        await writeAudit({
          actorUid, actorRole: role, action: `submission.${to}`,
          target: subId, rule: "section 10",
          details: {feedback: feedback ?? null, reward: sub.rewardAmount},
        }, tx);
        return {submissionId: subId, status: to};
      });
    });
  });
