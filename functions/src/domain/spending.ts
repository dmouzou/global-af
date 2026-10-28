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

/** Plafond minimal et maximal que le membre peut se fixer (XOF). */
export const SPENDING_LIMIT_MIN = 10000;
export const SPENDING_LIMIT_MAX = 1000000;
/** Une hausse de plafond ne prend effet qu'après ce délai (protection). */
export const LIMIT_INCREASE_DELAY_MS = 24 * 60 * 60 * 1000;

/**
 * Dépenses du mois courant. Le cumul est remis à zéro à chaque nouveau mois
 * civil : sans cela, le plafond mensuel deviendrait un plafond à vie.
 * @param {object} user Cumul stocké et mois auquel il se rapporte.
 * @param {Date} now Instant courant.
 * @return {number} Dépenses du mois courant.
 */
export function spentInCurrentMonth(
  user: { spentThisMonth?: number; spentMonth?: string }, now: Date): number {
  return user.spentMonth === monthKey(now) ? (user.spentThisMonth ?? 0) : 0;
}

export interface LimitState {
  spendingLimitMonthly?: number;
  pendingSpendingLimit?: { amount: number; effectiveAtMs: number } | null;
}

/**
 * Plafond effectivement applicable : une hausse demandée n'est prise en
 * compte qu'une fois son délai écoulé ; une baisse est immédiate.
 * @param {LimitState} user État du plafond.
 * @param {number} fallback Plafond par défaut de la plateforme.
 * @param {Date} now Instant courant.
 * @return {number} Plafond applicable.
 */
export function effectiveLimit(user: LimitState, fallback: number,
  now: Date): number {
  const base = user.spendingLimitMonthly ?? fallback;
  const pending = user.pendingSpendingLimit;
  if (pending && now.getTime() >= pending.effectiveAtMs) return pending.amount;
  return base;
}

/**
 * Calcule le nouvel état du plafond demandé par le membre.
 * @param {LimitState} user État actuel.
 * @param {number} requested Plafond demandé.
 * @param {number} fallback Plafond par défaut de la plateforme.
 * @param {Date} now Instant courant.
 * @return {LimitState} Nouvel état (baisse immédiate, hausse différée).
 */
export function requestLimitChange(user: LimitState, requested: number,
  fallback: number, now: Date): LimitState {
  if (!Number.isInteger(requested) || requested < SPENDING_LIMIT_MIN ||
    requested > SPENDING_LIMIT_MAX) {
    throw new DomainError("invalid_limit",
      `Le plafond doit être un entier entre ${SPENDING_LIMIT_MIN} et ` +
      `${SPENDING_LIMIT_MAX} XOF.`);
  }
  const current = effectiveLimit(user, fallback, now);
  if (requested <= current) {
    return {spendingLimitMonthly: requested, pendingSpendingLimit: null};
  }
  return {
    spendingLimitMonthly: current,
    pendingSpendingLimit: {
      amount: requested, effectiveAtMs: now.getTime() + LIMIT_INCREASE_DELAY_MS,
    },
  };
}
