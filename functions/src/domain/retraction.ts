import {PlatformConfig, SaleKind} from "./types";
import {DomainError} from "./errors";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Instant où le délai de rétractation se termine. */
export function retractionDeadline(purchasedAt: Date, days: number): Date {
  return new Date(purchasedAt.getTime() + days * DAY_MS);
}

export type RetractionVerdict =
  | { eligible: true }
  | { eligible: false; reason: "expired" | "consumed" };

/**
 * Éligibilité à la rétractation (section 6 et condition 2).
 * @param {object} input Date d'achat, instant courant, consommation (0-1).
 * @param {PlatformConfig} config Configuration plateforme.
 * @return {RetractionVerdict} Verdict.
 */
export function checkRetraction(
  input: { purchasedAt: Date; now: Date; consumption?: number },
  config: Pick<PlatformConfig, "retractionDays" | "retractionMaxConsumption">,
): RetractionVerdict {
  const deadline = retractionDeadline(input.purchasedAt,
    config.retractionDays);
  if (input.now.getTime() > deadline.getTime()) {
    return {eligible: false, reason: "expired"};
  }
  if (config.retractionMaxConsumption !== null &&
    (input.consumption ?? 0) > config.retractionMaxConsumption) {
    return {eligible: false, reason: "consumed"};
  }
  return {eligible: true};
}

/**
 * Seul le Pass d'entrée (kind « activation ») ouvre un droit de rétractation
 * de 7 jours (remboursement - 3 %). L'abonnement VIP Premium (kind « subscription »)
 * n'est pas remboursable car l'accès aux fichiers et contacts VCF est immédiat.
 */
export const RETRACTABLE_KINDS: SaleKind[] = ["activation"];

/**
 * @param {SaleKind} kind Type de vente.
 * @return {boolean} true si la vente ouvre un droit de rétractation.
 */
export function isRetractableKind(kind: SaleKind): boolean {
  return RETRACTABLE_KINDS.includes(kind);
}

/**
 * Refuse la rétractation d'une vente non rétractable.
 * @param {SaleKind} kind Type de vente.
 */
export function assertRetractableKind(kind: SaleKind): void {
  if (!isRetractableKind(kind)) {
    throw new DomainError("not_retractable",
      "L'abonnement VIP Premium n'est pas remboursable (accès immédiat aux fichiers VCF). " +
      "Seul le Pass d'entrée ouvre un droit de rétractation sous 7 jours.");
  }
}

/**
 * Montant remboursé en cas de rétractation : le montant payé moins les frais
 * de transaction retenus (arrondi à l'entier, XOF sans décimales).
 * @param {number} amount Montant payé.
 * @param {number} feeBps Frais retenus en points de base (300 = 3 %).
 * @return {{fee: number, refund: number}} Frais retenus et montant remboursé.
 */
export function computeRefund(amount: number, feeBps: number):
  {fee: number; refund: number} {
  if (!Number.isInteger(amount) || amount <= 0 || !Number.isInteger(feeBps) ||
    feeBps < 0 || feeBps > 10000) {
    throw new DomainError("invalid_refund", "Remboursement invalide.");
  }
  const fee = Math.min(amount, Math.round(amount * feeBps / 10000));
  return {fee, refund: amount - fee};
}
