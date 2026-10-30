/**
 * Types métier partagés (cahier des charges v1.2, sections 3, 8, 9, 20, 29).
 * Tous les montants sont des ENTIERS dans la plus petite unité de la devise
 * (le XOF n'a pas de sous-unité). Aucun flottant n'est utilisé pour l'argent.
 */

export const ROLES = [
  "member",
  "member_premium",
  "moderator",
  "support",
  "financial_manager",
  "content_manager",
  "admin",
  "super_admin",
] as const;
export type Role = typeof ROLES[number];

export const OPERATORS = [
  "wave",
  "orange_money",
  "mtn_momo",
  "moov_money",
] as const;
export type Operator = typeof OPERATORS[number];

/** Compartiments d'un wallet (section 8). */
export type Bucket = "available" | "pending" | "reserved";

/** Types de transactions (section 8). */
export type LedgerType =
  | "reward"
  | "bonus"
  | "commission"
  | "withdrawal"
  | "activation_payment"
  | "subscription_payment"
  | "refund"
  | "adjustment";

/**
 * Un mouvement. `from`/`to` valent un compartiment du wallet ou "external"
 * (argent hors wallet : Mobile Money, plateforme). Un mouvement
 * entièrement externe n'a aucun effet sur le wallet mais est historisé.
 */
export interface Posting {
  from: Bucket | "external";
  to: Bucket | "external";
  amount: number;
}

export interface Balances {
  available: number;
  pending: number;
  reserved: number;
}

export type WithdrawalStatus =
  | "reserved"
  | "approved"
  | "payout_initiated"
  | "paid"
  | "reconciled"
  | "rejected"
  | "failed";

export type CommissionStatus = "pending" | "validated" | "cancelled";

/** Type de produit vendu. Seuls certains ouvrent droit à commission. */
export type SaleKind =
  | "activation"
  | "subscription"
  | "course"
  | "partner_campaign";

export interface AffiliationConfig {
  /** Taux en points de base : 1000 = 10 %. */
  level1Bps: number;
  level2Bps: number;
  /** Niveaux actifs, 2 au maximum au lancement (section 9). */
  maxLevels: 1 | 2;
  /** Plafond total par rapport au prix de vente, en points de base. */
  maxTotalBps: number;
  /** Types de vente ouvrant droit à commission. */
  commissionableKinds: SaleKind[];
}

export interface WithdrawalRules {
  minAmount: number;
  /** Plafond par retrait ; null = aucun plafond configuré. */
  maxAmount: number | null;
  feeBps: number;
  operators: Operator[];
}

export interface CountryConfig {
  code: string;
  enabled: boolean;
  currency: string;
  /** Indicatif sans « + », ex. "225". */
  phonePrefix: string;
  /** Longueurs acceptées du numéro national (sans indicatif). */
  nationalLengths: number[];
  withdrawal: WithdrawalRules;
}

export interface PlatformConfig {
  minAge: number;
  retractionDays: number;
  /**
   * Frais de transaction retenus sur un remboursement de rétractation, en
   * points de base (300 = 3 %). Annoncés avant le paiement.
   */
  refundFeeBps: number;
  /**
   * Part maximale du contenu consommée au-delà de laquelle la rétractation
   * est refusée (section 6). null = critère désactivé (à décider).
   */
  retractionMaxConsumption: number | null;
  /** Plafond de dépense mensuel par défaut à l'ouverture du compte. */
  defaultMonthlyLimit: number;
  /** Seuil de paiements rapprochés (condition 5) ; null = désactivé. */
  rapidPayment: { windowMinutes: number; maxCount: number } | null;
  affiliation: AffiliationConfig;
}
