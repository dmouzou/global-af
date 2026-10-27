import {Operator} from "../../domain/types";
import {PaymentRecord} from "../../domain/payment";

export interface PaymentInitiationResult {
  paymentId: string;
  providerReference?: string;
  checkoutUrl?: string;
  instructions?: string;
  status: "pending" | "succeeded";
}

export interface WebhookVerificationResult {
  isValid: boolean;
  paymentId?: string;
  providerReference?: string;
  status: "succeeded" | "failed";
  amountPaid?: number;
  currency?: string;
  rawPayload: unknown;
}

export interface MobileMoneyAdapter {
  readonly operator: Operator;
  initiatePayment(
    payment: PaymentRecord,
    callbackUrl?: string
  ): Promise<PaymentInitiationResult>;
  verifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookVerificationResult>;
}
