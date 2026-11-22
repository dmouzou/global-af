import {describe, expect, it} from "vitest";
import {assertCanChangeStatus} from "../src/domain/admin";

const base = {
  actorRole: "support" as const, actorUid: "a", targetRole: "member" as const,
  targetUid: "m", to: "suspended", reason: "Multi-comptes suspectés",
};

describe("assertCanChangeStatus", () => {
  it("laisse le support suspendre un membre avec un motif", () => {
    expect(assertCanChangeStatus(base)).toEqual({
      to: "suspended", reason: "Multi-comptes suspectés"});
  });
  it("refuse un rôle non autorisé", () => {
    expect(() => assertCanChangeStatus({...base, actorRole: "moderator"}))
      .toThrow(/non autorisée/);
    expect(() => assertCanChangeStatus({...base, actorRole: "member"}))
      .toThrow();
  });
  it("refuse d'agir sur soi-même", () => {
    expect(() => assertCanChangeStatus({...base, targetUid: "a"}))
      .toThrow(/propre compte/);
  });
  it("refuse d'agir sur un rang égal ou supérieur", () => {
    expect(() => assertCanChangeStatus({...base, targetRole: "support"}))
      .toThrow(/rang/);
    expect(() => assertCanChangeStatus({...base, actorRole: "admin",
      targetRole: "super_admin"})).toThrow(/rang/);
    expect(() => assertCanChangeStatus({...base, actorRole: "super_admin",
      targetRole: "super_admin"})).toThrow(/rang/);
    expect(assertCanChangeStatus({...base, actorRole: "admin",
      targetRole: "financial_manager"}).to).toBe("suspended");
  });
  it("exige un motif et un statut valide", () => {
    expect(() => assertCanChangeStatus({...base, reason: "  ok "}))
      .toThrow(/motif/);
    expect(() => assertCanChangeStatus({...base, to: "closed"}))
      .toThrow(/Statut/);
    expect(assertCanChangeStatus({...base, to: "active"}).to).toBe("active");
  });
});
