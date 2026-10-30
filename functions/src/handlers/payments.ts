import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall, onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {defineSecret} from "firebase-functions/params";
import {Request, Response} from "express";
import {db} from "../lib/db";
import {guard} from "../lib/errors";
import {writeAudit} from "../lib/audit";
import {enforceRateLimit} from "../lib/rateLimit";
import {asObject, optString, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {
  amountMatches, assertSellableProduct, PaymentMethod, PaymentProviderId,
  PaymentRecord, paymentMethodLabel, toDate, validateCheckoutAmount,
} from "../domain/payment";
import {Balances, Posting, Role} from "../domain/types";
import {
  getPaymentProvider, PAYMENT_PROVIDERS,
} from "../services/payments/paymentRegistry";
import {
  assertWithinSpendingLimit, effectiveLimit, monthKey, spentInCurrentMonth,
} from "../domain/spending";
import {computeCommissions, SponsorChain} from "../domain/commission";
import {
  assertRetractableKind, bestRemainingPlan, checkRetraction, computeRefund,
  isRetractableKind,
} from "../domain/retraction";
import {getPlatformConfig} from "../lib/config";
import {readBalances, writeWalletAndLedger} from "../lib/walletStore";
import {applyPosting} from "../domain/ledger";

const FINANCE_ROLES: Role[] = ["financial_manager", "admin", "super_admin"];

/**
 * Crée une notification interne pour un membre (écriture serveur : les
 * règles Firestore interdisent au client d'en créer).
 * @param {FirebaseFirestore.Transaction} tx Transaction en cours.
 * @param {string} userId Destinataire.
 * @param {string} title Titre.
 * @param {string} message Message.
 */
function notify(tx: FirebaseFirestore.Transaction, userId: string,
  title: string, message: string): void {
  tx.set(db.collection("notifications").doc(), {
    userId, title, message, type: "system", read: false,
    createdAt: FieldValue.serverTimestamp(),
  });
}

// Clés sensibles CinetPay : Secret Manager (exposées en variables d'environnement
// uniquement dans les fonctions qui les déclarent). CINETPAY_SITE_ID et
// APP_BASE_URL (non secrets) se règlent dans functions/.env.<projet>.
// NOTE : Laissé vide tant que les clés réelles CinetPay ne sont pas disponibles,
// pour éviter le blocage 'Secret Payload cannot be empty' lors de 'firebase deploy'.
// Pour activer ultérieurement :
//   1. firebase functions:secrets:set CINETPAY_API_KEY
//   2. firebase functions:secrets:set CINETPAY_SECRET_KEY
//   3. Décommenter les deux defineSecret ci-dessous.
const cinetpaySecrets: ReturnType<typeof defineSecret>[] = [
  // defineSecret("CINETPAY_API_KEY"),
  // defineSecret("CINETPAY_SECRET_KEY"),
];

/** Passerelle d'encaissement (CinetPay par défaut ; Wave direct possible). */
function activeProvider(): PaymentProviderId {
  const p = (process.env.PAYMENT_PROVIDER ?? "cinetpay") as PaymentProviderId;
  return PAYMENT_PROVIDERS.includes(p) ? p : "cinetpay";
}

/**
 * Identifiant de transaction : alphanumérique, court, imprévisible
 * (CinetPay exige un identifiant unique).
 * @return {string} Identifiant de paiement.
 */
function newPaymentId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GAF${Date.now().toString(36).toUpperCase()}${rand}`;
}

/**
 * Initialise un paiement en ligne pour un produit du catalogue : Mobile Money
 * (Wave, Orange, MTN, Moov) ou carte bancaire Visa, sur le guichet sécurisé
 * de la passerelle. Le PRIX et le TYPE de vente viennent du catalogue
 * serveur (products/{id}), jamais du navigateur ; aucune donnée de carte ne
 * transite par nos serveurs.
 */
export const initiateOnlinePayment = onCall(
  {secrets: cinetpaySecrets},
  async (request: CallableRequest) => {
    return guard(async () => {
      if (!request.auth) {
        throw new HttpsError("unauthenticated",
          "Connexion requise pour effectuer un paiement.");
      }
      if (request.auth.token.email_verified !== true) {
        throw new DomainError("email_not_verified",
          "Vérifiez votre adresse e-mail avant de payer.");
      }
      const uid = request.auth.uid;
      await enforceRateLimit("initiate_payment", uid, 10, 3600);

      const data = asObject(request.data);
      const method = reqString(data, "method", 20) as PaymentMethod;
      if (method !== "mobile_money" && method !== "card") {
        throw new DomainError("invalid_method",
          "Moyen de paiement non supporté.");
      }
      const productId = reqString(data, "productId", 40);
      if (!/^[a-z0-9_-]+$/.test(productId)) {
        throw new DomainError("product_unavailable",
          "Ce produit n'est pas disponible.");
      }
      let billing: {address: string; city: string; zipCode: string} | undefined;
      if (method === "card") {
        const b = asObject(data.billing);
        billing = {
          address: reqString(b, "address", 120),
          city: reqString(b, "city", 60),
          zipCode: reqString(b, "zipCode", 5),
        };
        if (!/^[0-9A-Za-z-]{3,5}$/.test(billing.zipCode)) {
          throw new DomainError("invalid_zip", "Code postal invalide.");
        }
      }

      const [productSnap, userSnap, platform] = await Promise.all([
        db.collection("products").doc(productId).get(),
        db.collection("users").doc(uid).get(),
        getPlatformConfig(),
      ]);
      const product = assertSellableProduct(
        productSnap.exists ? {...productSnap.data(), id: productSnap.id} :
          undefined);
      if (!userSnap.exists) {
        throw new DomainError("user_not_found", "Profil introuvable.");
      }
      const user = userSnap.data() as {
        firstName: string; lastName: string; email: string; phone: string;
        country: string; status?: string; spentThisMonth?: number;
        spentMonth?: string; spendingLimitMonthly?: number;
        pendingSpendingLimit?: {amount: number; effectiveAtMs: number} | null;
      };
      if (user.status !== undefined && user.status !== "active") {
        throw new DomainError("account_not_active",
          "Votre compte ne permet pas de paiement pour le moment.");
      }
      const amount = validateCheckoutAmount(product.priceXOF);
      // L'abonnement VIP Premium n'est pas remboursable (accès immédiat aux fichiers
      // et contacts VCF téléchargeables) : le membre doit l'avoir reconnu explicitement.
      const nonRefundable = !isRetractableKind(product.kind);
      if (nonRefundable && data.acceptedNoRefund !== true) {
        throw new DomainError("acknowledgement_required",
          "Vous devez reconnaître que l'abonnement VIP Premium n'est pas " +
          "remboursable (accès immédiat aux répertoires VCF) avant de payer.");
      }

      const now = new Date();
      assertWithinSpendingLimit({
        amount,
        spentThisMonth: spentInCurrentMonth(user, now),
        limit: effectiveLimit(user, platform.defaultMonthlyLimit, now),
      });

      const baseUrl = (process.env.APP_BASE_URL ?? "").replace(/\/+$/, "");
      if (!baseUrl.startsWith("https://")) {
        throw new DomainError("provider_not_configured",
          "Le paiement en ligne n'est pas encore configuré.");
      }
      const provider = activeProvider();
      const paymentId = newPaymentId();
      const paymentRef = db.collection("payments").doc(paymentId);
      const record: PaymentRecord = {
        id: paymentId, userId: uid, amount, currency: "XOF", provider, method,
        kind: product.kind, plan: product.id, status: "initiated",
        transactionReference: paymentId, createdAt: now,
      };
      const acknowledgement = nonRefundable ?
        {acceptedNoRefundAt: FieldValue.serverTimestamp()} : {};
      // Le paiement est enregistré AVANT d'ouvrir le guichet : une
      // notification très rapide trouve toujours son enregistrement.
      await paymentRef.set({...record, ...acknowledgement,
        retractable: !nonRefundable, createdAt: FieldValue.serverTimestamp()});

      const projectId = process.env.GCLOUD_PROJECT ?? "global-af-dev";
      let init;
      try {
        init = await getPaymentProvider(provider).initiatePayment(record, {
          notifyUrl: `https://europe-west1-${projectId}.cloudfunctions.net/` +
            `${provider}Webhook`,
          returnUrl: `${baseUrl}/?payment=return&pid=${paymentId}`,
          description: `GLOBAL-AF - ${product.name}`.slice(0, 100),
          customer: {
            firstName: user.firstName, lastName: user.lastName,
            email: user.email, phone: user.phone, country: user.country,
            ...billing,
          },
        });
      } catch (err) {
        await paymentRef.update({status: "failed",
          failureReason: "initiation_failed",
          failedAt: FieldValue.serverTimestamp()});
        throw err;
      }
      await paymentRef.update({
        status: "pending", providerReference: init.providerReference ?? null,
      });
      await writeAudit({
        actorUid: uid, actorRole: "member", action: "payment.initiated",
        target: paymentId, rule: "section 6",
        details: {amount, provider, method, productId: product.id,
          kind: product.kind},
      });
      return {
        success: true, paymentId, checkoutUrl: init.checkoutUrl,
        instructions: init.instructions, status: init.status, amount,
        currency: "XOF",
      };
    });
  });

/**
 * Fabrique le webhook de confirmation d'une passerelle (signature vérifiée,
 * idempotent). Un paiement déjà confirmé ou remboursé n'est JAMAIS modifié
 * par une notification tardive ou rejouée ; un paiement marqué « échoué »
 * peut encore être confirmé (le membre peut réessayer sur le guichet).
 * @param {PaymentProviderId} providerId Passerelle concernée.
 * @param {Array} secrets Secrets Secret Manager nécessaires à la passerelle.
 * @return {Function} Fonction HTTPS Firebase.
 */
function makePaymentWebhook(providerId: PaymentProviderId,
  secrets: ReturnType<typeof defineSecret>[] = []) {
  return onRequest({secrets}, async (req: Request, res: Response): Promise<void> => {
    if (req.method !== "POST") {
      res.status(405).json({error: "Méthode non autorisée"});
      return;
    }
    const rawBody = (req as unknown as {rawBody?: Buffer}).rawBody ??
      JSON.stringify(req.body);
    const headers = req.headers as Record<string, string | string[] |
      undefined>;
    const result = await getPaymentProvider(providerId)
      .verifyWebhook(rawBody, headers);

    // Journal brut de tout appel reçu (valide ou non) pour l'enquête.
    await db.collection("payment_webhooks").doc().set({
      provider: providerId, isValid: result.isValid, status: result.status,
      paymentId: result.paymentId ?? null,
      providerReference: result.providerReference ?? null,
      receivedAt: FieldValue.serverTimestamp(),
      payload: JSON.parse(JSON.stringify(result.rawPayload ?? null)),
    });
    if (!result.isValid || !result.paymentId) {
      res.status(401).json({error: "Notification invalide"});
      return;
    }

    const paymentRef = db.collection("payments").doc(result.paymentId);
    const platform = await getPlatformConfig();
    const outcome = await db.runTransaction(async (tx) => {
      const pmtSnap = await tx.get(paymentRef);
      if (!pmtSnap.exists) return "unknown_payment";
      const pmt = pmtSnap.data() as PaymentRecord;
      if (pmt.provider !== providerId) return "provider_mismatch";
      const failedByAmount = (pmtSnap.data() as {failureReason?: string})
        .failureReason === "amount_mismatch";
      // Idempotence : un paiement confirmé/remboursé ne change plus ; un
      // paiement « échoué » peut encore être confirmé (nouvel essai du
      // membre), sauf s'il a été refusé pour montant incohérent.
      const open = pmt.status === "pending" || pmt.status === "initiated";
      const retryable = pmt.status === "failed" && !failedByAmount &&
        result.status === "succeeded";
      if (!open && !retryable) return "ignored_" + pmt.status;

      // Événement sans effet (ex. échec Wave non définitif : le membre peut
      // réessayer dans la même session) : on n'écrit rien.
      if (result.status === "pending") return "ignored_event";
      if (result.status !== "succeeded") {
        tx.update(paymentRef, {status: "failed",
          failedAt: FieldValue.serverTimestamp()});
        return "marked_failed";
      }
      if (!amountMatches(pmt.amount, result.amountPaid)) {
        tx.update(paymentRef, {status: "failed", failureReason:
          "amount_mismatch", failedAt: FieldValue.serverTimestamp()});
        return "amount_mismatch";
      }

      const now = new Date();
      const reserveUntil = new Date(
        now.getTime() + platform.retractionDays * 24 * 60 * 60 * 1000);
      const retractable = isRetractableKind(pmt.kind);
      const userRef = db.collection("users").doc(pmt.userId);
      const userSnap = await tx.get(userRef);
      const balances: Balances = await readBalances(tx, pmt.userId);

      tx.update(paymentRef, {
        status: "succeeded", paidAt: FieldValue.serverTimestamp(),
        paidWith: result.paidWith ?? null,
        retractionUntil: retractable ? Timestamp.fromDate(reserveUntil) : null,
        providerReference: result.providerReference ?? pmt.providerReference ??
          null,
      });
      if (!userSnap.exists) return "succeeded_no_user";

      const user = userSnap.data() as {
        referredBy?: string; referredByUid?: string; status?: string;
        spentThisMonth?: number; spentMonth?: string;
      };
      const grantsAccess = pmt.kind === "activation" ||
        pmt.kind === "subscription";
      const userUpdate: Record<string, unknown> = {
        spentThisMonth: spentInCurrentMonth(user, now) + pmt.amount,
        spentMonth: monthKey(now),
      };
      // Un achat sans accès (ex. un cours) ne doit JAMAIS modifier l'offre.
      if (grantsAccess) {
        userUpdate.isActivated = true;
        userUpdate.planId = pmt.plan ?? null;
        userUpdate.subscriptionPlan = pmt.plan ?? "premium";
        userUpdate.activatedAt = FieldValue.serverTimestamp();
        userUpdate.activationDate = now.toISOString();
      }
      tx.update(userRef, userUpdate);

      // Historique du ledger : mouvement externe (Mobile Money → plateforme).
      const posting: Posting = {from: "external", to: "external",
        amount: pmt.amount};
      writeWalletAndLedger(tx, pmt.userId, "XOF", balances, [{
        entryId: `pay_${pmt.id}`, userId: pmt.userId,
        type: grantsAccess ? "activation_payment" : "subscription_payment",
        phase: "paid", posting, currency: "XOF",
        origin: `Paiement ${pmt.plan ?? pmt.kind} (${result.paidWith ?? pmt.method})`,
        ref: {kind: "payment", id: pmt.id},
      }]);
      notify(tx, pmt.userId, "Paiement confirmé",
        `Votre paiement de ${pmt.amount.toLocaleString("fr-FR")} XOF est ` +
        "confirmé." + (retractable ? " Vous pouvez vous rétracter pendant " +
          `${platform.retractionDays} jours.` : ""));

      // Commissions : seulement sur ventes réelles, comptes actifs.
      const isUserActive = user.status === "active" ||
        user.status === undefined;
      const sponsorIdentifier = user.referredByUid || user.referredBy;
      if (isUserActive && sponsorIdentifier) {
        const chain = await resolveSponsorChain(tx, user);
        const drafts = computeCommissions(
          {buyerUid: pmt.userId, amount: pmt.amount, kind: pmt.kind},
          chain, platform.affiliation);
        for (const draft of drafts) {
          const commRef = db.collection("commissions").doc();
          tx.set(commRef, {
            id: commRef.id, paymentId: pmt.id,
            beneficiaryUid: draft.beneficiaryUid, buyerUid: pmt.userId,
            level: draft.level, amount: draft.amount, rateBps: draft.rateBps,
            status: "pending_retraction",
            matureAt: Timestamp.fromDate(reserveUntil),
            createdAt: FieldValue.serverTimestamp(),
          });
        }
      }
      return "processed";
    });
    res.status(200).json({status: outcome});
  });
}

export const cinetpayWebhook = makePaymentWebhook("cinetpay", cinetpaySecrets);
export const waveWebhook = makePaymentWebhook("wave");

/**
 * Résout les parrains de niveau 1 et 2 d'un acheteur (comptes actifs
 * seulement). Les lectures passent par la transaction.
 * @param {FirebaseFirestore.Transaction} tx Transaction en cours.
 * @param {object} user Profil de l'acheteur.
 * @return {Promise<SponsorChain>} Chaîne de parrainage.
 */
async function resolveSponsorChain(tx: FirebaseFirestore.Transaction,
  user: {referredBy?: string; referredByUid?: string}): Promise<SponsorChain> {
  type Doc = FirebaseFirestore.DocumentSnapshot;
  const isActive = (d: Doc) => {
    const s = (d.data() as {status?: string}).status;
    return s === "active" || s === undefined;
  };
  const byUidOrCode = async (uid?: string, code?: string):
    Promise<Doc | null> => {
    if (uid) {
      const snap = await tx.get(db.collection("users").doc(uid));
      if (snap.exists) return snap;
    }
    if (code) {
      const q = await tx.get(db.collection("users")
        .where("referralCode", "==", code).limit(1));
      if (!q.empty) return q.docs[0];
    }
    return null;
  };
  const l1 = await byUidOrCode(user.referredByUid, user.referredBy);
  if (!l1 || !isActive(l1)) return {level1Uid: null, level2Uid: null};
  const l1Data = l1.data() as {referredBy?: string; referredByUid?: string};
  const l2 = await byUidOrCode(l1Data.referredByUid, l1Data.referredBy);
  return {
    level1Uid: l1.id,
    level2Uid: l2 && isActive(l2) ? l2.id : null,
  };
}

/**
 * Droit de rétractation (section 6) : annule l'accès, annule les
 * commissions en attente et ouvre une demande de remboursement Mobile Money
 * que la finance exécute et confirme. Aucun argent n'est annoncé comme
 * rendu tant que le remboursement n'est pas confirmé.
 */
export const requestPaymentRetraction = onCall(
  async (request: CallableRequest) => {
    return guard(async () => {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Connexion requise.");
      }
      const uid = request.auth.uid;
      await enforceRateLimit("retraction", uid, 5, 3600);
      const data = asObject(request.data);
      const reason = optString(data, "reason", 500) ?? "";
      const requestedId = optString(data, "paymentId", 80);
      const platform = await getPlatformConfig();

      // Sans identifiant : le dernier Pass d'entrée confirmé (seul le Pass d'entrée
      // est rétractable sous 7 jours ; les abonnements ne le sont pas).
      let paymentId = requestedId;
      if (!paymentId) {
        const q = await db.collection("payments")
          .where("userId", "==", uid).where("status", "==", "succeeded")
          .orderBy("createdAt", "desc").limit(20).get();
        const target = q.docs.find((d) =>
          isRetractableKind((d.data() as PaymentRecord).kind));
        if (!target) {
          throw new DomainError("payment_not_found",
            "Aucun Pass d'entrée confirmé éligible à la rétractation. " +
            "L'abonnement VIP Premium n'est pas remboursable (fichiers VCF).");
        }
        paymentId = target.id;
      }
      const paymentRef = db.collection("payments").doc(paymentId);
      const refundRef = db.collection("refunds").doc(paymentId);

      const outcome = await db.runTransaction(async (tx) => {
        const snap = await tx.get(paymentRef);
        if (!snap.exists) {
          throw new DomainError("payment_not_found", "Paiement introuvable.");
        }
        const pmt = snap.data() as PaymentRecord & {paidAt?: unknown};
        if (pmt.userId !== uid) {
          throw new HttpsError("permission-denied",
            "Ce paiement ne vous appartient pas.");
        }
        assertRetractableKind(pmt.kind);
        // Le contrôle du statut est DANS la transaction : deux demandes
        // simultanées ne peuvent pas ouvrir deux remboursements.
        if (pmt.status !== "succeeded") {
          throw new DomainError("invalid_status",
            "Seul un paiement confirmé peut être remboursé.");
        }
        const verdict = checkRetraction({
          purchasedAt: toDate(pmt.paidAt ?? pmt.createdAt), now: new Date(),
        }, platform);
        if (!verdict.eligible) {
          throw new DomainError("retraction_expired",
            `Le délai de rétractation de ${platform.retractionDays} jours ` +
            "est expiré.");
        }
        const userRef = db.collection("users").doc(uid);
        const userSnap = await tx.get(userRef);
        // Autres paiements confirmés (lus AVANT toute écriture) : si le membre
        // a aussi un Pass d'entrée ou une autre offre valide, il la conserve.
        const others = await tx.get(db.collection("payments")
          .where("userId", "==", uid).where("status", "==", "succeeded"));
        const remainingPlan = bestRemainingPlan(others.docs
          .filter((d) => d.id !== paymentId)
          .map((d) => d.data() as PaymentRecord)
          .filter((p) => p.kind === "activation" || p.kind === "subscription")
          .map((p) => p.plan));
        const now = new Date();
        // Frais de transaction retenus : annoncés avant le paiement.
        const {fee, refund} = computeRefund(pmt.amount, platform.refundFeeBps);
        tx.update(paymentRef, {
          status: "refund_pending", retractedAt: FieldValue.serverTimestamp(),
          refundReason: reason,
        });
        tx.set(refundRef, {
          userId: uid, paymentId, amount: pmt.amount, currency: "XOF",
          feeBps: platform.refundFeeBps, fee, refundAmount: refund,
          provider: pmt.provider, method: pmt.method,
          paidWith: pmt.paidWith ?? null, status: "pending",
          reason, createdAt: FieldValue.serverTimestamp(),
        });
        if (userSnap.exists) {
          const user = userSnap.data() as {
            spentThisMonth?: number; spentMonth?: string;
          };
          const update: Record<string, unknown> = remainingPlan ?
            {isActivated: true, planId: remainingPlan,
              subscriptionPlan: remainingPlan} :
            {isActivated: false, planId: null, subscriptionPlan: "free",
              activatedAt: null, activationDate: null};
          if (user.spentMonth === monthKey(now)) {
            update.spentThisMonth = Math.max(0,
              (user.spentThisMonth ?? 0) - pmt.amount);
          }
          tx.update(userRef, update);
        }
        notify(tx, uid, "Rétractation enregistrée",
          `Remboursement de ${refund.toLocaleString("fr-FR")} XOF ` +
          `(${pmt.amount.toLocaleString("fr-FR")} XOF payés, moins ` +
          `${fee.toLocaleString("fr-FR")} XOF de frais de transaction) ` +
          `par ${paymentMethodLabel(pmt.paidWith, pmt.method)} : en cours ` +
          "de traitement.");
        return {paid: pmt.amount, fee, refund};
      });
      const amount = outcome.paid;

      // Commissions de cette vente : annulées (le crédit n'a lieu qu'après le
      // délai de rétractation, donc rien n'a encore été versé). Le parrainage échoue.
      const comms = await db.collection("commissions")
        .where("paymentId", "==", paymentId)
        .where("status", "==", "pending_retraction").get();
      await Promise.all(comms.docs.map((c) => c.ref.update({
        status: "cancelled_retraction",
        cancelledAt: FieldValue.serverTimestamp(),
      })));

      // Notification du/des parrain(s) : annulation de la commission
      for (const commDoc of comms.docs) {
        const cData = commDoc.data() as {beneficiaryUid?: string};
        if (cData.beneficiaryUid) {
          await db.collection("notifications").doc().set({
            userId: cData.beneficiaryUid,
            title: "Parrainage annulé (rétractation)",
            message: "Votre filleul a exercé son droit de rétractation de 7 jours " +
              "sur son Pass d'entrée. Le parrainage a été annulé et aucune commission " +
              "n'a été versée.",
            type: "system",
            read: false,
            createdAt: FieldValue.serverTimestamp(),
          });
        }
      }

      await writeAudit({
        actorUid: uid, actorRole: "member",
        action: "payment.retraction_requested", target: paymentId,
        rule: "section 6", details: {amount, reason},
      });
      return {
        success: true, refundAmount: outcome.refund, feeAmount: outcome.fee,
        message: "Rétractation enregistrée. Remboursement de " +
          `${outcome.refund.toLocaleString("fr-FR")} XOF (frais de ` +
          `transaction retenus : ${outcome.fee.toLocaleString("fr-FR")} ` +
          "XOF) en cours de traitement vers votre moyen de paiement.",
      };
    });
  });

/**
 * Exécution d'un remboursement par la finance (section 25) : confirme que
 * l'argent a bien été renvoyé par Mobile Money (référence obligatoire).
 */
export const adminProcessRefund = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    const role = request.auth.token.role as Role | undefined;
    if (!role || !FINANCE_ROLES.includes(role)) {
      throw new HttpsError("permission-denied", "Action non autorisée.");
    }
    const data = asObject(request.data);
    const refundId = reqString(data, "refundId", 80);
    const providerReference = reqString(data, "providerReference", 100);
    const refundRef = db.collection("refunds").doc(refundId);
    const paymentRef = db.collection("payments").doc(refundId);

    await db.runTransaction(async (tx) => {
      const refundSnap = await tx.get(refundRef);
      if (!refundSnap.exists) {
        throw new DomainError("not_found", "Remboursement introuvable.");
      }
      const refund = refundSnap.data() as {
        status: string; userId: string; amount: number; method: PaymentMethod;
        paidWith?: string | null; refundAmount?: number;
      };
      if (refund.status !== "pending") {
        throw new DomainError("invalid_status",
          "Ce remboursement est déjà traité.");
      }
      const balances = await readBalances(tx, refund.userId);
      tx.update(refundRef, {
        status: "paid", providerReference, processedBy: request.auth?.uid,
        processedAt: FieldValue.serverTimestamp(),
      });
      tx.update(paymentRef, {status: "refunded",
        refundedAt: FieldValue.serverTimestamp()});
      writeWalletAndLedger(tx, refund.userId, "XOF", balances, [{
        entryId: `refund_${refundId}`, userId: refund.userId, type: "refund",
        phase: "paid", currency: "XOF",
        posting: {from: "external", to: "external",
          amount: refund.refundAmount ?? refund.amount},
        origin: "Remboursement rétractation (" +
          `${paymentMethodLabel(refund.paidWith, refund.method)})`,
        ref: {kind: "payment", id: refundId}, meta: {providerReference},
      }]);
      notify(tx, refund.userId, "Remboursement effectué",
        `${(refund.refundAmount ?? refund.amount).toLocaleString("fr-FR")} ` +
        "XOF ont été renvoyés vers " +
        `votre moyen de paiement (${paymentMethodLabel(refund.paidWith,
          refund.method)}).`);
      await writeAudit({
        actorUid: request.auth?.uid ?? null, actorRole: role,
        action: "refund.paid", target: refundId, rule: "section 6",
        details: {providerReference, amount: refund.refundAmount ?? refund.amount},
      }, tx);
    });
    return {refundId, status: "paid"};
  });
});

/**
 * Crédite les commissions dont le délai de rétractation est échu.
 * Chaque commission est relue DANS la transaction : un double passage (ou
 * un appel manuel concurrent) ne peut pas créditer deux fois.
 * @param {number} maxBatches Nombre maximal de lots de 50.
 * @return {Promise<number>} Nombre de commissions créditées.
 */
async function creditMaturedCommissions(maxBatches: number): Promise<number> {
  let processed = 0;
  for (let batch = 0; batch < maxBatches; batch++) {
    const snapshot = await db.collection("commissions")
      .where("status", "==", "pending_retraction")
      .where("matureAt", "<=", Timestamp.now()).limit(50).get();
    if (snapshot.empty) break;
    for (const doc of snapshot.docs) {
      const done = await db.runTransaction(async (tx) => {
        const fresh = await tx.get(doc.ref);
        const comm = fresh.data() as {
          id: string; beneficiaryUid: string; amount: number; level: number;
          status: string;
        } | undefined;
        if (!comm || comm.status !== "pending_retraction") return false;
        const balances = await readBalances(tx, comm.beneficiaryUid);
        const posting: Posting = {from: "external", to: "available",
          amount: comm.amount};
        tx.update(doc.ref, {status: "credited",
          creditedAt: FieldValue.serverTimestamp()});
        writeWalletAndLedger(tx, comm.beneficiaryUid, "XOF",
          applyPosting(balances, posting), [{
            entryId: `comm_cred_${comm.id}`, userId: comm.beneficiaryUid,
            type: "commission", posting, currency: "XOF",
            origin: `Commission affiliation niveau ${comm.level}`,
            ref: {kind: "commission", id: comm.id},
            meta: {level: comm.level, amount: comm.amount},
          }]);
        notify(tx, comm.beneficiaryUid, "Commission créditée",
          `${comm.amount.toLocaleString("fr-FR")} XOF de commission ` +
          `(niveau ${comm.level}) ont été ajoutés à votre solde.`);
        return true;
      });
      if (done) processed++;
    }
  }
  return processed;
}

/** Déclenchement manuel (super administrateur). */
export const validateMaturedCommissions = onCall(
  async (request: CallableRequest) => {
    return guard(async () => {
      if (!request.auth || request.auth.token.role !== "super_admin") {
        throw new HttpsError("permission-denied",
          "Réservé aux administrateurs.");
      }
      return {success: true, processedCount: await creditMaturedCommissions(1)};
    });
  });

/** Exécution automatique quotidienne (cahier des charges : CRON/jobs). */
export const creditMaturedCommissionsDaily = onSchedule(
  {schedule: "every day 03:00", timeZone: "Africa/Abidjan"},
  async () => {
    const count = await creditMaturedCommissions(10);
    console.log(`Commissions créditées : ${count}`);
  });
