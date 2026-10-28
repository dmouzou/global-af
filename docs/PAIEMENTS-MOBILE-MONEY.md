# Paiements Mobile Money — état et plan de branchement

Dernière mise à jour : 29 octobre 2026. Sources : documentation officielle de
Wave (docs.wave.com : Checkout, Webhook, Payout) et page développeur d'Orange
(developer.orange.com). Pour MTN, Moov et les agrégateurs, les informations
viennent de guides tiers et sont **à confirmer auprès des prestataires** (frais,
délais, conditions d'agrément).

## État du code

| Opérateur | Encaissement (activation, abonnements) | Versement (retraits) |
|---|---|---|
| Wave | **Adaptateur réel** (Checkout API + webhook signé), prêt dès que les clés sont fournies | Non branché (Payout API existe, voir ci-dessous) |
| Orange Money | Simulé : fermé en production | Non branché |
| MTN MoMo | Simulé : fermé en production | Non branché |
| Moov Money | Simulé : fermé en production | Non branché |

Les retraits restent **manuels** : la finance verse l'argent hors plateforme
puis saisit la référence de l'opérateur (obligatoire) dans le back-office.

## Wave (documentation officielle)

**Encaissement — Checkout API** : `POST https://api.wave.com/v1/checkout/sessions`
avec `amount` (chaîne, XOF sans décimale), `currency`, `client_reference` (notre
identifiant de paiement), `success_url` et `error_url` (https). Le membre est
redirigé vers `wave_launch_url`. Nous passons aussi `restrict_payer_mobile`
(seul le numéro du membre peut payer). Une session expire au bout de 30 minutes
par défaut ; un paiement peut échouer plusieurs fois avant de réussir.

**Webhook** : en-tête `Wave-Signature: t=<horodatage>,v1=<hmac>`, HMAC-SHA256 de
`horodatage + corps brut` avec le secret du webhook ; plusieurs `v1` possibles
pendant une rotation ; horodatage à refuser au-delà de 5 minutes. Événements :
`checkout.session.completed` et `checkout.session.payment_failed`. Le code
applique exactement ce schéma (tests inclus). L'ancienne implémentation vérifiait
la signature sur le corps seul : elle aurait refusé tous les vrais webhooks.

**Versement — Payout API** (`POST /v1/payout`) : permet de payer un numéro Wave ;
il ne couvre donc que les retraits vers Wave. Prévoir un contrat Wave Business
avec droit de payout, et un plafonnement/contrôle côté plateforme.

### À configurer pour mettre Wave en service
1. Ouvrir un compte **Wave Business** en Côte d'Ivoire et obtenir les clés
   (le processus de validation du compte marchand est propre à Wave).
2. Créer la clé API (`WAVE_API_KEY`) ; optionnel mais recommandé : secret de
   signature des requêtes (`WAVE_SIGNING_SECRET`).
3. Déclarer dans le portail Wave le webhook
   `https://europe-west1-<projet>.cloudfunctions.net/paymentWebhook?operator=wave`
   et récupérer son secret (`WAVE_WEBHOOK_SECRET`).
4. Fournir les secrets au backend (Firebase : `firebase functions:secrets:set …`
   ou variables d'environnement du projet) et `APP_BASE_URL` (URL https du site).
5. Tester avec un **petit montant réel** (Wave n'annonce pas de bac à sable
   public : vérifier avec leur support) puis contrôler la boucle complète :
   paiement → webhook → activation → rétractation → remboursement.
6. Prévoir un job d'expiration/réconciliation des paiements restés « pending »
   (les sessions Wave expirent sans webhook de succès).

## Orange Money

L'API « Orange Money Web Payment » est réservée aux **marchands Orange Money
enregistrés** (contrat marchand, conformité KYC). Il faut : un compte marchand,
l'accès au portail développeur Orange, les identifiants (clé marchand, jetons) et
l'URL de notification. Le versement vers un numéro Orange relève d'un produit
distinct (décaissement) à négocier. Documentation à demander : web payment,
notification (callback), vérification de statut, décaissement.

## MTN MoMo

L'API MoMo (portail développeur MTN) propose **Collection** (demande de paiement
avec callback) et **Disbursement** (versement). Passage en production : compte
marchand MTN CI, KYC, validation des cas d'usage. Point d'infrastructure : la
production peut exiger une **adresse IP sortante fixe** ; les Cloud Functions n'en
ont pas par défaut (connecteur VPC + Cloud NAT à prévoir).

## Moov Money

Je n'ai trouvé **aucune documentation développeur publique officielle** pour
Moov Money en Côte d'Ivoire. Probablement via contrat commercial direct avec
Moov Africa CI, ou via un agrégateur.

## Option agrégateur (recommandée pour couvrir les 4 opérateurs)

Le cahier des charges (section 20) autorise « directement ou via un agrégateur
agréé ». Un agrégateur évite 4 contrats et 4 intégrations. Candidats cités :
CinetPay, PayDunya, Flutterwave (page Côte d'Ivoire dans sa documentation
officielle), pawaPay, Hub2. Critères de choix : couverture **encaissement ET
versement** pour les 4 opérateurs en Côte d'Ivoire, frais, délais de
règlement, agrément (monnaie électronique/BCEAO), webhooks signés, sandbox.
Chaque agrégateur = un nouvel adaptateur dans `functions/src/services/payments/`
(l'architecture est déjà en place, avec tests de signature et d'idempotence).

## Ce dont j'ai besoin pour finir

- **Décision** : Wave direct seulement au lancement, ou agrégateur pour les 4 ?
- La **documentation** du prestataire retenu (je peux lire les pages publiques
  en ligne ; l'accès aux comptes, clés et sandbox restent chez toi) et un accès
  sandbox/test si le prestataire en fournit un.
- Les **secrets** (jamais dans le dépôt ni dans ce chat de préférence).
- La validation **juridique/réglementaire** du dispositif (section 38) : détenir
  des soldes de membres et les reverser peut relever de la réglementation sur la
  monnaie électronique ; à faire valider par un conseil local avant l'ouverture.
