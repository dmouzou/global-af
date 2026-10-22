import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, onCall} from "firebase-functions/v2/https";
import {auth, db} from "../lib/db";
import {getCountryConfig, getPlatformConfig} from "../lib/config";
import {writeAudit} from "../lib/audit";
import {enforceRateLimit} from "../lib/rateLimit";
import {guard} from "../lib/errors";
import {asObject, reqString} from "../lib/validate";
import {assertMinAge} from "../domain/age";
import {DomainError} from "../domain/errors";
import {normalizePhone} from "../domain/phone";
import {generateReferralCode, normalizeReferralCode} from "../domain/referral";
import {EMPTY_BALANCES} from "../domain/ledger";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Inscription (sections 5 et 39 condition 5). Appelable SANS être connecté :
 * toutes les vérifications (âge, unicité, parrain) ont lieu AVANT la création
 * du compte Firebase Auth, ce qui évite les comptes orphelins.
 * Le client se connecte ensuite et envoie l'e-mail de vérification.
 */
export const registerUser = onCall(async (request: CallableRequest) => {
  return guard(async () => {
    const data = asObject(request.data);
    const ip = request.rawRequest.ip ?? "unknown";
    await enforceRateLimit("register", ip, 10, 3600);

    const email = reqString(data, "email", 254).toLowerCase();
    if (!EMAIL_RE.test(email)) {
      throw new DomainError("invalid_email", "Adresse e-mail invalide.");
    }
    const password = reqString(data, "password", 128, MIN_PASSWORD_LENGTH);
    const firstName = reqString(data, "firstName", 60);
    const lastName = reqString(data, "lastName", 60);
    const countryCode = reqString(data, "country", 2, 2).toUpperCase();
    if (data.acceptedTerms !== true) {
      throw new DomainError("terms_required",
        "Vous devez accepter les conditions d'utilisation.");
    }

    const [platform, country] = await Promise.all([
      getPlatformConfig(), getCountryConfig(countryCode),
    ]);
    const now = new Date();
    const birthDate = assertMinAge(data.birthDate, now, platform.minAge);
    const phone = normalizePhone(data.phone, country);

    const rawRef = data.referralCode;
    let sponsorCode: string | null = null;
    if (rawRef !== undefined && rawRef !== null && rawRef !== "") {
      sponsorCode = normalizeReferralCode(rawRef);
      if (!sponsorCode) {
        throw new DomainError("invalid_referral", "Code de parrainage invalide.");
      }
    }

    // Pré-contrôles non transactionnels (message d'erreur rapide).
    if ((await db.collection("phoneIndex").doc(phone).get()).exists) {
      throw new DomainError("phone_in_use",
        "Ce numéro de téléphone est déjà utilisé.");
    }

    let userRecord;
    try {
      userRecord = await auth.createUser({
        email, password, displayName: `${firstName} ${lastName}`,
        emailVerified: false,
      });
    } catch (err) {
      if ((err as {code?: string}).code === "auth/email-already-exists") {
        throw new DomainError("email_in_use",
          "Cette adresse e-mail est déjà utilisée.");
      }
      throw err;
    }
    const uid = userRecord.uid;

    try {
      const referralCode = await db.runTransaction(async (tx) => {
        const phoneRef = db.collection("phoneIndex").doc(phone);
        const sponsorRef = sponsorCode ?
          db.collection("referralCodes").doc(sponsorCode) : null;
        // Lectures d'abord.
        const phoneSnap = await tx.get(phoneRef);
        const sponsorSnap = sponsorRef ? await tx.get(sponsorRef) : null;
        let ownCode = "";
        let ownRef = db.collection("referralCodes").doc("_");
        for (let i = 0; i < 5; i++) {
          ownCode = generateReferralCode(countryCode);
          ownRef = db.collection("referralCodes").doc(ownCode);
          if (!(await tx.get(ownRef)).exists) break;
          if (i === 4) {
            throw new DomainError("code_generation_failed",
              "Impossible de générer un code de parrainage, réessayez.");
          }
        }
        if (phoneSnap.exists) {
          throw new DomainError("phone_in_use",
            "Ce numéro de téléphone est déjà utilisé.");
        }
        let sponsorUid: string | null = null;
        if (sponsorSnap) {
          if (!sponsorSnap.exists) {
            throw new DomainError("invalid_referral",
              "Code de parrainage introuvable.");
          }
          sponsorUid = (sponsorSnap.data() as {uid: string}).uid;
        }

        // Écritures.
        tx.set(phoneRef, {uid, createdAt: FieldValue.serverTimestamp()});
        tx.set(ownRef, {uid, createdAt: FieldValue.serverTimestamp()});
        tx.set(db.collection("users").doc(uid), {
          uid, email, firstName, lastName, phone, country: countryCode,
          role: "member", status: "active", planId: null, activatedAt: null,
          level: "Starter", points: 0, referralCode: ownCode,
          referredByUid: sponsorUid,
          spendingLimitMonthly: platform.defaultMonthlyLimit,
          createdAt: FieldValue.serverTimestamp(),
        });
        tx.set(db.collection("userPrivate").doc(uid), {
          birthDate: birthDate.toISOString().slice(0, 10),
          ageVerifiedAt: FieldValue.serverTimestamp(),
          minAgeRequired: platform.minAge,
        });
        tx.set(db.collection("wallets").doc(uid), {
          userId: uid, currency: country.currency, ...EMPTY_BALANCES,
          updatedAt: FieldValue.serverTimestamp(),
        });
        if (sponsorUid) {
          // Un seul document par filleul : pas de double attribution.
          tx.create(db.collection("referrals").doc(uid), {
            userUid: uid, sponsorUid, createdAt: FieldValue.serverTimestamp(),
          });
        }
        await writeAudit({
          actorUid: uid, actorRole: "anonymous", action: "user.registered",
          target: uid, rule: "section 5",
          details: {country: countryCode, hasSponsor: sponsorUid !== null},
        }, tx);
        return ownCode;
      });
      await auth.setCustomUserClaims(uid, {role: "member"});
      return {uid, referralCode};
    } catch (err) {
      // Compensation : on ne laisse pas de compte Auth sans profil.
      await auth.deleteUser(uid).catch((e) =>
        console.error("Échec du nettoyage du compte Auth", uid, e));
      throw err;
    }
  });
});
