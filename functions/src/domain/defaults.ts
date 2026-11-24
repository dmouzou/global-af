import {CountryConfig, PlatformConfig} from "./types";

/**
 * Valeurs du seed, source unique. Elles ne servent JAMAIS à lire la
 * configuration en production (le serveur refuse une configuration
 * incomplète) : seulement à compléter explicitement un document ancien,
 * depuis la console, avec un historique qui le dit.
 */
export const DEFAULT_PLATFORM: PlatformConfig = {
  minAge: 18,
  retractionDays: 7,
  subscriptionDays: 30,
  aiDailyQuota: {standard: 3, premium: 30, business: 30},
  refundFeeBps: 300,
  retractionMaxConsumption: null,
  defaultMonthlyLimit: 50000,
  rapidPayment: null,
  affiliation: {
    level1Bps: 1000,
    level2Bps: 500,
    maxLevels: 1,
    maxTotalBps: 1000,
    commissionableKinds:
      ["activation", "subscription", "course", "partner_campaign"],
  },
};

export const DEFAULT_WITHDRAWAL = {
  minAmount: 2000, maxAmount: null as number | null, feeBps: 150,
  operators: ["wave", "orange_money", "mtn_momo", "moov_money"],
};

type Obj = Record<string, unknown>;

/**
 * Complète un document de configuration ancien avec les valeurs du seed.
 * @param {unknown} raw Document tel que stocké.
 * @return {object} Configuration complète et liste des champs ajoutés.
 */
export function completePlatform(raw: unknown):
  {config: PlatformConfig; filled: string[]} {
  const cur = (raw ?? {}) as Obj;
  const filled: string[] = [];
  const pick = <T>(path: string, v: T | undefined, d: T): T => {
    if (v === undefined) {
      filled.push(path); return d;
    }
    return v;
  };
  const aff = (cur.affiliation ?? {}) as Partial<PlatformConfig["affiliation"]>;
  const ai = (cur.aiDailyQuota ?? {}) as Partial<PlatformConfig["aiDailyQuota"]>;
  const D = DEFAULT_PLATFORM;
  const config: PlatformConfig = {
    minAge: pick("minAge", cur.minAge as number | undefined, D.minAge),
    retractionDays: pick("retractionDays",
      cur.retractionDays as number | undefined, D.retractionDays),
    subscriptionDays: pick("subscriptionDays",
      cur.subscriptionDays as number | undefined, D.subscriptionDays),
    aiDailyQuota: {
      standard: pick("aiDailyQuota.standard", ai.standard,
        D.aiDailyQuota.standard),
      premium: pick("aiDailyQuota.premium", ai.premium,
        D.aiDailyQuota.premium),
      business: pick("aiDailyQuota.business", ai.business,
        D.aiDailyQuota.business),
    },
    refundFeeBps: pick("refundFeeBps",
      cur.refundFeeBps as number | undefined, D.refundFeeBps),
    retractionMaxConsumption: (cur.retractionMaxConsumption ??
      D.retractionMaxConsumption) as PlatformConfig["retractionMaxConsumption"],
    defaultMonthlyLimit: pick("defaultMonthlyLimit",
      cur.defaultMonthlyLimit as number | undefined, D.defaultMonthlyLimit),
    rapidPayment: (cur.rapidPayment ?? D.rapidPayment) as
      PlatformConfig["rapidPayment"],
    affiliation: {
      level1Bps: pick("affiliation.level1Bps", aff.level1Bps,
        D.affiliation.level1Bps),
      level2Bps: pick("affiliation.level2Bps", aff.level2Bps,
        D.affiliation.level2Bps),
      maxLevels: pick("affiliation.maxLevels", aff.maxLevels,
        D.affiliation.maxLevels),
      maxTotalBps: pick("affiliation.maxTotalBps", aff.maxTotalBps,
        D.affiliation.maxTotalBps),
      commissionableKinds: pick("affiliation.commissionableKinds",
        aff.commissionableKinds, D.affiliation.commissionableKinds),
    },
  };
  return {config, filled};
}

/**
 * Complète les règles de retrait d'un pays.
 * @param {CountryConfig} raw Document tel que stocké.
 * @return {object} Configuration complète et liste des champs ajoutés.
 */
export function completeCountry(raw: CountryConfig):
  {config: CountryConfig; filled: string[]} {
  const filled: string[] = [];
  const w = (raw.withdrawal ?? {}) as Partial<CountryConfig["withdrawal"]>;
  const pick = <T>(path: string, v: T | undefined, d: T): T => {
    if (v === undefined) {
      filled.push(`withdrawal.${path}`); return d;
    }
    return v;
  };
  const config: CountryConfig = {
    ...raw,
    withdrawal: {
      minAmount: pick("minAmount", w.minAmount, DEFAULT_WITHDRAWAL.minAmount),
      maxAmount: pick("maxAmount", w.maxAmount, DEFAULT_WITHDRAWAL.maxAmount),
      feeBps: pick("feeBps", w.feeBps, DEFAULT_WITHDRAWAL.feeBps),
      operators: pick("operators", w.operators,
        DEFAULT_WITHDRAWAL.operators) as CountryConfig["withdrawal"]["operators"],
    },
  };
  return {config, filled};
}
