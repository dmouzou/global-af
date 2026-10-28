import {DomainError} from "./errors";
import {Operator, OPERATORS, SaleKind} from "./types";

export type PaymentStatus =
  | "initiated"
  | "pending"
  | "succeeded"
  | "failed"
  | "refund_pending"
  | "refunded";

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  currency: "XOF";
  operator: Operator;
  phone: string;
  kind: SaleKind;
  /** Identifiant du produit du catalogue (products/{id}). */
  plan?: string;
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

export interface ProductDoc {
  id: string;
  name: string;
  priceXOF: number;
  kind: SaleKind;
  active?: boolean;
}

/**
 * Valide un produit du catalogue serveur. Le prix et le type de vente
 * viennent TOUJOURS du serveur : le montant envoyé par le navigateur n'est
 * jamais une source de vérité (sinon un membre paierait 500 XOF un pack à
 * 25 000 XOF).
 * @param {unknown} doc Document products/{id} (ou undefined).
 * @return {ProductDoc} Produit valide.
 */
export function assertSellableProduct(doc: unknown): ProductDoc {
  const p = doc as Partial<ProductDoc> | undefined;
  if (!p || typeof p.id !== "string" || p.active === false) {
    throw new DomainError("product_unavailable",
      "Ce produit n'est pas disponible.");
  }
  if (!Number.isInteger(p.priceXOF) || (p.priceXOF as number) <= 0) {
    throw new DomainError("product_invalid", "Prix du produit invalide.");
  }
  const kinds: SaleKind[] = ["activation", "subscription", "course",
    "partner_campaign"];
  if (!kinds.includes(p.kind as SaleKind)) {
    throw new DomainError("product_invalid", "Type de produit invalide.");
  }
  return p as ProductDoc;
}

/**
 * Le montant confirmé par le prestataire doit être celui attendu.
 * @param {number|undefined} expected Montant du paiement initié.
 * @param {number|undefined} paid Montant annoncé par le webhook.
 * @return {boolean} true si cohérent (ou non fourni par le prestataire).
 */
export function amountMatches(expected: number, paid: number | undefined):
  boolean {
  return paid === undefined || paid === expected;
}

/** Convertit un Timestamp Firestore, une Date ou un nombre en Date. */
export function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  const v = value as {toDate?: () => Date; seconds?: number} | null;
  if (v && typeof v.toDate === "function") return v.toDate();
  if (v && typeof v.seconds === "number") return new Date(v.seconds * 1000);
  if (typeof value === "number") return new Date(value);
  throw new DomainError("invalid_date", "Date invalide.");
}
