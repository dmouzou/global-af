/**
 * Règles commerciales annoncées au public. Elles reflètent la configuration
 * serveur (functions/src/scripts/seedConfig.ts : retractionDays, refundFeeBps) :
 * en cas de changement, modifier les deux (le serveur reste l'autorité pour
 * les montants réellement remboursés).
 */
export const POLICY = {
  /** Délai de rétractation du PASS D'ENTRÉE (jours). */
  retractionDays: 7,
  /** Frais de transaction retenus sur un remboursement (%). */
  refundFeePercent: 3,
  minAge: 18,
} as const;

/** Rappel court, réutilisé dans les pages et le chatbot. */
export const REFUND_RULE_SHORT =
  `Rétractation de ${POLICY.retractionDays} jours pour le Pass d'entrée (Standard), ` +
  `remboursement sous déduction des frais de transaction (${POLICY.refundFeePercent} %) ; ` +
  `l'abonnement VIP Premium n'est pas remboursable (accès immédiat aux fichiers et répertoires VCF).`;
