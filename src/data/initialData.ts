import { 
  CountryConfig, 
  EthicalIndicators, 
  User, 
  Task, 
  Course, 
  VCFResource, 
  LedgerEntry, 
  CommunityPost, 
  SupportTicket, 
  NotificationItem, 
  AuditLogItem, 
  RiskAlert,
  WithdrawalRequest,
  TaskSubmission
} from '../types';
import { generate40ExamQuestions } from './examQuestions';

export const COUNTRIES_CONFIG: Record<string, CountryConfig> = {
  CI: {
    code: 'CI',
    name: "Côte d'Ivoire",
    currency: 'XOF',
    phonePrefix: '+225',
    minWithdrawal: 2000,
    withdrawalFeePercent: 1.5,
    operators: ['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money']
  }
};

export const INITIAL_ETHICAL_INDICATORS: EthicalIndicators = {
  medianMonthlyIncomeXOF: 28500,
  percentUnwithdrawnMembers: 34.2,
  averageDaysToFirstPayout: 11,
  totalWithdrawnXOF: 18450000,
  activeMembersCount: 4210,
  lastUpdated: '12 Octobre 2026'
};

export const INITIAL_CURRENT_USER: User = {
  id: 'usr_kouame_01',
  memberNumber: 'CI-2026-9042',
  firstName: 'Kouamé',
  lastName: 'Diallo',
  email: 'k.diallo@example.ci',
  phone: '+225 07 48 92 11 05',
  country: 'CI',
  city: 'Abidjan (Cocody Angré)',
  role: 'member',
  isActivated: true,
  activationDate: '2026-09-15',
  subscriptionPlan: 'free',
  referralCode: 'GAF-CI-9042',
  referredBy: 'GAF-CI-1002',
  defaultPayoutOperator: 'Orange Money',
  bio: 'Micro-entrepreneur digital à Abidjan, actif sur les sondages et la création de fiches produits.',
  level: 'Bronze',
  points: 480,
  isEmailVerified: true,
  spendingLimitMonthly: 50000,
  spentThisMonth: 0,
  createdAt: '2026-09-15'
};

export const DEMO_PROFILES: User[] = [
  {
    ...INITIAL_CURRENT_USER,
    role: 'member',
    subscriptionPlan: 'free'
  },
  {
    id: 'usr_aicha_premium',
    memberNumber: 'CI-2026-7731',
    firstName: 'Aïcha',
    lastName: 'Ouattara',
    email: 'aicha.ouattara@example.ci',
    phone: '+225 05 64 22 98 10',
    country: 'CI',
    city: 'Abidjan (Plateau / Marcory)',
    role: 'member_premium',
    isActivated: true,
    activationDate: '2026-09-20',
    subscriptionPlan: 'premium',
    referralCode: 'GAF-CI-7731',
    defaultPayoutOperator: 'Wave',
    bio: 'Consultante marketing e-commerce indépendante, certifiée Académie GLOBAL-AF.',
    level: 'Silver',
    points: 1250,
    isEmailVerified: true,
    spendingLimitMonthly: 100000,
    spentThisMonth: 9900,
    createdAt: '2026-09-20'
  },
  {
    id: 'usr_koffi_mod',
    firstName: 'Koffi',
    lastName: 'Jean-Yves',
    email: 'moderation@global-af.ci',
    phone: '+225 07 01 23 45 67',
    country: 'CI',
    role: 'moderator',
    isActivated: true,
    subscriptionPlan: 'business',
    referralCode: 'GAF-MOD-01',
    level: 'Gold',
    points: 3400,
    isEmailVerified: true,
    spendingLimitMonthly: 200000,
    spentThisMonth: 0,
    createdAt: '2026-08-01'
  },
  {
    id: 'usr_sophie_fin',
    firstName: 'Sophie',
    lastName: 'Yao',
    email: 'finances@global-af.ci',
    phone: '+225 01 55 44 33 22',
    country: 'CI',
    role: 'financial_manager',
    isActivated: true,
    subscriptionPlan: 'business',
    referralCode: 'GAF-FIN-01',
    level: 'Gold',
    points: 4200,
    isEmailVerified: true,
    spendingLimitMonthly: 500000,
    spentThisMonth: 0,
    createdAt: '2026-07-15'
  },
  {
    id: 'usr_ibrahim_admin',
    firstName: 'Ibrahim',
    lastName: 'Traoré',
    email: 'admin@global-af.ci',
    phone: '+225 07 99 88 77 66',
    country: 'CI',
    role: 'admin',
    isActivated: true,
    subscriptionPlan: 'business',
    referralCode: 'GAF-ADMIN-01',
    level: 'Platinum',
    points: 9800,
    isEmailVerified: true,
    spendingLimitMonthly: 1000000,
    spentThisMonth: 0,
    createdAt: '2026-06-01'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-001',
    title: 'Étude d\'usage du Mobile Money en Côte d\'Ivoire',
    category: 'survey',
    description: 'Partagez vos habitudes d\'utilisation de Wave, Orange Money et MTN MoMo pour les transactions quotidiennes.',
    instructions: [
      'Répondre consciencieusement aux 10 questions du formulaire sécurisé.',
      'Indiquer la fréquence réelle de vos recharges et transferts.',
      'Valider la dernière étape pour générer votre code de complétion.'
    ],
    rewardAmount: 600,
    currency: 'XOF',
    quotaMax: 1000,
    quotaCurrent: 642,
    requiredLevel: 'Starter',
    countries: ['CI'],
    isPremiumOnly: false,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    targetPlatform: 'Web',
    targetUrl: 'https://survey.global-af.ci/momo-habits',
    verificationType: 'automatic',
    status: 'published'
  },
  {
    id: 'tsk-002',
    title: 'Test UX & Ergonomie d\'une application de livraison abidjanaise',
    category: 'app_test',
    description: 'Testez la fluidité du parcours de commande d\'une application locale partenaire et signalez 2 pistes d\'amélioration concrètes.',
    instructions: [
      'Télécharger l\'application partenaire sur le Play Store ou tester la version web.',
      'Simuler une commande fictive jusqu\'à l\'étape du récapitulatif.',
      'Rédiger un avis constructif de 3 à 5 lignes avec une capture d\'écran.'
    ],
    rewardAmount: 1500,
    currency: 'XOF',
    quotaMax: 200,
    quotaCurrent: 89,
    requiredLevel: 'Bronze',
    countries: ['CI'],
    isPremiumOnly: false,
    startDate: '2026-10-05',
    endDate: '2026-10-25',
    targetPlatform: 'PlayStore',
    targetUrl: 'https://play.google.com/store/apps/details?id=ci.livraison.express',
    verificationType: 'manual',
    status: 'published'
  },
  {
    id: 'tsk-003',
    title: 'Découverte d\'un tutoriel sur la cybersécurité des comptes Mobile Money',
    category: 'social_visit',
    description: 'Visionnez une vidéo de sensibilisation de 4 minutes contre le hameçonnage par SMS et répondez aux 2 questions clés.',
    instructions: [
      'Regarder la vidéo éducative complète (pas de faux clic ni manipulation).',
      'Identifier les 2 réflexes pour protéger son code secret Wave / MoMo.',
      'Soumettre les 2 réponses pour validation immédiate.'
    ],
    rewardAmount: 400,
    currency: 'XOF',
    quotaMax: 1500,
    quotaCurrent: 1120,
    requiredLevel: 'Starter',
    countries: ['CI'],
    isPremiumOnly: false,
    startDate: '2026-10-08',
    endDate: '2026-11-08',
    targetPlatform: 'YouTube',
    targetUrl: 'https://youtube.com/watch?v=globalaf-cyber-protection',
    verificationType: 'automatic',
    status: 'published'
  },
  {
    id: 'tsk-004',
    title: 'Analyse d\'une fiche produit e-commerce (Artisanat d\'Afrique de l\'Ouest)',
    category: 'content_review',
    description: 'Vérifiez la clarté des descriptions et le prix affiché d\'une sélection de 3 produits artisanaux.',
    instructions: [
      'Consulter les 3 fiches produits sur la plateforme partenaire.',
      'Vérifier que les informations de livraison pour Abidjan et l\'intérieur sont explicites.',
      'Noter si les dimensions et la matière sont conformes.'
    ],
    rewardAmount: 850,
    currency: 'XOF',
    quotaMax: 300,
    quotaCurrent: 142,
    requiredLevel: 'Bronze',
    countries: ['CI'],
    isPremiumOnly: false,
    startDate: '2026-10-02',
    endDate: '2026-10-28',
    targetPlatform: 'Web',
    targetUrl: 'https://artisanat-ci.store/eval-produits',
    verificationType: 'manual',
    status: 'published'
  },
  {
    id: 'tsk-005',
    title: 'Mission Réservée Premium : Audit de conversion pour marque locale',
    category: 'partner_campaign',
    description: 'Mission approfondie : Réalisez un retour qualitatif complet sur l\'entonnoir d\'inscription d\'un service fintech partenaire.',
    instructions: [
      'Analyser le temps de chargement et la lisibilité des tarifs.',
      'Proposer un résumé synthétique de 150 mots avec vos recommandations.',
      'Rémunération majorée réservée aux membres ayant activé le pack Premium.'
    ],
    rewardAmount: 3200,
    currency: 'XOF',
    quotaMax: 100,
    quotaCurrent: 24,
    requiredLevel: 'Silver',
    countries: ['CI'],
    isPremiumOnly: true,
    startDate: '2026-10-10',
    endDate: '2026-10-30',
    targetPlatform: 'Web',
    targetUrl: 'https://fintech-audit.ci/onboarding-check',
    verificationType: 'manual',
    status: 'published'
  }
];

export const INITIAL_SUBMISSIONS: TaskSubmission[] = [
  {
    id: 'sub-001',
    taskId: 'tsk-001',
    taskTitle: 'Étude d\'usage du Mobile Money en Côte d\'Ivoire',
    userId: 'usr_kouame_01',
    userName: 'Kouamé Diallo',
    submittedAt: '2026-10-09 14:22',
    proofType: 'text',
    proofContent: 'Formulaire complété avec succès. Code unique de complétion : MM-CI-99482.',
    status: 'approved',
    feedback: 'Participation conforme. Récompense créditée.',
    rewardAmount: 600,
    verifiedAt: '2026-10-09 14:25',
    verifiedBy: 'Système automatique'
  },
  {
    id: 'sub-002',
    taskId: 'tsk-003',
    taskTitle: 'Découverte d\'un tutoriel sur la cybersécurité des comptes Mobile Money',
    userId: 'usr_kouame_01',
    userName: 'Kouamé Diallo',
    submittedAt: '2026-10-10 10:15',
    proofType: 'text',
    proofContent: 'Règle 1 : Ne jamais divulguer son code secret même à un agent. Règle 2 : Vérifier le nom du destinataire avant confirmation.',
    status: 'approved',
    feedback: 'Excellentes réponses.',
    rewardAmount: 400,
    verifiedAt: '2026-10-10 10:18',
    verifiedBy: 'Système automatique'
  },
  {
    id: 'sub-003',
    taskId: 'tsk-002',
    taskTitle: 'Test UX & Ergonomie d\'une application de livraison abidjanaise',
    userId: 'usr_aicha_premium',
    userName: 'Aïcha Ouattara',
    submittedAt: '2026-10-11 16:40',
    proofType: 'url',
    proofContent: 'Capture et rapport déposés sur https://drive.google.com/file/d/test-ux-livraison-ci',
    status: 'pending',
    rewardAmount: 1500
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-001',
    title: 'Marketing Digital & Acquisition Client en Côte d\'Ivoire',
    category: 'Marketing Digital',
    description: 'Programme certifiant complet et pratique : maîtrisez les canaux d\'acquisition digitaux adaptés aux réalités ivoiriennes (WhatsApp Business, Meta Ads géociblé Abidjan/Intérieur, Mobile Money direct, logistique du dernier kilomètre).',
    level: 'Débutant à Pro',
    durationHours: 22.0,
    isPremium: false,
    enrolledUserIds: ['usr_kouame_01'],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-101',
        title: 'Palier 1 : Comportements Numériques & Écosystème Mobile Ivoirien',
        durationMinutes: 50,
        content: `### 1. Cartographie de la connectivité en Côte d'Ivoire
En Côte d'Ivoire, plus de 88% de la population connectée accède à internet exclusivement via un smartphone avec des forfaits données mobiles prépayés (pass journaliers et hebdomadaires de 100 à 1 000 FCFA). Les canaux prioritaires incontournables sont WhatsApp Business, Facebook et TikTok.

### 2. Le triptyque de la confiance : Humain, Proximité et Mobile Money
Contrairement aux marchés occidentaux où l'achat se fait par carte bancaire sur des sites web automatisés, l'acheteur ivoirien exige une interaction humaine directe :
- **WhatsApp comme standard de réassurance** : 95% des conversions directes se concluent dans un fil de discussion WhatsApp après échange audio ou confirmation visuelle.
- **Les 4 opérateurs de paiement intégrés** : Wave (le plus populaire pour la gratuité des dépôts et les frais de retrait à 1%), Orange Money, MTN MoMo et Moov Money.
- **Pourquoi les sites web traditionnels échouent à 90%** : Les pages lourdes consomment les données mobiles de l'utilisateur, et l'absence de contact direct crée la méfiance face aux arnaques en ligne.

### 3. Les règles d'or de l'expérience mobile ivoirienne
1. **Légèreté absolue** : Visuels optimisés (moins de 200 Ko) pour un chargement instantané même en 3G/4G instable.
2. **Affichage immédiat des prix en FCFA** : Tout produit sans prix clair génère de la méfiance et des commentaires négatifs ("Prix svp ?").
3. **Bouton d'action direct vers WhatsApp** : Réduire le parcours à 1 clic ("Commander sur WhatsApp").`,
        keyTakeaways: [
          'Design ultra-léger adapté aux forfaits data prépayés des usagers ivoiriens.',
          'WhatsApp Business couplé au Mobile Money est le canal de conversion n°1.',
          'Transparence obligatoire des tarifs en FCFA pour instaurer une confiance durable.'
        ],
        checkpointQuiz: {
          id: 'cpq-101',
          courseId: 'crs-001',
          title: 'Quiz Palier 1 : Écosystème Numérique & Mobile CI',
          passingScore: 100,
          rewardPoints: 30,
          questions: [
            {
              id: 'q-cp1-1',
              question: 'Quel est le premier canal de conversion directe pour un commerce en ligne en Côte d\'Ivoire ?',
              options: [
                'La prospection par e-mailing B2C traditionnel',
                'WhatsApp Business couplé aux paiements Mobile Money (Wave, OM, MTN, Moov)',
                'Le courrier postal recommandé',
                'Les forums web sur ordinateur de bureau'
              ],
              correctAnswerIndex: 1,
              explanation: 'WhatsApp Business et le Mobile Money sont les standards incontournables du commerce direct en Côte d\'Ivoire.'
            },
            {
              id: 'q-cp1-2',
              question: 'Pourquoi les formulaires avec paiement obligatoire par carte bancaire internationale perdent-ils plus de 90% des clients ivoiriens ?',
              options: [
                'Parce que le taux de bancarisation classique par carte reste minoritaire face à l\'omniprésence du Mobile Money',
                'Parce que les Ivoiriens n\'aiment pas payer en ligne',
                'Parce que les cartes sont interdites le week-end',
                'Il n\'y a aucune perte de clients'
              ],
              correctAnswerIndex: 0,
              explanation: 'Le Mobile Money est le moyen de paiement universel en Côte d\'Ivoire, tandis que la carte bancaire reste restreinte à une élite bancarisée.'
            },
            {
              id: 'q-cp1-3',
              question: 'Quel comportement utilisateur est typique des internautes d\'Abidjan et de l\'intérieur ?',
              options: [
                'Télécharger de lourds catalogues PDF de 100 Mo',
                'Naviguer sur smartphone avec des pass data prépayés et exiger un contact WhatsApp direct',
                'Consulter les sites web la nuit sur grand écran d\'ordinateur',
                'Refuser de communiquer avant de payer'
              ],
              correctAnswerIndex: 1,
              explanation: 'L\'internaute ivoirien gère sa consommation data au mégaoctet près et privilégie l\'échange direct avec un interlocuteur réel.'
            }
          ]
        }
      },
      {
        id: 'mod-102',
        title: 'Palier 2 : Création de Visuels Publicitaires & Copywriting Persuasif Local',
        durationMinutes: 55,
        content: `### 1. La règle des 3 secondes en publicité mobile
Dans le fil d'actualité Facebook, TikTok ou Instagram, un utilisateur d'Abidjan scrolle à une vitesse de 2 mètres de contenu par minute. Votre annonce dispose de moins de 3 secondes pour capter son attention.

### 2. La formule d'or d'une accroche qui convertit
Une annonce performante contient impérativement 3 éléments visibles dès le premier coup d'œil :
1. **L'Accroche ou Problème résolu** : Directe, parlante, souvent teintée de touches culturelles locales ou de nouchi urbain ("Y'a pas drap", "Finie la galère de...").
2. **Le Prix net en FCFA et modalité de livraison** : Préciser le tarif et la zone de livraison couverte (Abidjan : Cocody, Yopougon, Marcory, etc.).
3. **L'Appel à l'action immédiat** : Un lien WhatsApp clair avec un message pré-rempli ("Bonjour, je souhaite commander l'article vu sur votre page").

### 3. Éthique publicitaire et règles de la plateforme GLOBAL-AF
- **Tolérance zéro pour les allégations trompeuses** : Interdiction formelle des montages mensongers, faux témoignages ou promesses de gains sans travail.
- **Transparence sur les garanties** : Rappel du droit de rétractation légal de 7 jours et de la possibilité de vérifier la conformité du produit lors de la livraison.`,
        keyTakeaways: [
          'Formule des 3 secondes : Accroche percutante + Prix en FCFA + Appel à l\'action WhatsApp.',
          'Visuels à fort contraste avec photos réelles prises sous éclairage naturel sur smartphone.',
          'Interdiction stricte des promesses mensongères conformément à la charte éthique.'
        ],
        checkpointQuiz: {
          id: 'cpq-102',
          courseId: 'crs-001',
          title: 'Quiz Palier 2 : Copywriting Local & Visuels Éthiques',
          passingScore: 100,
          rewardPoints: 30,
          questions: [
            {
              id: 'q-cp2-1',
              question: 'Selon la charte de transparence de GLOBAL-AF, quel type d\'argumentaire commercial est formellement banni ?',
              options: [
                'Les démonstrations vidéo montrant le produit réel sous différents angles',
                'Les fausses allégations de gains miraculeux sans travail et les faux avis montés de toutes pièces',
                'L\'indication claire des frais de livraison moto à Abidjan',
                'Les remises de lancement limitées dans le temps et vérifiables'
              ],
              correctAnswerIndex: 1,
              explanation: 'La charte de GLOBAL-AF interdit formellement tout argumentaire mensonger, trompeur ou assimilable à une arnaque pyramidale.'
            },
            {
              id: 'q-cp2-2',
              question: 'Pourquoi recommander l\'utilisation de photos réelles du produit plutôt que des images parfaites de banques d\'images occidentales ?',
              options: [
                'Car les banques d\'images sont interdites par la loi',
                'Parce que le client ivoirien associe les photos trop parfaites à des arnaques de livraison et veut voir le produit authentique',
                'Pour faire des économies de batterie',
                'Aucune raison, cela ne change rien'
              ],
              correctAnswerIndex: 1,
              explanation: 'L\'authenticité visuelle rassure l\'acheteur qui craint de recevoir un produit non conforme à la photo d\'origine.'
            },
            {
              id: 'q-cp2-3',
              question: 'Quelle est la fonction d\'un message WhatsApp pré-rempli sur un lien publicitaire ?',
              options: [
                'Bloquer le compte WhatsApp du prospect',
                'Réduire l\'effort du client en lui évitant d\'écrire et identifier immédiatement la provenance de l\'annonce',
                'Augmenter le prix du produit automatiquement',
                'Supprimer l\'historique des conversations'
              ],
              correctAnswerIndex: 1,
              explanation: 'Un texte pré-rempli ("Bonjour, je suis intéressé par le pack à 15 000 FCFA") accélère la prise de contact et la conversion.'
            }
          ]
        }
      },
      {
        id: 'mod-103',
        title: 'Palier 3 : Ciblage Géographique et Campagnes Meta Ads Locales (Abidjan & Régions)',
        durationMinutes: 60,
        content: `### 1. Stratégie de segmentation territoriale en Côte d'Ivoire
Le marché ivoirien n'est pas homogène. Une campagne publicitaire rentable doit être segmentée géographiquement :
- **Zone 1 : Abidjan - Pouvoir d'achat premium** : Cocody (Angré, Riviera 2, 3, 4, Palmeraie, Golf), Marcory (Zone 4, Biétry), Plateau. Cible idéale pour les services B2B, formations supérieures et produits high-ticket.
- **Zone 2 : Abidjan - Grand public et fort volume** : Yopougon, Abobo, Koumassi, Treichville, Port-Bouët. Cible privilégiée pour le prêt-à-porter, la beauté et les biens de consommation courante.
- **Zone 3 : Grandes métropoles de province** : Bouaké, Yamoussoukro, San Pédro, Korhogo, Daloa. Coûts publicitaires souvent 40% moins élevés, mais logistique à anticiper via les gares de car (UTB, CTE, etc.).

### 2. Paramétrage optimal des campagnes Click-to-WhatsApp (CTWA)
- **Objectif de campagne** : Trafic ou Engagement avec destination WhatsApp Business connectée.
- **Budget de démarrage recommandé** : 2 500 à 5 000 FCFA par jour (environ 4 à 8 €/jour) pour tester un angle avant de monter à l'échelle.
- **Calcul du ROAS (Retour sur Dépenses Publicitaires)** : Si 5 000 FCFA dépensés génèrent 15 messages WhatsApp, 5 commandes fermes et 25 000 FCFA de marge nette, votre ROAS net est de 5x.`,
        keyTakeaways: [
          'Segmenter rigoureusement Abidjan par communes pour adapter la tarification et la livraison.',
          'Tester systématiquement 2 à 3 variantes d\'annonces avec un budget initial de 3 000 FCFA/jour.',
          'Suivre le coût par message WhatsApp qualifié pour piloter sa rentabilité en FCFA.'
        ],
        checkpointQuiz: {
          id: 'cpq-103',
          courseId: 'crs-001',
          title: 'Quiz Palier 3 : Ciblage Géographique & Rentabilité Meta Ads',
          passingScore: 100,
          rewardPoints: 40,
          questions: [
            {
              id: 'q-cp3-1',
              question: 'Pourquoi est-il crucial de segmenter ses publicités entre Abidjan et l\'intérieur du pays ?',
              options: [
                'Parce que les coûts logistiques, les délais d\'acheminement et les habitudes d\'achat diffèrent grandement',
                'Pour payer la TVA deux fois',
                'Car Facebook interdit de diffuser sur tout le pays simultanément',
                'Il n\'y a aucune différence'
              ],
              correctAnswerIndex: 0,
              explanation: 'La livraison à Abidjan (24h par livreur moto) diffère de l\'intérieur (48h par car ou relais), ce qui influe sur la marge et les délais.'
            },
            {
              id: 'q-cp3-2',
              question: 'Si vous dépensez 5 000 FCFA de publicité et obtenez 20 messages WhatsApp dont 4 aboutissent à une vente nette de 10 000 FCFA chacune (40 000 FCFA), quel est votre retour brut ?',
              options: [
                '2 fois la mise',
                '8 fois le budget publicitaire investi (ROAS de 8)',
                'Zéro, vous avez perdu de l\'argent',
                '15 fois'
              ],
              correctAnswerIndex: 1,
              explanation: '40 000 FCFA de chiffre généré pour 5 000 FCFA dépensés correspond à un ratio de retour publicitaire exceptionnel de 8 pour 1.'
            },
            {
              id: 'q-cp3-3',
              question: 'Quel est le premier indicateur d\'alerte signalant qu\'une campagne publicitaire s\'épuise sur Abidjan ?',
              options: [
                'Le téléphone surchauffe',
                'La répétition (fréquence) dépasse 3,5 et le coût par message WhatsApp commence à doubler',
                'Facebook change de logo',
                'Les clients appellent la police'
              ],
              correctAnswerIndex: 1,
              explanation: 'Lorsque la fréquence augmente au-delà de 3, la même audience a vu l\'annonce trop souvent, ce qui fatigue l\'audience et renchérit le coût par lead.'
            }
          ]
        }
      },
      {
        id: 'mod-104',
        title: 'Palier 4 : Logistique du Dernier Kilomètre, Gestion des Livraisons & Clôture WhatsApp',
        durationMinutes: 55,
        content: `### 1. Résoudre le dilemme du Cash-on-Delivery (Paiement à la livraison)
À Abidjan, le refus de colis lors de la livraison atteint souvent 30 à 40% chez les commerçants mal organisés. Comment diviser ce taux par 4 :
- **L'appel de confirmation obligatoire** : 1 heure avant l'envoi du livreur à moto, un appel courtois confirme l'adresse exacte, le point de repère (ex: "Carrefour Duncan, pharmacie...") et la disponibilité de la monnaie.
- **La sécurisation par acompte symbolique** : Demander un acompte Mobile Money de 1 000 ou 2 000 FCFA pour couvrir la course élimine les faux acheteurs et garantit la vente à 98%.

### 2. Gestion professionnelle des partenaires coursiers
- Structurer un réseau de 2 à 3 livreurs indépendants à moto de confiance ou recourir à des sociétés de livraison locales formalisées.
- Exiger un encaissement direct sur compte marchand Wave pour éviter le risque de vol ou de litige d'espèces.

### 3. Service après-vente et fidélisation
Un client bien traité à Abidjan recommande immédiatement le service à sa famille et à ses collègues de bureau. Mettre en place un message de suivi 48h après la réception : "Bonjour, avez-vous bien reçu votre commande ? Tout est conforme ?".`,
        keyTakeaways: [
          'Un appel téléphonique systématique 1h avant la livraison réduit les refus de 70%.',
          'Encaissement Mobile Money marchand direct pour éliminer les risques d\'impayés d\'espèces.',
          'Suivi après-vente 48h pour générer du réachat et des avis authentiques.'
        ],
        checkpointQuiz: {
          id: 'cpq-104',
          courseId: 'crs-001',
          title: 'Quiz Palier 4 : Logistique & Clôture Commerciale',
          passingScore: 100,
          rewardPoints: 40,
          questions: [
            {
              id: 'q-cp4-1',
              question: 'Quelle méthode opérationnelle divise par 3 le taux de refus de colis à Abidjan ?',
              options: [
                'Envoyer le coursier sans prévenir à l\'improviste',
                'Un appel téléphonique de confirmation avec point de repère précis 1 heure avant le départ du coursier',
                'Augmenter le prix de livraison lors de l\'arrivée',
                'Refuser de décrocher le téléphone'
              ],
              correctAnswerIndex: 1,
              explanation: 'L\'appel de confirmation valide que le client est sur place, joignable et qu\'il a préparé le règlement.'
            },
            {
              id: 'q-cp4-2',
              question: 'Comment sécuriser les encaissements effectués par les livreurs à moto ?',
              options: [
                'Laisser le livreur garder l\'argent liquide plusieurs semaines sans contrôle',
                'Demander au client de payer directement sur le compte marchand Mobile Money officiel (Wave/OM/MTN) lors de la remise du colis',
                'Exiger un paiement en devises étrangères uniquement',
                'Livrer gratuitement sans rien encaisser'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le règlement direct sur le compte marchand Mobile Money offre une traçabilité instantanée sans manipulation d\'espèces.'
            },
            {
              id: 'q-cp4-3',
              question: 'Pourquoi le suivi après-vente 48h sur WhatsApp est-il si puissant dans le commerce ivoirien ?',
              options: [
                'Pour demander un pourboire obligatoire',
                'Parce qu\'il rassure le client, active le bouche-à-oreille familial et génère des commandes récurrentes sans coût publicitaire supplémentaire',
                'Pour envoyer des publicités non sollicitées toutes les nuits',
                'C\'est une obligation de la météo'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le service attentionné transforme un simple acheteur en ambassadeur fidèle qui partage l\'offre dans ses groupes WhatsApp.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-101',
      courseId: 'crs-001',
      title: 'Grand Examen Certifiant Officiel : Marketing Digital & Acquisition Client CI (40 Questions Chronométrées)',
      passingScore: 80,
      rewardPoints: 200,
      questions: generate40ExamQuestions('crs-001', 'Marketing Digital & Acquisition Client en Côte d\'Ivoire')
    }
  },
  {
    id: 'crs-002',
    title: 'Maîtrise Professionnelle de l\'IA Générative Commerciale',
    category: 'Intelligence Artificielle',
    description: 'Formation Premium avancée : devenez expert dans l\'utilisation des modèles d\'IA (Google Gemini, ChatGPT) pour automatiser la rédaction de propositions commerciales, le support client 24/7 et l\'analyse de marché en Afrique de l\'Ouest.',
    level: 'Intermédiaire à Expert',
    durationHours: 24.0,
    isPremium: true,
    priceXOF: 15000,
    enrolledUserIds: ['usr_aicha_premium'],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-201',
        title: 'Palier 1 : Ingénierie de Prompts & Structuration Avancée R-C-T-F-C',
        durationMinutes: 50,
        content: `### 1. Les fondations de l'ingénierie de prompt en contexte professionnel
Pour obtenir des résultats d'élite avec un modèle d'intelligence artificielle comme Google Gemini, poser une simple question donne un résultat générique et fade. Les professionnels utilisent le framework R-C-T-F-C :
- **Rôle (R)** : Définir l'expertise exacte du modèle (ex: "Tu es un directeur marketing senior expert du marché d'Abidjan").
- **Contexte (C)** : La situation réelle (ex: "Une PME de Treichville lance une gamme de cosmétiques naturels à 7 500 FCFA").
- **Tâche (T)** : L'action précise demandée (ex: "Rédige 3 variantes d'annonces WhatsApp et un script d'accueil client").
- **Format (F)** : La forme exacte souhaitée (tableaux comparatifs, puces avec emojis, textes de moins de 150 mots).
- **Contraintes (C)** : Les limites incontournables (tarifs en FCFA, ton chaleureux et professionnel, aucune promesse médicale non prouvée).

### 2. Le Few-Shot Prompting avec exemples locaux
Montrer à l'IA 2 exemples réussis d'annonces ou de messages WhatsApp permet de calibrer instantanément le niveau de langage (nouchi subtil, politesse ivoirienne, courtoisie commerciale).`,
        keyTakeaways: [
          'Le framework R-C-T-F-C garantit des réponses professionnelles prêtes à l\'emploi sans retouche.',
          'Injecter des contraintes claires sur les devises (FCFA) et le contexte local.',
          'Toujours relire et vérifier les sorties avant toute diffusion commerciale.'
        ],
        checkpointQuiz: {
          id: 'cpq-201',
          courseId: 'crs-002',
          title: 'Quiz Palier 1 : Ingénierie de Prompt Professionnelle',
          passingScore: 100,
          rewardPoints: 50,
          questions: [
            {
              id: 'q-cp201-1',
              question: 'Dans le framework R-C-T-F-C, que permet de garantir l\'étape Contraintes (C) ?',
              options: [
                'Ralentir délibérément la réponse du modèle',
                'Imposer le respect strict des devises locales (FCFA), du ton culturel et des règles éthiques',
                'Supprimer l\'accès aux fonctionnalités réseau',
                'Remplacer le cerveau humain sans vérification'
              ],
              correctAnswerIndex: 1,
              explanation: 'Les contraintes précisent les limites impératives : devises, terminologie et conformité métier.'
            },
            {
              id: 'q-cp201-2',
              question: 'Qu\'est-ce que la technique du "Few-Shot Prompting" ?',
              options: [
                'Donner 1 à 3 exemples concrets du résultat attendu dans le prompt pour guider le style du modèle',
                'Appuyer 3 fois sur la touche Entrée',
                'Faire payer le modèle à chaque mot',
                'Répondre en moins d\'une seconde'
              ],
              correctAnswerIndex: 0,
              explanation: 'Fournir des exemples permet à l\'IA de reproduire exactement la cadence, la structure et le ton souhaités.'
            },
            {
              id: 'q-cp201-3',
              question: 'Quelle donnée confidentielle ne doit JAMAIS être insérée dans une requête IA ?',
              options: [
                'La description publique d\'un produit cosmétique',
                'Un mot de passe, code secret Mobile Money ou identifiant bancaire personnel',
                'Le nom d\'une commune d\'Abidjan',
                'Les horaires d\'ouverture d\'une boutique'
              ],
              correctAnswerIndex: 1,
              explanation: 'La cybersécurité exige de ne jamais transmettre d\'identifiants ou de codes secrets à un outil tiers.'
            }
          ]
        }
      },
      {
        id: 'mod-202',
        title: 'Palier 2 : Automatisation du Support Commercial & Gestion des Objections',
        durationMinutes: 55,
        content: `### 1. Construire une matrice de réponses intelligentes aux objections
Les prospects d'Abidjan formulent généralement 4 objections récurrentes :
1. *"Est-ce que c'est un produit original ou une contrefaçon ?"*
2. *"Est-ce que je peux payer après avoir ouvert le colis ?"*
3. *"Quels sont vos frais de livraison pour Yopougon ou Cocody ?"*
4. *"Si le produit a un problème, vous me remboursez comment ?"*

### 2. Formuler des réponses personnalisées et réassurantes avec l'IA
Utilisez l'IA pour générer des scripts de réponses fluides intégrant le droit de rétractation de 7 jours, les moyens de paiement vérifiés (Wave, Orange Money) et les détails logistiques précis.`,
        keyTakeaways: [
          'Répondre aux doutes d\'achat avec bienveillance et transparence.',
          'Conserver une touche humaine chaleureuse et professionnelle.',
          'Réduire le temps de première réponse de plusieurs heures à moins d\'une minute.'
        ],
        checkpointQuiz: {
          id: 'cpq-202',
          courseId: 'crs-002',
          title: 'Quiz Palier 2 : Support Client Intelligent & Sécurisé',
          passingScore: 100,
          rewardPoints: 50,
          questions: [
            {
              id: 'q-cp202-1',
              question: 'Quelle est la meilleure réponse face à un client qui hésite par peur de se faire escroquer ?',
              options: [
                'Lui dire qu\'il n\'a pas confiance et bloquer son numéro',
                'Rappeler courtoisement la possibilité de vérifier le colis à la livraison et la garantie de rétractation de 7 jours',
                'Lui exiger un virement bancaire sous 10 minutes',
                'Ignorer sa question'
              ],
              correctAnswerIndex: 1,
              explanation: 'La transparence sur les garanties et la politique de retour apaise les craintes légitimes des acheteurs.'
            },
            {
              id: 'q-cp202-2',
              question: 'Comment l\'IA améliore-t-elle le taux de conversion sur WhatsApp Business ?',
              options: [
                'En envoyant des spams toutes les 5 minutes',
                'En fournissant des modèles de réponses rapides et précis aux questions techniques des prospects',
                'En inventant de faux prix',
                'En supprimant les avis négatifs'
              ],
              correctAnswerIndex: 1,
              explanation: 'Des réponses rapides et bien formulées évitent que le client ne parte acheter chez un concurrent plus réactif.'
            },
            {
              id: 'q-cp202-3',
              question: 'Que prescrit la charte éthique de GLOBAL-AF sur l\'automatisation ?',
              options: [
                'Transparence totale, interdiction du spam et respect absolu de la vie privée',
                'Spammer des milliers de numéros sans leur consentement',
                'Vendre les données des prospects',
                'Aucune règle'
              ],
              correctAnswerIndex: 0,
              explanation: 'L\'automatisation doit toujours servir la qualité et respecter scrupuleusement la réglementation locale.'
            }
          ]
        }
      },
      {
        id: 'mod-203',
        title: 'Palier 3 : Création de Contenu Stratégique & Analyse de Marché Locale',
        durationMinutes: 60,
        content: `### 1. Veille concurrentielle et analyse d'opportunités à Abidjan
Comment exploiter les capacités analytiques des modèles avancés pour :
- Synthétiser les tendances de consommation émergentes en Côte d'Ivoire (alimentation bio, services à domicile, formation professionnelle).
- Établir une grille tarifaire compétitive en tenant compte des marges brutes et du pouvoir d'achat par commune.
- Structurer un calendrier éditorial mensuel pour réseaux sociaux avec thématiques hebdomadaires.`,
        keyTakeaways: [
          'Analyse rapide des tendances du marché ouest-africain.',
          'Génération de calendriers éditoriaux complets et diversifiés.',
          'Validation humaine indispensable de tous les chiffres avancés.'
        ],
        checkpointQuiz: {
          id: 'cpq-203',
          courseId: 'crs-002',
          title: 'Quiz Palier 3 : Veille Stratégique & Décision',
          passingScore: 100,
          rewardPoints: 50,
          questions: [
            {
              id: 'q-cp203-1',
              question: 'Quelle est la bonne posture professionnelle face aux données chiffrées produites par une IA ?',
              options: [
                'Les publier immédiatement sans vérification',
                'Les vérifier systématiquement auprès de sources officielles ou de terrain avant toute décision',
                'Refuser d\'utiliser les outils modernes',
                'Considérer que l\'IA a toujours raison'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le professionnel qualifié vérifie toujours les données critiques avant de les engager dans une décision commerciale.'
            },
            {
              id: 'q-cp203-2',
              question: 'Comment structurer un calendrier éditorial pour une page Facebook commerciale en Côte d\'Ivoire ?',
              options: [
                'Poster uniquement des promotions directes 10 fois par jour',
                'Alterner entre contenu éducatif/conseil (40%), avis clients/coulisses (30%) et offres commerciales directes (30%)',
                'Ne publier qu\'une fois par mois',
                'Partager des vidéos sans rapport avec le produit'
              ],
              correctAnswerIndex: 1,
              explanation: 'La règle des 80/20 ou l\'alternance valeur/vente évite la lassitude des abonnés et construit une audience fidèle.'
            },
            {
              id: 'q-cp203-3',
              question: 'Quel est le rôle de l\'humain dans un processus créatif assisté par IA ?',
              options: [
                'L\'humain n\'est plus nécessaire',
                'L\'humain pilote la vision stratégique, injecte l\'empathie culturelle et valide la vérité des faits',
                'L\'humain ne fait que copier-coller sans lire',
                'L\'IA remplace la signature juridique'
              ],
              correctAnswerIndex: 1,
              explanation: 'L\'IA est un multiplicateur de force, mais le discernement stratégique et l\'éthique restent exclusivement humains.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-201',
      courseId: 'crs-002',
      title: 'Grand Examen Certifiant : Spécialiste IA Générative & Productivité Commerciale (40 Questions Chronométrées)',
      passingScore: 80,
      rewardPoints: 200,
      questions: generate40ExamQuestions('crs-002', 'Maîtrise Professionnelle de l\'IA Générative Commerciale')
    }
  },
  {
    id: 'crs-003',
    title: 'Lancer une Activité E-Commerce & Logistique Abidjan-Intérieur',
    category: 'E-Commerce',
    description: 'Programme certifiant d\'exécution : approvisionnement local (Adjamé, Treichville, San Pédro), partenariats transporteurs fiables et sécurisation des paiements Mobile Money.',
    level: 'Intermédiaire à Avancé',
    durationHours: 20.0,
    isPremium: false,
    enrolledUserIds: [],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-301',
        title: 'Palier 1 : Sourcing Produits & Négociation Fournisseurs en Côte d\'Ivoire',
        durationMinutes: 50,
        content: `### 1. Identifier des partenaires d'approvisionnement fiables
Cartographie des grands pôles commerciaux d'Abidjan :
- **Marché Gouro et Black Market d'Adjamé** : Pôle majeur pour les accessoires, le textile et les produits du quotidien à tarif grossiste.
- **Treichville (Avenue 8, Boulevard du Port)** : Spécialistes de l'importation directe, quincaillerie et équipements.
- **Grossistes du Port Autonome d'Abidjan** : Pour les commandes en carton ou en conteneur partagé.

### 2. Calculer sa marge réelle unitaire
Formule d'or : \`Marge nette = Prix de vente - (Prix d'achat + Coût d'emballage + Coût d'acquisition publicitaire + Coût de livraison moyen + Provision pour retours)\`.`,
        keyTakeaways: [
          'Sécuriser au moins 2 fournisseurs pour chaque produit clé.',
          'Intégrer le taux de retour colis dans le calcul de la marge de rentabilité.',
          'Tester physiquement un échantillon avant tout achat en volume.'
        ],
        checkpointQuiz: {
          id: 'cpq-301',
          courseId: 'crs-003',
          title: 'Quiz Palier 1 : Sourcing & Marge Réelle',
          passingScore: 100,
          rewardPoints: 30,
          questions: [
            {
              id: 'q-cp301-1',
              question: 'Dans le calcul de rentabilité d\'un produit e-commerce en Côte d\'Ivoire, quel poste est trop souvent sous-estimé ?',
              options: [
                'Le coût de la connexion Wi-Fi',
                'Le coût des livraisons non abouties (taux de refus de colis)',
                'Le prix de la batterie du téléphone',
                'Le nom du magasin'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le taux de refus à la livraison impacte lourdement la marge si le client n\'a pas été pré-qualifié par téléphone.'
            },
            {
              id: 'q-cp301-2',
              question: 'Pourquoi est-il risqué de dépendre d\'un seul et unique fournisseur à Adjamé ou Treichville ?',
              options: [
                'C\'est illégal',
                'En cas de rupture de stock ou de hausse soudaine de prix, votre commerce est immédiatement paralysé',
                'Pour payer deux fois plus cher',
                'Aucun risque'
              ],
              correctAnswerIndex: 1,
              explanation: 'Disposer d\'un fournisseur de secours garantit la continuité de vos ventes même en cas de pénurie.'
            },
            {
              id: 'q-cp301-3',
              question: 'Quel est le premier réflexe avant de commander 50 unités d\'un nouveau produit ?',
              options: [
                'Acheter immédiatement sans vérifier',
                'Acheter un échantillon test, tester sa résistance et vérifier sa conformité réelle',
                'Lancer une campagne de 100 000 FCFA',
                'Demander un prêt bancaire'
              ],
              correctAnswerIndex: 1,
              explanation: 'L\'inspection physique d\'un échantillon évite d\'immobiliser du capital dans des stocks défectueux.'
            }
          ]
        }
      },
      {
        id: 'mod-302',
        title: 'Palier 2 : Organisation Logistique & Réseau de Livraison Sécurisé',
        durationMinutes: 55,
        content: `### 1. Structurer sa logistique à Abidjan
Contractualiser avec des livreurs à moto professionnels :
- Fixer des forfaits clairs par zone (ex: 1 500 FCFA pour Cocody-Plateau-Marcory, 2 000 FCFA pour Yopougon-Abobo-Bingerville).
- Mettre en place un protocole d'encaissement via compte marchand Mobile Money pour limiter les manipulations d'espèces.

### 2. Expéditions sécurisées vers les villes de l'intérieur
Utiliser les comptoirs d'expédition des compagnies de car réputées (UTB, CTE, SBTA) avec émission d'un bordereau numéroté et retrait sur présentation d'une pièce d'identité officielle.`,
        keyTakeaways: [
          'Appel de confirmation obligatoire 1h avant le départ du coursier.',
          'Encaissement Mobile Money marchand direct pour une traçabilité sans faille.',
          'Expédition intérieure via compagnies de transport agréées avec code de retrait sécurisé.'
        ],
        checkpointQuiz: {
          id: 'cpq-302',
          courseId: 'crs-003',
          title: 'Quiz Palier 2 : Logistique du Dernier Kilomètre',
          passingScore: 100,
          rewardPoints: 35,
          questions: [
            {
              id: 'q-cp302-1',
              question: 'Quel réflexe opérationnel réduit de 70% les refus de colis à Abidjan ?',
              options: [
                'Envoyer le colis sans prévenir',
                'Un appel téléphonique court de confirmation d\'adresse et d\'horaire 1 heure avant la course',
                'Augmenter le prix sans explication',
                'Changer l\'adresse du destinataire'
              ],
              correctAnswerIndex: 1,
              explanation: 'La confirmation téléphonique préalable garantit la présence physique et la disponibilité des fonds chez le client.'
            },
            {
              id: 'q-cp302-2',
              question: 'Comment organiser l\'expédition vers l\'intérieur de la Côte d\'Ivoire (Bouaké, Korhogo, etc.) ?',
              options: [
                'Partenariat avec les comptoirs colis officiels des compagnies de car avec bordereau et retrait sous présentation de pièce d\'identité',
                'Laisser le colis au bord de la route',
                'Attendre que le client vienne à pied à Abidjan',
                'Envoyer par pigeon voyageur'
              ],
              correctAnswerIndex: 0,
              explanation: 'Les compagnies de transport disposent de comptoirs colis officiels fiables et très économiques.'
            },
            {
              id: 'q-cp302-3',
              question: 'Quel est l\'avantage d\'un compte marchand Wave ou Orange Money par rapport aux transferts personnels ?',
              options: [
                'Plafonds de transaction plus élevés, séparation stricte de la trésorerie et reçu automatique pour le client',
                'Aucun avantage',
                'Les retraits sont bloqués',
                'Le compte est anonyme'
              ],
              correctAnswerIndex: 0,
              explanation: 'Le compte marchand professionnalise l\'activité et évite de mélanger l\'argent du commerce avec l\'argent personnel.'
            }
          ]
        }
      },
      {
        id: 'mod-303',
        title: 'Palier 3 : Fidélisation Clientèle & Service Après-Vente Éthique',
        durationMinutes: 50,
        content: `### 1. Transformer un premier acheteur en client fidèle
Le coût d'acquisition d'un nouveau client sur Meta Ads augmente chaque année. La vraie rentabilité réside dans le réachat :
- Message de satisfaction 48h après la livraison.
- Offre exclusive réservée aux anciens clients sur les nouveaux arrivages via WhatsApp Status et listes de diffusion consenties.

### 2. Gestion éthique des retours et conformité
Appliquer la politique de rétractation de 7 jours de GLOBAL-AF : un client qui sait qu'il peut échanger sans conflit achète avec le double de confiance.`,
        keyTakeaways: [
          'La rentabilité à long terme repose sur le réachat des clients satisfaits.',
          'Le droit de rétractation de 7 jours est un puissant argument de vente.',
          'Conserver une relation personnalisée et humaine sur WhatsApp.'
        ],
        checkpointQuiz: {
          id: 'cpq-303',
          courseId: 'crs-003',
          title: 'Quiz Palier 3 : SAV & Fidélisation Durable',
          passingScore: 100,
          rewardPoints: 40,
          questions: [
            {
              id: 'q-cp303-1',
              question: 'Quelle est la durée de rétractation et remboursement garantie sur GLOBAL-AF pour protéger les acheteurs ?',
              options: [
                '0 jour (aucun remboursement possible)',
                '7 jours sans condition arbitraire sur les achats éligibles',
                '365 jours',
                'Uniquement si le client paie une pénalité'
              ],
              correctAnswerIndex: 1,
              explanation: 'La garantie de rétractation de 7 jours est l\'un des piliers cardinaux de la charte éthique de GLOBAL-AF.'
            },
            {
              id: 'q-cp303-2',
              question: 'Pourquoi envoyer un message WhatsApp de suivi 48h après la livraison ?',
              options: [
                'Pour s\'assurer de la satisfaction du client, désamorcer d\'éventuels doutes et favoriser le réachat',
                'Pour demander de supprimer le produit',
                'Pour bloquer le client',
                'C\'est inutile'
              ],
              correctAnswerIndex: 0,
              explanation: 'Un SAV attentif prouve le sérieux de l\'entreprise et fidélise le client pour ses prochains achats.'
            },
            {
              id: 'q-cp303-3',
              question: 'Quelle est la règle d\'or lors de l\'utilisation de listes de diffusion WhatsApp ?',
              options: [
                'Ajouter des numéros inconnus sans leur accord',
                'N\'envoyer des messages qu\'aux clients ayant enregistré votre numéro et donné leur accord préalable',
                'Envoyer 20 messages par jour',
                'Écrire à 3 heures du matin'
              ],
              correctAnswerIndex: 1,
              explanation: 'WhatsApp ne délivre les messages de diffusion qu\'aux contacts ayant enregistré votre numéro, ce qui protège contre le signalement pour spam.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-301',
      courseId: 'crs-003',
      title: 'Grand Examen Certifiant : Gestionnaire E-Commerce & Logistique CI (40 Questions Chronométrées)',
      passingScore: 80,
      rewardPoints: 200,
      questions: generate40ExamQuestions('crs-003', 'Lancer une Activité E-Commerce & Logistique Abidjan-Intérieur')
    }
  },
  {
    id: 'crs-004',
    title: 'Prospection B2B & Négociation Grands Comptes en Côte d\'Ivoire',
    category: 'Entrepreneuriat',
    description: 'Formation Premium certifiante : maîtrisez les techniques de prospection auprès des PME, multinationales et institutions basées au Plateau et en Zone Industrielle d\'Abidjan.',
    level: 'Avancé & Direction Commerciale',
    durationHours: 26.0,
    isPremium: true,
    priceXOF: 25000,
    enrolledUserIds: [],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-401',
        title: 'Palier 1 : Cartographie des Décideurs & Réseautage au Plateau et Zone 4',
        durationMinutes: 55,
        content: `### 1. Identifier le circuit décisionnel dans les entreprises ivoiriennes
Dans le secteur B2B à Abidjan, les cycles de vente nécessitent d'identifier précisément les acteurs :
- **L'Utilisateur final** : Celui qui exprime le besoin (responsable marketing, chef d'atelier, chef de projet).
- **Le Validateur technique** : Le DSI ou responsable logistique qui s'assure de la compatibilité.
- **Le Signataire budgétaire** : Le Directeur Général, Gérant ou DAF, seul habilité à engager la trésorerie.

### 2. Canaux d'approche directe
Techniques de prise de contact via LinkedIn, annuaires professionnels qualifiés (fichiers VCF), clubs d'affaires (CGECI, Eurocham, Chambres consulaires) et salons d'exposition d'Abidjan.`,
        keyTakeaways: [
          'Distinguer clairement prescripteur, utilisateur et signataire officiel.',
          'Soigner son pitch d\'introduction en 60 secondes chrono.',
          'Préparer un dossier de présentation avec références locales vérifiées.'
        ],
        checkpointQuiz: {
          id: 'cpq-401',
          courseId: 'crs-004',
          title: 'Quiz Palier 1 : Cartographie Décisionnelle B2B',
          passingScore: 100,
          rewardPoints: 50,
          questions: [
            {
              id: 'q-cp401-1',
              question: 'Dans une négociation B2B à Abidjan, qui a le pouvoir légal et final d\'autoriser la dépense ?',
              options: [
                'Le stagiaire',
                'Le signataire autorisé (DG, Gérant ou Directeur Financier habilité)',
                'Le réceptionniste',
                'Le coursier de l\'entreprise'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le signataire officiel détient le pouvoir budgétaire légal d\'engager la société.'
            },
            {
              id: 'q-cp401-2',
              question: 'Pourquoi est-il crucial de soigner son réseau professionnel et sa réputation à Abidjan ?',
              options: [
                'Car le marché B2B ivoirien fonctionne par cooptation, recommandation et confiance interpersonnelle',
                'C\'est obligatoire pour avoir un passeport',
                'Pour obtenir des cadeaux',
                'Il n\'y a aucune importance'
              ],
              correctAnswerIndex: 0,
              explanation: 'La recommandation et le bouche-à-oreille entre dirigeants représentent la voie d\'entrée la plus rapide auprès des grands comptes.'
            },
            {
              id: 'q-cp401-3',
              question: 'Quelle est la première erreur à éviter lors d\'un premier contact avec un dirigeant ?',
              options: [
                'Envoyer immédiatement un document de 80 pages sans avoir cerné son besoin réel',
                'Poser des questions sur ses défis opérationnels',
                'Être à l\'heure au rendez-vous',
                'Avoir une carte de visite professionnelle'
              ],
              correctAnswerIndex: 0,
              explanation: 'Un dirigeant attend un diagnostic ciblé et synthétique, et non un argumentaire fleuve générique.'
            }
          ]
        }
      },
      {
        id: 'mod-402',
        title: 'Palier 2 : Construction de Devis Professionnels & Sécurisation Contractuelle',
        durationMinutes: 60,
        content: `### 1. Mentions légales et conformité fiscale en Côte d'Ivoire
Tout devis professionnel B2B doit comporter :
- Identité légale complète : Raison sociale, RCCM, Compte Contribuable, siège social à Abidjan.
- Détail des prestations chiffrées en Francs CFA (XOF), avec mention explicite Hors Taxes (HT) et Taxes Comprises (TTC) selon le régime fiscal (TVA, AIRSI).

### 2. Sécurisation financière du contrat
- **Règle de l'acompte** : Toujours exiger 30% à 50% d'acompte à la signature du Bon de Commande avant de commencer tout travail.
- **Le Bon de Commande (Purchase Order - PO)** : Signé et tamponné avec mention "Bon pour Accord".`,
        keyTakeaways: [
          'Ne jamais débuter une prestation sans Bon de Commande officiel signé et tamponné.',
          'Structurer un acompte d\'au moins 40% pour couvrir les frais de production.',
          'Préciser les délais de livraison et les modalités d\'approbation écrite.'
        ],
        checkpointQuiz: {
          id: 'cpq-402',
          courseId: 'crs-004',
          title: 'Quiz Palier 2 : Devis & Sécurisation Contractuelle',
          passingScore: 100,
          rewardPoints: 50,
          questions: [
            {
              id: 'q-cp402-1',
              question: 'Quelle formalité garantit la validité juridique d\'une commande commerciale B2B ?',
              options: [
                'Un simple accord verbal informel',
                'Un Bon de Commande officiel signé et revêtu du cachet de l\'entreprise cliente avec les conditions générales',
                'Un SMS non signé',
                'Une promesse sur les réseaux sociaux'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le Bon de Commande tamponné et signé constitue l\'engagement juridique officiel de paiement.'
            },
            {
              id: 'q-cp402-2',
              question: 'Pourquoi l\'acompte au démarrage est-il indispensable pour un prestataire de services ?',
              options: [
                'Pour financer les dépenses engagées et sceller l\'engagement financier du client',
                'Pour partir en vacances immédiatement',
                'C\'est illégal',
                'Pour doubler le tarif'
              ],
              correctAnswerIndex: 0,
              explanation: 'L\'acompte protège la trésorerie et valide le sérieux de la relation d\'affaires.'
            },
            {
              id: 'q-cp402-3',
              question: 'Quelle mention fiscale est obligatoire sur une facture formelle en Côte d\'Ivoire ?',
              options: [
                'Le signe du zodiaque',
                'Le numéro de Compte Contribuable et le registre de commerce (RCCM)',
                'Le prénom des enfants',
                'Le modèle du smartphone'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le Compte Contribuable et le RCCM sont les identifiants fiscaux légaux de toute entreprise en Côte d\'Ivoire.'
            }
          ]
        }
      },
      {
        id: 'mod-403',
        title: 'Palier 3 : Recouvrement Amiable & Relations d\'Affaires Long Terme',
        durationMinutes: 55,
        content: `### 1. Gérer les délais de paiement des entreprises
À Abidjan, les délais de règlement des grandes entreprises s'étirent fréquemment entre 30 et 90 jours fin de mois.
- **Relance préventive** : Contacter le service comptabilité 5 jours avant l'échéance pour vérifier que la facture a bien été validée et intégrée dans le plan de décaissement.
- **Courtoisie et fermeté** : Les retards sont souvent d'ordre administratif plutôt que financier. Maintenir un contact direct et chaleureux avec le comptable chargé du dossier.

### 2. Le contrat de récurrence (Retainer)
Comment transformer une mission ponctuelle en contrat de maintenance ou de suivi mensuel (ex: 250 000 FCFA/mois) assurant une trésorerie prévisible toute l'année.`,
        keyTakeaways: [
          'La relance préventive 5 jours avant l\'échéance évite 80% des retards de paiement.',
          'Conserver un historique écrit et poli de tous les échanges financiers.',
          'Proposer des abonnements mensuels pour stabiliser sa trésorerie.'
        ],
        checkpointQuiz: {
          id: 'cpq-403',
          courseId: 'crs-004',
          title: 'Quiz Palier 3 : Recouvrement & Partenariats Durables',
          passingScore: 100,
          rewardPoints: 50,
          questions: [
            {
              id: 'q-cp403-1',
              question: 'Quel est le meilleur moment pour effectuer la première relance d\'une facture B2B ?',
              options: [
                '3 mois après l\'impayé',
                '3 à 5 jours avant la date d\'échéance pour s\'assurer du bon enregistrement par le service comptabilité',
                'Jamais, par peur de froisser le client',
                'Le jour du Nouvel An uniquement'
              ],
              correctAnswerIndex: 1,
              explanation: 'La relance préventive permet de détecter les éventuels blocages de transmission avant le retard effectif.'
            },
            {
              id: 'q-cp403-2',
              question: 'Comment transformer une mission ponctuelle en revenu récurrent prévisible ?',
              options: [
                'En proposant un contrat d\'accompagnement mensuel (retainer) avec des prestations régulières',
                'En surfacturant la première prestation',
                'En refusant de rappeler le client',
                'En lui vendant un produit dont il n\'a pas besoin'
              ],
              correctAnswerIndex: 0,
              explanation: 'Le contrat d\'accompagnement fidélise le grand compte et sécurise une trésorerie mensuelle stable.'
            },
            {
              id: 'q-cp403-3',
              question: 'Quelle est la clé pour maintenir une collaboration B2B de plus de 5 ans avec une entreprise ivoirienne ?',
              options: [
                'Respecter rigoureusement ses engagements de qualité, être réactif et faire preuve d\'intégrité',
                'Baisser la qualité au fil des mois',
                'Arriver en retard aux réunions',
                'Changer les tarifs chaque semaine'
              ],
              correctAnswerIndex: 0,
              explanation: 'L\'intégrité et la fiabilité opérationnelle font la différence sur le marché des affaires à Abidjan.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-401',
      courseId: 'crs-004',
      title: 'Grand Examen Certifiant : Spécialiste Négociation B2B & Grands Comptes CI (40 Questions Chronométrées)',
      passingScore: 80,
      rewardPoints: 250,
      questions: generate40ExamQuestions('crs-004', 'Prospection B2B & Négociation Grands Comptes en Côte d\'Ivoire')
    }
  }
];

export const INITIAL_VCF_RESOURCES: VCFResource[] = [
  {
    id: 'vcf-001',
    title: 'Annuaire B2B Agrobusiness & Coopératives Agricoles (Abidjan - Yamoussoukro)',
    country: 'CI',
    sector: 'Agrobusiness',
    description: 'Base vérifiée de 250 contacts professionnels, acheteurs de vivriers, transformateurs de manioc et conditionneurs agréés.',
    entriesCount: 250,
    verifiedDate: '01 Octobre 2026',
    requiredPlan: 'free',
    fileFormat: 'VCF & CSV'
  },
  {
    id: 'vcf-002',
    title: 'Répertoire des Entreprises BTP & Fournisseurs de Matériaux (Côte d\'Ivoire)',
    country: 'CI',
    sector: 'BTP & Construction',
    description: 'Contacts de 180 quincailleries de gros, dépôts de ciment et bureaux d\'études techniques pour prospection ciblée.',
    entriesCount: 180,
    verifiedDate: '15 Septembre 2026',
    requiredPlan: 'premium',
    fileFormat: 'VCF & Excel'
  },
  {
    id: 'vcf-003',
    title: 'Annuaire des Boutiques de Mode & Cosmétique d\'Abidjan (Cocody, Marcory, Plateau)',
    country: 'CI',
    sector: 'Mode & Beauté',
    description: '120 gérants de boutiques physiques et concept stores recherchant des distributeurs et créateurs locaux.',
    entriesCount: 120,
    verifiedDate: '28 Septembre 2026',
    requiredPlan: 'premium',
    fileFormat: 'VCF'
  },
  {
    id: 'vcf-004',
    title: 'Catalogue des Prestataires de Restauration & Événementiel',
    country: 'CI',
    sector: 'Restauration',
    description: '95 traiteurs, gérants de maquis haut standing et organisateurs de réceptions avec contacts WhatsApp pros.',
    entriesCount: 95,
    verifiedDate: '05 Octobre 2026',
    requiredPlan: 'free',
    fileFormat: 'VCF'
  }
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'ldg-1001',
    userId: 'usr_kouame_01',
    amount: 1000,
    currency: 'XOF',
    type: 'bonus',
    origin: 'Bonus de bienvenue à l\'activation conforme',
    status: 'completed',
    date: '2026-09-15 10:00',
    reference: 'GLB-INIT-001',
    notes: 'Bonus déterministe crédité après vérification de compte'
  },
  {
    id: 'ldg-1002',
    userId: 'usr_kouame_01',
    amount: 600,
    currency: 'XOF',
    type: 'reward',
    origin: 'Mission #tsk-001 : Étude Mobile Money',
    status: 'completed',
    date: '2026-10-09 14:25',
    reference: 'GLB-TSK-99482',
    notes: 'Validation automatique de la participation'
  },
  {
    id: 'ldg-1003',
    userId: 'usr_kouame_01',
    amount: 400,
    currency: 'XOF',
    type: 'reward',
    origin: 'Mission #tsk-003 : Tutoriel Cybersécurité',
    status: 'completed',
    date: '2026-10-10 10:18',
    reference: 'GLB-TSK-88123',
    notes: 'Validation automatique'
  },
  {
    id: 'ldg-1004',
    userId: 'usr_kouame_01',
    amount: 1500,
    currency: 'XOF',
    type: 'commission',
    origin: 'Affiliation Vente Réelle : Abonnement Premium Filleul Niveau 1 (Aïcha O.)',
    status: 'completed',
    date: '2026-10-11 12:30',
    reference: 'GLB-COM-77189',
    notes: 'Commission éthique sur vente réelle d\'un produit utile'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wth-001',
    userId: 'usr_aicha_premium',
    userName: 'Aïcha Ouattara',
    userPhone: '+225 05 64 22 98 10',
    amount: 5000,
    fees: 75,
    netAmount: 4925,
    currency: 'XOF',
    operator: 'Wave',
    operatorPhone: '+225 05 64 22 98 10',
    status: 'payout_sent',
    requestedAt: '2026-10-08 09:30',
    processedAt: '2026-10-08 10:15',
    transactionRef: 'WAVE-CI-TX-883492'
  },
  {
    id: 'wth-002',
    userId: 'usr_kouame_01',
    userName: 'Kouamé Diallo',
    userPhone: '+225 07 48 92 11 05',
    amount: 2500,
    fees: 38,
    netAmount: 2462,
    currency: 'XOF',
    operator: 'Orange Money',
    operatorPhone: '+225 07 48 92 11 05',
    status: 'approved',
    requestedAt: '2026-10-11 18:20',
    processedAt: '2026-10-11 19:00',
    transactionRef: 'OM-CI-20261011-449'
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-001',
    authorId: 'usr_ibrahim_admin',
    authorName: 'Ibrahim Traoré (Admin)',
    authorRole: 'admin',
    authorLevel: 'Platinum',
    content: 'Bienvenue sur GLOBAL-AF ! Rappel essentiel : notre plateforme fonctionne selon une Charte Éthique stricte. Aucune tombola, aucun jeu de hasard, et aucune commission sur le recrutement simple. Toutes les récompenses sont garanties et prévisibles.',
    category: 'Annonce Officielle',
    createdAt: '2026-10-01 08:00',
    likes: 84,
    commentsCount: 12,
    isOfficial: true,
    reportsCount: 0
  },
  {
    id: 'post-002',
    authorId: 'usr_aicha_premium',
    authorName: 'Aïcha Ouattara',
    authorRole: 'member_premium',
    authorLevel: 'Silver',
    content: 'Premier retrait de 5 000 FCFA reçu ce matin sur mon compte Wave en moins de 45 minutes ! Très rassurant. La formation sur l\'IA pour créer des fiches produits m\'a déjà fait gagner 2 clients à Abidjan.',
    category: 'Témoignage',
    createdAt: '2026-10-08 11:30',
    likes: 38,
    commentsCount: 5,
    reportsCount: 0
  },
  {
    id: 'post-003',
    authorId: 'usr_kouame_01',
    authorName: 'Kouamé Diallo',
    authorRole: 'member',
    authorLevel: 'Bronze',
    content: 'Astuce pour la mission sondage Mobile Money : prenez le temps de bien détailler les questions ouvertes, la validation automatique passe tout de suite.',
    category: 'Conseils & Astuces',
    createdAt: '2026-10-10 15:20',
    likes: 19,
    commentsCount: 3,
    reportsCount: 0
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-001',
    userId: 'usr_kouame_01',
    userName: 'Kouamé Diallo',
    userEmail: 'k.diallo@example.ci',
    subject: 'Confirmation de délai pour retrait Orange Money',
    category: 'Retrait',
    priority: 'Moyenne',
    message: 'Bonjour, j\'ai soumis une demande de retrait de 2 500 FCFA vers mon numéro Orange Money. Quel est le délai moyen de confirmation ? Merci d\'avance.',
    status: 'resolu',
    createdAt: '2026-10-11 18:25',
    updatedAt: '2026-10-11 19:05',
    responses: [
      {
        sender: 'support',
        senderName: 'Équipe Support GLOBAL-AF',
        message: 'Bonjour Kouamé. Votre retrait a été validé par notre équipe financière et transféré avec la référence OM-CI-20261011-449. Le délai est habituellement de 15 à 60 minutes.',
        timestamp: '2026-10-11 19:05'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    userId: 'usr_kouame_01',
    title: 'Commission d\'affiliation (+990 XOF)',
    message: 'Votre filleul Actif #1 a souscrit au VIP Premium (9 900 XOF). Conformément à nos règles éthiques, votre commission de 10% (990 XOF) sera définitivement libérée après le délai de rétractation légal de 7 jours.',
    type: 'commission',
    timestamp: '2026-10-27 15:45',
    read: false
  },
  {
    id: 'notif-002',
    userId: 'usr_kouame_01',
    title: 'Mission rémunérée validée (+850 XOF)',
    message: 'Votre test d\'application partenaire "Wave Côte d\'Ivoire - Parcours Transfert" a été validé avec succès. Gains crédités sur votre solde.',
    type: 'reward',
    timestamp: '2026-10-27 11:20',
    read: false
  },
  {
    id: 'notif-003',
    userId: 'usr_kouame_01',
    title: 'Certification Académie Réussie (92.5%)',
    message: 'Félicitations ! Vous avez réussi l\'examen officiel de 40 questions sur "Marketing Digital & Prospection B2B". Votre attestation avec QR Code est disponible.',
    type: 'system',
    timestamp: '2026-10-26 17:30',
    read: true
  },
  {
    id: 'notif-004',
    userId: 'usr_kouame_01',
    title: 'Retrait Mobile Money Réussi (5 000 XOF)',
    message: 'Votre virement vers Wave (+225 07 56 77 12 10) a été traité et complété avec succès (Réf. #WTH-8821).',
    type: 'system',
    timestamp: '2026-10-25 09:15',
    read: true
  },
  {
    id: 'notif-005',
    userId: 'usr_kouame_01',
    title: 'Pass Membre Standard Confirmé (3 000 FCFA)',
    message: 'Votre accès aux formations certifiantes (18h-26h), aux micro-jobs et aux retraits Mobile Money est activé à vie.',
    type: 'system',
    timestamp: '2026-10-24 14:00',
    read: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-11 19:00',
    actorName: 'Sophie Yao',
    actorRole: 'financial_manager',
    action: 'Validation Retrait Mobile Money',
    details: 'Approbation retrait #wth-002 pour Kouamé Diallo (2 500 XOF Orange Money). Vérification plafond et solde conforme.',
    complianceRule: 'Section 20 - Workflow de retrait & rapprochement'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-11 12:30',
    actorName: 'Système Affiliation',
    actorRole: 'admin',
    action: 'Attribution Commission Éthique Vente Réelle',
    details: 'Attribution 990 XOF au parrain Kouamé Diallo sur achat pack formation 9 900 XOF par Aïcha Ouattara. Plafond 10% respecté.',
    complianceRule: 'Charte Éthique : Ventes réelles uniquement'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-10 14:10',
    actorName: 'Ibrahim Traoré',
    actorRole: 'admin',
    action: 'Contrôle Éthique des Campagnes',
    details: 'Revue de la campagne #tsk-005. Confirmation de l\'absence totale de mécanisme aléatoire ou de jeu de hasard.',
    complianceRule: 'Charte Éthique : Interdiction absolue des jeux de hasard'
  }
];

export const INITIAL_RISK_ALERTS: RiskAlert[] = [
  {
    id: 'risk-001',
    timestamp: '2026-10-11 04:12',
    userId: 'usr_anon_882',
    type: 'self_referral_attempt',
    severity: 'medium',
    details: 'Tentative d\'auto-parrainage détectée avec la même adresse IP et un numéro de téléphone similaire (+225 07 ** ** 05). Requête bloquée automatiquement.',
    resolved: true
  },
  {
    id: 'risk-002',
    timestamp: '2026-10-10 22:50',
    userId: 'usr_test_102',
    type: 'multi_account_suspected',
    severity: 'low',
    details: '2 comptes créés depuis le même navigateur en 5 minutes. Vérification e-mail stricte exigée.',
    resolved: true
  }
];
