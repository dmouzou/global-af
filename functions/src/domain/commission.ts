import {DomainError} from "./errors";
import {percentOfBps} from "./money";
import {AffiliationConfig, SaleKind} from "./types";

export interface CommissionDraft {
  level: 1;
  beneficiaryUid: string;
  amount: number;
  rateBps: number;
}

export interface SponsorChain {
  /** Parrain direct de l'acheteur (niveau 1), sinon null. */
  level1Uid: string | null;
  /** Parrain du parrain (niveau 2) - conservé pour rétro-compatibilité. */
  level2Uid?: string | null;
}

/**
 * Calcule les commissions d'affiliation sur ventes réelles :
 * 1. Un seul niveau de parrainage (parrain direct uniquement).
 * 2. 10 % sur le Pass membre (activation).
 * 3. 5 % sur la PREMIÈRE vente réelle d'un filleul (abonnement, cours, etc.).
 * 4. Jamais d'auto-parrainage.
 *
 * @param {object} sale Vente (acheteur, montant, type, premier achat ou non).
 * @param {SponsorChain} chain Chaîne de parrainage de l'acheteur.
 * @param {AffiliationConfig} config Règles d'affiliation.
 * @return {CommissionDraft[]} Commissions à créer (statut "pending").
 */
export function computeCommissions(
  sale: { buyerUid: string; amount: number; kind: SaleKind; isFirstSale?: boolean },
  chain: SponsorChain,
  config: AffiliationConfig
): CommissionDraft[] {
  if (!config.commissionableKinds.includes(sale.kind)) return [];
  if (!chain.level1Uid || chain.level1Uid === sale.buyerUid) return [];

  const drafts: CommissionDraft[] = [];

  if (sale.kind === "activation") {
    // Taux lu dans la configuration : 0 désactive vraiment la commission.
    const rateBps = config.level1Bps;
    const amount = percentOfBps(sale.amount, rateBps);
    if (amount > 0) {
      drafts.push({level: 1, beneficiaryUid: chain.level1Uid, amount, rateBps});
    }
  } else if (sale.isFirstSale) {
    // 5 % sur la première vente de l'utilisateur parrainé
    const rateBps = config.level2Bps;
    const amount = percentOfBps(sale.amount, rateBps);
    if (amount > 0) {
      drafts.push({level: 1, beneficiaryUid: chain.level1Uid, amount, rateBps});
    }
  }

  const total = drafts.reduce((sum, d) => sum + d.amount, 0);
  if (total > percentOfBps(sale.amount, config.maxTotalBps)) {
    throw new DomainError("commission_cap_exceeded",
      "Le total des commissions dépasse le plafond autorisé.");
  }
  return drafts;
}

/**
 * Valide la configuration d'affiliation (appelée avant chaque sauvegarde
 * depuis le back-office).
 * @param {AffiliationConfig} c Configuration à contrôler.
 */
export function assertAffiliationConfig(c: AffiliationConfig): void {
  const ok = (n: number) => Number.isInteger(n) && n >= 0 && n <= 10000;
  if (!ok(c.level1Bps) || !ok(c.level2Bps) || !ok(c.maxTotalBps)) {
    throw new DomainError("invalid_config", "Taux de commission invalide.");
  }
  if (c.maxLevels < 1 || c.maxLevels > 2) {
    throw new DomainError("invalid_config",
      "Niveaux d'affiliation invalides.");
  }
  if (c.level1Bps > c.maxTotalBps) {
    throw new DomainError("invalid_config",
      "Le taux de commission dépasse le plafond.");
  }
}
