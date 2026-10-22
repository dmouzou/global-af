import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {auth, db} from "../lib/db";
import {writeAudit} from "../lib/audit";
import {guard} from "../lib/errors";
import {asObject, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {Role, ROLES} from "../domain/types";

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
