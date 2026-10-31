import {FieldValue} from "firebase-admin/firestore";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {db} from "../lib/db";
import {guard} from "../lib/errors";
import {enforceRateLimit} from "../lib/rateLimit";
import {getPlatformConfig} from "../lib/config";
import {asObject} from "../lib/validate";
import {DomainError} from "../domain/errors";
import {accessStateFromDoc, resolveAccess} from "../domain/subscription";
import {
  aiUsageId, buildAiRequest, dailyAiQuota, parseAiTone, parseAiTool,
  sanitizeAiInput,
} from "../domain/aiTools";
import {GeminiClient} from "../services/ai/gemini";

// La clé GEMINI_API_KEY est lue dans l'environnement de la fonction
// (functions/.env.<projet>). Pour la stocker dans Secret Manager : créer le
// secret avec une VRAIE valeur, puis déclarer
// `defineSecret("GEMINI_API_KEY")` ici et dans `secrets` ci-dessous.
const aiSecrets: never[] = [];

const gemini = new GeminiClient();

/**
 * Outils IA de rédaction (section 13) : appelle Gemini côté serveur, jamais
 * depuis le navigateur (une clé dans le bundle serait publique).
 * Garde-fous : connexion + e-mail confirmé, Pass actif, quota quotidien par
 * offre, limite de débit, textes saisis non conservés.
 */
export const runAiTool = onCall(
  {secrets: aiSecrets, timeoutSeconds: 90},
  async (request: CallableRequest) => {
    return guard(async () => {
      if (!request.auth) {
        throw new HttpsError("unauthenticated",
          "Connexion requise pour utiliser les outils IA.");
      }
      if (request.auth.token.email_verified !== true) {
        throw new DomainError("email_not_verified",
          "Confirmez votre adresse e-mail pour utiliser les outils IA.");
      }
      const uid = request.auth.uid;
      await enforceRateLimit("ai_tool", uid, 10, 60);

      const data = asObject(request.data);
      const tool = parseAiTool(data.tool);
      const input = sanitizeAiInput(data.input, tool);
      const tone = parseAiTone(data.tone);

      if (!gemini.isConfigured()) {
        throw new DomainError("ai_not_configured",
          "L'assistant IA n'est pas encore configuré.");
      }

      const now = new Date();
      const [userSnap, platform] = await Promise.all([
        db.collection("users").doc(uid).get(), getPlatformConfig(),
      ]);
      if (!userSnap.exists) {
        throw new DomainError("user_not_found", "Profil introuvable.");
      }
      const user = userSnap.data() as {status?: string};
      if (user.status !== undefined && user.status !== "active") {
        throw new DomainError("account_not_active",
          "Votre compte ne permet pas cette action pour le moment.");
      }
      // Accès EFFECTIF (un abonnement échu ne compte plus).
      const access = resolveAccess(accessStateFromDoc(
        userSnap.data() as never), now);
      if (!access.isActivated) {
        throw new DomainError("activation_required",
          "Les outils IA nécessitent un Pass actif.");
      }
      const limit = dailyAiQuota(access.plan, platform.aiDailyQuota);

      // Réservation du quota AVANT l'appel (deux requêtes simultanées ne
      // peuvent pas dépasser le plafond) ; rendue si l'appel échoue.
      const usageRef = db.collection("aiUsage").doc(aiUsageId(uid, now));
      const used = await db.runTransaction(async (tx) => {
        const snap = await tx.get(usageRef);
        const count = (snap.data()?.count as number | undefined) ?? 0;
        if (count >= limit) {
          throw new DomainError("quota_exceeded",
            `Quota quotidien atteint (${limit} génération(s) par jour pour ` +
            "votre offre). Revenez demain.");
        }
        tx.set(usageRef, {
          userId: uid, day: now.toISOString().slice(0, 10),
          count: count + 1, updatedAt: FieldValue.serverTimestamp(),
        });
        return count + 1;
      });

      try {
        const req = buildAiRequest(tool, input, tone);
        const result = await gemini.generate({
          ...req, temperature: tool === "summarizer" ? 0.2 : 0.7,
        });
        return {text: result.text, remaining: Math.max(0, limit - used),
          dailyLimit: limit};
      } catch (err) {
        await usageRef.set({count: FieldValue.increment(-1),
          updatedAt: FieldValue.serverTimestamp()}, {merge: true});
        throw err;
      }
    });
  });
