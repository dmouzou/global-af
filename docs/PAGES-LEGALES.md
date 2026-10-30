# Pages légales — état et points à valider

Pages ajoutées (liens dans le pied de page) : **Conditions générales**,
**Politique de confidentialité**, **Politique cookies**, **Mentions légales**.
Textes dans `src/data/legalTexts.ts`, identité de l'éditeur dans
`src/data/legalEntity.ts`. Les CGU s'affichent aussi dans la fenêtre d'inscription.

**Ce sont des projets de textes, rédigés d'après le fonctionnement réel de la plateforme
et vos décisions. Ils doivent être relus et validés par un juriste ivoirien avant
publication.** Tant que `LEGAL_REVIEWED = false` (dans `legalEntity.ts`), chaque page
affiche un bandeau « version provisoire » ; le passer à `true` après validation.

## À renseigner (`src/data/legalEntity.ts`)
Raison sociale, forme juridique, capital, RCCM, adresse postale complète, téléphone,
directeur de la publication, correspondant à la protection des données (e-mail),
**n° de déclaration ou d'autorisation ARTCI**, lieu d'hébergement de la base (région
Firebase), juridiction compétente, durées de conservation (compte après clôture, pièces
comptables, journaux). Un champ vide s'affiche « [à renseigner] » en surbrillance.
Seul l'e-mail `contact@global-af.ci` (déjà dans le pied de page) est prérempli.

## Décisions produit reflétées dans les textes
- **Pass actif obligatoire** pour les missions rémunérées, les formations et les retraits
  (appliqué aussi côté serveur : un retrait sans Pass est refusé).
- **Rétractation de 7 jours uniquement pour les abonnements** (Premium, Business),
  remboursement **sous déduction de 3 % de frais de transaction** ; **Pass d'entrée non
  remboursable**, reconnu par case à cocher (horodatée sur le paiement). Si le membre
  possède aussi un Pass d'entrée, rétracter l'abonnement ne le lui retire pas.
- Commissions : uniquement sur ventes réelles, jamais sur le Pass d'entrée ; créditées après
  7 jours ; annulées si le filleul se rétracte.
- Ces choix **s'écartent du cahier des charges** (sections 6 et 39, conditions 2 et 5 : droit
  de rétractation pour toute activation payante, palier gratuit réellement utile). Écart
  assumé par le propriétaire du produit.

## Points à faire valider par votre conseil
1. **Non-remboursabilité du Pass d'entrée** et **conditionnement des retraits à un paiement** :
   ce sont les clauses les plus exposées au regard du droit de la consommation et de la
   réglementation sur les systèmes de parrainage/ventes pyramidales. Je ne suis pas juriste :
   ces textes ne valent pas conseil juridique.
2. Les **3 % de frais** : à aligner sur le barème réel de CinetPay (valeur modifiable :
   `refundFeeBps` dans la configuration serveur et `src/lib/policy.ts`) et à afficher avant paiement
   (déjà fait dans la fenêtre de paiement).
3. Références : loi n° 2013-450 du 19 juin 2013 (données personnelles) et ARTCI, d'après des
   sources publiques ; le traitement de données et les transferts hors de Côte d'Ivoire sont
   soumis à déclaration ou autorisation préalable : à effectuer avant l'ouverture.
4. Durées de conservation, limitation de responsabilité, juridiction compétente, médiation.
5. Qualification juridique du portefeuille et des retraits (monnaie électronique / services de
   paiement, section 38 du cahier des charges).

## Politique cookies : hypothèses à vérifier
Aucun cookie publicitaire ni outil d'audience n'est présent dans le code ; la session de
connexion Firebase utilise le stockage du navigateur ; le site charge des polices Google
Fonts et `fonts.cdnfonts.com` (transmission de l'adresse IP à ces services : à remplacer par
des polices hébergées localement si vous voulez l'éviter). Si un outil d'analyse est ajouté,
il faudra un consentement préalable et une mise à jour de la page.
