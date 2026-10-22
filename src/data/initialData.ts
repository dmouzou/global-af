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
  idCardNumber: 'CI0039281729',
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
    idCardNumber: 'CI0081290344',
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
    description: 'Programme certifiant complet : maîtrisez les canaux d\'acquisition digitaux adaptés aux réalités ivoiriennes (WhatsApp Business, Meta Ads ciblé Abidjan/Intérieur, Mobile Money direct).',
    level: 'Débutant',
    durationHours: 4.5,
    isPremium: false,
    enrolledUserIds: ['usr_kouame_01'],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-101',
        title: 'Palier 1 : Comportements Numériques & Écosystème Mobile Ivoirien',
        durationMinutes: 45,
        content: `En Côte d'Ivoire, plus de 88% de la population connectée accède à internet via un smartphone avec des forfaits données prépayés. Les canaux prioritaires sont WhatsApp Business, Facebook et TikTok. Le parcours d'achat repose sur la confiance humaine directe et les paiements Mobile Money instantanés (Wave, Orange Money, MTN MoMo, Moov). Les sites web lourds ou nécessitant une carte bancaire perdent 90% de leur audience.`,
        keyTakeaways: [
          'Design ultra-léger et adapté aux connexions 3G/4G mobiles.',
          'Intégration systématique du canal de contact WhatsApp direct.',
          'Tarification transparente et affichage immédiat en Francs CFA (XOF).'
        ],
        checkpointQuiz: {
          id: 'cpq-101',
          courseId: 'crs-001',
          title: 'Quiz Palier 1 : Écosystème Numérique CI',
          passingScore: 100,
          rewardPoints: 30,
          questions: [
            {
              id: 'q-cp1-1',
              question: 'Quel est le premier canal de conversion directe pour un commerce en ligne en Côte d\'Ivoire ?',
              options: [
                'La prospection par e-mailing B2C',
                'WhatsApp Business couplé aux paiements Mobile Money',
                'Le courrier postal recommandé',
                'Les forums web sur PC de bureau'
              ],
              correctAnswerIndex: 1,
              explanation: 'WhatsApp Business et le Mobile Money sont les standards incontournables du commerce direct ivoirien.'
            }
          ]
        }
      },
      {
        id: 'mod-102',
        title: 'Palier 2 : Création de Visuels Publicitaires & Copywriting Percutant',
        durationMinutes: 50,
        content: `La création d'annonces performantes sur le marché ivoirien exige une clarté instantanée : présenter le problème résolu en moins de 3 secondes, employer des accroches locales authentiques et un appel à l'action précis ("Cliquez pour discuter sur WhatsApp", "Paiement Wave à la livraison"). Les visuels doivent présenter le produit réel dans un environnement familier pour maximiser la réassurance.`,
        keyTakeaways: [
          'Règle des 3 secondes : produit + prix FCFA + avantage concret.',
          'Pas de promesses trompeuses ni de faux témoignages (charte éthique).',
          'Visuels à fort contraste lisibles en plein soleil sur mobile.'
        ],
        checkpointQuiz: {
          id: 'cpq-102',
          courseId: 'crs-001',
          title: 'Quiz Palier 2 : Visuels & Copywriting Éthique',
          passingScore: 100,
          rewardPoints: 30,
          questions: [
            {
              id: 'q-cp2-1',
              question: 'Selon la charte de transparence de GLOBAL-AF, quel type d\'argumentaire commercial est formellement banni ?',
              options: [
                'Les démonstrations vidéo du produit réel',
                'Les fausses allégations de gains miraculeux sans travail effectif',
                'L\'indication des frais de livraison à Abidjan',
                'Les remises de lancement vérifiables'
              ],
              correctAnswerIndex: 1,
              explanation: 'La charte éthique de GLOBAL-AF proscrit tout argumentaire trompeur ou promesse spéculative.'
            }
          ]
        }
      },
      {
        id: 'mod-103',
        title: 'Palier 3 : Ciblage Géographique et Campagnes Meta Ads Locales',
        durationMinutes: 55,
        content: `Configurer des campagnes publicitaires rentables sans gaspillage de budget. Apprenez à cibler précisément les communes d'Abidjan (Cocody, Yopougon, Marcory, Plateau, Koumassi) et les grandes villes de province (Bouaké, Yamoussoukro, San Pédro, Korhogo). Optimisation du coût par message WhatsApp et suivi des conversions réelles.`,
        keyTakeaways: [
          'Segmenter les campagnes par zone géographique pour adapter les coûts de livraison.',
          'Tester au moins 2 angles d\'annonces avant d\'augmenter le budget quotidien.',
          'Calculer le retour sur investissement publicitaire (ROAS) réel.'
        ],
        checkpointQuiz: {
          id: 'cpq-103',
          courseId: 'crs-001',
          title: 'Quiz Palier 3 : Ciblage & Rentabilité des Campagnes',
          passingScore: 100,
          rewardPoints: 40,
          questions: [
            {
              id: 'q-cp3-1',
              question: 'Pourquoi est-il crucial de segmenter ses publicités entre Abidjan et l\'intérieur du pays ?',
              options: [
                'Parce que les coûts logistiques et les délais de livraison diffèrent grandement',
                'Pour payer la TVA deux fois',
                'Car Facebook interdit de diffuser sur tout le pays en même temps',
                'Il n\'y a aucune différence'
              ],
              correctAnswerIndex: 0,
              explanation: 'La livraison à Abidjan (24h en moto) diffère de l\'intérieur (48h par car ou relais), ce qui influe sur la conversion et les marges.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-101',
      courseId: 'crs-001',
      title: 'Certification Finale : Marketing Digital Opérationnel CI',
      passingScore: 75,
      rewardPoints: 120,
      questions: [
        {
          id: 'q1',
          question: 'Quel est le moyen de paiement prioritaire pour un commerce digital en Côte d\'Ivoire ?',
          options: ['Carte bancaire internationale', 'Mobile Money (Wave, Orange, MTN, Moov)', 'Chèque postal', 'Crypto-monnaie spéculative'],
          correctAnswerIndex: 1,
          explanation: 'Le Mobile Money représente l\'écrasante majorité des paiements digitaux en Côte d\'Ivoire.'
        },
        {
          id: 'q2',
          question: 'Pourquoi la plateforme GLOBAL-AF exige-t-elle que les commissions soient basées sur des ventes réelles ?',
          options: ['Parce que l\'affiliation éthique valorise la création de valeur concrète sans spéculation pyramidale', 'Pour limiter les revenus des membres', 'Par obligation de la météo', 'Aucune raison'],
          correctAnswerIndex: 0,
          explanation: 'Notre engagement éthique garantit une rémunération saine indexée uniquement sur des transactions de produits et services réels.'
        },
        {
          id: 'q3',
          question: 'Quel type d\'expérience utilisateur est indispensable pour le public ivoirien ?',
          options: ['Desktop uniquement', 'Mobile-first léger, chargement rapide et boutons WhatsApp/MoMo', 'Fichiers téléchargeables de 500 Mo', 'Popups agressives'],
          correctAnswerIndex: 1,
          explanation: 'La quasi-totalité des internautes utilisent des smartphones avec des connexions mobiles où chaque mégaoctet compte.'
        },
        {
          id: 'q4',
          question: 'Que doit contenir une offre promotionnelle transparente ?',
          options: ['Prix en FCFA clair, frais de livraison annoncés et politique de rétractation', 'Des frais cachés non déclarés', 'Un délai de rétractation de zéro minute', 'Des termes obscurs'],
          correctAnswerIndex: 0,
          explanation: 'La transparence totale sur le prix, la livraison et le retour est le socle de la confiance en e-commerce.'
        }
      ]
    }
  },
  {
    id: 'crs-002',
    title: 'Maîtrise Professionnelle de l\'IA Générative Commerciale',
    category: 'Intelligence Artificielle',
    description: 'Formation Premium avancée : devenez expert dans l\'utilisation des modèles d\'IA pour automatiser la rédaction de propositions commerciales, le support client 24/7 et l\'analyse de marché.',
    level: 'Intermédiaire',
    durationHours: 6.0,
    isPremium: true,
    priceXOF: 15000,
    enrolledUserIds: ['usr_aicha_premium'],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-201',
        title: 'Palier 1 : Ingénierie de Prompts & Structuration Avancée',
        durationMinutes: 50,
        content: `Pour obtenir des résultats d'élite avec un assistant IA, la précision du prompt est reine. Maîtrisez le framework R-C-T-F-C : Rôle (expert marché ivoirien), Contexte (secteur B2B / B2C à Abidjan), Tâche explicite, Format exigé (tableaux, devis structurés), et Contraintes (ton professionnel, monnaie FCFA).`,
        keyTakeaways: [
          'Assigner une identité d\'expert métier au modèle.',
          'Exiger des formats exploitables immédiatement sans reformatage.',
          'Technique du few-shot prompting avec exemples concrets de réussite.'
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
                'Ralentir la réponse du modèle',
                'Imposer le respect strict des devises locales (FCFA), du ton et des règles éthiques',
                'Supprimer l\'accès à internet',
                'Remplacer l\'humain sans vérification'
              ],
              correctAnswerIndex: 1,
              explanation: 'Les contraintes précisent les limites impératives : devises, terminologie et conformité métier.'
            }
          ]
        }
      },
      {
        id: 'mod-202',
        title: 'Palier 2 : Automatisation du Support Commercial & Gestion des Objections',
        durationMinutes: 55,
        content: `Configurez des matrices de réponses automatisées et intelligentes pour répondre aux questions fréquentes des clients ivoiriens : délais de livraison, sécurité des dépôts Mobile Money, garanties de remboursement sous 7 jours. Réduire le temps de première réponse de 2 heures à moins de 30 secondes.`,
        keyTakeaways: [
          'Répondre aux doutes sur le paiement à la livraison (COD) vs Mobile Money prépayé.',
          'Conserver une touche humaine chaleureuse et professionnelle.',
          'Sécurité absolue : aucune donnée bancaire sensible partagée.'
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
              question: 'Quelle donnée ne doit JAMAIS être insérée dans une invite ou un prompt d\'IA ?',
              options: [
                'Une description de produit vestimentaire',
                'Un code secret PIN Wave, un mot de passe ou une clé d\'accès confidentielle',
                'La liste des communes d\'Abidjan',
                'Le tarif public en Francs CFA'
              ],
              correctAnswerIndex: 1,
              explanation: 'Les codes confidentiels et identifiants bancaires ne doivent jamais être communiqués à un outil tiers.'
            }
          ]
        }
      },
      {
        id: 'mod-203',
        title: 'Palier 3 : Création de Contenu Stratégique & Analyse de Marché',
        durationMinutes: 60,
        content: `Exploitez l'IA pour synthétiser des rapports de marché, repérer les tendances émergentes de consommation en Afrique de l'Ouest, rédiger des fiches de négociation B2B et concevoir des scripts d'appels commerciaux percutants.`,
        keyTakeaways: [
          'Analyse concurrentielle rapide et structurée.',
          'Génération de scripts d\'appels téléphoniques adaptés à la culture d\'affaires ivoirienne.',
          'Vérification humaine des faits et chiffres cités.'
        ],
        checkpointQuiz: {
          id: 'cpq-203',
          courseId: 'crs-002',
          title: 'Quiz Palier 3 : Analyse Stratégique & Décision',
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
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-201',
      courseId: 'crs-002',
      title: 'Examen de Certification : Spécialiste IA Générative & Productivité Pro',
      passingScore: 80,
      rewardPoints: 200,
      questions: [
        {
          id: 'q201-1',
          question: 'Quelle est la composante clé d\'un prompt professionnel performant ?',
          options: ['Écrire le moins de mots possible', 'Définir clairement le rôle, contexte, tâche et format attendu', 'Attendre le hasard', 'Utiliser un jargon incompréhensible'],
          correctAnswerIndex: 1,
          explanation: 'La structure et le cadrage précis conditionnent directement l\'utilité du résultat.'
        },
        {
          id: 'q201-2',
          question: 'Comment l\'IA contribue-t-elle à la productivité d\'un entrepreneur ivoirien ?',
          options: ['En rédigeant en quelques minutes devis, fiches produits et synthèses tout en laissant l\'humain valider', 'En remplaçant les clients', 'En spéculant sur des monnaies virtuelles', 'En travaillant sans électricité'],
          correctAnswerIndex: 0,
          explanation: 'L\'IA agit comme un accélérateur opérationnel pour les tâches rédactionnelles et d\'analyse.'
        },
        {
          id: 'q201-3',
          question: 'Que prescrit la charte éthique de GLOBAL-AF sur l\'automatisation ?',
          options: ['Transparence totale, interdiction du spam et respect de la confidentialité des usagers', 'Spammer les utilisateurs par SMS automatiques', 'Vendre les coordonnées des clients', 'Aucune règle'],
          correctAnswerIndex: 0,
          explanation: 'L\'automatisation doit toujours servir la qualité de service et respecter scrupuleusement la vie privée des clients.'
        }
      ]
    }
  },
  {
    id: 'crs-003',
    title: 'Lancer une Activité E-Commerce & Logistique Abidjan-Intérieur',
    category: 'E-Commerce',
    description: 'Guide pratique d\'exécution : approvisionnement local (Adjamé, Treichville, San Pédro), partenariats transporteurs fiables et sécurisation des paiements Mobile Money.',
    level: 'Intermédiaire',
    durationHours: 5.0,
    isPremium: false,
    enrolledUserIds: [],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-301',
        title: 'Palier 1 : Sourcing Produits & Négociation Fournisseurs en Côte d\'Ivoire',
        durationMinutes: 45,
        content: `Comment identifier des fournisseurs fiables sur les grands pôles marchands d'Abidjan (marché Gouro d'Adjamé, grossistes de Treichville, importateurs du Port Autonome d'Abidjan). Calcul précis de la marge brute unitaire après transport, conditionnement et pertes potentielles.`,
        keyTakeaways: [
          'Toujours sécuriser un fournisseur de secours (backup).',
          'Calculer le seuil de rentabilité en tenant compte du taux de retour colis.',
          'Tester la qualité physique d\'un échantillon avant tout achat en volume.'
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
                'Le coût des livraisons non abouties (taux de refus à la livraison)',
                'Le prix de la batterie du téléphone',
                'Le nom du magasin'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le taux de refus à la livraison en paiement à la réception impacte lourdement la marge si le client n\'a pas été pré-qualifié par téléphone.'
            }
          ]
        }
      },
      {
        id: 'mod-302',
        title: 'Palier 2 : Organisation Logistique & Réseau de Livraison Fiable',
        durationMinutes: 50,
        content: `Structurer sa logistique du dernier kilomètre : contractualiser avec des livreurs à moto professionnels à Abidjan (horaires stricts, traçabilité des espèces et des reçus Wave), et mettre en place des expéditions sécurisées vers l'intérieur (compagnies de car UTB, CTE, mallettes sécurisées).`,
        keyTakeaways: [
          'Appeler systématiquement le client avant le départ du coursier.',
          'Mettre en place un protocole d\'encaissement Wave marchand direct.',
          'Notifier le client à chaque étape d\'acheminement du colis.'
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
            }
          ]
        }
      },
      {
        id: 'mod-303',
        title: 'Palier 3 : Fidélisation Clientèle & Service Après-Vente Éthique',
        durationMinutes: 45,
        content: `Transformer un premier acheteur en client récurrent. Respecter la promesse de conformité produit, traiter les échanges avec bienveillance et appliquer la politique de rétractation garantie de 7 jours de GLOBAL-AF pour asseoir une réputation inattaquable.`,
        keyTakeaways: [
          'Un client satisfait de la gestion d\'un litige devient votre meilleur ambassadeur.',
          'Proposer des offres de réachat personnalisées sur WhatsApp.',
          'Mesurer le taux de satisfaction client mensuel.'
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
                '0 jour (aucun remboursement)',
                '7 jours sans condition arbitraire sur les achats éligibles',
                '365 jours',
                'Uniquement si le client paie une pénalité'
              ],
              correctAnswerIndex: 1,
              explanation: 'La garantie de rétractation de 7 jours est l\'un des piliers cardinaux de la charte éthique de GLOBAL-AF.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-301',
      courseId: 'crs-003',
      title: 'Certification Finale : Gestionnaire E-Commerce & Logistique CI',
      passingScore: 75,
      rewardPoints: 140,
      questions: [
        {
          id: 'q301-1',
          question: 'Comment sécuriser les encaissements pour éviter les impayés et la fraude à la monnaie fiduciaire ?',
          options: ['Privilégier le Mobile Money officiel (Wave, OM, MTN) avec notification instantanée sur le terminal marchand', 'Accepter des chèques sans provision', 'Faire confiance à des captures d\'écran non vérifiées', 'Livrer à crédit sans contrat'],
          correctAnswerIndex: 0,
          explanation: 'La validation directe du solde sur son compte marchand Mobile Money protège contre toute falsification de SMS.'
        },
        {
          id: 'q301-2',
          question: 'Quel est l\'impact d\'une politique de retour transparente sur le chiffre d\'affaires ?',
          options: ['Elle fait fuir les clients', 'Elle lève le frein à l\'achat et multiplie par 2 la confiance des acheteurs indécis', 'Elle ruine systématiquement l\'entreprise', 'Aucun impact'],
          correctAnswerIndex: 1,
          explanation: 'La garantie de remboursement rassure les acheteurs et convertit un nombre nettement supérieur de prospects.'
        },
        {
          id: 'q301-3',
          question: 'Comment organiser l\'expédition vers l\'intérieur de la Côte d\'Ivoire (Bouaké, Korhogo, etc.) ?',
          options: ['Partenariat avec les gares routières et services d\'expédition de colis enregistrés avec code de retrait', 'Laisser le colis au bord de la route', 'Attendre que le client vienne à pied à Abidjan', 'Envoyer par pigeon voyageur'],
          correctAnswerIndex: 0,
          explanation: 'Les compagnies de transport disposent de comptoirs colis officiels avec bordereau et retrait sous présentation de pièce d\'identité.'
        }
      ]
    }
  },
  {
    id: 'crs-004',
    title: 'Prospection B2B & Négociation Grands Comptes en Côte d\'Ivoire',
    category: 'Entrepreneuriat',
    description: 'Formation Premium certifiante : maîtrisez les techniques de prospection auprès des PME, multinationales et institutions basées au Plateau et en Zone Industrielle.',
    level: 'Avancé',
    durationHours: 6.5,
    isPremium: true,
    priceXOF: 25000,
    enrolledUserIds: [],
    completedUserIds: [],
    modules: [
      {
        id: 'mod-401',
        title: 'Palier 1 : Cartographie des Décideurs & Réseautage au Plateau et Zone 4',
        durationMinutes: 50,
        content: `Identifier le circuit décisionnel dans les entreprises ivoiriennes : Directeur Général, Directeur des Achats, DAF. Techniques d'approche directe via LinkedIn, clubs d'affaires locaux (CGECI, Eurocham, chambres consulaires) et événements professionnels d'Abidjan.`,
        keyTakeaways: [
          'Comprendre la distinction entre influenceur, utilisateur final et signataire budgétaire.',
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
              question: 'Dans une négociation B2B à Abidjan, qui a le pouvoir final d\'autoriser la dépense ?',
              options: [
                'Le stagiaire',
                'Le signataire autorisé (DG, Gérant ou Directeur Financier)',
                'Le réceptionniste',
                'Le chauffeur de l\'entreprise'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le signataire officiel détient le pouvoir budgétaire légal d\'engager l\'entreprise.'
            }
          ]
        }
      },
      {
        id: 'mod-402',
        title: 'Palier 2 : Construction de Devis Professionnels & Négociation Contractuelle',
        durationMinutes: 60,
        content: `Élaborer des devis conformes aux normes fiscales ivoiriennes (TVA, AIRSI, mentions légales RCCM et Compte Contribuable). Négocier les conditions de règlement (acompte 40% au démarrage, solde à réception) et clauses de confidentialité.`,
        keyTakeaways: [
          'Toujours formaliser l\'accord par un bon de commande (PO) signé et tamponné.',
          'Définir clairement le périmètre pour éviter les demandes gratuites non budgétées.',
          'Proposer des facilités de paiement échelonné pour débloquer les signatures.'
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
              question: 'Quelle mention garantit la validité juridique d\'une commande commerciale B2B ?',
              options: [
                'Un simple accord verbal sans trace',
                'Un Bon de Commande officiel signé et revêtu du cachet de l\'entreprise cliente',
                'Un SMS non signé',
                'Une promesse sur les réseaux sociaux'
              ],
              correctAnswerIndex: 1,
              explanation: 'Le Bon de Commande tamponné et signé constitue l\'engagement juridique officiel de paiement.'
            }
          ]
        }
      },
      {
        id: 'mod-403',
        title: 'Palier 3 : Recouvrement Amiable & Relations d\'Affaires Long Terme',
        durationMinutes: 55,
        content: `Gestion saine du compte client : relance préventive des factures à 15 jours, gestion courtoise mais ferme des retards d'échéances et fidélisation pour contrats à reconduction annuelle.`,
        keyTakeaways: [
          'La relance commence avant la date d\'échéance, par un point d\'étape bienveillant.',
          'Conserver une trace écrite de tous les échanges financiers.',
          'Développer des contrats de maintenance ou d\'abonnement récurrents.'
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
                '3 à 5 jours avant la date d\'échéance pour s\'assurer de son bon enregistrement comptable',
                'Jamais, par timidité',
                'Le jour du Nouvel An'
              ],
              correctAnswerIndex: 1,
              explanation: 'La relance préventive permet de détecter les éventuels blocages de transmission avant le retard effectif.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'qz-401',
      courseId: 'crs-004',
      title: 'Grand Examen : Spécialiste Négociation & Grands Comptes CI',
      passingScore: 80,
      rewardPoints: 250,
      questions: [
        {
          id: 'q401-1',
          question: 'Pourquoi l\'acompte au démarrage est-il primordial en prestation de services B2B ?',
          options: ['Pour financer les dépenses initiales et tester l\'engagement réel du client', 'Pour partir en vacances', 'C\'est interdit par la loi', 'Pour doubler le prix'],
          correctAnswerIndex: 0,
          explanation: 'L\'acompte valide la solidité de l\'engagement du client et couvre les frais de production engagés.'
        },
        {
          id: 'q401-2',
          question: 'Que stipule l\'éthique commerciale sur la transparence des tarifs ?',
          options: ['Annoncer des prix fermes, détaillés et sans surfacturations dissimulées', 'Modifier les prix selon l\'humeur', 'Ne jamais donner de facture', 'Refuser d\'indiquer les taxes'],
          correctAnswerIndex: 0,
          explanation: 'La clarté contractuelle est le gage d\'une collaboration sereine et durable.'
        }
      ]
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
    title: 'Commission d\'affiliation validée',
    message: 'Vous avez reçu 1 500 XOF suite à la souscription d\'un pack formation par votre filleul.',
    type: 'commission',
    timestamp: '2026-10-11 12:30',
    read: false
  },
  {
    id: 'notif-002',
    userId: 'usr_kouame_01',
    title: 'Mission validée avec succès',
    message: 'Votre participation au tutoriel Cybersécurité a été créditée (+400 XOF).',
    type: 'reward',
    timestamp: '2026-10-10 10:18',
    read: true
  },
  {
    id: 'notif-003',
    userId: 'usr_kouame_01',
    title: 'Bienvenue sur GLOBAL-AF',
    message: 'Votre compte est actif. Découvrez votre premier module de formation gratuit.',
    type: 'system',
    timestamp: '2026-09-15 10:00',
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
    details: 'Attribution 1 500 XOF au parrain Kouamé Diallo sur achat pack formation 9 900 XOF par Aïcha Ouattara. Plafond 15% respecté.',
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
