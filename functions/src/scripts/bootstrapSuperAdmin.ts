/**
 * Promeut un compte EXISTANT au rôle super_admin (amorçage unique).
 * Usage : node lib/scripts/bootstrapSuperAdmin.js adresse@email [--force]
 * Aucun identifiant n'est écrit dans le code. Le compte doit d'abord être
 * créé par l'inscription normale. Refuse s'il existe déjà un super_admin
 * (sauf --force).
 */
import {FieldValue} from "firebase-admin/firestore";
import {auth, db} from "../lib/db";
import {writeAudit} from "../lib/audit";

/** Point d'entrée du script. */
async function main(): Promise<void> {
  const email = process.argv[2];
  const force = process.argv.includes("--force");
  if (!email || email.startsWith("--")) {
    throw new Error("Usage : bootstrapSuperAdmin.js adresse@email [--force]");
  }
  const existing = await db.collection("users")
    .where("role", "==", "super_admin").limit(1).get();
  if (!existing.empty && !force) {
    throw new Error("Un super_admin existe déjà (utiliser --force).");
  }
  const user = await auth.getUserByEmail(email.toLowerCase());
  if (!user.emailVerified) {
    throw new Error("L'adresse e-mail du compte n'est pas vérifiée.");
  }
  await auth.setCustomUserClaims(user.uid, {role: "super_admin"});
  await db.collection("users").doc(user.uid).update({
    role: "super_admin", roleUpdatedAt: FieldValue.serverTimestamp(),
  });
  await writeAudit({
    actorUid: null, actorRole: "system", action: "user.role_changed",
    target: user.uid, rule: "section 3",
    details: {to: "super_admin", via: "bootstrap"},
  });
  console.log(`super_admin attribué à ${email} (uid ${user.uid}).`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
