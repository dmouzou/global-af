import {describe, expect, it} from "vitest";
import {
  assertRetractableKind, computeRefund, isRetractableKind,
} from "../src/domain/retraction";

describe("Politique de rétractation : abonnements uniquement", () => {
  it("le Pass d'entrée (activation) n'est pas rétractable, les abonnements le sont", () => {
    expect(isRetractableKind("activation")).toBe(false);
    expect(isRetractableKind("subscription")).toBe(true);
    expect(isRetractableKind("course")).toBe(false);
    expect(() => assertRetractableKind("activation")).toThrow(/Pass d'entrée/);
    expect(() => assertRetractableKind("subscription")).not.toThrow();
  });

  it("remboursement = montant payé moins les frais de transaction (3 %)", () => {
    expect(computeRefund(9900, 300)).toEqual({fee: 297, refund: 9603});
    expect(computeRefund(25000, 300)).toEqual({fee: 750, refund: 24250});
    // arrondi à l'entier (XOF sans décimales)
    expect(computeRefund(3333, 300)).toEqual({fee: 100, refund: 3233});
    // sans frais
    expect(computeRefund(9900, 0)).toEqual({fee: 0, refund: 9900});
  });

  it("le total frais + remboursement égale toujours le montant payé", () => {
    for (const amount of [100, 995, 3000, 9900, 25000, 499995]) {
      for (const bps of [0, 150, 300, 1000]) {
        const r = computeRefund(amount, bps);
        expect(r.fee + r.refund).toBe(amount);
        expect(r.refund).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("refuse un montant ou des frais invalides", () => {
    expect(() => computeRefund(0, 300)).toThrow();
    expect(() => computeRefund(9900.5, 300)).toThrow();
    expect(() => computeRefund(9900, -1)).toThrow();
    expect(() => computeRefund(9900, 10001)).toThrow();
  });
});
