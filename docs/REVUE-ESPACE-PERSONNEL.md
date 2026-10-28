# Revue de l'espace personnel — corrections et reste à faire

Revue du code (frontend `src/`, backend `functions/`, règles Firestore) réalisée
après le commit `3123f96`. Les constats viennent de la lecture du code, du
build et des tests ; **rien n'a été testé dans un navigateur ni avec les
émulateurs Firebase.**

## 1. Corrigé dans ce lot

### Isolation des données (demande initiale)
- Les notifications du membre de démo s'affichaient à tous : toutes les données
  personnelles (notifications, ledger, retraits) sont désormais lues **dans
  Firestore pour l'utilisateur connecté uniquement** ; plus aucune donnée de démo
  (profils Aïcha/Kouamé, tickets, publications, soumissions, indicateurs).
- Écouteurs Firestore jamais résiliés à la déconnexion (le profil d'un ancien
  compte pouvait réapparaître) : tous résiliés à chaque changement d'utilisateur.
- `DemoSwitcher.tsx` supprimé ; `INITIAL_*` personnels supprimés.

### Inscription et connexion
- **Date de naissance codée en dur (`1995-01-01`)** : la vérification d'âge 18+
  du serveur était contournée. Vraie date saisie ; contrôle serveur conservé.
- **Aucun e-mail de confirmation n'était jamais envoyé** (`sendEmailVerification`
  absent) : retraits et paiements, qui exigent un e-mail vérifié, étaient donc
  bloqués pour tous. Envoi ajouté, étape de vérification réelle (renvoi,
  « j'ai confirmé »), bandeau dans le dashboard.
- Faux code de vérification (`784910`, `123456`) supprimé.
- Lien de parrainage : domaine inexistant et code jamais lu. Lien
  `https://<site>/?ref=CODE`, code prérempli à l'inscription.
- Login admin : rôle lu dans le **claim signé** (pas dans le profil) ; déconnexion en cas de refus.

### Argent (client)
- **Faux code e-mail du premier retrait** (`248690`/`123456` acceptés et affichés)
  supprimé.
- Activation, rétractation, remboursement, récompenses de missions et points de
  quiz étaient **simulés dans le navigateur** (compte « activé » sans paiement
  confirmé, remboursement affiché alors que le serveur avait refusé, erreurs
  serveur avalées). Plus aucune écriture d'argent côté client : l'état affiché
  vient du serveur.
- Actions de retrait admin : le client envoyait `pay`/`fail`, actions inconnues du
  serveur, mais affichait « Payé ». Les vraies actions sont utilisées, avec
  référence opérateur obligatoire pour confirmer un paiement.
- Retraits : le numéro de versement est celui de l'inscription (champ non modifiable).
- Profil : les modifications n'étaient jamais enregistrées (« succès » affiché) →
  `updateMyProfile` ; le téléphone n'est plus modifiable en ligne.
- Plafond de dépense : réglage purement local, sans effet serveur → `setSpendingLimit`.
- Mentions fausses retirées : « Profil/Mobile Money Certifié », attestation PDF
  « générée », « E-mail vérifié » toujours vert, matricules factices,
  « validation instantanée », « +40 % », « retrait express < 2 h », « gains garantis ».
- Indicateurs de gains publics inventés (4 210 membres, revenu médian 28 500 XOF)
  remplacés par « en cours de collecte » (condition 3).
- Clé Gemini lue dans le navigateur (`VITE_GEMINI_API_KEY`) : supprimée.

### Backend (`functions/`)
- **Le prix était choisi par le client** (500 XOF pouvaient activer un pack à
  25 000 XOF) : prix et type lus dans `products/{id}`.
- **Secrets de webhook par défaut connus** (`dev_wave_secret`…) : un paiement
  « confirmé » pouvait être forgé. Échec fermé si le secret est absent.
- Webhook : montant vérifié ; un webhook tardif ne peut plus faire passer un
  paiement confirmé à « échoué » ; idempotent ; ledger et notification créés.
- Un achat sans accès (cours) rétrogradait l'offre en « free » : corrigé.
- Cumul « dépensé ce mois » jamais remis à zéro (plafond devenu à vie) : corrigé.
- Rétractation : jamais fonctionnelle (Timestamp traité comme Date, identifiant de
  paiement inventé) et ne remboursait rien. Statut vérifié dans la transaction,
  demande de remboursement (`refunds`) + `adminProcessRefund` (référence obligatoire).
- Commissions : relecture en transaction (pas de double crédit), notification,
  job quotidien, index manquant `(status, matureAt)`.
- Paiement fermé en production tant que les API opérateurs ne sont pas branchées
  (les adaptateurs simulent ; variable `PAYMENTS_SIMULATION=true` pour le dev).
- Tests : 44 (13 nouveaux : webhooks sans secret, prix, plafond, Timestamp).

## 2. À faire avant toute mise en production

1. Définir les secrets : `WAVE_WEBHOOK_SECRET`, `ORANGE_WEBHOOK_SECRET`,
   `MTN_WEBHOOK_SECRET`, `MOOV_WEBHOOK_SECRET` (sans eux, aucun webhook n'est accepté).
2. `node lib/scripts/seedConfig.js` pour créer le produit `standard` (3 000 XOF,
   prototype) en plus de `premium` et `business` ; déployer règles, **index** et fonctions.
3. Brancher les vraies API Wave/Orange/MTN/Moov (les adaptateurs actuels fabriquent
   des URL de paiement fictives) puis retirer le garde-fou.
4. Restreindre la clé web Firebase dans Google Cloud (référents HTTP, API limitées).
5. Tester avec les émulateurs : inscription → e-mail → retrait → traitement admin,
   paiement → webhook → rétractation → remboursement, plafond.

## 3. Décisions produit / juridiques (non modifiées)

- **Retraits verrouillés derrière une activation payante** (UI uniquement ; le
  serveur ne l'exige pas). Argent gagné retenu tant que le membre ne paie pas :
  incompatible avec l'esprit des conditions 2 et 5. À trancher avant lancement.
- Contenu réel des offres Standard/Premium (la « majoration de gains » n'existe
  nulle part dans le code) ; Premium « 9 900 FCFA/mois » mais produit `activation`
  unique en base ; un pack `activation` ne génère aucune commission (section 6).
- Valeurs prototype à confirmer : frais de retrait 1,5 %, minimum 2 000 XOF,
  plafond mensuel par défaut 50 000 XOF.
- Catalogue de missions, formations, VCF et « Gains » affichés : données de
  démonstration, sans backend. Le catalogue VCF (droits d'usage) reste à valider.
- Une hausse de plafond prend effet après 24 h (choix de protection à confirmer).

## 4. Modules sans backend (désormais explicites, rien n'est simulé)

Missions et récompenses, quiz/points/certificats, support par tickets,
communauté, téléchargement VCF, outils IA (modèles de texte locaux : à remplacer
par un appel serveur), journal d'audit et alertes de risque côté admin,
commissions et équipe d'affiliation (non lues dans le dashboard).

## 5. Optimisations restantes (non bloquantes)

- `MemberDashboard.tsx` : 3 100 lignes, un seul composant → découper par onglet
  et charger à la demande (le bundle dépasse 500 kB).
- `alert()`/`prompt()` à remplacer par des notifications et modales accessibles.
- Pagination du ledger, des retraits et des notifications (limites 200/100 actuelles).
- Régénération du jeton d'identité après changement de rôle (claim) sans reconnexion.
- Webhook : file de reprise et alerte sur les paiements restés « pending ».
- Rapprochement Mobile Money automatique (section 20) et tâche d'expiration des
  paiements en attente.
