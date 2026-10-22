import {DomainError} from "./errors";

/**
 * Analyse une date de naissance au format AAAA-MM-JJ, en UTC.
 * @param {string} iso Date saisie.
 * @return {Date} Date valide (jamais dans le futur).
 */
export function parseBirthDate(iso: unknown): Date {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new DomainError("invalid_birthdate",
      "Date de naissance invalide (format AAAA-MM-JJ).");
  }
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d || y < 1900) {
    throw new DomainError("invalid_birthdate", "Date de naissance invalide.");
  }
  return date;
}

/**
 * Âge révolu à une date donnée.
 * @param {Date} birth Date de naissance.
 * @param {Date} now Date de référence.
 * @return {number} Âge en années révolues.
 */
export function ageAt(birth: Date, now: Date): number {
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < birth.getUTCMonth() ||
    (now.getUTCMonth() === birth.getUTCMonth() &&
      now.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/**
 * Exige l'âge minimum (18 ans) à l'ouverture du compte (section 5).
 * @param {unknown} birthDateIso Date saisie par l'utilisateur.
 * @param {Date} now Date de référence.
 * @param {number} minAge Âge minimum (configuration).
 * @return {Date} Date de naissance validée.
 */
export function assertMinAge(birthDateIso: unknown, now: Date,
  minAge: number): Date {
  const birth = parseBirthDate(birthDateIso);
  if (birth.getTime() > now.getTime()) {
    throw new DomainError("invalid_birthdate",
      "La date de naissance ne peut pas être dans le futur.");
  }
  if (ageAt(birth, now) < minAge) {
    throw new DomainError("underage",
      `Vous devez avoir au moins ${minAge} ans pour créer un compte.`);
  }
  return birth;
}
