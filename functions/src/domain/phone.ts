import {DomainError} from "./errors";

/**
 * Normalise un numéro de téléphone au format E.164 sans « + »
 * (ex. "2250748921105"). Sert de clé d'unicité (section 5) et de
 * référence Mobile Money.
 * @param {unknown} raw Saisie utilisateur.
 * @param {object} country Indicatif et longueurs nationales acceptées.
 * @return {string} Numéro normalisé.
 */
export function normalizePhone(raw: unknown,
  country: { phonePrefix: string; nationalLengths: number[] }): string {
  if (typeof raw !== "string") {
    throw new DomainError("invalid_phone", "Numéro de téléphone invalide.");
  }
  let digits = raw.replace(/[\s().-]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  if (!/^\d+$/.test(digits)) {
    throw new DomainError("invalid_phone", "Numéro de téléphone invalide.");
  }
  const national = digits.startsWith(country.phonePrefix) ?
    digits.slice(country.phonePrefix.length) : digits;
  if (!country.nationalLengths.includes(national.length)) {
    throw new DomainError("invalid_phone",
      "Numéro de téléphone invalide pour ce pays.");
  }
  return country.phonePrefix + national;
}
