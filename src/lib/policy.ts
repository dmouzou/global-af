/**
 * Valeurs de REPLI des règles commerciales. L'affichage lit la configuration
 * serveur en direct (lib/useRates.ts) ; ces constantes ne servent que tant que
 * cette lecture n'a pas abouti. Le serveur reste l'autorité pour les montants.
 */
export const POLICY = {
  /** Délai de rétractation du PASS D'ENTRÉE (jours). */
  retractionDays: 7,
  /** Durée d'une période d'abonnement (jours) ; renouvellement manuel. */
  subscriptionDays: 30,
  /** Préavis du rappel d'échéance (jours). */
  reminderDays: 3,
  /** Frais de transaction retenus sur un remboursement (%). */
  refundFeePercent: 3,
  minAge: 18,
} as const;

/** Rappel court, réutilisé dans les pages et le chatbot. */
export const REFUND_RULE_SHORT =
  `Rétractation de ${POLICY.retractionDays} jours pour le Pass d'entrée (Standard), ` +
  `remboursement sous déduction des frais de transaction (${POLICY.refundFeePercent} %) ; ` +
  `l'abonnement VIP Premium n'est pas remboursable (accès immédiat aux fichiers et répertoires VCF).`;
