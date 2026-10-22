import {PlatformConfig} from "./types";

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
