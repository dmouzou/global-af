import {FieldValue} from "firebase-admin/firestore";
import {db} from "./db";
import {Role} from "../domain/types";

export interface AuditEvent {
  actorUid: string | null;
  actorRole: Role | "system" | "anonymous";
  action: string;
  target?: string;
  details?: Record<string, unknown>;
  /** Règle du cahier des charges concernée (ex. "section 20"). */
  rule?: string;
}

/**
 * Ajoute une entrée au journal d'audit (append-only : aucune règle client
 * ne permet de la lire ou la modifier). Utilisable dans une transaction.
 * @param {AuditEvent} event Événement à journaliser.
 * @param {FirebaseFirestore.Transaction} [tx] Transaction éventuelle.
 */
export async function writeAudit(event: AuditEvent,
  tx?: FirebaseFirestore.Transaction): Promise<void> {
  const ref = db.collection("audit_logs").doc();
  const payload = {...event, createdAt: FieldValue.serverTimestamp()};
  if (tx) {
    tx.set(ref, payload);
  } else {
    await ref.set(payload);
  }
}
