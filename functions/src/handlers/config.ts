import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {db} from "../lib/db";
import {writeAudit} from "../lib/audit";
import {guard} from "../lib/errors";
import {asObject, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {CountryConfig, PlatformConfig, Role} from "../domain/types";
import {
  applyCountryPatch, applyPlatformPatch, assertConfigReason,
} from "../domain/configEdit";

function requireSuperAdmin(request: CallableRequest): string {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Connexion requise.");
  }
  if ((request.auth.token.role as Role | undefined) !== "super_admin") {
    throw new HttpsError("permission-denied",
      "Réservé au super administrateur.");
  }
  return request.auth.uid;
}

/**
 * Modification des paramètres plateforme (commissions, remboursement,
 * abonnement, quotas IA). Super administrateur uniquement, motif obligatoire,
 * historique immuable. S'applique aux opérations futures seulement.
 */
export const adminUpdatePlatformConfig = onCall(
  async (request: CallableRequest) => {
    return guard(async () => {
      const actorUid = requireSuperAdmin(request);
      const data = asObject(request.data);
      const reason = assertConfigReason(data.reason);
      const ref = db.collection("config").doc("platform");
      return db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) {
          throw new DomainError("config_missing",
            "Configuration plateforme absente (lancer le script de seed).");
        }
        const {next, changes} =
          applyPlatformPatch(snap.data() as PlatformConfig, data.patch);
        tx.set(ref, next);
        tx.create(db.collection("configHistory").doc(), {
          scope: "platform", changes, reason, actorUid,
          createdAt: FieldValue.serverTimestamp(),
        });
        await writeAudit({
          actorUid, actorRole: "super_admin", action: "config.platform",
          target: "config/platform", rule: "section 25",
          details: {reason, changes: changes.length},
        }, tx);
        return {changes};
      });
    });
  });

/**
 * Modification des paramètres d'un pays (ouverture, retrait minimum,
 * plafond et frais de retrait).
 */
export const adminUpdateCountryConfig = onCall(
  async (request: CallableRequest) => {
    return guard(async () => {
      const actorUid = requireSuperAdmin(request);
      const data = asObject(request.data);
      const code = reqString(data, "code", 2).toUpperCase();
      const reason = assertConfigReason(data.reason);
      const ref = db.collection("countries").doc(code);
      return db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) {
          throw new DomainError("not_found", "Pays introuvable.");
        }
        const {next, changes} =
          applyCountryPatch(snap.data() as CountryConfig, data.patch);
        tx.set(ref, next);
        tx.create(db.collection("configHistory").doc(), {
          scope: `country:${code}`, changes, reason, actorUid,
          createdAt: FieldValue.serverTimestamp(),
        });
        await writeAudit({
          actorUid, actorRole: "super_admin", action: "config.country",
          target: `countries/${code}`, rule: "section 21",
          details: {reason, changes: changes.length},
        }, tx);
        return {changes};
      });
    });
  });
