import {HttpsError} from "firebase-functions/v2/https";
import {DomainError} from "../domain/errors";

/**
 * Convertit toute erreur en HttpsError exploitable par le client.
 * Les erreurs métier gardent leur code stable ; le reste est masqué.
 * @param {unknown} err Erreur interceptée.
 * @return {HttpsError} Erreur à relancer.
 */
export function toHttpsError(err: unknown): HttpsError {
  if (err instanceof HttpsError) return err;
  if (err instanceof DomainError) {
    return new HttpsError("failed-precondition", err.message,
      {code: err.code});
  }
  console.error("Erreur inattendue", err);
  return new HttpsError("internal", "Une erreur interne est survenue.");
}

/** Exécute un handler en normalisant les erreurs. */
export async function guard<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw toHttpsError(err);
  }
}
