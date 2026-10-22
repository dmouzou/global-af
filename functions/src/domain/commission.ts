import {DomainError} from "./errors";
import {percentOfBps} from "./money";
import {AffiliationConfig, SaleKind} from "./types";

export interface CommissionDraft {
  level: 1 | 2;
  beneficiaryUid: string;
  amount: number;
  rateBps: number;
}

export interface SponsorChain {
  /** Parrain direct de l'acheteur (niveau 1), sinon null. */
  level1Uid: string | null;
  /** Parrain du parrain (niveau 2), sinon null. */
  level2Uid: string | null;
}

/**
 * Calcule les commissions d'une vente RÉELLE (section 9, condition 1).
 * - Aucune commission pour un type de vente non listé (dont "activation").
 * - Jamais pour l'acheteur lui-même (auto-parrainage).
 * - Jamais deux fois la même personne sur une vente (double attribution).
 * - Niveau 2 seulement si `maxLevels` vaut 2 ; niveau 3 inexistant.
 * - Plafond total par rapport au prix.
 * @param {object} sale Vente (acheteur, montant, type).
 * @param {SponsorChain} chain Chaîne de parrainage de l'acheteur.
 * @param {AffiliationConfig} config Règles d'affiliation.
 * @return {CommissionDraft[]} Commissions à créer (statut "pending").
 */
export function computeCommissions(
  sale: { buyerUid: string; amount: number; kind: SaleKind },
  chain: SponsorChain, config: AffiliationConfig): CommissionDraft[] {
  if (!config.commissionableKinds.includes(sale.kind)) return [];
  const drafts: CommissionDraft[] = [];
  const seen = new Set<string>([sale.buyerUid]);

  const push = (level: 1 | 2, uid: string | null, bps: number) => {
    if (!uid || seen.has(uid)) return;
    seen.add(uid);
    const amount = percentOfBps(sale.amount, bps);
    if (amount > 0) {
      drafts.push({level, beneficiaryUid: uid, amount, rateBps: bps});
    }
  };
  push(1, chain.level1Uid, config.level1Bps);
  if (config.maxLevels === 2) push(2, chain.level2Uid, config.level2Bps);

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
  if (c.maxLevels !== 1 && c.maxLevels !== 2) {
    throw new DomainError("invalid_config",
      "Deux niveaux maximum au lancement (section 9).");
  }
  const active = c.level1Bps + (c.maxLevels === 2 ? c.level2Bps : 0);
  if (active > c.maxTotalBps) {
    throw new DomainError("invalid_config",
      "La somme des taux dépasse le plafond.");
  }
}
