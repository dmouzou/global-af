import {randomInt} from "node:crypto";

// Alphabet sans caractères ambigus (0/O, 1/I/L).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Génère un code de parrainage ex. "GAF-CI-7K3M9Q". L'unicité est garantie
 * par l'écriture transactionnelle dans `referralCodes/{code}`.
 * @param {string} countryCode Code pays (ex. "CI").
 * @return {string} Code de parrainage.
 */
export function generateReferralCode(countryCode: string): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `GAF-${countryCode.toUpperCase()}-${suffix}`;
}

/** Forme valide d'un code saisi (insensible à la casse). */
export function normalizeReferralCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toUpperCase();
  return /^GAF-[A-Z]{2}-[A-Z0-9]{6}$/.test(code) ? code : null;
}
