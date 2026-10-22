import {createHash} from "node:crypto";
import {Timestamp} from "firebase-admin/firestore";
import {db} from "./db";
import {DomainError} from "../domain/errors";

/**
 * Limitation de débit par clé (hachée : l'IP n'est jamais stockée en clair).
 * @param {string} action Nom de l'action (ex. "register").
 * @param {string} subject Identifiant (IP, uid).
 * @param {number} max Nombre maximal d'appels dans la fenêtre.
 * @param {number} windowSeconds Durée de la fenêtre.
 */
export async function enforceRateLimit(action: string, subject: string,
  max: number, windowSeconds: number): Promise<void> {
  const key = createHash("sha256").update(`${action}:${subject}`)
    .digest("hex");
  const ref = db.collection("rateLimits").doc(key);
  const now = Date.now();
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() as
      { count: number; windowStart: Timestamp } | undefined;
    if (!data || now - data.windowStart.toMillis() > windowSeconds * 1000) {
      tx.set(ref, {count: 1, windowStart: Timestamp.fromMillis(now)});
      return;
    }
    if (data.count >= max) {
      throw new DomainError("rate_limited",
        "Trop de tentatives. Réessayez plus tard.");
    }
    tx.update(ref, {count: data.count + 1});
  });
}
