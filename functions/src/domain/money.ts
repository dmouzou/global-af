import {DomainError} from "./errors";

/** Vérifie qu'une valeur est un entier strictement positif et sûr. */
export function assertPositiveInt(value: unknown, label = "montant"): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) ||
    value <= 0) {
    throw new DomainError("invalid_amount",
      `Le ${label} doit être un entier strictement positif.`);
  }
  return value;
}

/** Vérifie qu'une valeur est un entier positif ou nul. */
export function assertNonNegativeInt(value: unknown, label = "montant") {
  if (typeof value !== "number" || !Number.isSafeInteger(value) ||
    value < 0) {
    throw new DomainError("invalid_amount",
      `Le ${label} doit être un entier positif ou nul.`);
  }
  return value;
}

/**
 * Calcule `amount * bps / 10000` en arithmétique entière, arrondi à
 * l'entier inférieur (jamais de flottant pour l'argent).
 * @param {number} amount Montant entier.
 * @param {number} bps Taux en points de base (1000 = 10 %).
 * @return {number} Montant entier arrondi vers le bas.
 */
export function percentOfBps(amount: number, bps: number): number {
  assertNonNegativeInt(amount);
  assertNonNegativeInt(bps, "taux");
  return Math.floor((amount * bps) / 10000);
}
