import {createHmac, timingSafeEqual} from "node:crypto";
import {PaymentRecord} from "../../domain/payment";
import {MobileMoneyAdapter, PaymentInitiationResult, WebhookVerificationResult}
  from "./provider.interface";

export class MoovMoneyAdapter implements MobileMoneyAdapter {
  readonly operator = "moov_money" as const;
  private readonly webhookSecret: string;

  constructor(webhookSecret = process.env.MOOV_WEBHOOK_SECRET ?? "dev_moov_secret") {
    this.webhookSecret = webhookSecret;
  }

  async initiatePayment(payment: PaymentRecord): Promise<PaymentInitiationResult> {
    return {
      paymentId: payment.id,
      providerReference: `moov_push_${payment.id}`,
      checkoutUrl: undefined,
      instructions: "Validez le push Moov Money ou composez le *155# pour confirmer.",
      status: "pending",
    };
  }

  async verifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookVerificationResult> {
    const rawString = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
    const sigHeader = (headers["x-moov-signature"] ||
      headers["x-flooz-signature"]) as string | undefined;

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
      reference?: string;
      transId?: string;
      status?: string;
      amount?: number;
    } = {};
    try {
      payload = JSON.parse(rawString);
    } catch {
      return {isValid: false, status: "failed", rawPayload: rawString};
    }

    const isSuccess = payload.status === "0" ||
      payload.status === "SUCCESS" ||
      payload.status === "succeeded";

    return {
      isValid,
      paymentId: payload.reference,
      providerReference: payload.transId,
      status: isSuccess ? "succeeded" : "failed",
      amountPaid: payload.amount,
      currency: "XOF",
      rawPayload: payload,
    };
  }
}
