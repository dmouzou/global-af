import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {db} from "../lib/db";
import {notify} from "../lib/notify";
import {accessStateFromDoc, resolveAccess} from "../domain/subscription";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Préavis du rappel d'échéance. */
const REMINDER_DAYS = 3;

/**
 * Entretien quotidien des abonnements :
 *  1. les abonnements échus repassent sur le Pass d'entrée (s'il existe) ou
 *     sur le palier gratuit, et le membre est notifié ;
 *  2. les abonnements qui expirent sous 3 jours déclenchent UN rappel par
 *     échéance.
 * Le serveur ne dépend pas de cette tâche pour les contrôles d'accès (retraits
 * : accès calculé à l'instant) ; elle remet seulement l'affichage à jour.
 * @param {Date} now Instant courant.
 * @return {Promise<{expired: number, reminded: number}>} Compteurs.
 */
export async function runSubscriptionMaintenance(now: Date):
  Promise<{expired: number; reminded: number}> {
  let expired = 0;
  for (let batch = 0; batch < 5; batch++) {
    const due = await db.collection("users")
      .where("subscriptionExpiresAt", "<=", Timestamp.fromDate(now))
      .limit(200).get();
    if (due.empty) break;
    for (const doc of due.docs) {
      const done = await db.runTransaction(async (tx) => {
        const fresh = await tx.get(doc.ref);
        const data = fresh.data();
        if (!data) return false;
        const state = accessStateFromDoc(data);
        // Relu dans la transaction : un renouvellement arrivé entre-temps gagne.
        if (!state.subscriptionExpiresAt ||
          state.subscriptionExpiresAt.getTime() > now.getTime()) return false;
        const after = resolveAccess({
          entryPass: state.entryPass, subscriptionPlan: null,
          subscriptionExpiresAt: null,
        }, now);
        tx.update(doc.ref, {
          isActivated: after.isActivated,
          subscriptionPlan: after.plan,
          planId: after.plan === "free" ? null : after.plan,
          subscriptionExpiresAt: null,
          expiryReminderFor: null,
          updatedAt: FieldValue.serverTimestamp(),
        });
        notify(tx, doc.id, "Abonnement expiré",
          after.isActivated ?
            "Votre abonnement a expiré. Votre Pass d'entrée reste actif : " +
            "vous pouvez renouveler l'abonnement depuis votre espace." :
            "Votre abonnement a expiré. Renouvelez-le depuis votre espace " +
            "pour retrouver l'accès aux missions, aux formations et aux " +
            "retraits. Vos soldes sont conservés.");
        return true;
      });
      if (done) expired++;
    }
  }

  let reminded = 0;
  const soon = await db.collection("users")
    .where("subscriptionExpiresAt", ">", Timestamp.fromDate(now))
    .where("subscriptionExpiresAt", "<=",
      Timestamp.fromDate(new Date(now.getTime() + REMINDER_DAYS * DAY_MS)))
    .limit(400).get();
  const writes = db.batch();
  for (const doc of soon.docs) {
    const data = doc.data();
    const state = accessStateFromDoc(data);
    const stamp = state.subscriptionExpiresAt?.getTime();
    if (!stamp || data.expiryReminderFor === stamp) continue;
    writes.update(doc.ref, {expiryReminderFor: stamp});
    notify(writes, doc.id, "Votre abonnement expire bientôt",
      `Votre abonnement expire le ${new Date(stamp)
        .toLocaleDateString("fr-FR")}. Il n'est pas renouvelé ` +
      "automatiquement : renouvelez-le avant cette date pour ne perdre " +
      "aucun jour.");
    reminded++;
  }
  if (reminded > 0) await writes.commit();
  return {expired, reminded};
}

/** Exécution automatique quotidienne (cahier des charges : CRON/jobs). */
export const processSubscriptions = onSchedule(
  {schedule: "every day 02:00", timeZone: "Africa/Abidjan"},
  async () => {
    const res = await runSubscriptionMaintenance(new Date());
    console.log(`Abonnements : ${res.expired} expiré(s), ` +
      `${res.reminded} rappel(s)`);
  });
