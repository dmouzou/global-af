import {FieldValue} from "firebase-admin/firestore";
import {db} from "./db";

/**
 * Crée une notification interne dans une transaction (écriture serveur :
 * les règles Firestore interdisent au client d'en créer).
 * @param {FirebaseFirestore.Transaction|FirebaseFirestore.WriteBatch} writer
 *   Transaction ou lot d'écritures en cours.
 * @param {string} userId Destinataire.
 * @param {string} title Titre.
 * @param {string} message Message.
 */
export function notify(
  writer: FirebaseFirestore.Transaction | FirebaseFirestore.WriteBatch,
  userId: string, title: string, message: string): void {
  const ref = db.collection("notifications").doc();
  const data = {
    userId, title, message, type: "system", read: false,
    createdAt: FieldValue.serverTimestamp(),
  };
  if ("getAll" in writer) {
    (writer as FirebaseFirestore.Transaction).set(ref, data);
  } else {
    (writer as FirebaseFirestore.WriteBatch).set(ref, data);
  }
}
