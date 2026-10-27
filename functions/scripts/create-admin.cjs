#!/usr/bin/env node

/**
 * Script pour créer ou promouvoir un compte Administrateur dans Firebase.
 * Usage :
 *   node scripts/create-admin.cjs <email> <password> [super_admin|admin|financial_manager]
 *
 * Exemple :
 *   node scripts/create-admin.cjs admin@global-af.ci MonSuperMotDePasse2026! super_admin
 */

const admin = require('firebase-admin');

// Initialisation de Firebase Admin avec le projet global-af-dev
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'global-af-dev'
  });
}

// Named database "global-af-database"
const db = admin.firestore();
db.settings({ databaseId: 'global-af-database' });
const auth = admin.auth();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];
  const role = args[2] || 'super_admin';

  if (!email || !password) {
    console.error("\n❌ Erreur : Paramètres manquants.");
    console.log("Usage : node scripts/create-admin.cjs <email> <mot_de_passe> [role]");
    console.log("Exemple : node scripts/create-admin.cjs admin@global-af.ci Securise2026! super_admin\n");
    process.exit(1);
  }

  const validRoles = ['admin', 'super_admin', 'financial_manager', 'advertiser'];
  if (!validRoles.includes(role)) {
    console.error(`\n❌ Rôle invalide. Rôles autorisés : ${validRoles.join(', ')}\n`);
    process.exit(1);
  }

  console.log(`\n⏳ Configuration du compte admin pour ${email} avec le rôle "${role}"...`);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`ℹ️ Utilisateur existant trouvé (UID: ${userRecord.uid}). Mise à jour du mot de passe...`);
    await auth.updateUser(userRecord.uid, {
      password: password,
      emailVerified: true
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`✨ Création du nouvel utilisateur Firebase Auth...`);
      userRecord = await auth.createUser({
        email: email,
        password: password,
        emailVerified: true,
        displayName: 'Administrateur GLOBAL-AF'
      });
    } else {
      throw error;
    }
  }

  const uid = userRecord.uid;

  // 1. Mise à jour de users/{uid} dans "global-af-database"
  await db.collection('users').doc(uid).set({
    id: uid,
    email: email,
    firstName: 'Admin',
    lastName: 'GLOBAL-AF',
    role: role,
    country: 'CI',
    isActivated: true,
    subscriptionPlan: 'business',
    referralCode: 'ADMIN_' + uid.slice(0, 6).toUpperCase(),
    spendingLimitMonthly: 10000000,
    spentThisMonth: 0,
    isEmailVerified: true,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }, { merge: true });

  // 2. Création ou mise à jour du wallet
  await db.collection('wallets').doc(uid).set({
    userId: uid,
    availableBalance: 0,
    pendingBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    currency: 'XOF',
    updatedAt: new Date().toISOString()
  }, { merge: true });

  console.log(`\n✅ SUCCÈS ! Compte administrateur configuré avec succès :`);
  console.log(`--------------------------------------------------`);
  console.log(`📧 Email       : ${email}`);
  console.log(`🔑 Mot de passe : ${password}`);
  console.log(`🛡️ Rôle        : ${role}`);
  console.log(`🆔 UID         : ${uid}`);
  console.log(`🌐 Accès Back-Office : https://global-af-dev-admin.web.app\n`);
}

main().catch((err) => {
  console.error("❌ Erreur lors de la configuration de l'admin :", err);
  process.exit(1);
});
