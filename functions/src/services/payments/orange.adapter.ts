import {createHmac, timingSafeEqual} from "node:crypto";
import {PaymentRecord} from "../../domain/payment";
import {MobileMoneyAdapter, PaymentInitiationResult, WebhookVerificationResult}
  from "./provider.interface";

export class OrangeMoneyAdapter implements MobileMoneyAdapter {
  readonly operator = "orange_money" as const;
  private readonly webhookSecret: string;

  constructor(webhookSecret = process.env.ORANGE_WEBHOOK_SECRET ?? "") {
    this.webhookSecret = webhookSecret;
  }

  async initiatePayment(
    payment: PaymentRecord,
    _callbackUrl?: string
  ): Promise<PaymentInitiationResult> {
    return {
      paymentId: payment.id,
      providerReference: `om_pay_${payment.id}`,
      checkoutUrl: `https://webpayment.orange.com/pay?token=om_${payment.id}`,
      instructions: "Composez le #144*82# sur votre mobile Orange pour autoriser la transaction.",
      status: "pending",
    };
  }

  async verifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookVerificationResult> {
    if (!this.webhookSecret) {
      // Secret non configuré : on refuse tout webhook (jamais de secret par défaut).
      return {isValid: false, status: "failed", rawPayload: null};
    }
    const rawString = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
    const sigHeader = (headers["x-orange-signature"] ||
      headers["authorization"]) as string | undefined;

    let isValid = false;
    if (sigHeader) {
      const cleanSig = sigHeader.replace(/^Bearer\s+/i, "").trim();
      const expected = createHmac("sha256", this.webhookSecret)
        .update(rawString)
        .digest("hex");

      try {
        const sigBuf = Buffer.from(cleanSig, "hex");
        const expBuf = Buffer.from(expected, "hex");
        if (sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf)) {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
    }

    let payload: {
      order_id?: string;
      pay_token?: string;
      status?: string;
      txnid?: string;
      amount?: number;
    } = {};
    try {
      payload = JSON.parse(rawString);
    } catch {
      return {isValid: false, status: "failed", rawPayload: rawString};
    }

    const isSuccess = payload.status === "SUCCESS" || payload.status === "succeeded";

    return {
      isValid,
      paymentId: payload.order_id,
      providerReference: payload.txnid ?? payload.pay_token,
      status: isSuccess ? "succeeded" : "failed",
      amountPaid: payload.amount,
      currency: "XOF",
      rawPayload: payload,
    };
  }
}
