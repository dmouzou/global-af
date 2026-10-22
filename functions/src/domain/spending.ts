import {DomainError} from "./errors";
import {assertPositiveInt} from "./money";

/** Clé du mois civil UTC (la Côte d'Ivoire est à UTC+0), ex. "2026-10". */
export function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1)
    .padStart(2, "0")}`;
}

/**
 * Contrôle du plafond de dépense mensuel (condition 5).
 * @param {object} input Dépenses du mois, plafond, montant du nouvel achat.
 */
export function assertWithinSpendingLimit(
  input: { spentThisMonth: number; limit: number; amount: number }): void {
  assertPositiveInt(input.amount);
  if (input.spentThisMonth + input.amount > input.limit) {
    throw new DomainError("spending_limit_exceeded",
      "Ce paiement dépasserait votre plafond de dépense mensuel.");
  }
}

/**
 * Paiements répétés rapprochés (condition 5) : retourne true si une pause
 * ou une vérification doit être déclenchée. Désactivé tant que la
 * configuration ne définit pas de seuil (null).
 * @param {Date[]} recentPayments Dates des paiements récents.
 * @param {Date} now Instant courant.
 * @param {object|null} rule Fenêtre et nombre max, ou null.
 * @return {boolean} true si le seuil est atteint.
 */
export function isRapidPaymentPattern(recentPayments: Date[], now: Date,
  rule: { windowMinutes: number; maxCount: number } | null): boolean {
  if (rule === null) return false;
  const since = now.getTime() - rule.windowMinutes * 60 * 1000;
  const count = recentPayments.filter((d) => d.getTime() >= since).length;
  return count >= rule.maxCount;
}
