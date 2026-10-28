import {createHmac, timingSafeEqual} from "node:crypto";

/**
 * Vérifie une signature HMAC-SHA256 (hex) de webhook.
 * Échoue TOUJOURS si le secret est absent ou vide : un secret par défaut
 * connu (ou une clé vide) permettrait à n'importe qui de forger un
 * paiement « confirmé ».
 * @param {string|undefined} secret Secret partagé avec le prestataire.
 * @param {string} rawBody Corps brut reçu (non reformaté).
 * @param {string} candidate Signature reçue (hex).
 * @return {boolean} true si la signature est valide.
 */
export function verifyHmacSha256Hex(secret: string | undefined,
  rawBody: string, candidate: string): boolean {
  if (!secret) return false;
  if (!/^[0-9a-fA-F]+$/.test(candidate)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(candidate, "hex");
  return received.length === expected.length &&
    timingSafeEqual(received, expected);
}
