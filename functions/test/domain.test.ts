import {describe, expect, it} from "vitest";
import {applyPosting, replay, reversePosting} from "../src/domain/ledger";
import {percentOfBps} from "../src/domain/money";
import {
  assertTransition, canProcessWithdrawals, postingForStatus, quoteWithdrawal,
} from "../src/domain/withdrawal";
import {assertAffiliationConfig, computeCommissions}
  from "../src/domain/commission";
import {checkRetraction} from "../src/domain/retraction";
import {assertMinAge, ageAt, parseBirthDate} from "../src/domain/age";
import {normalizePhone} from "../src/domain/phone";
import {generateReferralCode, normalizeReferralCode}
  from "../src/domain/referral";
import {
  assertWithinSpendingLimit, isRapidPaymentPattern, monthKey,
} from "../src/domain/spending";
import {AffiliationConfig, WithdrawalRules} from "../src/domain/types";

const AFF: AffiliationConfig = {
  level1Bps: 1000, level2Bps: 500, maxLevels: 2, maxTotalBps: 1500,
  commissionableKinds: ["subscription", "course", "partner_campaign"],
};
const RULES: WithdrawalRules = {
  minAmount: 2000, maxAmount: null, feeBps: 150,
  operators: ["wave", "orange_money", "mtn_momo", "moov_money"],
};
const CI = {phonePrefix: "225", nationalLengths: [10]};

describe("money", () => {
  it("calcule les pourcentages en entiers, arrondi inférieur", () => {
    expect(percentOfBps(9900, 1000)).toBe(990);
    expect(percentOfBps(9900, 500)).toBe(495);
    expect(percentOfBps(999, 1000)).toBe(99);
  });
  it("refuse les montants non entiers", () => {
    expect(() => percentOfBps(10.5, 1000)).toThrow();
  });
});

describe("ledger", () => {
  it("déplace sans créer ni détruire d'argent", () => {
    const b = applyPosting({available: 0, pending: 0, reserved: 0},
      {from: "external", to: "available", amount: 5000});
    const r = applyPosting(b,
      {from: "available", to: "reserved", amount: 2000});
    expect(r).toEqual({available: 3000, pending: 0, reserved: 2000});
  });
  it("interdit un solde négatif et un mouvement sur place", () => {
    const zero = {available: 0, pending: 0, reserved: 0};
    expect(() => applyPosting(zero,
      {from: "available", to: "reserved", amount: 1})).toThrow();
    expect(() => applyPosting(zero,
      {from: "available", to: "available", amount: 1})).toThrow();
  });
  it("la contrepartie annule exactement le mouvement", () => {
    const p = {from: "external", to: "pending", amount: 990} as const;
    expect(replay([p, reversePosting(p)]))
      .toEqual({available: 0, pending: 0, reserved: 0});
  });
});

describe("retraits", () => {
  it("devis : frais en points de base", () => {
    expect(quoteWithdrawal(
      {amount: 10000, operator: "wave", available: 10000}, RULES))
      .toEqual({amount: 10000, fee: 150, net: 9850});
  });
  it("refuse sous le minimum, solde insuffisant, opérateur inconnu", () => {
    const base = {operator: "wave" as const, available: 50000};
    expect(() => quoteWithdrawal({...base, amount: 1999}, RULES)).toThrow();
    expect(() => quoteWithdrawal(
      {...base, amount: 60000}, RULES)).toThrow();
    expect(() => quoteWithdrawal({...base, amount: 5000},
      {...RULES, operators: ["wave"]})).not.toThrow();
    expect(() => quoteWithdrawal(
      {amount: 5000, operator: "moov_money", available: 50000},
      {...RULES, operators: ["wave"]})).toThrow();
  });
  it("applique le plafond par retrait s'il existe", () => {
    expect(() => quoteWithdrawal(
      {amount: 6000, operator: "wave", available: 50000},
      {...RULES, maxAmount: 5000})).toThrow();
  });
  it("machine à états : pas de retour en arrière ni de saut", () => {
    expect(() => assertTransition("reserved", "approved")).not.toThrow();
    expect(() => assertTransition("rejected", "approved")).toThrow();
    expect(() => assertTransition("reserved", "paid")).toThrow();
    expect(() => assertTransition("paid", "failed")).toThrow();
  });
  it("un rejet libère exactement la somme réservée", () => {
    const reserve = postingForStatus("reserved", 5000)!;
    const release = postingForStatus("rejected", 5000)!;
    const start = {available: 5000, pending: 0, reserved: 0};
    const after = [reserve, release].reduce(applyPosting, start);
    expect(after).toEqual(start);
  });
  it("un paiement confirmé solde la réserve", () => {
    const start = {available: 5000, pending: 0, reserved: 0};
    const after = ["reserved", "paid"].map(
      (s) => postingForStatus(s as never, 5000)!).reduce(applyPosting, start);
    expect(after).toEqual({available: 0, pending: 0, reserved: 0});
  });
  it("réserve les droits aux rôles financiers", () => {
    expect(canProcessWithdrawals("financial_manager")).toBe(true);
    expect(canProcessWithdrawals("support")).toBe(false);
    expect(canProcessWithdrawals("member")).toBe(false);
  });
});

describe("commissions", () => {
  const sale = {buyerUid: "buyer", amount: 9900, kind: "subscription" as const};
  it("10 % niveau 1 et 5 % niveau 2", () => {
    const d = computeCommissions(sale,
      {level1Uid: "a", level2Uid: "b"}, AFF);
    expect(d).toEqual([
      {level: 1, beneficiaryUid: "a", amount: 990, rateBps: 1000},
      {level: 2, beneficiaryUid: "b", amount: 495, rateBps: 500},
    ]);
  });
  it("aucune commission sur l'activation seule", () => {
    expect(computeCommissions({...sale, kind: "activation"},
      {level1Uid: "a", level2Uid: "b"}, AFF)).toEqual([]);
  });
  it("aucune commission sans parrain, ni niveau 3", () => {
    expect(computeCommissions(sale,
      {level1Uid: null, level2Uid: null}, AFF)).toEqual([]);
  });
  it("exclut l'auto-parrainage et la double attribution", () => {
    expect(computeCommissions(sale,
      {level1Uid: "buyer", level2Uid: "b"}, AFF).map((d) => d.level))
      .toEqual([2]);
    expect(computeCommissions(sale,
      {level1Uid: "a", level2Uid: "a"}, AFF).length).toBe(1);
  });
  it("ignore le niveau 2 quand un seul niveau est actif", () => {
    expect(computeCommissions(sale, {level1Uid: "a", level2Uid: "b"},
      {...AFF, maxLevels: 1}).length).toBe(1);
  });
  it("refuse une configuration au-delà du plafond ou de 2 niveaux", () => {
    expect(() => assertAffiliationConfig(AFF)).not.toThrow();
    expect(() => assertAffiliationConfig({...AFF, maxTotalBps: 1000}))
      .toThrow();
    expect(() => assertAffiliationConfig(
      {...AFF, maxLevels: 3 as never})).toThrow();
  });
});

describe("rétractation", () => {
  const cfg = {retractionDays: 7, retractionMaxConsumption: null};
  const bought = new Date("2026-10-01T10:00:00Z");
  it("éligible jusqu'à 7 jours inclus", () => {
    expect(checkRetraction({purchasedAt: bought,
      now: new Date("2026-10-08T10:00:00Z")}, cfg).eligible).toBe(true);
  });
  it("expirée au-delà de 7 jours", () => {
    expect(checkRetraction({purchasedAt: bought,
      now: new Date("2026-10-08T10:00:01Z")}, cfg))
      .toEqual({eligible: false, reason: "expired"});
  });
  it("critère de consommation seulement s'il est configuré", () => {
    const now = new Date("2026-10-02T10:00:00Z");
    expect(checkRetraction({purchasedAt: bought, now, consumption: 0.9},
      cfg).eligible).toBe(true);
    expect(checkRetraction({purchasedAt: bought, now, consumption: 0.9},
      {...cfg, retractionMaxConsumption: 0.5}))
      .toEqual({eligible: false, reason: "consumed"});
  });
});

describe("âge", () => {
  const now = new Date("2026-10-23T12:00:00Z");
  it("accepte exactement 18 ans le jour de l'anniversaire", () => {
    expect(() => assertMinAge("2008-10-23", now, 18)).not.toThrow();
  });
  it("refuse la veille des 18 ans", () => {
    expect(() => assertMinAge("2008-10-24", now, 18)).toThrow();
  });
  it("gère le 29 février", () => {
    expect(ageAt(parseBirthDate("2008-02-29"), new Date("2026-02-28T00:00:00Z")))
      .toBe(17);
    expect(ageAt(parseBirthDate("2008-02-29"), new Date("2026-03-01T00:00:00Z")))
      .toBe(18);
  });
  it("rejette dates invalides, futures, ou mal formées", () => {
    for (const bad of ["2008-02-30", "23/10/2000", "", null, "2030-01-01",
      "1800-01-01"]) {
      expect(() => assertMinAge(bad, now, 18)).toThrow();
    }
  });
});

describe("téléphone et parrainage", () => {
  it("normalise les formats ivoiriens courants", () => {
    for (const v of ["+225 07 48 92 11 05", "0748921105", "00225 0748921105",
      "225-0748921105"]) {
      expect(normalizePhone(v, CI)).toBe("2250748921105");
    }
  });
  it("rejette les numéros invalides", () => {
    for (const v of ["12345", "+22507489211", "abc", "", 5]) {
      expect(() => normalizePhone(v, CI)).toThrow();
    }
  });
  it("génère des codes valides et normalise la saisie", () => {
    const code = generateReferralCode("ci");
    expect(code).toMatch(/^GAF-CI-[A-Z0-9]{6}$/);
    expect(normalizeReferralCode(` ${code.toLowerCase()} `)).toBe(code);
    expect(normalizeReferralCode("nimporte quoi")).toBeNull();
  });
});

describe("plafonds de dépense", () => {
  it("bloque le dépassement mensuel", () => {
    expect(() => assertWithinSpendingLimit(
      {spentThisMonth: 45000, limit: 50000, amount: 9900})).toThrow();
    expect(() => assertWithinSpendingLimit(
      {spentThisMonth: 40000, limit: 50000, amount: 9900})).not.toThrow();
  });
  it("clé de mois UTC", () => {
    expect(monthKey(new Date("2026-10-31T23:59:59Z"))).toBe("2026-10");
  });
  it("paiements rapprochés désactivés sans règle", () => {
    const now = new Date("2026-10-23T12:00:00Z");
    const recent = [new Date("2026-10-23T11:55:00Z"),
      new Date("2026-10-23T11:58:00Z")];
    expect(isRapidPaymentPattern(recent, now, null)).toBe(false);
    expect(isRapidPaymentPattern(recent, now,
      {windowMinutes: 10, maxCount: 2})).toBe(true);
  });
});
