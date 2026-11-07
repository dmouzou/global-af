import {describe, expect, it} from "vitest";
import {
  assertEligible, assertSubmissionTransition, decideOnSubmit, isIsoDate,
  levelRank, submissionId, validateMissionInput, validateProof,
} from "../src/domain/mission";

const valid = {
  title: "Étude d'usage Mobile Money", category: "survey",
  description: "Répondez au questionnaire jusqu'au bout.",
  instructions: ["Répondre aux 10 questions"], rewardAmount: 600,
  quotaMax: 100, requiredLevel: "Starter", countries: ["CI"],
  isPremiumOnly: false, startDate: "2026-11-01", endDate: "2026-11-30",
  verificationType: "manual", status: "published",
};
const mission = {
  status: "published" as const, startDate: "2026-11-01",
  endDate: "2026-11-30", countries: ["CI"], requiredLevel: "Starter",
  isPremiumOnly: false, quotaMax: 10, quotaCurrent: 0,
};
const member = {
  status: "active", country: "CI", level: "Starter", isActivated: true,
  plan: "standard" as const,
};
const now = new Date("2026-11-10T10:00:00Z");

describe("validateMissionInput", () => {
  it("accepte une mission valide", () => {
    expect(validateMissionInput(valid).rewardAmount).toBe(600);
  });
  it("refuse une récompense non entière ou trop basse", () => {
    expect(() => validateMissionInput({...valid, rewardAmount: 600.5}))
      .toThrow();
    expect(() => validateMissionInput({...valid, rewardAmount: 50}))
      .toThrow();
  });
  it("refuse des dates incohérentes", () => {
    expect(() => validateMissionInput({...valid, endDate: "2026-10-01"}))
      .toThrow();
    expect(() => validateMissionInput({...valid, startDate: "2026-02-31"}))
      .toThrow();
  });
  it("exige un code de fin hors vérification manuelle", () => {
    expect(() => validateMissionInput({...valid,
      verificationType: "automatic"})).toThrow();
    expect(validateMissionInput({...valid, verificationType: "automatic",
      completionCode: "ABCD-1234"}).completionCode).toBe("ABCD-1234");
  });
  it("refuse un lien non https et un pays mal formé", () => {
    expect(() => validateMissionInput({...valid,
      targetUrl: "http://x.ci"})).toThrow();
    expect(() => validateMissionInput({...valid, countries: ["ci"]}))
      .toThrow();
  });
});

describe("assertEligible", () => {
  it("laisse participer un membre éligible", () => {
    expect(() => assertEligible(mission, member, now)).not.toThrow();
  });
  it("exige un Pass actif", () => {
    expect(() => assertEligible(mission,
      {...member, isActivated: false, plan: "free"}, now))
      .toThrow(/Pass/);
  });
  it("refuse hors période, hors pays, quota atteint", () => {
    expect(() => assertEligible(mission, member,
      new Date("2026-12-01T00:00:00Z"))).toThrow(/terminée/);
    expect(() => assertEligible(mission, member,
      new Date("2026-10-31T00:00:00Z"))).toThrow(/pas encore/);
    expect(() => assertEligible(mission, {...member, country: "SN"}, now))
      .toThrow(/pays/);
    expect(() => assertEligible({...mission, quotaCurrent: 10}, member, now))
      .toThrow(/quota/i);
  });
  it("respecte le niveau et le réservé Premium", () => {
    expect(() => assertEligible({...mission, requiredLevel: "Gold"}, member,
      now)).toThrow(/niveau/);
    expect(() => assertEligible({...mission, isPremiumOnly: true}, member,
      now)).toThrow(/Premium/);
    expect(() => assertEligible({...mission, isPremiumOnly: true},
      {...member, plan: "premium"}, now)).not.toThrow();
  });
  it("refuse une mission non publiée ou un compte non actif", () => {
    expect(() => assertEligible({...mission, status: "paused"}, member, now))
      .toThrow();
    expect(() => assertEligible(mission, {...member, status: "suspended"},
      now)).toThrow();
  });
});

describe("validateProof", () => {
  it("contrôle chaque type de preuve", () => {
    expect(validateProof("text", "fait", "u1").content).toBe("fait");
    expect(() => validateProof("url", "http://a.ci", "u1")).toThrow();
    expect(validateProof("url", "https://a.ci/x", "u1").type).toBe("url");
    expect(validateProof("screenshot", "proofs/u1/a.png", "u1").type)
      .toBe("screenshot");
    expect(() => validateProof("screenshot", "proofs/u2/a.png", "u1"))
      .toThrow();
    expect(() => validateProof("screenshot", "proofs/u1/../u2/a.png", "u1"))
      .toThrow();
  });
});

describe("decideOnSubmit", () => {
  it("manuel : toujours en attente", () => {
    expect(decideOnSubmit("manual", undefined, "x")).toBe("pending");
  });
  it("automatique : valide si code exact, sinon erreur", () => {
    expect(decideOnSubmit("automatic", "ABCD-1234", "abcd-1234"))
      .toBe("approved");
    expect(() => decideOnSubmit("automatic", "ABCD-1234", "nope")).toThrow();
  });
  it("hybride : code exact valide, sinon revue manuelle", () => {
    expect(decideOnSubmit("hybrid", "ABCD-1234", "ABCD-1234"))
      .toBe("approved");
    expect(decideOnSubmit("hybrid", "ABCD-1234", "autre")).toBe("pending");
  });
});

describe("workflow", () => {
  it("une revue ne s'applique qu'à une participation en attente", () => {
    expect(() => assertSubmissionTransition("pending", "approved"))
      .not.toThrow();
    expect(() => assertSubmissionTransition("approved", "rejected"))
      .toThrow();
    expect(() => assertSubmissionTransition("rejected", "approved"))
      .toThrow();
  });
  it("outils divers", () => {
    expect(submissionId("m1", "u1")).toBe("m1_u1");
    expect(levelRank("Gold")).toBeGreaterThan(levelRank("Bronze"));
    expect(isIsoDate("2026-11-07")).toBe(true);
    expect(isIsoDate("07/11/2026")).toBe(false);
  });
});
