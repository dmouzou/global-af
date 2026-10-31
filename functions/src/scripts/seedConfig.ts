/**
 * Initialise la configuration (collections `config` et `countries`).
 * Usage : node lib/scripts/seedConfig.js [--force]
 * Nécessite des identifiants Google (ADC) ou l'émulateur
 * (FIRESTORE_EMULATOR_HOST). N'écrase JAMAIS une configuration existante
 * sans --force.
 *
 * VALEURS : issues du cahier des charges v1.2 et des décisions du
 * propriétaire (affiliation 10 %/5 %, rétractation 7 j, 18 ans). Les
 * valeurs marquées « prototype » proviennent de l'ancien prototype et
 * restent À CONFIRMER : frais et minimum de retrait, plafond mensuel par
 * défaut, prix et type des packs.
 */
import {FieldValue} from "firebase-admin/firestore";
import {db} from "../lib/db";
import {PlatformConfig, CountryConfig} from "../domain/types";
import {assertAffiliationConfig} from "../domain/commission";

const platform: PlatformConfig = {
  minAge: 18,
  retractionDays: 7,
  subscriptionDays: 30, // période d'abonnement ; renouvellement manuel
  // Plafonds quotidiens d'appels IA (hypothèses de départ, à confirmer).
  aiDailyQuota: {standard: 10, premium: 200, business: 300},
  refundFeeBps: 300, // 3 % retenus au remboursement : à confirmer avec les frais CinetPay
  retractionMaxConsumption: null, // critère « contenu consommé » : à définir
  defaultMonthlyLimit: 50000, // prototype : à confirmer
  rapidPayment: null, // seuil des paiements rapprochés : à définir
  affiliation: {
    level1Bps: 1000, // 10 %
    level2Bps: 500, // 5 %
    maxLevels: 2,
    maxTotalBps: 1500, // = N1 + N2 : aucun plafond supplémentaire inventé
    commissionableKinds: ["subscription", "course", "partner_campaign"],
  },
};

const countries: CountryConfig[] = [{
  code: "CI",
  enabled: true,
  currency: "XOF",
  phonePrefix: "225",
  nationalLengths: [10],
  withdrawal: {
    minAmount: 2000, // prototype : à confirmer
    maxAmount: null,
    feeBps: 150, // prototype (1,5 %) : à confirmer
    operators: ["wave", "orange_money", "mtn_momo", "moov_money"],
  },
}];

// Offres. `activation` = Pass d'entrée : NON remboursable (décision produit),
// sans commission d'affiliation (section 6). `subscription` = abonnements :
// droit de rétractation de 7 jours (remboursement sous déduction des frais
// de transaction) et commissions d'affiliation sur ventes réelles.
const products = [
  {id: "standard", name: "Pass Membre Standard", priceXOF: 3000,
    kind: "activation"},
  {id: "premium", name: "Abonnement Premium", priceXOF: 9900,
    kind: "subscription"},
  {id: "business", name: "Abonnement Business", priceXOF: 25000,
    kind: "subscription"},
];

/** Point d'entrée du script. */
async function main(): Promise<void> {
  const force = process.argv.includes("--force");
  assertAffiliationConfig(platform.affiliation);
  const writes: Array<[FirebaseFirestore.DocumentReference, object]> = [
    [db.collection("config").doc("platform"), platform],
    ...countries.map((c) =>
      [db.collection("countries").doc(c.code), c] as
        [FirebaseFirestore.DocumentReference, object]),
    ...products.map((p) =>
      [db.collection("products").doc(p.id), p] as
        [FirebaseFirestore.DocumentReference, object]),
  ];
  for (const [ref, value] of writes) {
    const exists = (await ref.get()).exists;
    if (exists && !force) {
      console.log(`Ignoré (existe déjà) : ${ref.path}`);
      continue;
    }
    await ref.set({...value, updatedAt: FieldValue.serverTimestamp()});
    console.log(`Écrit : ${ref.path}`);
  }
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
