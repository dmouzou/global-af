import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {db} from "../lib/db";
import {writeAudit} from "../lib/audit";
import {guard} from "../lib/errors";
import {asObject, reqString} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {CountryConfig, Role} from "../domain/types";
import {
  applyCountryPatch, applyPlatformPatch, assertConfigReason, FieldChange,
} from "../domain/configEdit";
import {completeCountry, completePlatform} from "../domain/defaults";

/**
 * Applique un patch ; si le seul effet est de compléter des champs absents,
 * c'est accepté et tracé (de « absent » vers la valeur par défaut).
 */
function applyWithCompletion<T>(
  apply: () => {next: T; changes: FieldChange[]}, base: T,
  filled: string[]): {next: T; changes: FieldChange[]} {
  const completion: FieldChange[] =
    filled.map((field) => ({field, from: null, to: "valeur par défaut du seed"}));
  try {
    const r = apply();
    return {next: r.next, changes: [...completion, ...r.changes]};
  } catch (e) {
    if (e instanceof DomainError && e.code === "no_change" &&
      filled.length > 0) {
      return {next: base, changes: completion};
    }
    throw e;
  }
}

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
        // Un document ancien est complété avec les valeurs du seed, et l'historique le dit.
        const {config: base, filled} = completePlatform(snap.data());
        const {next, changes} = applyWithCompletion(
          () => applyPlatformPatch(base, data.patch), base, filled);
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
        const {config: base, filled} =
          completeCountry(snap.data() as CountryConfig);
        const {next, changes} = applyWithCompletion(
          () => applyCountryPatch(base, data.patch), base, filled);
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
