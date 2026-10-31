import {db} from "./db";
import {DomainError} from "../domain/errors";
import {assertAffiliationConfig} from "../domain/commission";
import {CountryConfig, PlatformConfig} from "../domain/types";

/**
 * Lit la configuration plateforme. Aucune valeur par défaut silencieuse :
 * si la configuration manque, on échoue (on ne devine jamais un taux).
 * @param {FirebaseFirestore.Transaction} [tx] Transaction éventuelle.
 * @return {Promise<PlatformConfig>} Configuration validée.
 */
export async function getPlatformConfig(
  tx?: FirebaseFirestore.Transaction): Promise<PlatformConfig> {
  const ref = db.collection("config").doc("platform");
  const snap = tx ? await tx.get(ref) : await ref.get();
  if (!snap.exists) {
    throw new DomainError("config_missing",
      "Configuration plateforme absente (lancer le script de seed).");
  }
  const cfg = snap.data() as PlatformConfig;
  assertAffiliationConfig(cfg.affiliation);
  if (!Number.isInteger(cfg.subscriptionDays) || cfg.subscriptionDays < 1 ||
    cfg.subscriptionDays > 366) {
    throw new DomainError("config_invalid",
      "Durée d'abonnement invalide (relancer le script de seed).");
  }
  const q = cfg.aiDailyQuota;
  if (!q || ![q.standard, q.premium, q.business].every(
    (n) => Number.isInteger(n) && n >= 0 && n <= 10000)) {
    throw new DomainError("config_invalid",
      "Quotas IA invalides (relancer le script de seed).");
  }
  if (!Number.isInteger(cfg.refundFeeBps) || cfg.refundFeeBps < 0 ||
    cfg.refundFeeBps > 2000) {
    throw new DomainError("config_invalid",
      "Frais de remboursement invalides (relancer le script de seed).");
  }
  return cfg;
}

/**
 * Lit la configuration d'un pays ouvert.
 * @param {string} code Code pays ISO (ex. "CI").
 * @param {FirebaseFirestore.Transaction} [tx] Transaction éventuelle.
 * @return {Promise<CountryConfig>} Configuration du pays.
 */
export async function getCountryConfig(code: string,
  tx?: FirebaseFirestore.Transaction): Promise<CountryConfig> {
  const ref = db.collection("countries").doc(code.toUpperCase());
  const snap = tx ? await tx.get(ref) : await ref.get();
  if (!snap.exists || (snap.data() as CountryConfig).enabled !== true) {
    throw new DomainError("country_unavailable",
      "GLOBAL-AF n'est pas encore disponible dans ce pays.");
  }
  return snap.data() as CountryConfig;
}
