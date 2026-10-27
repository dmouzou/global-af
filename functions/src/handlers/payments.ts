import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall, onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import {db} from "../lib/db";
import {guard} from "../lib/errors";
import {writeAudit} from "../lib/audit";
import {enforceRateLimit} from "../lib/rateLimit";
import {asObject, reqNumber, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {PaymentRecord, validatePaymentInitiation} from "../domain/payment";
import {Operator, OPERATORS, Posting, SaleKind} from "../domain/types";
import {getPaymentAdapter} from "../services/payments/paymentRegistry";
import {assertWithinSpendingLimit} from "../domain/spending";
import {computeCommissions, SponsorChain} from "../domain/commission";
import {checkRetraction} from "../domain/retraction";
import {getPlatformConfig} from "../lib/config";
import {readBalances, writeWalletAndLedger} from "../lib/walletStore";
import {applyPosting} from "../domain/ledger";

/**
 * Initialise un paiement Mobile Money pour un abonnement ou un achat utile.
 */
export const initiateMobileMoneyPayment = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise pour effectuer un paiement.");
    }
    const uid = request.auth.uid;
    await enforceRateLimit("initiate_payment", uid, 10, 3600);

    const data = asObject(request.data);
    const rawAmount = reqNumber(data, "amount", 500, 500000);
    const rawOperator = reqString(data, "operator", 20);
    const rawPhone = reqString(data, "phone", 30);
    const plan = data.plan as "premium" | "business" | undefined;
    const kind: SaleKind = (data.kind as SaleKind) || "subscription";

    const {operator, amount} = validatePaymentInitiation(rawAmount, rawOperator, rawPhone);

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      throw new DomainError("user_not_found", "Profil utilisateur introuvable.");
    }
    const userData = userSnap.data() as {
      spentThisMonth?: number;
      spendingLimitMonthly?: number;
      phone: string;
    };

    assertWithinSpendingLimit({
      amount,
      spentThisMonth: userData.spentThisMonth ?? 0,
      limit: userData.spendingLimitMonthly ?? 100000,
    });

    const paymentId = `pmt_${uid}_${Date.now()}`;
    const paymentRecord: PaymentRecord = {
      id: paymentId,
      userId: uid,
      amount,
      currency: "XOF",
      operator,
      phone: rawPhone || userData.phone,
      kind,
      plan,
      status: "pending",
      transactionReference: `TX-${Date.now()}`,
      createdAt: new Date(),
    };

    const adapter = getPaymentAdapter(operator);
    const projectId = process.env.GCLOUD_PROJECT ?? "global-af-dev";
    const callbackUrl =
      `https://europe-west1-${projectId}.cloudfunctions.net/paymentWebhook?operator=${operator}`;
    const initResult = await adapter.initiatePayment(paymentRecord, callbackUrl);

    paymentRecord.providerReference = initResult.providerReference;

    await db.collection("payments").doc(paymentId).set({
      ...paymentRecord,
      createdAt: FieldValue.serverTimestamp(),
    });

    await writeAudit({
      actorUid: uid,
      actorRole: "member",
      action: "payment.initiated",
      target: paymentId,
      rule: "section 6",
      details: {amount, operator, plan, kind},
    });

    return {
      success: true,
      paymentId,
      checkoutUrl: initResult.checkoutUrl,
      instructions: initResult.instructions,
      status: initResult.status,
    };
  });
});

/**
 * Webhook unifié de confirmation de paiement Mobile Money avec signature cryptographique.
 */
export const paymentWebhook = onRequest(async (req: Request, res: Response): Promise<void> => {
  const operatorParam = (req.query.operator as string)?.toLowerCase();
  if (!operatorParam || !OPERATORS.includes(operatorParam as Operator)) {
    res.status(400).json({error: "Opérateur manquant ou invalide"});
    return;
  }

  const operator = operatorParam as Operator;
  const adapter = getPaymentAdapter(operator);

  const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody ?? JSON.stringify(req.body);
  const headers = req.headers as Record<string, string | string[] | undefined>;
  const result = await adapter.verifyWebhook(rawBody, headers);

  const auditRef = db.collection("payment_webhooks").doc();
  await auditRef.set({
    operator,
    isValid: result.isValid,
    status: result.status,
    paymentId: result.paymentId ?? null,
    providerReference: result.providerReference ?? null,
    receivedAt: FieldValue.serverTimestamp(),
    payload: result.rawPayload,
  });

  if (!result.isValid || !result.paymentId) {
    res.status(401).json({error: "Signature de webhook invalide"});
    return;
  }

  if (result.status !== "succeeded") {
    await db.collection("payments").doc(result.paymentId).update({
      status: "failed",
      failedAt: FieldValue.serverTimestamp(),
    });
    res.status(200).json({status: "marked_failed"});
    return;
  }

  const paymentRef = db.collection("payments").doc(result.paymentId);
  const platform = await getPlatformConfig();

  await db.runTransaction(async (tx) => {
    const pmtSnap = await tx.get(paymentRef);
    if (!pmtSnap.exists) return;
    const pmt = pmtSnap.data() as PaymentRecord;
    if (pmt.status === "succeeded") return;

    const now = new Date();
    const retractionUntil = new Date(now.getTime() + platform.retractionDays * 24 * 60 * 60 * 1000);

    tx.update(paymentRef, {
      status: "succeeded",
      paidAt: FieldValue.serverTimestamp(),
      retractionUntil: Timestamp.fromDate(retractionUntil),
      providerReference: result.providerReference ?? pmt.providerReference ?? null,
    });

    const userRef = db.collection("users").doc(pmt.userId);
    const userSnap = await tx.get(userRef);
    if (userSnap.exists) {
      const user = userSnap.data() as {
        referredBy?: string;
        referredByUid?: string;
        status?: string;
        spentThisMonth?: number;
      };

      // Si le compte de l'utilisateur n'est pas actif (désactivé ou supprimé), pas de parrainage
      const isUserActive = user.status === "active" || user.status === undefined;

      tx.update(userRef, {
        isActivated: true,
        subscriptionPlan: pmt.plan ?? (pmt.kind === "subscription" ? "premium" : "free"),
        activationDate: now.toISOString(),
        spentThisMonth: (user.spentThisMonth ?? 0) + pmt.amount,
      });

      // Le parrainage continue pour chaque dépense (abonnement mensuel récurrent, etc.)
      // mais prend fin si l'une des parties est désactivée ou supprimée.
      const sponsorIdentifier = user.referredByUid || user.referredBy;
      if (isUserActive && sponsorIdentifier) {
        let level1Uid: string | null = null;
        let level2Uid: string | null = null;

        // Résolution Sponsor Niveau 1
        let l1Doc = null;
        if (user.referredByUid) {
          const directSnap = await tx.get(db.collection("users").doc(user.referredByUid));
          if (directSnap.exists) l1Doc = directSnap;
        }
        if (!l1Doc && user.referredBy) {
          const l1Query = await db.collection("users")
            .where("referralCode", "==", user.referredBy)
            .limit(1)
            .get();
          if (!l1Query.empty) l1Doc = l1Query.docs[0];
        }

        if (l1Doc) {
          const l1Data = l1Doc.data() as {
            referredBy?: string;
            referredByUid?: string;
            status?: string;
          };
          // Le parrain niveau 1 doit être actif
          if (l1Data.status === "active" || l1Data.status === undefined) {
            level1Uid = l1Doc.id;

            // Résolution Sponsor Niveau 2
            let l2Doc = null;
            if (l1Data.referredByUid) {
              const directL2Snap = await tx.get(db.collection("users").doc(l1Data.referredByUid));
              if (directL2Snap.exists) l2Doc = directL2Snap;
            }
            if (!l2Doc && l1Data.referredBy) {
              const l2Query = await db.collection("users")
                .where("referralCode", "==", l1Data.referredBy)
                .limit(1)
                .get();
              if (!l2Query.empty) l2Doc = l2Query.docs[0];
            }

            if (l2Doc) {
              const l2Data = l2Doc.data() as { status?: string };
              // Le parrain niveau 2 doit également être actif
              if (l2Data.status === "active" || l2Data.status === undefined) {
                level2Uid = l2Doc.id;
              }
            }
          }
        }

        const chain: SponsorChain = {level1Uid, level2Uid};
        const drafts = computeCommissions(
          {buyerUid: pmt.userId, amount: pmt.amount, kind: pmt.kind},
          chain,
          platform.affiliation
        );

        for (const draft of drafts) {
          const commRef = db.collection("commissions").doc();
          tx.set(commRef, {
            id: commRef.id,
            paymentId: pmt.id,
            beneficiaryUid: draft.beneficiaryUid,
            buyerUid: pmt.userId,
            level: draft.level,
            amount: draft.amount,
            rateBps: draft.rateBps,
            status: "pending_retraction",
            matureAt: Timestamp.fromDate(retractionUntil),
            createdAt: FieldValue.serverTimestamp(),
          });
        }
      }
    }
  });

  res.status(200).json({status: "processed"});
});

/**
 * Demande d'exercice du droit de rétractation de 7 jours (section 6).
 */
export const requestPaymentRetraction = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    const uid = request.auth.uid;
    const data = asObject(request.data);
    const paymentId = reqString(data, "paymentId", 64);
    const reason = reqString(data, "reason", 500);

    const paymentRef = db.collection("payments").doc(paymentId);
    const pmtSnap = await paymentRef.get();
    if (!pmtSnap.exists) {
      throw new DomainError("payment_not_found", "Paiement introuvable.");
    }
    const pmt = pmtSnap.data() as PaymentRecord;
    if (pmt.userId !== uid) {
      throw new HttpsError("permission-denied", "Ce paiement ne vous appartient pas.");
    }
    if (pmt.status !== "succeeded") {
      throw new DomainError("invalid_status", "Seul un paiement confirmé peut être remboursé.");
    }

    const platform = await getPlatformConfig();
    const verdict = checkRetraction(
      {purchasedAt: pmt.createdAt, now: new Date()},
      platform
    );
    if (!verdict.eligible) {
      throw new DomainError(
        "retraction_expired",
        "Le délai légal de rétractation de 7 jours est expiré."
      );
    }

    await db.runTransaction(async (tx) => {
      tx.update(paymentRef, {
        status: "refunded",
        refundedAt: FieldValue.serverTimestamp(),
        refundReason: reason,
      });

      const userRef = db.collection("users").doc(uid);
      tx.update(userRef, {
        isActivated: false,
        subscriptionPlan: "free",
      });

      const commsQuery = await db.collection("commissions")
        .where("paymentId", "==", paymentId)
        .where("status", "==", "pending_retraction")
        .get();

      for (const cDoc of commsQuery.docs) {
        tx.update(cDoc.ref, {
          status: "cancelled_retraction",
          cancelledAt: FieldValue.serverTimestamp(),
        });
      }
    });

    await writeAudit({
      actorUid: uid,
      actorRole: "member",
      action: "payment.retraction_granted",
      target: paymentId,
      rule: "section 6",
      details: {amount: pmt.amount, reason},
    });

    return {success: true, message: "Rétractation acceptée et remboursement initié."};
  });
});

/**
 * Valide les commissions d'affiliation dont la période de rétractation est échue.
 */
export const validateMaturedCommissions = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth || request.auth.token.role !== "super_admin") {
      throw new HttpsError("permission-denied", "Réservé aux administrateurs.");
    }

    const now = Timestamp.now();
    const snapshot = await db.collection("commissions")
      .where("status", "==", "pending_retraction")
      .where("matureAt", "<=", now)
      .limit(50)
      .get();

    let processedCount = 0;
    for (const doc of snapshot.docs) {
      const comm = doc.data() as {
        id: string;
        beneficiaryUid: string;
        amount: number;
        level: number;
      };

      await db.runTransaction(async (tx) => {
        tx.update(doc.ref, {
          status: "credited",
          creditedAt: FieldValue.serverTimestamp(),
        });

        const balances = await readBalances(tx, comm.beneficiaryUid);
        const posting: Posting = {
          from: "external",
          to: "available",
          amount: comm.amount,
        };
        const nextBalances = applyPosting(balances, posting);

        writeWalletAndLedger(
          tx,
          comm.beneficiaryUid,
          "XOF",
          nextBalances,
          [{
            entryId: `comm_cred_${comm.id}`,
            userId: comm.beneficiaryUid,
            type: "commission",
            posting,
            currency: "XOF",
            origin: `Commission affiliation niveau ${comm.level}`,
            ref: {kind: "payment", id: comm.id},
            meta: {level: comm.level, amount: comm.amount},
          }]
        );
      });
      processedCount++;
    }

    return {success: true, processedCount};
  });
});
