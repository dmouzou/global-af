import {DomainError} from "../domain/errors";

type Obj = Record<string, unknown>;

/** Garantit que l'entrée est un objet. */
export function asObject(data: unknown): Obj {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new DomainError("invalid_request", "Requête invalide.");
  }
  return data as Obj;
}

/** Chaîne obligatoire, nettoyée, de longueur bornée. */
export function reqString(data: Obj, key: string, max: number,
  min = 1): string {
  const v = data[key];
  if (typeof v !== "string") {
    throw new DomainError("invalid_request", `Champ « ${key} » requis.`);
  }
  const trimmed = v.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new DomainError("invalid_request", `Champ « ${key} » invalide.`);
  }
  return trimmed;
}

/** Chaîne facultative (undefined si absente ou vide). */
export function optString(data: Obj, key: string,
  max: number): string | undefined {
  const v = data[key];
  if (v === undefined || v === null || v === "") return undefined;
  return reqString(data, key, max);
}

/** Identifiant de requête client (idempotence) : 8 à 64 caractères sûrs. */
export function reqRequestId(data: Obj): string {
  const id = reqString(data, "requestId", 64, 8);
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    throw new DomainError("invalid_request", "Identifiant de requête invalide.");
  }
  return id;
}
