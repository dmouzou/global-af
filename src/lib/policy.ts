/**
 * Règles commerciales annoncées au public. Elles reflètent la configuration
 * serveur (functions/src/scripts/seedConfig.ts : retractionDays, refundFeeBps) :
 * en cas de changement, modifier les deux (le serveur reste l'autorité pour
 * les montants réellement remboursés).
 */
export const POLICY = {
  /** Délai de rétractation des ABONNEMENTS (jours). */
  retractionDays: 7,
  /** Frais de transaction retenus sur un remboursement (%). */
  refundFeePercent: 3,
  minAge: 18,
} as const;

/** Rappel court, réutilisé dans les pages et le chatbot. */
export const REFUND_RULE_SHORT =
  `Rétractation de ${POLICY.retractionDays} jours pour les abonnements (Premium, Business), ` +
  `remboursement sous déduction des frais de transaction (${POLICY.refundFeePercent} %) ; ` +
  `le Pass d'entrée n'est pas remboursable.`;
