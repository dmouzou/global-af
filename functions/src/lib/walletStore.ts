import {FieldValue} from "firebase-admin/firestore";
import {db} from "./db";
import {EMPTY_BALANCES} from "../domain/ledger";
import {Balances, LedgerType, Posting} from "../domain/types";

export const walletRef = (uid: string) => db.collection("wallets").doc(uid);
export const ledgerRef = (id: string) => db.collection("ledger").doc(id);

export interface LedgerInput {
  /** Clé d'idempotence = identifiant du document ledger (unique). */
  entryId: string;
  userId: string;
  type: LedgerType;
  /** Phase du type (ex. "reserve", "release", "settle", "validate"). */
  phase?: string;
  /** Mouvement ; "external" des deux côtés n'est pas permis. */
  posting: Posting;
  currency: string;
  origin: string;
  ref?: { kind: string; id: string };
  meta?: Record<string, unknown>;
}

/**
 * Lit les soldes d'un wallet DANS une transaction (toutes les lectures
 * d'une transaction doivent précéder les écritures).
 * @param {FirebaseFirestore.Transaction} tx Transaction.
 * @param {string} uid Titulaire.
 * @return {Promise<Balances>} Soldes courants.
 */
export async function readBalances(tx: FirebaseFirestore.Transaction,
  uid: string): Promise<Balances> {
  const snap = await tx.get(walletRef(uid));
  if (!snap.exists) return {...EMPTY_BALANCES};
  const d = snap.data() as Balances;
  return {available: d.available, pending: d.pending, reserved: d.reserved};
}

/**
 * Écrit les soldes calculés et ajoute les écritures de ledger. Le ledger est
 * en ajout seulement : une écriture existante n'est jamais modifiée (on
 * corrige par contrepartie). Un entryId déjà présent fait échouer la
 * transaction (protection contre les doubles crédits).
 * @param {FirebaseFirestore.Transaction} tx Transaction.
 * @param {string} uid Titulaire du wallet.
 * @param {string} currency Devise.
 * @param {Balances} balances Nouveaux soldes (déjà validés par le domaine).
 * @param {LedgerInput[]} entries Écritures à ajouter.
 */
export function writeWalletAndLedger(tx: FirebaseFirestore.Transaction,
  uid: string, currency: string, balances: Balances,
  entries: LedgerInput[]): void {
  tx.set(walletRef(uid), {
    userId: uid, currency, ...balances,
    updatedAt: FieldValue.serverTimestamp(),
  }, {merge: true});
  for (const e of entries) {
    tx.create(ledgerRef(e.entryId), {
      userId: e.userId, type: e.type, phase: e.phase ?? null,
      posting: e.posting, amount: e.posting.amount, currency: e.currency,
      origin: e.origin, ref: e.ref ?? null, meta: e.meta ?? null,
      status: "posted", createdAt: FieldValue.serverTimestamp(),
    });
  }
}
