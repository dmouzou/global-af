import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {auth, db} from "../lib/db";
import {writeAudit} from "../lib/audit";
import {guard} from "../lib/errors";
import {asObject, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {Role, ROLES} from "../domain/types";
import {assertCanChangeStatus} from "../domain/admin";

/**
 * Attribution d'un rôle (section 3 : droits critiques réservés au
 * super administrateur). Le rôle est posé comme custom claim signé ET
 * recopié dans le profil ; le client ne peut jamais se l'attribuer.
 */
export const adminSetUserRole = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    if (request.auth.token.role !== "super_admin") {
      throw new HttpsError("permission-denied", "Action non autorisée.");
    }
    const data = asObject(request.data);
    const uid = reqString(data, "uid", 128);
    const role = reqString(data, "role", 30) as Role;
    if (!ROLES.includes(role)) {
      throw new DomainError("invalid_role", "Rôle inconnu.");
    }
    if (uid === request.auth.uid) {
      throw new DomainError("self_role_change",
        "Vous ne pouvez pas modifier votre propre rôle.");
    }
    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      throw new DomainError("user_not_found", "Utilisateur introuvable.");
    }
    const previous = (snap.data() as {role: Role}).role;
    await auth.setCustomUserClaims(uid, {role});
    await userRef.update({role, roleUpdatedAt: FieldValue.serverTimestamp()});
    await writeAudit({
      actorUid: request.auth.uid, actorRole: "super_admin",
      action: "user.role_changed", target: uid, rule: "section 3",
      details: {from: previous, to: role},
    });
    return {uid, role};
  });
});

/**
 * Suspension ou réactivation d'un compte (sections 3, 23 et 25). Une
 * suspension bloque aussi la connexion (compte d'authentification désactivé,
 * sessions révoquées). Le motif est obligatoire et journalisé.
 */
export const adminSetUserStatus = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }
    const actorRole = (request.auth.token.role as Role | undefined) ?? "member";
    const data = asObject(request.data);
    const uid = reqString(data, "uid", 128);
    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      throw new DomainError("user_not_found", "Utilisateur introuvable.");
    }
    const target = snap.data() as {role?: Role; status?: string};
    const {to, reason} = assertCanChangeStatus({
      actorRole, actorUid: request.auth.uid,
      targetRole: target.role ?? "member", targetUid: uid,
      to: reqString(data, "status", 20),
      reason: typeof data.reason === "string" ? data.reason : "",
    });
    await auth.updateUser(uid, {disabled: to === "suspended"});
    if (to === "suspended") {
      await auth.revokeRefreshTokens(uid);
    }
    await userRef.update({
      status: to, statusReason: reason,
      statusUpdatedAt: FieldValue.serverTimestamp(),
      statusUpdatedBy: request.auth.uid,
    });
    await writeAudit({
      actorUid: request.auth.uid, actorRole,
      action: to === "suspended" ? "user.suspended" : "user.reactivated",
      target: uid, rule: "section 25",
      details: {from: target.status ?? "active", to, reason},
    });
    return {uid, status: to};
  });
});
