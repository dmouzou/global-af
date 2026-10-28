import {createHmac, timingSafeEqual} from "node:crypto";
import {PaymentRecord} from "../../domain/payment";
import {MobileMoneyAdapter, PaymentInitiationResult, WebhookVerificationResult}
  from "./provider.interface";

export class WaveAdapter implements MobileMoneyAdapter {
  readonly operator = "wave" as const;
  private readonly webhookSecret: string;

  constructor(webhookSecret = process.env.WAVE_WEBHOOK_SECRET ?? "") {
    this.webhookSecret = webhookSecret;
  }

  async initiatePayment(
    payment: PaymentRecord,
    _callbackUrl?: string
  ): Promise<PaymentInitiationResult> {
    const checkoutUrl = `https://pay.wave.com/c/ci_${payment.id}`;
    return {
      paymentId: payment.id,
      providerReference: `wave_sess_${payment.id}`,
      checkoutUrl,
      instructions: "Scannez le QR code ou confirmez dans votre application Wave.",
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
    const sigHeader = (headers["wave-signature"] ||
      headers["Wave-Signature"]) as string | undefined;

    let isValid = false;
    if (sigHeader) {
      const parts = sigHeader.split(",");
      const v1Part = parts.find((p) => p.startsWith("v1=")) || parts[0];
      const signature = v1Part ? v1Part.replace("v1=", "").trim() : sigHeader.trim();

      const expected = createHmac("sha256", this.webhookSecret)
        .update(rawString)
        .digest("hex");

      try {
        const sigBuf = Buffer.from(signature, "hex");
        const expBuf = Buffer.from(expected, "hex");
        if (sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf)) {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
    }

    let payload: {
      client_reference?: string;
      id?: string;
      checkout_status?: string;
      amount?: number;
    } = {};
    try {
      payload = JSON.parse(rawString);
    } catch {
      return {isValid: false, status: "failed", rawPayload: rawString};
    }

    const isSuccess = payload.checkout_status === "complete" ||
      payload.checkout_status === "succeeded";

    return {
      isValid,
      paymentId: payload.client_reference,
      providerReference: payload.id,
      status: isSuccess ? "succeeded" : "failed",
      amountPaid: payload.amount,
      currency: "XOF",
      rawPayload: payload,
    };
  }
}
