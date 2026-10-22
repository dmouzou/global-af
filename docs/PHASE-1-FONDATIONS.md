# Phase 1 — Fondations (suite à l'audit du cahier des charges v1.2)

Décisions du propriétaire : Firebase conservé ; API directes des 4 opérateurs
Mobile Money ; affiliation 10 % (N1) / 5 % (N2) ; rétractation 7 jours ;
âge minimum 18 ans vérifié sur date de naissance ; validation juridique
repoussée à plus tard.

## Livré dans cette phase
- `functions/src/domain/*` : logique métier pure, 31 tests (`npm test` dans `functions/`).
- `firestore.rules`, `storage.rules`, `firestore.indexes.json` : deny-by-default,
  aucune écriture client sur les données sensibles.
- `functions/src/handlers/*` : `registerUser`, `requestWithdrawal`,
  `adminProcessWithdrawal`, `adminSetUserRole` (région `europe-west1`).
- `functions/src/scripts/*` : `seedConfig` (non destructif), `bootstrapSuperAdmin`.
- `server.ts` durci ; `npm install` racine réparé.

## Pas encore fait (phases suivantes)
1. Module de paiement : abstraction prestataire, adaptateurs Wave / Orange Money /
   MTN MoMo / Moov Money, webhooks signés, activation, rétractation, validation
   des commissions après le délai. Dépend des documentations et identifiants
   marchands de chaque opérateur (non devinés).
2. Rebranchement du front sur Firebase (Auth, Firestore, Functions) et retrait
   du code de démonstration : connexion admin factice, `localStorage` comme
   source de vérité, `updateUserRole`, `idCardNumber`, profils de démo.
3. Balayage des textes publics : taux 15 % → 10 %, promesses « instantané »,
   « 48 h », frais « 1 % », indicateurs de gains inventés (condition 3).
4. Missions, quiz, VCF, support, communauté, back-office réel, exports.

## Hypothèses prises (à confirmer)
- Arrondi des commissions et des frais : vers le bas, en entiers (XOF).
- Mot de passe : 8 caractères minimum.
- Retrait : numéro Mobile Money = numéro d'inscription (pas de numéro libre).
- Un retrait est réservé dès la demande après contrôle automatique ; la
  validation manuelle suit (workflow section 20).
- Seed : frais de retrait 1,5 %, minimum 2 000 XOF, plafond mensuel 50 000 XOF,
  prix 9 900 / 25 000 XOF — valeurs issues du prototype, à confirmer.
- Les packs sont seedés en `kind: "activation"` (aucune commission, section 6).

## Limites de vérification
- Règles Firestore et handlers non exécutés contre l'émulateur (non
  disponible dans l'environnement de travail) : à tester avant déploiement.
- `functions` compile (tsc strict), passe ESLint, et le module se charge.
