import {describe, expect, it} from "vitest";
import {
  accessStateFromDoc, assertPurchasable, isSubscriptionActive, MAX_PREPAID_DAYS,
  nextSubscriptionExpiry, resolveAccess,
} from "../src/domain/subscription";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-11-01T10:00:00Z");
const inDays = (n: number) => new Date(now.getTime() + n * DAY);

describe("Abonnements : échéance et renouvellement", () => {
  it("un premier abonnement dure 30 jours à partir de maintenant", () => {
    expect(nextSubscriptionExpiry(null, now, 30).getTime())
      .toBe(inDays(30).getTime());
  });

  it("renouveler AVANT l'échéance prolonge à partir de l'échéance (aucun jour perdu)", () => {
    expect(nextSubscriptionExpiry(inDays(5), now, 30).getTime())
      .toBe(inDays(35).getTime());
  });

  it("renouveler APRÈS l'échéance repart de maintenant", () => {
    expect(nextSubscriptionExpiry(inDays(-2), now, 30).getTime())
      .toBe(inDays(30).getTime());
  });
});

describe("Accès effectif", () => {
  it("abonnement valide => offre de l'abonnement", () => {
    const s = {subscriptionPlan: "premium", subscriptionExpiresAt: inDays(3)};
    expect(isSubscriptionActive(s, now)).toBe(true);
    expect(resolveAccess(s, now)).toEqual({isActivated: true, plan: "premium"});
  });

  it("abonnement échu sans Pass d'entrée => palier gratuit (retraits bloqués)", () => {
    const s = {subscriptionPlan: "premium", subscriptionExpiresAt: inDays(-1)};
    expect(isSubscriptionActive(s, now)).toBe(false);
    expect(resolveAccess(s, now)).toEqual({isActivated: false, plan: "free"});
  });

  it("abonnement échu avec Pass d'entrée => retour sur le Pass d'entrée", () => {
    const s = {entryPass: true, subscriptionPlan: "business",
      subscriptionExpiresAt: inDays(-1)};
    expect(resolveAccess(s, now)).toEqual({isActivated: true, plan: "standard"});
  });

  it("Pass d'entrée seul : actif sans limite de durée", () => {
    expect(resolveAccess({entryPass: true}, now))
      .toEqual({isActivated: true, plan: "standard"});
    expect(resolveAccess({}, now)).toEqual({isActivated: false, plan: "free"});
  });

  it("lit un profil Firestore (Timestamp) sans se tromper", () => {
    const doc = {entryPass: false, subscriptionPlan: "premium",
      subscriptionExpiresAt: {toDate: () => inDays(2)}};
    expect(resolveAccess(accessStateFromDoc(doc), now).plan).toBe("premium");
  });
});

describe("Contrôles avant paiement", () => {
  const active = {subscriptionPlan: "premium", subscriptionExpiresAt: inDays(10)};

  it("refuse un second Pass d'entrée", () => {
    expect(() => assertPurchasable({entryPass: true},
      {id: "standard", kind: "activation"}, now, 30)).toThrow(/déjà le Pass/);
    expect(() => assertPurchasable({},
      {id: "standard", kind: "activation"}, now, 30)).not.toThrow();
  });

  it("refuse de changer d'offre en cours de période", () => {
    expect(() => assertPurchasable(active,
      {id: "business", kind: "subscription"}, now, 30)).toThrow(/déjà un abonnement/);
  });

  it("autorise le renouvellement de la même offre, et tout achat après échéance", () => {
    expect(() => assertPurchasable(active,
      {id: "premium", kind: "subscription"}, now, 30)).not.toThrow();
    const expired = {subscriptionPlan: "premium", subscriptionExpiresAt: inDays(-1)};
    expect(() => assertPurchasable(expired,
      {id: "business", kind: "subscription"}, now, 30)).not.toThrow();
  });

  it(`refuse de prépayer au-delà de ${MAX_PREPAID_DAYS} jours`, () => {
    const far = {subscriptionPlan: "premium", subscriptionExpiresAt: inDays(70)};
    expect(() => assertPurchasable(far,
      {id: "premium", kind: "subscription"}, now, 30)).toThrow(/déjà payé/);
  });
});
