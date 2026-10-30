import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {db} from "../lib/db";
import {getCountryConfig} from "../lib/config";
import {writeAudit} from "../lib/audit";
import {enforceRateLimit} from "../lib/rateLimit";
import {guard} from "../lib/errors";
import {asObject, optString, reqRequestId, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {applyPosting} from "../domain/ledger";
import {
  assertTransition, canProcessWithdrawals, postingForStatus, quoteWithdrawal,
} from "../domain/withdrawal";
import {OPERATORS, Operator, Role, ROLES, WithdrawalStatus} from "../domain/types";
import {readBalances, writeWalletAndLedger} from "../lib/walletStore";

interface WithdrawalDoc {
  userId: string;
  amount: number;
  fee: number;
  net: number;
  currency: string;
  operator: Operator;
  payoutPhone: string;
  status: WithdrawalStatus;
}

/**
 * Demande de retrait (section 20). Contrôle automatique + réservation du
 * montant dans UNE transaction ; un `requestId` rend l'appel idempotent
 * (un double clic ne réserve qu'une fois).
 */
export const requestWithdrawal = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    if (request.auth.token.email_verified !== true) {
      throw new DomainError("email_not_verified",
        "Vérifiez votre adresse e-mail avant de demander un retrait.");
    }
    const uid = request.auth.uid;
    await enforceRateLimit("withdraw", uid, 10, 3600);

    const data = asObject(request.data);
    const requestId = reqRequestId(data);
    const amount = data.amount as number;
    const operator = reqString(data, "operator", 20) as Operator;
    if (!OPERATORS.includes(operator)) {
      throw new DomainError("operator_not_allowed", "Opérateur inconnu.");
    }

    const wdId = `${uid}_${requestId}`;
    const wdRef = db.collection("withdrawals").doc(wdId);

    return db.runTransaction(async (tx) => {
      const existing = await tx.get(wdRef);
      if (existing.exists) {
        return {withdrawalId: wdId, status: (existing.data() as WithdrawalDoc)
          .status, duplicate: true};
      }
      const userSnap = await tx.get(db.collection("users").doc(uid));
      if (!userSnap.exists) {
        throw new DomainError("user_not_found", "Compte introuvable.");
      }
      const user = userSnap.data() as {
        status: string; country: string; phone: string;
        isActivated?: boolean; activatedAt?: unknown;
      };
      if (user.status !== "active") {
        throw new DomainError("account_not_active",
          "Votre compte ne permet pas de retrait pour le moment.");
      }
      // Règle produit : les retraits exigent un Pass actif (condition d'accès
      // affichée avant tout paiement).
      if (!(user.isActivated === true || user.activatedAt)) {
        throw new DomainError("activation_required",
          "Les retraits nécessitent un Pass actif. Activez votre Pass depuis " +
          "votre espace pour demander un retrait.");
      }
      const country = await getCountryConfig(user.country, tx);
      const balances = await readBalances(tx, uid);
      const quote = quoteWithdrawal(
        {amount, operator, available: balances.available},
        country.withdrawal);

      const posting = postingForStatus("reserved", quote.amount)!;
      const next = applyPosting(balances, posting);
      tx.create(wdRef, {
        userId: uid, amount: quote.amount, fee: quote.fee, net: quote.net,
        currency: country.currency, operator,
        // Numéro Mobile Money = numéro d'inscription (section 5).
        payoutPhone: user.phone, status: "reserved" as WithdrawalStatus,
        requestedAt: FieldValue.serverTimestamp(),
        history: [{status: "reserved", at: new Date().toISOString(),
          by: uid}],
      });
      writeWalletAndLedger(tx, uid, country.currency, next, [{
        entryId: `${wdId}_reserve`, userId: uid, type: "withdrawal",
        phase: "reserve", posting, currency: country.currency,
        origin: `Retrait ${operator}`, ref: {kind: "withdrawal", id: wdId},
        meta: {fee: quote.fee, net: quote.net},
      }]);
      await writeAudit({
        actorUid: uid, actorRole: "member", action: "withdrawal.requested",
        target: wdId, rule: "section 20",
        details: {amount: quote.amount, operator},
      }, tx);
      return {withdrawalId: wdId, status: "reserved", duplicate: false};
    });
  });
});

const ACTIONS: Record<string, WithdrawalStatus> = {
  approve: "approved",
  reject: "rejected",
  mark_payout_initiated: "payout_initiated",
  confirm_paid: "paid",
  mark_failed: "failed",
  reconcile: "reconciled",
};

/**
 * Traitement d'un retrait par la finance (sections 20 et 25). Chaque
 * transition est contrôlée par la machine à états du domaine, journalisée,
 * et déplace l'argent via le ledger (libération sur rejet ou échec).
 */
export const adminProcessWithdrawal = onCall(
  async (request: CallableRequest) => {
    return guard(async () => {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Connexion requise.");
      }
      const role = request.auth.token.role as Role | undefined;
      if (!role || !ROLES.includes(role) || !canProcessWithdrawals(role)) {
        throw new HttpsError("permission-denied", "Action non autorisée.");
      }
      const actorUid = request.auth.uid;
      const data = asObject(request.data);
      const withdrawalId = reqString(data, "withdrawalId", 200);
      const action = reqString(data, "action", 30);
      const to = ACTIONS[action];
      if (!to) throw new DomainError("invalid_action", "Action inconnue.");
      const reason = optString(data, "reason", 300);
      const providerReference = optString(data, "providerReference", 100);
      if ((to === "rejected" || to === "failed") && !reason) {
        throw new DomainError("reason_required",
          "Un motif est obligatoire pour un rejet ou un échec.");
      }
      if (to === "paid" && !providerReference) {
        throw new DomainError("reference_required",
          "La référence du prestataire est obligatoire pour confirmer.");
      }

      const wdRef = db.collection("withdrawals").doc(withdrawalId);
      return db.runTransaction(async (tx) => {
        const snap = await tx.get(wdRef);
        if (!snap.exists) {
          throw new DomainError("not_found", "Retrait introuvable.");
        }
        const wd = snap.data() as WithdrawalDoc;
        assertTransition(wd.status, to);
        const posting = postingForStatus(to, wd.amount);
        const entries = [];
        if (posting) {
          const balances = await readBalances(tx, wd.userId);
          const next = applyPosting(balances, posting);
          entries.push({
            entryId: `${withdrawalId}_${to}`, userId: wd.userId,
            type: "withdrawal" as const, phase: to, posting,
            currency: wd.currency, origin: `Retrait ${wd.operator} : ${to}`,
            ref: {kind: "withdrawal", id: withdrawalId},
            meta: {reason: reason ?? null,
              providerReference: providerReference ?? null},
          });
          writeWalletAndLedger(tx, wd.userId, wd.currency, next, entries);
        }
        tx.update(wdRef, {
          status: to, processedBy: actorUid,
          processedAt: FieldValue.serverTimestamp(),
          rejectReason: to === "rejected" || to === "failed" ?
            reason ?? null : FieldValue.delete(),
          providerReference: providerReference ?? FieldValue.delete(),
          history: FieldValue.arrayUnion({
            status: to, at: new Date().toISOString(), by: actorUid,
            reason: reason ?? null,
          }),
        });
        await writeAudit({
          actorUid, actorRole: role, action: `withdrawal.${to}`,
          target: withdrawalId, rule: "section 20 et 25",
          details: {reason: reason ?? null,
            providerReference: providerReference ?? null},
        }, tx);
        return {withdrawalId, status: to};
      });
    });
  });
