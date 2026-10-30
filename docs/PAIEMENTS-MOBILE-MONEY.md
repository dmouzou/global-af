# Paiements en ligne — CinetPay (Mobile Money + carte Visa)

Passerelle retenue : **CinetPay**, qui regroupe Wave, Orange Money, MTN MoMo,
Moov Money et les cartes bancaires. Intégration faite d'après la documentation
officielle (docs.cinetpay.com : initialisation, notification, jeton HMAC,
vérification de transaction). Un adaptateur Wave direct reste disponible
(`PAYMENT_PROVIDER=wave`) mais n'est pas utilisé par défaut.

## Fonctionnement

1. Le membre choisit un pack et **Mobile Money** ou **carte Visa** dans son espace.
2. La fonction `initiateOnlinePayment` lit le **prix dans le catalogue serveur**
   (`products/{id}`), enregistre le paiement puis appelle CinetPay
   (`POST /v2/payment`, canal `MOBILE_MONEY` ou `CREDIT_CARD`).
3. Le membre est redirigé vers la **page sécurisée CinetPay** : il y choisit son
   opérateur ou saisit sa carte. **Aucune donnée de carte ne passe par nos serveurs.**
4. CinetPay appelle `cinetpayWebhook` (POST, en-tête `x-token`). Nous vérifions le
   jeton HMAC-SHA256 (16 champs, clé secrète), puis **interrogeons toujours**
   `POST /v2/payment/check` : le statut et le montant viennent de cette réponse,
   jamais de la notification. Paiement accepté = `code 00` + `status ACCEPTED`.
5. Le serveur active l'offre, écrit le ledger, notifie le membre et planifie les
   commissions (créditées après le délai de rétractation).
6. Le membre revient sur `/?payment=return&pid=…` : un bandeau affiche l'état réel
   du paiement (enregistré par le serveur).

Règles appliquées : montant entier **multiple de 5**, 100 XOF minimum (exigence
CinetPay) ; paiement par carte = adresse, ville et code postal du client
(exigés par CinetPay) ; un paiement « échoué » peut encore être confirmé si le
membre réessaie sur le guichet ; un paiement confirmé n'est jamais rétrogradé ;
aucun secret par défaut (clés absentes = webhook refusé).

## À configurer

1. Compte marchand CinetPay validé (Mobile Money et, séparément, **canal carte** :
   à demander à CinetPay, avec les réseaux de cartes acceptés — Visa, éventuellement Mastercard).
2. Récupérer dans « Intégrations » : **APIKEY**, **SITEID**, **Secret Key**.
3. Secrets (Secret Manager) : `firebase functions:secrets:set CINETPAY_API_KEY` et
   `CINETPAY_SECRET_KEY`.
4. Variables non secrètes dans `functions/.env.<projet>` (non versionné) :
   `CINETPAY_SITE_ID=…` et `APP_BASE_URL=https://<votre-site>`.
5. Déployer règles, **index** et fonctions ; `node lib/scripts/seedConfig.js` pour créer
   les produits `standard`, `premium`, `business`.
6. Tester **avec de petits montants réels** (aucun bac à sable public confirmé dans la
   documentation consultée : à demander au support CinetPay), en vérifiant la boucle
   complète : paiement → notification → activation → rétractation → remboursement.
7. Adresse de notification à connaître (déjà envoyée dans chaque paiement) :
   `https://europe-west1-<projet>.cloudfunctions.net/cinetpayWebhook`.

## Règles commerciales appliquées (décisions du propriétaire)

- `standard` = **Pass d'entrée** (`kind: activation`) : non remboursable, aucune commission ;
  la case « je comprends qu'il n'est pas remboursable » est exigée et horodatée (`acceptedNoRefundAt`).
- `premium` et `business` = **abonnements** (`kind: subscription`) : rétractation de 7 jours,
  remboursement du montant payé **moins 3 %** (`refundFeeBps = 300`, à aligner sur les frais
  CinetPay), commissions d'affiliation (créditées après un délai de sécurité de 7 jours, à chaque renouvellement).
- Retraits : refusés par le serveur sans Pass actif.
- Si le membre a plusieurs achats, la rétractation d'un abonnement lui laisse la meilleure offre restante.
- **Non géré** : durée et renouvellement des abonnements. Un abonnement payé reste actif sans
  date d'expiration et il n'y a aucun prélèvement automatique ; à définir si « abonnement »
  doit signifier « 30 jours renouvelables ».

## Ce qui reste manuel ou non branché

- **Retraits (versements aux membres)** : manuels. L'API de transfert CinetPay existe
  (`client.cinetpay.com/v1/transfer/...`) mais exige un compte approvisionné, l'ajout du
  contact avant chaque envoi, et une **adresse IP publique fixe whitelistée** ; sans elle,
  chaque transfert demande une confirmation manuelle par e-mail. Les Cloud Functions n'ont
  pas d'IP fixe par défaut (connecteur VPC + Cloud NAT à prévoir). Les versements vers une
  carte ne sont pas proposés par cette API.
- **Remboursements** (rétractation) : la demande est enregistrée (`refunds`), la finance
  rembourse depuis le back-office CinetPay puis saisit la référence dans `adminProcessRefund`.
- **Expiration des paiements restés « pending »** : pas encore de tâche planifiée.
- Frais et délais de règlement CinetPay : non vérifiés ici, à confirmer par contrat.

## Réglementaire

Encaisser pour le compte de membres et leur reverser des gains peut relever de la
réglementation sur la monnaie électronique / les services de paiement (cahier des
charges, section 38) : validation juridique locale requise avant ouverture commerciale.
