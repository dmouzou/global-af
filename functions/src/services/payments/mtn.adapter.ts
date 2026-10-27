import {createHmac, timingSafeEqual} from "node:crypto";
import {PaymentRecord} from "../../domain/payment";
import {MobileMoneyAdapter, PaymentInitiationResult, WebhookVerificationResult}
  from "./provider.interface";

export class MtnMomoAdapter implements MobileMoneyAdapter {
  readonly operator = "mtn_momo" as const;
  private readonly webhookSecret: string;

  constructor(webhookSecret = process.env.MTN_WEBHOOK_SECRET ?? "dev_mtn_secret") {
    this.webhookSecret = webhookSecret;
  }

  async initiatePayment(payment: PaymentRecord): Promise<PaymentInitiationResult> {
    return {
      paymentId: payment.id,
      providerReference: `mtn_req_${payment.id}`,
      checkoutUrl: undefined,
      instructions: "Une invite de paiement s'affiche sur votre mobile MTN. Validez par PIN.",
      status: "pending",
    };
  }

  async verifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookVerificationResult> {
    const rawString = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
    const sigHeader = (headers["x-momo-signature"] ||
      headers["x-callback-signature"]) as string | undefined;

    let isValid = false;
    if (sigHeader) {
      const expected = createHmac("sha256", this.webhookSecret)
        .update(rawString)
        .digest("hex");

      try {
        const sigBuf = Buffer.from(sigHeader.trim(), "hex");
        const expBuf = Buffer.from(expected, "hex");
        if (sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf)) {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
    }

    let payload: {
      externalId?: string;
      financialTransactionId?: string;
      status?: string;
      amount?: number;
    } = {};
    try {
      payload = JSON.parse(rawString);
    } catch {
      return {isValid: false, status: "failed", rawPayload: rawString};
    }

    const isSuccess = payload.status === "SUCCESSFUL" || payload.status === "succeeded";

    return {
      isValid,
      paymentId: payload.externalId,
      providerReference: payload.financialTransactionId,
      status: isSuccess ? "succeeded" : "failed",
      amountPaid: payload.amount,
      currency: "XOF",
      rawPayload: payload,
    };
  }
}
