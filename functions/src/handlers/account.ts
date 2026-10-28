import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {db} from "../lib/db";
import {guard} from "../lib/errors";
import {writeAudit} from "../lib/audit";
import {enforceRateLimit} from "../lib/rateLimit";
import {asObject, optString, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {OPERATORS} from "../domain/types";
import {getPlatformConfig} from "../lib/config";
import {requestLimitChange} from "../domain/spending";

/**
 * Mise à jour du profil par le titulaire. Seuls les champs non sensibles
 * sont modifiables : le numéro de téléphone (clé d'unicité et numéro
 * Mobile Money), l'e-mail, le rôle et les soldes ne le sont jamais ici.
 */
export const updateMyProfile = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    const uid = request.auth.uid;
    await enforceRateLimit("profile_update", uid, 20, 3600);
    const data = asObject(request.data);
    const update: Record<string, unknown> = {};

    if (data.firstName !== undefined) {
      update.firstName = reqString(data, "firstName", 60);
    }
    if (data.lastName !== undefined) {
      update.lastName = reqString(data, "lastName", 60);
    }
    const city = optString(data, "city", 80);
    if (data.city !== undefined) update.city = city ?? "";
    const bio = optString(data, "bio", 300);
    if (data.bio !== undefined) update.bio = bio ?? "";
    if (data.defaultPayoutOperator !== undefined) {
      const op = reqString(data, "defaultPayoutOperator", 20);
      if (!(OPERATORS as readonly string[]).includes(op)) {
        throw new DomainError("operator_not_allowed", "Opérateur inconnu.");
      }
      update.defaultPayoutOperator = op;
    }
    if (Object.keys(update).length === 0) {
      throw new DomainError("nothing_to_update", "Aucune modification.");
    }
    const ref = db.collection("users").doc(uid);
    if (!(await ref.get()).exists) {
      throw new DomainError("user_not_found", "Profil introuvable.");
    }
    await ref.update({...update, updatedAt: FieldValue.serverTimestamp()});
    await writeAudit({
      actorUid: uid, actorRole: "member", action: "profile.updated",
      target: uid, rule: "section 7",
      details: {fields: Object.keys(update)},
    });
    return {updated: Object.keys(update)};
  });
});

/**
 * Plafond de dépense mensuel (condition 5). Une BAISSE est immédiate ; une
 * HAUSSE ne prend effet qu'après 24 h (délai de réflexion), pour limiter
 * les décisions impulsives.
 */
export const setSpendingLimit = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    const uid = request.auth.uid;
    await enforceRateLimit("spending_limit", uid, 10, 3600);
    const data = asObject(request.data);
    const requested = data.limit;
    if (typeof requested !== "number") {
      throw new DomainError("invalid_limit", "Plafond invalide.");
    }
    const platform = await getPlatformConfig();
    const ref = db.collection("users").doc(uid);
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        throw new DomainError("user_not_found", "Profil introuvable.");
      }
      const next = requestLimitChange(snap.data() as never, requested,
        platform.defaultMonthlyLimit, new Date());
      tx.update(ref, {
        spendingLimitMonthly: next.spendingLimitMonthly,
        pendingSpendingLimit: next.pendingSpendingLimit ?? null,
        updatedAt: FieldValue.serverTimestamp(),
      });
      await writeAudit({
        actorUid: uid, actorRole: "member", action: "spending_limit.changed",
        target: uid, rule: "condition 5",
        details: {requested, effectiveNow: next.spendingLimitMonthly,
          delayed: next.pendingSpendingLimit !== null},
      }, tx);
      return next;
    });
    return {
      spendingLimitMonthly: result.spendingLimitMonthly,
      pendingSpendingLimit: result.pendingSpendingLimit ?? null,
    };
  });
});
