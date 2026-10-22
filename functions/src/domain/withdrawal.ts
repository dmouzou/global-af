import {DomainError} from "./errors";
import {assertPositiveInt, percentOfBps} from "./money";
import {Operator, Posting, Role, WithdrawalRules, WithdrawalStatus}
  from "./types";

/**
 * Workflow de la section 20 : Demande → Contrôle → Réservation →
 * Validation → Paiement → Confirmation → Rapprochement.
 * Le contrôle automatique et la réservation ont lieu dans la même
 * transaction que la demande ; l'état initial est donc "reserved".
 */
const TRANSITIONS: Record<WithdrawalStatus, WithdrawalStatus[]> = {
  reserved: ["approved", "rejected"],
  approved: ["payout_initiated", "rejected"],
  payout_initiated: ["paid", "failed"],
  paid: ["reconciled"],
  reconciled: [],
  rejected: [],
  failed: [],
};

const FINANCE_ROLES: Role[] = ["financial_manager", "admin", "super_admin"];

/** Seuls les gestionnaires financiers et administrateurs agissent. */
export function canProcessWithdrawals(role: Role): boolean {
  return FINANCE_ROLES.includes(role);
}

/**
 * Vérifie une transition d'état de retrait.
 * @param {WithdrawalStatus} from État courant.
 * @param {WithdrawalStatus} to État demandé.
 */
export function assertTransition(from: WithdrawalStatus,
  to: WithdrawalStatus): void {
  if (!TRANSITIONS[from].includes(to)) {
    throw new DomainError("invalid_transition",
      `Transition de retrait interdite : ${from} → ${to}.`);
  }
}

export interface WithdrawalQuote {
  amount: number;
  fee: number;
  net: number;
}

/**
 * Contrôle d'une demande de retrait et calcul des frais.
 * @param {object} input Montant, opérateur et solde disponible.
 * @param {WithdrawalRules} rules Règles du pays.
 * @return {WithdrawalQuote} Montant brut, frais et net versé.
 */
export function quoteWithdrawal(
  input: { amount: number; operator: Operator; available: number },
  rules: WithdrawalRules): WithdrawalQuote {
  const amount = assertPositiveInt(input.amount);
  if (!rules.operators.includes(input.operator)) {
    throw new DomainError("operator_not_allowed",
      "Cet opérateur n'est pas disponible dans votre pays.");
  }
  if (amount < rules.minAmount) {
    throw new DomainError("below_minimum",
      `Le montant minimum de retrait est de ${rules.minAmount}.`);
  }
  if (rules.maxAmount !== null && amount > rules.maxAmount) {
    throw new DomainError("above_maximum",
      `Le montant maximum par retrait est de ${rules.maxAmount}.`);
  }
  if (amount > input.available) {
    throw new DomainError("insufficient_funds", "Solde insuffisant.");
  }
  const fee = percentOfBps(amount, rules.feeBps);
  return {amount, fee, net: amount - fee};
}

/**
 * Mouvement de wallet associé à chaque transition.
 * - reserved : disponible → réservé (à la demande)
 * - rejected / failed : réservé → disponible (libération)
 * - paid : réservé → externe (règlement au prestataire)
 * @param {WithdrawalStatus} to Nouvel état.
 * @param {number} amount Montant brut.
 * @return {Posting|null} Mouvement, ou null s'il n'y en a pas.
 */
export function postingForStatus(to: WithdrawalStatus,
  amount: number): Posting | null {
  switch (to) {
    case "reserved":
      return {from: "available", to: "reserved", amount};
    case "rejected":
    case "failed":
      return {from: "reserved", to: "available", amount};
    case "paid":
      return {from: "reserved", to: "external", amount};
    default:
      return null;
  }
}
