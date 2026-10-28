import {describe, expect, it} from "vitest";
import {createHmac} from "node:crypto";
import {WaveAdapter} from "../src/services/payments/wave.adapter";
import {MtnMomoAdapter} from "../src/services/payments/mtn.adapter";
import {OrangeMoneyAdapter} from "../src/services/payments/orange.adapter";
import {MoovMoneyAdapter} from "../src/services/payments/moov.adapter";
import {verifyHmacSha256Hex} from "../src/services/payments/signature";
import {
  amountMatches, assertSellableProduct, toDate,
} from "../src/domain/payment";
import {
  effectiveLimit, monthKey, requestLimitChange, spentInCurrentMonth,
} from "../src/domain/spending";

const payload = JSON.stringify({client_reference: "pmt_1", id: "x",
  checkout_status: "complete", amount: 9900});
const forge = (secret: string) =>
  createHmac("sha256", secret).update(payload).digest("hex");

describe("Webhooks : échec fermé sans secret", () => {
  it("refuse une signature forgée avec une clé vide ou l'ancien secret par défaut", async () => {
    const adapters = [
      [new WaveAdapter(""), {"wave-signature": `v1=${forge("")}`}],
      [new WaveAdapter(""), {"wave-signature": `v1=${forge("dev_wave_secret")}`}],
      [new OrangeMoneyAdapter(""), {"x-orange-signature": forge("")}],
      [new MtnMomoAdapter(""), {"x-momo-signature": forge("")}],
      [new MoovMoneyAdapter(""), {"x-moov-signature": forge("")}],
    ] as const;
    for (const [adapter, headers] of adapters) {
      const r = await adapter.verifyWebhook(payload, headers as never);
      expect(r.isValid).toBe(false);
    }
  });

  it("verifyHmacSha256Hex : secret absent = refus, secret correct = accepté", () => {
    expect(verifyHmacSha256Hex(undefined, payload, forge("s"))).toBe(false);
    expect(verifyHmacSha256Hex("", payload, forge(""))).toBe(false);
    expect(verifyHmacSha256Hex("s", payload, forge("s"))).toBe(true);
    expect(verifyHmacSha256Hex("s", payload, "zz")).toBe(false);
    expect(verifyHmacSha256Hex("s", payload + " ", forge("s"))).toBe(false);
  });
});

describe("Catalogue produits : le prix vient du serveur", () => {
  it("accepte un produit valide et refuse les produits invalides", () => {
    const ok = assertSellableProduct(
      {id: "premium", priceXOF: 9900, kind: "activation"});
    expect(ok.priceXOF).toBe(9900);
    expect(() => assertSellableProduct(undefined)).toThrow();
    expect(() => assertSellableProduct(
      {id: "x", priceXOF: 0, kind: "activation"})).toThrow();
    expect(() => assertSellableProduct(
      {id: "x", priceXOF: 99.5, kind: "activation"})).toThrow();
    expect(() => assertSellableProduct(
      {id: "x", priceXOF: 100, kind: "autre"})).toThrow();
    expect(() => assertSellableProduct(
      {id: "x", priceXOF: 100, kind: "course", active: false})).toThrow();
  });

  it("amountMatches : montant du prestataire = montant attendu", () => {
    expect(amountMatches(9900, 9900)).toBe(true);
    expect(amountMatches(9900, undefined)).toBe(true);
    expect(amountMatches(9900, 500)).toBe(false);
  });

  it("toDate gère Date, Timestamp Firestore et secondes", () => {
    const d = new Date("2026-10-01T00:00:00Z");
    expect(toDate(d).getTime()).toBe(d.getTime());
    expect(toDate({toDate: () => d}).getTime()).toBe(d.getTime());
    expect(toDate({seconds: d.getTime() / 1000}).getTime()).toBe(d.getTime());
    expect(() => toDate(null)).toThrow();
  });
});

describe("Plafond de dépense mensuel", () => {
  const oct = new Date("2026-10-15T10:00:00Z");
  const nov = new Date("2026-11-02T10:00:00Z");

  it("remet le cumul à zéro au changement de mois", () => {
    const user = {spentThisMonth: 40000, spentMonth: monthKey(oct)};
    expect(spentInCurrentMonth(user, oct)).toBe(40000);
    expect(spentInCurrentMonth(user, nov)).toBe(0);
    expect(spentInCurrentMonth({spentThisMonth: 5000}, oct)).toBe(0);
  });

  it("une baisse est immédiate, une hausse est différée de 24 h", () => {
    const user = {spendingLimitMonthly: 50000};
    const down = requestLimitChange(user, 20000, 50000, oct);
    expect(down.spendingLimitMonthly).toBe(20000);
    expect(down.pendingSpendingLimit).toBeNull();

    const up = requestLimitChange(user, 200000, 50000, oct);
    expect(up.spendingLimitMonthly).toBe(50000);
    expect(up.pendingSpendingLimit?.amount).toBe(200000);
    expect(effectiveLimit(up, 50000, oct)).toBe(50000);
    const after = new Date(oct.getTime() + 25 * 3600 * 1000);
    expect(effectiveLimit(up, 50000, after)).toBe(200000);
  });

  it("refuse un plafond hors bornes ou non entier", () => {
    expect(() => requestLimitChange({}, 5000, 50000, oct)).toThrow();
    expect(() => requestLimitChange({}, 2000000, 50000, oct)).toThrow();
    expect(() => requestLimitChange({}, 12345.5, 50000, oct)).toThrow();
  });
});
