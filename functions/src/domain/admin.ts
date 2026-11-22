import {DomainError} from "./errors";
import {Role} from "./types";

/**
 * Suspension / réactivation d'un compte (sections 3 et 25).
 * Règles : seul le support et l'administration agissent ; jamais sur soi-même ;
 * jamais sur un compte de rang égal ou supérieur ; un motif est obligatoire.
 */
const RANK: Record<Role, number> = {
  member: 0, member_premium: 0,
  moderator: 1, support: 1, content_manager: 1, financial_manager: 1,
  admin: 2, super_admin: 3,
};

export const STATUS_CHANGER_ROLES: Role[] = ["support", "admin", "super_admin"];
export const SETTABLE_STATUSES = ["active", "suspended"] as const;
export type SettableStatus = typeof SETTABLE_STATUSES[number];

export interface StatusChange {
  actorRole: Role;
  actorUid: string;
  targetRole: Role;
  targetUid: string;
  to: string;
  reason: string;
}

/**
 * Contrôle une demande de changement de statut.
 * @param {StatusChange} c Demande.
 * @return {object} Statut cible et motif normalisé.
 */
export function assertCanChangeStatus(c: StatusChange):
  {to: SettableStatus; reason: string} {
  if (!STATUS_CHANGER_ROLES.includes(c.actorRole)) {
    throw new DomainError("forbidden", "Action non autorisée.");
  }
  if (!(SETTABLE_STATUSES as readonly string[]).includes(c.to)) {
    throw new DomainError("invalid_status", "Statut invalide.");
  }
  if (c.actorUid === c.targetUid) {
    throw new DomainError("self_change",
      "Vous ne pouvez pas modifier le statut de votre propre compte.");
  }
  if (RANK[c.actorRole] <= (RANK[c.targetRole] ?? 0)) {
    throw new DomainError("insufficient_rank",
      "Vous ne pouvez pas agir sur un compte de rang égal ou supérieur.");
  }
  const reason = (c.reason ?? "").trim();
  if (reason.length < 5 || reason.length > 300) {
    throw new DomainError("reason_required",
      "Un motif de 5 à 300 caractères est obligatoire.");
  }
  return {to: c.to as SettableStatus, reason};
}
