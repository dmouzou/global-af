import {PaymentProviderId, PaymentRecord} from "../../domain/payment";

export interface PaymentInitiationResult {
  paymentId: string;
  providerReference?: string;
  checkoutUrl?: string;
  instructions?: string;
  status: "pending" | "succeeded";
}

/** Informations client transmises à la passerelle (obligatoires pour la carte). */
export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Code pays ISO à 2 lettres. */
  country: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

export interface PaymentInitiationContext {
  /** URL appelée par la passerelle à chaque changement d'état. */
  notifyUrl: string;
  /** Page de retour du membre après le paiement. */
  returnUrl: string;
  description: string;
  customer?: CheckoutCustomer;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  paymentId?: string;
  providerReference?: string;
  /**
   * succeeded : paiement confirmé ; failed : échec ;
   * pending : événement sans effet sur l'état (ex. échec non définitif).
   */
  status: "succeeded" | "failed" | "pending";
  amountPaid?: number;
  currency?: string;
  /** Moyen de paiement réellement utilisé (ex. OM, MOMO, VISA). */
  paidWith?: string;
  rawPayload: unknown;
}

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  initiatePayment(
    payment: PaymentRecord,
    context?: PaymentInitiationContext
  ): Promise<PaymentInitiationResult>;
  verifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookVerificationResult>;
}

/** Ancien nom, conservé pour les tests existants. */
export type MobileMoneyAdapter = PaymentProvider;
