import {describe, expect, it} from "vitest";
import {
  applyCountryPatch, applyPlatformPatch, assertConfigReason,
} from "../src/domain/configEdit";
import {computeCommissions} from "../src/domain/commission";
import {CountryConfig, PlatformConfig} from "../src/domain/types";

const platform = (): PlatformConfig => ({
  minAge: 18, retractionDays: 7, subscriptionDays: 30,
  aiDailyQuota: {standard: 3, premium: 30, business: 30}, refundFeeBps: 300,
  retractionMaxConsumption: null, defaultMonthlyLimit: 50000,
  rapidPayment: null,
  affiliation: {level1Bps: 1000, level2Bps: 500, maxLevels: 1,
    maxTotalBps: 1000, commissionableKinds: ["activation", "subscription"]},
} as PlatformConfig);
const country = (): CountryConfig => ({
  code: "CI", enabled: true, currency: "XOF", phonePrefix: "225",
  nationalLengths: [10],
  withdrawal: {minAmount: 2000, maxAmount: null, feeBps: 150,
    operators: ["wave", "orange_money", "mtn_momo", "moov_money"]},
} as CountryConfig);

describe("applyPlatformPatch", () => {
  it("applique un changement et le trace", () => {
    const r = applyPlatformPatch(platform(), {affiliation: {level1Bps: 800}});
    expect(r.next.affiliation.level1Bps).toBe(800);
    expect(r.changes).toEqual([
      {field: "affiliation.level1Bps", from: 1000, to: 800}]);
  });
  it("refuse un paramètre hors liste blanche", () => {
    expect(() => applyPlatformPatch(platform(), {minAge: 16}))
      .toThrow(/non modifiable/);
    expect(() => applyPlatformPatch(platform(),
      {affiliation: {maxLevels: 2}})).toThrow(/non modifiable/);
  });
  it("refuse les valeurs hors bornes ou non entières", () => {
    expect(() => applyPlatformPatch(platform(),
      {affiliation: {level1Bps: 5000}})).toThrow();
    expect(() => applyPlatformPatch(platform(), {retractionDays: 3}))
      .toThrow();
    expect(() => applyPlatformPatch(platform(), {refundFeeBps: 12.5}))
      .toThrow();
  });
  it("refuse un taux supérieur au plafond", () => {
    expect(() => applyPlatformPatch(platform(),
      {affiliation: {level1Bps: 1500}})).toThrow(/plafond/);
    const ok = applyPlatformPatch(platform(),
      {affiliation: {maxTotalBps: 1500, level1Bps: 1500}});
    expect(ok.next.affiliation.level1Bps).toBe(1500);
  });
  it("refuse un patch sans effet", () => {
    expect(() => applyPlatformPatch(platform(), {subscriptionDays: 30}))
      .toThrow(/Aucun changement/);
  });
  it("modifie les quotas IA", () => {
    const r = applyPlatformPatch(platform(), {aiDailyQuota: {standard: 5}});
    expect(r.next.aiDailyQuota.standard).toBe(5);
    expect(r.next.aiDailyQuota.premium).toBe(30);
  });
  it("un taux à 0 désactive vraiment la commission", () => {
    const r = applyPlatformPatch(platform(), {affiliation: {level1Bps: 0}});
    const drafts = computeCommissions(
      {buyerUid: "b", amount: 3000, kind: "activation"},
      {level1Uid: "s"}, r.next.affiliation);
    expect(drafts).toEqual([]);
  });
});

describe("applyCountryPatch", () => {
  it("modifie les retraits", () => {
    const r = applyCountryPatch(country(),
      {withdrawal: {minAmount: 3000, feeBps: 200}});
    expect(r.next.withdrawal.minAmount).toBe(3000);
    expect(r.changes).toHaveLength(2);
  });
  it("refuse un plafond inférieur au minimum et un champ inconnu", () => {
    expect(() => applyCountryPatch(country(),
      {withdrawal: {maxAmount: 500}})).toThrow();
    expect(() => applyCountryPatch(country(), {currency: "EUR"}))
      .toThrow(/non modifiable/);
    expect(() => applyCountryPatch(country(), {withdrawal: {operators: []}}))
      .toThrow(/non modifiable/);
  });
  it("accepte plafond nul et ouverture du pays", () => {
    const r = applyCountryPatch(country(),
      {enabled: false, withdrawal: {maxAmount: 500000}});
    expect(r.next.enabled).toBe(false);
    expect(r.next.withdrawal.maxAmount).toBe(500000);
  });
});

describe("assertConfigReason", () => {
  it("exige un vrai motif", () => {
    expect(() => assertConfigReason("court")).toThrow(/motif/);
    expect(assertConfigReason("  Décision du comité du 20/11  "))
      .toBe("Décision du comité du 20/11");
  });
});
