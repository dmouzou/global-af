/**
 * Textes juridiques de GLOBAL-AF (projet à faire valider par un conseil).
 * Syntaxe : {{champ}} = valeur de LEGAL_ENTITY ou de POLICY ; **gras**.
 */
export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
}
export interface LegalDoc {
  id: 'cgu' | 'confidentialite' | 'cookies' | 'mentions';
  title: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_DOCS: Record<LegalDoc['id'], LegalDoc> = {
  cgu: {
    id: 'cgu',
    title: "Conditions générales d'utilisation",
    intro:
      "Ces conditions régissent l'utilisation de la plateforme web GLOBAL-AF par toute personne qui y crée un compte. En créant un compte, vous déclarez les avoir lues et acceptées.",
    sections: [
      {
        title: '1. Éditeur et objet',
        paragraphs: [
          "GLOBAL-AF est une plateforme web éditée par **{{name}}** ({{legalForm}}, RCCM {{rccm}}, siège : {{address}}). Elle réunit des formations, des missions numériques, un programme d'affiliation et un portefeuille de récompenses, accessibles depuis un navigateur.",
          "Contact : {{email}}.",
        ],
      },
      {
        title: '2. Définitions',
        list: [
          '**Membre** : toute personne titulaire d\'un compte.',
          "**Pass actif** : accès payant ouvert par un Pass d'entrée ou par un abonnement en cours.",
          "**Pass d'entrée** : paiement unique qui ouvre l'accès aux missions rémunérées, aux formations et aux retraits.",
          '**Abonnement** : offre payante Premium ou Business, décrite avant paiement.',
          '**Mission** : tâche numérique proposée sur la plateforme, avec une récompense indiquée à l\'avance.',
          '**Commission** : somme due au parrain lorsqu\'un filleul achète réellement un produit ou un service éligible.',
          '**Portefeuille** : historique et soldes des récompenses, commissions et opérations du Membre.',
        ],
      },
      {
        title: '3. Compte et inscription',
        list: [
          'Vous devez avoir **au moins {{minAge}} ans**. Votre date de naissance est demandée à l\'inscription et contrôlée.',
          'Un seul compte par personne. Les comptes multiples, fictifs ou prêtés sont interdits.',
          'Votre adresse e-mail doit être **confirmée** (lien reçu par e-mail) pour payer ou retirer.',
          'Le numéro Mobile Money indiqué à l\'inscription doit être le vôtre : il reçoit vos retraits et ne peut pas être modifié en ligne.',
          'Vous êtes responsable de la confidentialité de votre mot de passe et des actions faites depuis votre compte.',
        ],
      },
      {
        title: '4. Accès gratuit, Pass et prix',
        paragraphs: [
          "L'inscription est **gratuite**. Pour participer aux missions rémunérées, suivre les formations et demander un retrait, un **Pass actif** est nécessaire. Cette condition est affichée avant tout paiement.",
          "Le contenu précis de chaque offre, son prix en francs CFA (XOF) et ses éventuels frais sont affichés **avant** le paiement, sur la page de paiement. Un changement de prix ne s'applique pas aux achats déjà effectués.",
          "**Aucun gain n'est garanti.** Un Pass donne accès à des services ; il ne promet ni revenu, ni rendement. Ne payez jamais une offre dans l'espoir d'un revenu, ni en vous endettant.",
        ],
      },
      {
        title: '5. Paiement',
        paragraphs: [
          "Les paiements s'effectuent sur la page sécurisée de notre prestataire de paiement **CinetPay**, par Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) ou par carte bancaire Visa. Les données de votre carte sont saisies uniquement sur cette page : GLOBAL-AF ne les voit ni ne les conserve.",
          "Votre offre est activée **après la confirmation** du paiement par le prestataire. Si vous avez été débité sans activation, écrivez à {{email}} en indiquant la référence de paiement affichée sur la page de retour.",
        ],
      },
      {
        title: '6. Rétractation et remboursement',
        list: [
          "**Pass d'entrée (Standard)** : vous pouvez vous rétracter pendant **{{retractionDays}} jours** à compter du paiement, depuis la rubrique « Paramètres ». Votre accès aux micro-jobs, formations et retraits est alors retiré. Si la rétractation intervient avant 7 jours, le parrainage échoue et aucune commission n'est versée au parrain.",
          "Le remboursement du Pass d'entrée est versé sur le moyen de paiement utilisé, **sous déduction des frais de transaction ({{refundFeePercent}} %)**.",
          "**Abonnements (VIP Premium)** : ils **ne sont pas remboursables**. En raison de la mise à disposition immédiate et définitive des fichiers et contacts VCF téléchargeables et des outils IA exclusifs, aucun droit de rétractation ne s'applique aux abonnements. Vous le reconnaissez expressément avant tout paiement.",
        ],
      },
      {
        title: '7. Missions et récompenses',
        list: [
          "La récompense de chaque mission, ses conditions et ses preuves attendues sont indiquées **avant** que vous commenciez. Aucun tirage au sort n'intervient jamais.",
          'La récompense est versée si votre preuve est validée (automatiquement ou manuellement). Un refus peut être motivé.',
          "La plateforme ne garantit ni un nombre de missions, ni un volume de gains. L'ouverture des missions est progressive.",
          'Toute fraude (fausse preuve, double participation, automatisation) entraîne l\'annulation de la récompense et peut entraîner la suspension du compte.',
        ],
      },
      {
        title: '8. Affiliation (parrainage)',
        list: [
          "Le parrainage compte **deux niveaux au maximum** (filleuls directs, puis filleuls de vos filleuls). Il n'y a pas de troisième niveau.",
          "Une commission n'existe que lorsqu'un filleul **achète réellement** un produit ou un service éligible. L'inscription d'un filleul, ou l'achat d'un Pass d'entrée seul, ne génère aucune commission.",
          'Les taux en vigueur sont affichés dans la rubrique « Équipe » de votre espace. Chaque commission est créditée après un délai de {{retractionDays}} jours et annulée si le filleul se rétracte.',
          "Interdits : auto-parrainage, comptes fictifs, spam, recrutement trompeur, et toute communication promettant des gains (« gagne X par jour », mises en scène d'argent, formulations « jusqu'à » trompeuses). Sanctions : annulation des commissions, suspension ou clôture du compte.",
        ],
      },
      {
        title: '9. Portefeuille et retraits',
        list: [
          'Un retrait exige : un **Pass actif**, une adresse e-mail confirmée, un solde disponible suffisant et le respect du montant minimum.',
          'Le montant minimum, les frais et le **montant net** que vous recevrez sont affichés avant que vous validiez la demande.',
          "Le versement se fait sur le numéro Mobile Money de votre inscription (Wave, Orange Money, MTN MoMo ou Moov Money). Les retraits vers une carte bancaire ne sont pas proposés.",
          "Chaque demande est **contrôlée** avant paiement ; le montant demandé est mis de côté sur votre solde pendant ce contrôle. Le délai n'est pas garanti. Une demande refusée ou échouée est recréditée à votre solde.",
        ],
      },
      {
        title: '10. Protection des membres',
        list: [
          'Vous pouvez fixer un **plafond de dépense mensuel**. Une baisse est immédiate ; une hausse ne prend effet qu\'après un délai de réflexion de 24 heures.',
          "Aucun jeu de hasard n'est proposé sur la plateforme (ni roue, ni loterie, ni tirage au sort, ni pari).",
          "Vous pouvez demander la suspension volontaire ou la clôture de votre compte à {{email}}.",
        ],
      },
      {
        title: '11. Règles d\'usage',
        paragraphs: ['Il est interdit de :'],
        list: [
          'fournir de fausses informations ou de fausses preuves ;',
          'créer plusieurs comptes, ou utiliser le compte d\'un tiers ;',
          'utiliser des robots ou des scripts, ou détourner le fonctionnement de la plateforme ;',
          'inciter à de faux engagements ou à une manipulation des plateformes sociales ;',
          'publier des contenus illicites, trompeurs ou portant atteinte aux droits d\'autrui.',
        ],
      },
      {
        title: '12. Suspension et clôture',
        paragraphs: [
          'Vous pouvez demander la clôture de votre compte à tout moment. GLOBAL-AF peut suspendre ou clôturer un compte en cas de manquement à ces conditions ou de fraude, après avoir, lorsque c\'est possible, informé le Membre du motif.',
          "À la clôture, les sommes dues au Membre lui sont versées après contrôle, sauf en cas de fraude établie.",
        ],
      },
      {
        title: '13. Responsabilité',
        paragraphs: [
          "Le service est fourni « en l'état ». GLOBAL-AF ne garantit ni l'absence d'interruption, ni un résultat financier. Les opérateurs de paiement et les prestataires techniques sont des tiers : leurs indisponibilités échappent à notre contrôle.",
          "Les outils d'aide à la rédaction fournissent des propositions que vous devez relire : vous restez responsable de ce que vous publiez.",
        ],
      },
      {
        title: '14. Propriété intellectuelle',
        paragraphs: [
          "Les contenus de la plateforme (textes, formations, visuels, logos, mascotte) sont protégés. Ils vous sont concédés pour un usage personnel et non commercial, dans le cadre de votre accès.",
        ],
      },
      {
        title: '15. Données personnelles',
        paragraphs: [
          "Le traitement de vos données est décrit dans la **Politique de confidentialité**, conformément à la loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel.",
        ],
      },
      {
        title: '16. Modification des conditions',
        paragraphs: [
          "Ces conditions peuvent évoluer. La version en vigueur est celle publiée sur la plateforme, avec sa date. En cas de changement important, vous en serez informé ; poursuivre l'utilisation après notification vaut acceptation, sans effet rétroactif sur vos achats.",
        ],
      },
      {
        title: '17. Droit applicable et litiges',
        paragraphs: [
          "Ces conditions sont régies par le droit ivoirien. En cas de litige, écrivez d'abord à {{email}} pour rechercher une solution amiable. À défaut, la juridiction compétente est : {{jurisdiction}}.",
        ],
      },
    ],
  },

  confidentialite: {
    id: 'confidentialite',
    title: 'Politique de confidentialité',
    intro:
      "Cette politique explique quelles données personnelles GLOBAL-AF traite, pourquoi, avec qui elles sont partagées, combien de temps elles sont conservées et comment exercer vos droits.",
    sections: [
      {
        title: '1. Responsable du traitement',
        paragraphs: [
          "**{{name}}**, {{address}}. Contact : {{email}}. Correspondant à la protection des données : {{dpoEmail}}.",
          "Le traitement est effectué dans le cadre de la loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel, sous le contrôle de l'Autorité de régulation des télécommunications/TIC de Côte d'Ivoire (ARTCI). Référence de déclaration ou d'autorisation : {{artciRef}}.",
        ],
      },
      {
        title: '2. Données traitées',
        list: [
          '**Identité et contact** : prénom, nom, date de naissance (contrôle de l\'âge), adresse e-mail, numéro de téléphone Mobile Money, pays, ville et présentation facultatives.',
          '**Compte** : identifiant, mot de passe (géré par le service d\'authentification, jamais lisible par nous), rôle, état de vérification de l\'e-mail.',
          '**Activité** : missions et quiz, notifications, plafond de dépense, parrain, nombre de filleuls de niveau 1 et 2 (sans leur identité).',
          '**Opérations financières** : soldes, historique des opérations, références de paiement et de retrait, moyen de paiement utilisé (opérateur Mobile Money ou carte). **Nous ne recevons ni ne conservons aucun numéro de carte.**',
          "**Adresse de facturation** : saisie uniquement pour un paiement par carte, transmise au prestataire de paiement.",
          '**Sécurité** : journaux techniques et d\'audit des actions sensibles, mesures anti-fraude (limitation des requêtes, détection des comptes multiples).',
          "**Assistant automatique** : les messages que vous lui envoyez. N'y saisissez aucune donnée personnelle ou financière.",
        ],
      },
      {
        title: '3. Pourquoi nous les traitons',
        list: [
          "**Exécution du contrat** : création et gestion du compte, paiements, retraits, commissions, assistance.",
          '**Obligations légales** : conservation des pièces comptables et financières, lutte contre la fraude.',
          "**Intérêt légitime** : sécurité de la plateforme, prévention des abus et des comptes multiples, amélioration du service.",
          '**Consentement** : tout usage facultatif (par exemple des communications non essentielles), que vous pouvez retirer à tout moment.',
        ],
      },
      {
        title: '4. Avec qui nous les partageons',
        list: [
          '**Hébergement et services techniques** : Google Cloud / Firebase (authentification, base de données, fonctions, hébergement).',
          '**Paiement** : CinetPay et les opérateurs ou banques concernés, pour traiter vos paiements.',
          "**Assistant et outils de texte** : le fournisseur d'intelligence artificielle (Google Gemini), lorsque ces services sont actifs.",
          '**Équipe habilitée** : personnels du support et de la finance, selon leur rôle, pour traiter vos demandes.',
          "**Autorités** : sur demande légale. **Nous ne vendons pas vos données.**",
        ],
      },
      {
        title: '5. Transferts hors de Côte d\'Ivoire',
        paragraphs: [
          "Vos données sont hébergées à l'étranger chez nos prestataires techniques (lieu d'hébergement de la base : {{dataLocation}}). Ces transferts sont déclarés ou autorisés auprès de l'ARTCI lorsque la loi l'exige et encadrés par des engagements contractuels des prestataires.",
        ],
      },
      {
        title: '6. Durées de conservation',
        list: [
          'Données du compte : pendant la durée de la relation, puis {{retentionAccount}} après la clôture.',
          'Pièces comptables et financières : {{retentionAccounting}} (obligation légale).',
          'Journaux de sécurité : {{retentionLogs}}.',
        ],
      },
      {
        title: '7. Sécurité',
        list: [
          'Connexions chiffrées (HTTPS), mots de passe protégés par le service d\'authentification.',
          'Accès par rôles, règles de base de données empêchant un membre de lire les données d\'un autre.',
          "Écritures financières réalisées uniquement par nos fonctions serveur, avec historique conservé.",
          'Journal d\'audit des actions administratives sensibles.',
        ],
      },
      {
        title: '8. Vos droits',
        paragraphs: [
          "Vous disposez d'un droit d'**accès**, de **rectification**, d'**opposition** et de **suppression** de vos données, dans les limites des obligations légales de conservation. Pour les exercer, écrivez à {{dpoEmail}} (ou {{email}}) en précisant votre demande ; une pièce permettant de vous identifier peut être demandée.",
          "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l'ARTCI.",
        ],
      },
      {
        title: '9. Mineurs',
        paragraphs: [
          "La plateforme est réservée aux personnes de {{minAge}} ans et plus. Un compte dont le titulaire est mineur est clôturé.",
        ],
      },
      {
        title: '10. Cookies et stockage',
        paragraphs: ["Voir la **Politique cookies**."],
      },
      {
        title: '11. Modifications',
        paragraphs: [
          "Cette politique peut évoluer ; la version en vigueur est celle publiée ici, avec sa date.",
        ],
      },
    ],
  },

  cookies: {
    id: 'cookies',
    title: 'Politique cookies et stockage local',
    intro:
      "Cette page indique ce que le site enregistre dans votre navigateur et les ressources tierces qu'il charge.",
    sections: [
      {
        title: '1. Ce que nous utilisons',
        list: [
          "**Stockage strictement nécessaire** : le maintien de votre session de connexion (service d'authentification Firebase) est conservé dans le stockage de votre navigateur. Il disparaît lorsque vous vous déconnectez.",
          "**Aucun cookie publicitaire**, aucun outil de mesure d'audience ni de profilage n'est utilisé à la date de ces textes.",
        ],
      },
      {
        title: '2. Ressources tierces chargées par le site',
        list: [
          "**Polices de caractères** : le site charge des polices depuis Google Fonts et un service de polices tiers. Votre navigateur transmet alors votre adresse IP à ces services.",
          "**Page de paiement CinetPay** : lorsque vous payez, vous quittez GLOBAL-AF pour une page du prestataire, qui applique sa propre politique en matière de cookies.",
        ],
      },
      {
        title: '3. Consentement',
        paragraphs: [
          "Le stockage strictement nécessaire ne requiert pas de consentement. Si nous ajoutons un jour un outil de mesure d'audience ou de publicité, nous demanderons votre consentement **avant** de l'activer et nous mettrons cette page à jour.",
        ],
      },
      {
        title: '4. Gérer le stockage',
        paragraphs: [
          "Vous pouvez supprimer les données du site depuis les réglages de votre navigateur. Cela vous déconnecte. Bloquer le stockage nécessaire empêche de se connecter.",
        ],
      },
    ],
  },

  mentions: {
    id: 'mentions',
    title: 'Mentions légales',
    intro: "Informations légales sur l'éditeur et l'hébergeur de la plateforme GLOBAL-AF.",
    sections: [
      {
        title: 'Éditeur',
        list: [
          'Raison sociale : {{name}}',
          'Forme juridique : {{legalForm}} — Capital : {{capital}}',
          'RCCM : {{rccm}}',
          'Siège : {{address}}',
          'E-mail : {{email}} — Téléphone : {{phone}}',
          'Directeur de la publication : {{director}}',
        ],
      },
      {
        title: 'Hébergement',
        paragraphs: [
          "Hébergement et infrastructure : Google Cloud / Firebase (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis). Lieu d'hébergement de la base de données : {{dataLocation}}.",
        ],
      },
      {
        title: 'Paiement',
        paragraphs: [
          "Les paiements sont traités par CinetPay et les opérateurs ou banques concernés ; GLOBAL-AF ne conserve aucun numéro de carte.",
        ],
      },
      {
        title: 'Propriété intellectuelle',
        paragraphs: [
          "L'ensemble des éléments du site (marque, logos, textes, formations, visuels) est protégé. Toute reproduction non autorisée est interdite.",
        ],
      },
      {
        title: 'Données personnelles',
        paragraphs: [
          "Voir la Politique de confidentialité. Contact : {{dpoEmail}}. Autorité de contrôle : ARTCI.",
        ],
      },
      {
        title: 'Signalement et réclamations',
        paragraphs: [
          "Pour signaler un contenu ou déposer une réclamation : {{email}}.",
        ],
      },
    ],
  },
};
