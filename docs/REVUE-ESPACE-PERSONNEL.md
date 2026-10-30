# Revue de l'espace personnel — corrections et reste à faire

Revue du code (frontend `src/`, backend `functions/`, règles Firestore) réalisée
après le commit `3123f96`. Les constats viennent de la lecture du code, du
build et des tests ; **rien n'a été testé dans un navigateur ni avec les
émulateurs Firebase.**

## 0. Couverture de la revue

| Rubrique | Lue en détail | Remarques |
|---|---|---|
| Vue d'ensemble, Profil, Portefeuille, Retraits, Notifications, Paramètres | Oui | Corrigées (voir §1) |
| Équipe / Affiliation | Oui | Affichait un faux filleul et un faux gain (+990 XOF) à tous : remplacé par des données réelles |
| Bonus | Oui | Faux « bonus d'inscription 1 000 XOF reçu » retiré |
| Mes activités (missions) | Oui | Majoration « +40 % » inexistante retirée ; envoi de preuve non disponible (pas de backend) |
| Académie (cours, quiz) | Oui | Message de quiz corrigé (plus de points/certificat annoncés) ; notation locale seulement |
| VCF, Outils IA, Communauté, Support | Parcourues | Pas de backend : messages explicites ; contenu VCF/IA non audité ligne à ligne |
| Pages publiques : accueil, Missions, Académie, Affiliation, Transparence, Outils, Partenaires, FAQ | Oui (affirmations et chiffres) | Corrigées (voir §1 bis) ; mise en page et accessibilité non revues |
| Chatbot (widget + `server.ts`) | Oui | Réécrit (voir §1 bis) |
| Barre de navigation, pied de page | Parcourus | Liens légaux ajoutés au pied de page |
| `storage.rules` | Non revu | |
| Comportement réel (navigateur, émulateurs Firebase, mobile) | **Non testé** | Aucun test de bout en bout n'a été exécuté |

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

## 1 bis. Pages publiques et chatbot (corrigés)

- Chiffres inventés affichés au public : revenu médian de 28 500 FCFA, « 32 450+ missions »,
  « 100 % de retraits », 4 210 membres actifs → retirés ; la page Transparence affiche
  « indicateurs en cours de collecte ».
- **Règle de rétractation contradictoire** : le site affirmait qu'elle ne s'appliquait pas au
  Pass Standard (3 000 FCFA), alors que le cahier des charges (condition 2) et le serveur
  l'appliquent à toute offre payante. Alignée sur 7 jours pour toutes les offres.
- Fausses certifications ou fonctions annoncées : « Certifié ARTCI & UEMOA », « 100 % légal »,
  « certificat inviolable », « 4 certifications vérifiées », « outils IA illimités (Gemini sans
  quota) », « téléchargement illimité des répertoires VCF », « retraits sous 2 h », « missions
  VIP à fort montant », « Chat instantané avec un conseiller » (aucun conseiller humain) →
  retirés ou reformulés (« à venir », « en cours d'ouverture »).
- Promesses de gains : « rémunérations garanties », « 10 % / 5 % garantis », « commissions
  récurrentes mensuelles » (aucun prélèvement récurrent n'existe) → reformulées ; simulateur
  d'affiliation relabellisé « exemple hypothétique » avec valeurs par défaut prudentes.
- Chatbot : réponses et fallbacks affirmaient des retraits « instantanés », un remboursement « en
  un clic en 1 à 3 jours », « aucun frais masqué » (frais de retrait pourtant prévus), Wave à 1 %
  ici et 1,5 % ailleurs, des fourchettes de gains de missions, des certificats, « aucune obligation
  d'achat pour retirer » (contraire à l'interface). Réécrits sur les seuls faits existants ;
  l'en-tête dit désormais « assistant automatique » (plus « en direct »).
- Serveur du chatbot : le message d'accueil du bot en tête de conversation faisait échouer les
  appels Gemini (la conversation doit commencer par l'utilisateur) → corrigé ; consignes
  anti-promesses et anti-injection ajoutées.
- Générateur de texte publicitaire et outils IA locaux : les modèles inventaient garanties,
  rareté (« 20 premiers »), avis clients et statistiques pour le compte du membre ; le « résumé »
  ne lisait même pas le texte. Remplacés par des trames à compléter (crochets) et un message
  clair quand l'IA n'est pas connectée.
- Paiement : carte Visa et Mobile Money via CinetPay (voir `docs/PAIEMENTS-MOBILE-MONEY.md`).

## 2. À faire avant toute mise en production

1. Définir les secrets `CINETPAY_API_KEY` et `CINETPAY_SECRET_KEY` (sans eux, aucun
   webhook n'est accepté) et `CINETPAY_SITE_ID`, `APP_BASE_URL`.
2. `node lib/scripts/seedConfig.js` pour créer le produit `standard` (3 000 XOF,
   prototype) en plus de `premium` et `business` ; déployer règles, **index** et fonctions.
3. Configurer CinetPay : voir `docs/PAIEMENTS-MOBILE-MONEY.md` (clés, secrets, variables,
   canal carte à activer chez CinetPay).
   **Ne pas ouvrir l'activation payante avant que les missions et les retraits
   fonctionnent réellement** : le Pass Standard vend l'accès à un catalogue de missions
   dont l'envoi de preuves n'existe pas encore.
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

- **Pages légales** : ajoutées (CGU, confidentialité, cookies, mentions) en version provisoire ;
  identité de l'éditeur, références ARTCI et durées de conservation à renseigner, validation
  juridique requise (voir `docs/PAGES-LEGALES.md`).
- **Décisions du propriétaire (écart assumé avec le cahier des charges)** : missions, formations
  et retraits exigent un Pass payant (désormais aussi contrôlé côté serveur) ; la rétractation ne
  s'applique qu'aux abonnements, avec 3 % de frais retenus ; le Pass d'entrée n'est pas
  remboursable. Textes publics, chatbot, interface et serveur alignés. Points à faire valider
  par un juriste (voir `docs/PAGES-LEGALES.md`).
- **API du chatbot et du générateur** (`/api/chat`, `/api/generate-copy`) : servies par
  `server.ts`, **non déployé par Firebase Hosting** (qui renvoie `index.html` pour toute URL) ; en
  production le widget retombe donc sur sa base locale. Si le serveur est déployé : exiger une
  authentification (limite actuelle : 15 requêtes/minute/IP, publique) pour protéger le quota Gemini.

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
