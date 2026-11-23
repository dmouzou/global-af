import {DomainError} from "./errors";
import {assertAffiliationConfig} from "./commission";
import {CountryConfig, PlatformConfig} from "./types";

/**
 * Modification des paramètres depuis la console (section 25, réservée au
 * super administrateur). Liste blanche stricte : seuls les paramètres
 * ci-dessous sont modifiables, dans des bornes de sécurité codées ici.
 * Un changement ne s'applique qu'aux ventes futures.
 */
export interface FieldChange {field: string; from: unknown; to: unknown}

export const LIMITS = {
  commissionBps: [0, 3000],
  refundFeeBps: [0, 2000],
  subscriptionDays: [1, 366],
  retractionDays: [7, 14],
  aiQuota: [0, 10000],
  withdrawMin: [100, 1000000],
  withdrawMax: [100, 10000000],
  withdrawFeeBps: [0, 1000],
} as const;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function int(v: unknown, label: string, [min, max]: readonly [number, number]):
  number {
  if (typeof v !== "number" || !Number.isInteger(v) || v < min || v > max) {
    throw new DomainError("invalid_config",
      `${label} : entier entre ${min} et ${max}.`);
  }
  return v;
}

function onlyKeys(o: Obj, allowed: string[], where: string): void {
  for (const k of Object.keys(o)) {
    if (!allowed.includes(k)) {
      throw new DomainError("invalid_config",
        `Paramètre non modifiable : ${where}${k}.`);
    }
  }
}

function track(changes: FieldChange[], field: string, from: unknown,
  to: unknown): void {
  if (from !== to) changes.push({field, from, to});
}

/**
 * Applique un patch sur la configuration plateforme.
 * @param {PlatformConfig} cur Configuration actuelle.
 * @param {unknown} patch Modifications demandées.
 * @return {object} Nouvelle configuration et liste des changements.
 */
export function applyPlatformPatch(cur: PlatformConfig, patch: unknown):
  {next: PlatformConfig; changes: FieldChange[]} {
  if (!isObj(patch)) {
    throw new DomainError("invalid_config", "Modification invalide.");
  }
  onlyKeys(patch, ["affiliation", "subscriptionDays", "retractionDays",
    "refundFeeBps", "aiDailyQuota"], "");
  const next: PlatformConfig = JSON.parse(JSON.stringify(cur));
  const changes: FieldChange[] = [];

  if (patch.affiliation !== undefined) {
    if (!isObj(patch.affiliation)) {
      throw new DomainError("invalid_config", "Affiliation invalide.");
    }
    onlyKeys(patch.affiliation, ["level1Bps", "level2Bps", "maxTotalBps"],
      "affiliation.");
    const a = patch.affiliation;
    const labels: Record<string, string> = {
      level1Bps: "Commission sur le Pass",
      level2Bps: "Commission sur la première commande",
      maxTotalBps: "Plafond de commission",
    };
    for (const k of ["level1Bps", "level2Bps", "maxTotalBps"] as const) {
      if (a[k] !== undefined) {
        const v = int(a[k], labels[k], LIMITS.commissionBps);
        track(changes, `affiliation.${k}`, next.affiliation[k], v);
        next.affiliation[k] = v;
      }
    }
    assertAffiliationConfig(next.affiliation);
    if (next.affiliation.level2Bps > next.affiliation.maxTotalBps) {
      throw new DomainError("invalid_config",
        "La commission sur la première commande dépasse le plafond.");
    }
  }
  if (patch.subscriptionDays !== undefined) {
    const v = int(patch.subscriptionDays, "Durée d'abonnement",
      LIMITS.subscriptionDays);
    track(changes, "subscriptionDays", next.subscriptionDays, v);
    next.subscriptionDays = v;
  }
  if (patch.retractionDays !== undefined) {
    const v = int(patch.retractionDays, "Délai de rétractation",
      LIMITS.retractionDays);
    track(changes, "retractionDays", next.retractionDays, v);
    next.retractionDays = v;
  }
  if (patch.refundFeeBps !== undefined) {
    const v = int(patch.refundFeeBps, "Frais de remboursement",
      LIMITS.refundFeeBps);
    track(changes, "refundFeeBps", next.refundFeeBps, v);
    next.refundFeeBps = v;
  }
  if (patch.aiDailyQuota !== undefined) {
    if (!isObj(patch.aiDailyQuota)) {
      throw new DomainError("invalid_config", "Quotas IA invalides.");
    }
    onlyKeys(patch.aiDailyQuota, ["standard", "premium", "business"],
      "aiDailyQuota.");
    for (const k of ["standard", "premium", "business"] as const) {
      const raw = (patch.aiDailyQuota as Obj)[k];
      if (raw !== undefined) {
        const v = int(raw, `Quota IA ${k}`, LIMITS.aiQuota);
        track(changes, `aiDailyQuota.${k}`, next.aiDailyQuota[k], v);
        next.aiDailyQuota[k] = v;
      }
    }
  }
  if (changes.length === 0) {
    throw new DomainError("no_change", "Aucun changement à enregistrer.");
  }
  return {next, changes};
}

/**
 * Applique un patch sur la configuration d'un pays.
 * @param {CountryConfig} cur Configuration actuelle.
 * @param {unknown} patch Modifications demandées.
 * @return {object} Nouvelle configuration et liste des changements.
 */
export function applyCountryPatch(cur: CountryConfig, patch: unknown):
  {next: CountryConfig; changes: FieldChange[]} {
  if (!isObj(patch)) {
    throw new DomainError("invalid_config", "Modification invalide.");
  }
  onlyKeys(patch, ["enabled", "withdrawal"], "");
  const next: CountryConfig = JSON.parse(JSON.stringify(cur));
  const changes: FieldChange[] = [];

  if (patch.enabled !== undefined) {
    if (typeof patch.enabled !== "boolean") {
      throw new DomainError("invalid_config", "Ouverture du pays invalide.");
    }
    track(changes, "enabled", next.enabled, patch.enabled);
    next.enabled = patch.enabled;
  }
  if (patch.withdrawal !== undefined) {
    if (!isObj(patch.withdrawal)) {
      throw new DomainError("invalid_config", "Retraits invalides.");
    }
    onlyKeys(patch.withdrawal, ["minAmount", "maxAmount", "feeBps"],
      "withdrawal.");
    const w = patch.withdrawal;
    if (w.minAmount !== undefined) {
      const v = int(w.minAmount, "Retrait minimum", LIMITS.withdrawMin);
      track(changes, "withdrawal.minAmount", next.withdrawal.minAmount, v);
      next.withdrawal.minAmount = v;
    }
    if (w.maxAmount !== undefined) {
      const v = w.maxAmount === null ? null :
        int(w.maxAmount, "Plafond par retrait", LIMITS.withdrawMax);
      track(changes, "withdrawal.maxAmount", next.withdrawal.maxAmount, v);
      next.withdrawal.maxAmount = v;
    }
    if (w.feeBps !== undefined) {
      const v = int(w.feeBps, "Frais de retrait", LIMITS.withdrawFeeBps);
      track(changes, "withdrawal.feeBps", next.withdrawal.feeBps, v);
      next.withdrawal.feeBps = v;
    }
    if (next.withdrawal.maxAmount !== null &&
      next.withdrawal.maxAmount < next.withdrawal.minAmount) {
      throw new DomainError("invalid_config",
        "Le plafond par retrait est inférieur au minimum.");
    }
  }
  if (changes.length === 0) {
    throw new DomainError("no_change", "Aucun changement à enregistrer.");
  }
  return {next, changes};
}

/** Motif obligatoire d'une modification de paramètres. */
export function assertConfigReason(reason: unknown): string {
  const r = typeof reason === "string" ? reason.trim() : "";
  if (r.length < 10 || r.length > 300) {
    throw new DomainError("reason_required",
      "Un motif de 10 à 300 caractères est obligatoire.");
  }
  return r;
}
