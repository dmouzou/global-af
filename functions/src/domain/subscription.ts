import {DomainError} from "./errors";
import {SaleKind} from "./types";
import {toDate} from "./payment";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Offres à durée limitée (les autres offres ne expirent pas). */
export const SUBSCRIPTION_PLANS = ["premium", "business"] as const;
/** Un abonnement ne peut pas être prépayé au-delà de ce nombre de jours. */
export const MAX_PREPAID_DAYS = 90;

export type AccessPlan = "free" | "standard" | "premium" | "business";

/** État d'accès d'un membre, tel qu'enregistré sur son profil. */
export interface AccessState {
  /** Pass d'entrée acheté (accès sans limite de durée). */
  entryPass?: boolean;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: Date | null;
}

/**
 * Lit l'état d'accès depuis un document utilisateur Firestore.
 * @param {object} doc Données du profil (Timestamps acceptés).
 * @return {AccessState} État d'accès.
 */
export function accessStateFromDoc(doc: {
  entryPass?: boolean; subscriptionPlan?: string | null;
  subscriptionExpiresAt?: unknown;
}): AccessState {
  return {
    entryPass: doc.entryPass === true,
    subscriptionPlan: doc.subscriptionPlan ?? null,
    subscriptionExpiresAt: doc.subscriptionExpiresAt ?
      toDate(doc.subscriptionExpiresAt) : null,
  };
}

/**
 * @param {AccessState} state État d'accès.
 * @param {Date} now Instant courant.
 * @return {boolean} true si un abonnement payant est en cours de validité.
 */
export function isSubscriptionActive(state: AccessState, now: Date): boolean {
  return (SUBSCRIPTION_PLANS as readonly string[])
    .includes(state.subscriptionPlan ?? "") &&
    !!state.subscriptionExpiresAt &&
    state.subscriptionExpiresAt.getTime() > now.getTime();
}

/**
 * Accès effectif à l'instant donné : un abonnement échu ne donne plus accès,
 * mais le Pass d'entrée, lui, ne expire pas. Cette fonction est la référence
 * (le serveur ne se fie jamais à un indicateur qu'une tâche planifiée
 * n'aurait pas encore remis à jour).
 * @param {AccessState} state État d'accès.
 * @param {Date} now Instant courant.
 * @return {object} Accès activé ou non, et offre effective.
 */
export function resolveAccess(state: AccessState, now: Date):
  {isActivated: boolean; plan: AccessPlan} {
  if (isSubscriptionActive(state, now)) {
    return {isActivated: true, plan: state.subscriptionPlan as AccessPlan};
  }
  if (state.entryPass) return {isActivated: true, plan: "standard"};
  return {isActivated: false, plan: "free"};
}

/**
 * Nouvelle date d'échéance après un paiement d'abonnement : un renouvellement
 * fait AVANT l'échéance prolonge à partir de l'échéance (aucun jour perdu) ;
 * après l'échéance, la période repart de maintenant.
 * @param {Date|null|undefined} current Échéance actuelle (même offre).
 * @param {Date} now Instant courant.
 * @param {number} days Durée d'une période en jours.
 * @return {Date} Nouvelle échéance.
 */
export function nextSubscriptionExpiry(current: Date | null | undefined,
  now: Date, days: number): Date {
  const start = current && current.getTime() > now.getTime() ? current : now;
  return new Date(start.getTime() + days * DAY_MS);
}

/**
 * Contrôles avant d'ouvrir un paiement : pas de doublon de Pass d'entrée, pas
 * de changement d'offre en cours de période (le temps payé serait perdu),
 * pas de prépaiement excessif.
 * @param {AccessState} state État d'accès du membre.
 * @param {object} product Produit demandé.
 * @param {Date} now Instant courant.
 * @param {number} days Durée d'une période d'abonnement en jours.
 */
export function assertPurchasable(state: AccessState,
  product: {id: string; kind: SaleKind}, now: Date, days: number): void {
  if (product.kind === "activation" && state.entryPass) {
    throw new DomainError("already_owned",
      "Vous avez déjà le Pass d'entrée : il n'a pas besoin d'être renouvelé.");
  }
  if (product.kind !== "subscription" || !isSubscriptionActive(state, now)) {
    return;
  }
  if (state.subscriptionPlan !== product.id) {
    throw new DomainError("subscription_active",
      `Vous avez déjà un abonnement ${state.subscriptionPlan} actif. ` +
      "Renouvelez cette même offre, ou attendez son échéance pour en " +
      "changer : le temps déjà payé ne serait pas reporté.");
  }
  const expires = state.subscriptionExpiresAt as Date;
  const after = expires.getTime() + days * DAY_MS;
  if (after > now.getTime() + MAX_PREPAID_DAYS * DAY_MS) {
    throw new DomainError("renewal_too_early",
      `Votre abonnement est déjà payé pour plus de ${MAX_PREPAID_DAYS} ` +
      "jours : renouvelez-le plus près de l'échéance.");
  }
}
