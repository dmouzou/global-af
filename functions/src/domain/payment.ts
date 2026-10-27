import {DomainError} from "./errors";
import {Operator, OPERATORS, SaleKind} from "./types";

export type PaymentStatus =
  | "initiated"
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded";

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  currency: "XOF";
  operator: Operator;
  phone: string;
  kind: SaleKind;
  plan?: "premium" | "business";
  status: PaymentStatus;
  providerReference?: string;
  transactionReference: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  paidAt?: Date;
  retractionUntil?: Date;
  commissionsAllocated?: boolean;
}

/**
 * Valide les paramètres d'initiation d'un paiement Mobile Money.
 */
export function validatePaymentInitiation(
  amount: number,
  operator: string,
  phone: string,
  minAmount = 500,
  maxAmount = 500000
): { operator: Operator; amount: number } {
  if (!Number.isInteger(amount) || amount < minAmount || amount > maxAmount) {
    throw new DomainError(
      "invalid_amount",
      `Le montant doit être un entier compris entre ${minAmount} et ${maxAmount} XOF.`
    );
  }

  if (!OPERATORS.includes(operator as Operator)) {
    throw new DomainError(
      "invalid_operator",
      `Opérateur Mobile Money non supporté : ${operator}`
    );
  }

  const cleanedPhone = phone.replace(/[\s-]/g, "");
  if (cleanedPhone.length < 8) {
    throw new DomainError(
      "invalid_phone",
      "Numéro de téléphone Mobile Money invalide."
    );
  }

  return {operator: operator as Operator, amount};
}
