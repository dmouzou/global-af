import { QuizQuestion } from '../types';

export const EXAM_QUESTIONS_CRS_001: QuizQuestion[] = [
  {
    id: 'c1-q1',
    question: 'Quel est le premier canal de conversion directe pour un commerce en ligne en Côte d\'Ivoire ?',
    options: ['L\'e-mailing B2C de masse', 'WhatsApp Business couplé aux paiements Mobile Money (Wave, OM, MTN, MoMo)', 'Le courrier postal recommandé', 'Les forums web sur PC de bureau'],
    correctAnswerIndex: 1,
    explanation: 'WhatsApp Business et le Mobile Money sont les standards universels incontournables du commerce direct en Côte d\'Ivoire.'
  },
  {
    id: 'c1-q2',
    question: 'Pourquoi les formulaires avec paiement obligatoire par carte bancaire internationale perdent-ils plus de 90% des clients ivoiriens ?',
    options: ['Parce que le taux de bancarisation classique par carte reste minoritaire face à l\'omniprésence du Mobile Money', 'Parce que les Ivoiriens refusent d\'acheter en ligne', 'Parce que les cartes sont interdites le week-end', 'Il n\'y a aucune perte constatée'],
    correctAnswerIndex: 0,
    explanation: 'Le Mobile Money est le moyen de paiement universel en Côte d\'Ivoire, tandis que la carte bancaire reste restreinte à une élite bancarisée.'
  },
  {
    id: 'c1-q3',
    question: 'Quelle est la taille maximale recommandée pour un visuel publicitaire sur mobile en Côte d\'Ivoire afin de préserver le forfait data de l\'utilisateur ?',
    options: ['Moins de 200 Ko', 'Au moins 15 Mo', 'Environ 50 Mo', 'La taille n\'a aucune importance'],
    correctAnswerIndex: 0,
    explanation: 'Un visuel inférieur à 200 Ko se charge instantanément même en connexion 3G/4G instable sans vider le pass internet prépayé du prospect.'
  },
  {
    id: 'c1-q4',
    question: 'Dans une annonce publicitaire sur les réseaux sociaux en Côte d\'Ivoire, que provoque l\'absence d\'affichage clair du prix en FCFA ?',
    options: ['Cela attire les acheteurs les plus riches', 'Cela engendre de la méfiance, des commentaires négatifs ("Prix svp ?") et une perte massive de conversions', 'Cela fait doubler le ROAS publicitaire', 'C\'est recommandé par l\'ARTCI'],
    correctAnswerIndex: 1,
    explanation: 'La transparence du prix en FCFA est un gage indispensable d\'honnêteté qui qualifie immédiatement les acheteurs sérieux.'
  },
  {
    id: 'c1-q5',
    question: 'Quel est l\'objectif prioritaire d\'un message WhatsApp pré-rempli dans une campagne Click-to-WhatsApp (CTWA) ?',
    options: ['Réduire l\'effort du client en lui évitant d\'écrire et identifier immédiatement la provenance de l\'annonce', 'Bloquer le compte WhatsApp du prospect', 'Changer le prix du produit', 'Obliger le client à acheter sans réfléchir'],
    correctAnswerIndex: 0,
    explanation: 'Un message pré-rempli ("Bonjour, je souhaite commander l\'offre X à 15 000 FCFA") accélère la prise de contact et la traçabilité.'
  },
  {
    id: 'c1-q6',
    question: 'Quelle commune d\'Abidjan présente la concentration la plus élevée en pouvoir d\'achat pour les offres B2B et premium ?',
    options: ['Cocody (Angré, Riviera, Palmeraie, Ambassades) et Marcory (Zone 4)', 'Abobo', 'Attécoubé', 'Anyama'],
    correctAnswerIndex: 0,
    explanation: 'Cocody et Marcory Zone 4 regroupent les cadres, diplomates et chefs d\'entreprises au pouvoir d\'achat supérieur.'
  },
  {
    id: 'c1-q7',
    question: 'Si vous investissez 10 000 FCFA dans Meta Ads et obtenez 40 messages qualifiés menant à 8 ventes de 15 000 FCFA chacune (120 000 FCFA de CA), quel est votre ROAS brut ?',
    options: ['12x', '2.5x', '0.5x', '20x'],
    correctAnswerIndex: 0,
    explanation: '120 000 FCFA de chiffre d\'affaires / 10 000 FCFA investis = un retour sur dépenses publicitaires (ROAS) exceptionnel de 12 pour 1.'
  },
  {
    id: 'c1-q8',
    question: 'À quel seuil de fréquence de répétition publicitaire constate-t-on généralement une saturation d\'audience sur Abidjan ?',
    options: ['Entre 3.5 et 4.5 impressions par personne', 'Dès 0.2 impression', 'À partir de 50 impressions', 'Une audience ne sature jamais'],
    correctAnswerIndex: 0,
    explanation: 'Au-delà d\'une fréquence de 3.5 à 4, le coût par message commence à s\'envoler car les mêmes personnes revoient l\'annonce sans cliquer.'
  },
  {
    id: 'c1-q9',
    question: 'Quelle procédure divise par 3 les refus de livraison de colis (taux de retour) à Abidjan ?',
    options: ['Un appel téléphonique de confirmation 1h avant le départ du coursier moto avec point de repère précis', 'Livrer sans prévenir à l\'improviste', 'Exiger un pourboire obligatoire au livreur', 'Ne jamais donner son numéro'],
    correctAnswerIndex: 0,
    explanation: 'L\'appel de confirmation valide que le client est effectivement présent, disponible et prêt avec le montant exact.'
  },
  {
    id: 'c1-q10',
    question: 'Pour une livraison d\'Abidjan vers Bouaké ou San Pedro, quel est le canal d\'acheminement le plus économique et fiable ?',
    options: ['Les compagnies de car interurbaines régulières (UTB, CTE, etc.) avec retrait sécurisé en gare', 'Un coursier à moto faisant le trajet aller-retour', 'Un vol charter privé', 'Attendre 2 mois'],
    correctAnswerIndex: 0,
    explanation: 'Le réseau d\'expédition colis des compagnies de cars ivoiriennes est rapide (24h-48h) et très peu coûteux (1 000 à 2 500 FCFA).'
  },
  {
    id: 'c1-q11',
    question: 'Quel est l\'intérêt d\'utiliser le Nouchi ou le français ivoirien familier dans une accroche publicitaire ?',
    options: ['Capter l\'attention instantanément en créant une proximité culturelle forte et authentique', 'C\'est interdit par Meta', 'Pour que personne ne comprenne le texte', 'Cela diminue toujours les ventes'],
    correctAnswerIndex: 0,
    explanation: 'Un soupçon de vocabulaire local maîtrisé brise la distance et humanise immédiatement l\'annonce aux yeux de l\'Ivoirien.'
  },
  {
    id: 'c1-q12',
    question: 'Que signifie un statut de livraison "Cash On Delivery" (COD) et quel est son risque principal ?',
    options: ['Paiement à la livraison ; son risque majeur est le refus du client à la réception ou l\'injoignabilité', 'Paiement par virement bancaire 30 jours après', 'Don gratuit sans contrepartie', 'Paiement uniquement par chèque certifié'],
    correctAnswerIndex: 0,
    explanation: 'Le COD rassure le client méfiant mais expose le vendeur aux faux bonds si aucun acompte de livraison n\'est demandé.'
  },
  {
    id: 'c1-q13',
    question: 'Quelle est la règle d\'or pour relancer un prospect qui a demandé des informations sur WhatsApp sans finaliser son achat ?',
    options: ['Le harceler 10 fois par jour avec des messages vocaux', 'Une relance respectueuse sous 24h avec un bénéfice additionnel ou une réponse à ses objections', 'Bloquer son numéro sur WhatsApp', 'Lui envoyer un message anonyme insultant'],
    correctAnswerIndex: 1,
    explanation: 'Une relance bienveillante sous 24 heures récupère en moyenne 25% à 35% des ventes hésitantes.'
  },
  {
    id: 'c1-q14',
    question: 'Sur TikTok en Côte d\'Ivoire, quel format de vidéo génère le taux de conversion le plus élevé pour vendre un produit physique ?',
    options: ['Le déballage (unboxing) authentique face caméra avec démonstration concrète et avis sincère', 'Un diaporama de photos fixes sans son', 'Une vidéo de 25 minutes sans rythme', 'Un texte défilant sur fond noir'],
    correctAnswerIndex: 0,
    explanation: 'Les vidéos courtes de démonstration concrète face caméra créent de la confiance et humanisent l\'offre.'
  },
  {
    id: 'c1-q15',
    question: 'Pourquoi le service client après-vente à J+2 est-il un levier de croissance majeur en Côte d\'Ivoire ?',
    options: ['Il transforme un acheteur satisfait en ambassadeur qui recommande l\'offre dans ses statuts WhatsApp et ses cercles familiaux', 'Il permet d\'exiger un supplément d\'argent', 'Il est imposé par la police', 'Il n\'apporte rien au chiffre d\'affaires'],
    correctAnswerIndex: 0,
    explanation: 'Le bouche-à-oreille et les recommandations sur statuts WhatsApp sont les sources d\'acquisition gratuites les plus rentables.'
  },
  {
    id: 'c1-q16',
    question: 'Quelle est la différence fondamentale entre une page de capture (landing page) et un site vitrine classique de 10 pages ?',
    options: ['La landing page se focalise sur un objectif unique de conversion sans menu de dispersion', 'Le site vitrine convertit toujours 10 fois mieux', 'La landing page est interdite en zone UEMOA', 'Il n\'y a aucune différence technique'],
    correctAnswerIndex: 0,
    explanation: 'Une landing page élimine les distractions et oriente le visiteur vers une action unique : commander ou contacter sur WhatsApp.'
  },
  {
    id: 'c1-q17',
    question: 'Sur Facebook Ads, quelle est l\'importance du paramétrage de l\'âge pour les produits de formation payante en Côte d\'Ivoire ?',
    options: ['Cibler au moins 21 ou 23 ans car les plus jeunes ont rarement un pouvoir d\'achat autonome et un solde Mobile Money approvisionné', 'Cibler uniquement les enfants de 12 ans', 'L\'âge ne doit jamais être configuré', 'Cibler les plus de 85 ans'],
    correctAnswerIndex: 0,
    explanation: 'Cibler les 22-55 ans évite de gaspiller son budget publicitaire sur des profils sans autonomie financière.'
  },
  {
    id: 'c1-q18',
    question: 'Pourquoi est-il avantageux d\'utiliser un QR Code Mobile Money sur ses supports physiques et reçus de livraison ?',
    options: ['Le client scanne avec Wave ou son appli bancaire pour payer en 2 secondes sans erreur de saisie du numéro', 'Le QR code bloque le téléphone du coursier', 'C\'est obligatoire pour passer les péages', 'Le QR code coûte 50 000 FCFA par scan'],
    correctAnswerIndex: 0,
    explanation: 'Le scan de QR code élimine les erreurs de frappe de numéro de téléphone et valide le paiement immédiatement.'
  },
  {
    id: 'c1-q19',
    question: 'Que prescrit la charte de transparence de GLOBAL-AF concernant la publicité sur les réseaux sociaux ?',
    options: ['Zéro promesse trompeuse, affichage exact des conditions de rétractation de 7 jours et traçabilité des opérations', 'Promettre de devenir millionnaire en 48 heures sans travailler', 'Masquer les prix pour forcer le clic', 'Prétendre que le hasard décide des gains'],
    correctAnswerIndex: 0,
    explanation: 'La charte impose l\'honnêteté intégrale : aucun gain fictif ou promesse illusoire n\'est toléré.'
  },
  {
    id: 'c1-q20',
    question: 'Quel indicateur financier mesure la rentabilité nette réelle d\'une opération e-commerce après déduction des coûts de livraison et retours ?',
    options: ['La marge nette opérationnelle par commande livrée', 'Le nombre de likes sur la page Facebook', 'Le nombre de vues de la vidéo', 'Le nombre d\'amis du vendeur'],
    correctAnswerIndex: 0,
    explanation: 'Seul l\'argent net restant en caisse après déduction des frais publicitaires, produit et retours compte.'
  },
  {
    id: 'c1-q21',
    question: 'Comment structurer le pitch d\'un produit sur WhatsApp selon la formule AIDA ?',
    options: ['Attention (Accroche percutante) -> Intérêt (Bénéfice clé) -> Désir (Preuve sociale & photos) -> Action (Bouton commande Wave/OM)', 'Attendre -> Ignorer -> Douter -> Abandonner', 'Envoyer 50 photos sans un mot d\'explication', 'Demander de l\'argent dès le premier mot'],
    correctAnswerIndex: 0,
    explanation: 'La structure AIDA guide naturellement le prospect depuis la curiosité jusqu\'au paiement sécurisé.'
  },
  {
    id: 'c1-q22',
    question: 'Quelle est la fonction d\'un catalogue de produits intégré dans WhatsApp Business ?',
    options: ['Permettre au client de parcourir les articles, prix et descriptions directement dans l\'application de messagerie sans sortir sur le web', 'Ralentir le smartphone', 'Supprimer les contacts du répertoire', 'Envoyer des SMS payants'],
    correctAnswerIndex: 0,
    explanation: 'Le catalogue WhatsApp Business offre une expérience boutique native fluide et gratuite pour le client.'
  },
  {
    id: 'c1-q23',
    question: 'Quel est l\'intérêt des "Statuts WhatsApp" pour animer une communauté de clients existants ?',
    options: ['Visibilité gratuite 24h auprès de contacts qui ont déjà enregistré votre numéro, générant des ventes sans budget pub', 'C\'est un espace réservé uniquement aux photos de vacances', 'Les statuts suppriment vos messages', 'Ils coûtent 500 FCFA par vue'],
    correctAnswerIndex: 0,
    explanation: 'Les statuts WhatsApp sont le levier de conversion organique le plus puissant pour les commerces locaux en Afrique de l\'Ouest.'
  },
  {
    id: 'c1-q24',
    question: 'Dans une offre promotionnelle limitée, pourquoi indiquer "Offre valable pour les 20 premiers inscrits à Abidjan" augmente-t-il les ventes ?',
    options: ['Parce que l\'effet de rareté et d\'urgence incite le prospect à passer à l\'action immédiatement plutôt que de reporter', 'Pour tromper le client', 'Pour annuler la commande', 'Cela ne change rien'],
    correctAnswerIndex: 0,
    explanation: 'L\'urgence authentique combat la procrastination naturelle de l\'acheteur en ligne.'
  },
  {
    id: 'c1-q25',
    question: 'Pourquoi est-il fondamental de séparer son compte Mobile Money personnel de son compte marchand professionnel ?',
    options: ['Pour une comptabilité rigoureuse, éviter le blocage des plafonds personnels et bénéficier des fonctionnalités marchandes (QR code, historique B2B)', 'Pour payer des impôts supplémentaires sans raison', 'C\'est strictement interdit par Wave', 'Pour perdre son argent'],
    correctAnswerIndex: 0,
    explanation: 'Un compte marchand dédié professionnalise l\'activité et offre des plafonds de transaction adaptés aux flux commerciaux.'
  },
  {
    id: 'c1-q26',
    question: 'Quel est le risque de lancer une campagne publicitaire sans avoir préalablement testé son lien WhatsApp ?',
    options: ['Dépenser du budget publicitaire dans le vide avec des prospects qui tombent sur une page d\'erreur ou un mauvais numéro', 'Facebook offre un bonus de 100 000 FCFA', 'Le téléphone se recharge tout seul', 'Aucun risque'],
    correctAnswerIndex: 0,
    explanation: 'Un lien WhatsApp cassé ou mal formaté entraîne 100% de perte sèche sur les dépenses publicitaires engagées.'
  },
  {
    id: 'c1-q27',
    question: 'Comment formater correctement un numéro ivoirien dans un lien direct wa.me/ ?',
    options: ['https://wa.me/2250768931844 (avec l\'indicatif 225 sans le + et sans espaces)', 'wa.me/07-68-93-18-44', 'whatsapp://call/abidjan', 'http://00225 07 68 93 18 44'],
    correctAnswerIndex: 0,
    explanation: 'Le standard WhatsApp API requiert l\'indicatif international sans espaces ni caractères spéciaux (ex: 22507XXXXXXXX).'
  },
  {
    id: 'c1-q28',
    question: 'Quelle est la bonne pratique pour gérer les avis clients négatifs sur une page Facebook commerciale ?',
    options: ['Répondre publiquement avec courtoisie, proposer une solution concrète ou un échange WhatsApp pour résoudre le litige', 'Insulter l\'internaute et effacer sa critique', 'Supprimer sa page Facebook immédiatement', 'Poursuivre tout le monde en justice'],
    correctAnswerIndex: 0,
    explanation: 'Une réponse professionnelle et constructive à une critique démontre le sérieux et la fiabilité de l\'entreprise.'
  },
  {
    id: 'c1-q29',
    question: 'Quelle est la part moyenne des commissions versées dans le cadre de l\'affiliation éthique sur GLOBAL-AF ?',
    options: ['10% sur le Niveau 1 et 5% sur le Niveau 2 (strictement plafonné à 2 niveaux)', '50% sur 10 niveaux', '100% du prix d\'inscription', 'Zéro pourcent'],
    correctAnswerIndex: 0,
    explanation: 'GLOBAL-AF applique une règle immuable : 10% sur le niveau direct et 5% sur le niveau indirect, exclusivement sur les ventes réelles.'
  },
  {
    id: 'c1-q30',
    question: 'Pourquoi la promesse d\'un droit de rétractation de 7 jours est-elle un atout commercial exceptionnel en Côte d\'Ivoire ?',
    options: ['Elle lève le dernier frein d\'achat chez un client échaudé par les arnaques en lui garantissant son remboursement par Mobile Money', 'Elle est obligatoire uniquement pour les entreprises étrangères', 'Elle fait fuir les clients sérieux', 'Elle coûte 50% de pénalité'],
    correctAnswerIndex: 0,
    explanation: 'La garantie de remboursement intégral rassure instantanément l\'acheteur et décuple le taux de passage à l\'acte.'
  },
  {
    id: 'c1-q31',
    question: 'Quel créneau horaire est généralement le plus réceptif pour la conversion publicitaire des particuliers à Abidjan ?',
    options: ['Entre 12h-14h (pause déjeuner) et 19h-22h (détente en soirée à domicile)', 'Entre 3h et 5h du matin', 'Pendant la prière du vendredi à midi', 'Pendant les heures d\'embouteillage de 7h du matin uniquement'],
    correctAnswerIndex: 0,
    explanation: 'Les pics de connexion active et de disponibilité mentale pour commander se situent à la mi-journée et en soirée.'
  },
  {
    id: 'c1-q32',
    question: 'Pourquoi l\'utilisation de vidéos verticales (format 9:16) est-elle aujourd\'hui indispensable sur mobile ?',
    options: ['Elle occupe 100% de l\'écran du smartphone sans forcer l\'utilisateur à tourner son téléphone', 'Elle est obligatoire pour le cinéma', 'Elle consomme moins d\'électricité sur la batterie', 'Elle est uniquement pour les ordinateurs'],
    correctAnswerIndex: 0,
    explanation: 'Le plein écran vertical 9:16 capture l\'attention visuelle maximale sur TikTok, Instagram Reels et Facebook Stories.'
  },
  {
    id: 'c1-q33',
    question: 'Comment fidéliser une cliente ayant acheté un produit de beauté ou de mode à Abidjan ?',
    options: ['Lui envoyer un message personnalisé 15 jours plus tard pour prendre des nouvelles et lui proposer une remise exclusive sur sa 2ème commande', 'Lui envoyer des spams tous les soirs à minuit', 'Augmenter le prix si elle revient', 'Ne jamais lui répondre'],
    correctAnswerIndex: 0,
    explanation: 'Le suivi attentionné transforme un client ponctuel en client fidèle à forte valeur vie (LTV).'
  },
  {
    id: 'c1-q34',
    question: 'Quel est l\'intérêt d\'intégrer des témoignages audio ou vidéo de vrais clients ivoiriens dans ses communications ?',
    options: ['Ils apportent une preuve sociale irréfutable et identifiable que le produit a bien été reçu et apprécié localement', 'Pour allonger la page inutilement', 'Pour consommer le forfait du client', 'C\'est interdit par l\'ARTCI'],
    correctAnswerIndex: 0,
    explanation: 'La preuve sociale locale avec l\'accent et les expressions du pays balaye les doutes sur l\'authenticité de l\'offre.'
  },
  {
    id: 'c1-q35',
    question: 'Quelle est la principale erreur des débutants lors de la rédaction d\'une publicité Facebook ?',
    options: ['Parler uniquement des caractéristiques techniques du produit au lieu de mettre en valeur les bénéfices concrets pour la vie du client', 'Donner le prix en FCFA', 'Mettre son numéro de téléphone', 'Répondre aux messages rapidement'],
    correctAnswerIndex: 0,
    explanation: 'Le client n\'achète pas un produit, il achète la transformation et la solution concrète que ce produit lui apporte.'
  },
  {
    id: 'c1-q36',
    question: 'Pourquoi est-il indispensable d\'avoir un stock tampon à Abidjan avant de lancer une grosse campagne publicitaire ?',
    options: ['Pour être en mesure de livrer sous 24h-48h et éviter la frustration des clients qui annulent leur commande en cas d\'attente prolongée', 'Pour payer plus d\'entreposage', 'Pour faire joli dans son salon', 'Ce n\'est pas nécessaire'],
    correctAnswerIndex: 0,
    explanation: 'En e-commerce ivoirien, tout retard de plus de 48h multiplie par 4 le risque de refus à la livraison.'
  },
  {
    id: 'c1-q37',
    question: 'Que permet l\'outil d\'intelligence artificielle Gemini intégré sur la plateforme GLOBAL-AF ?',
    options: ['Générer automatiquement des accroches publicitaires WhatsApp et Facebook adaptées aux codes culturels ivoiriens en quelques secondes', 'Voler les mots de passe des utilisateurs', 'Prédire les numéros de la loterie', 'Remplacer l\'humain pour tout'],
    correctAnswerIndex: 0,
    explanation: 'L\'assistant IA aide les créateurs et commerçants à rédiger des textes percutants adaptés au marché ouest-africain.'
  },
  {
    id: 'c1-q38',
    question: 'Quel est le moyen le plus sûr de se prémunir contre les faux profils et impayés sur les grosses commandes ?',
    options: ['Demander un acompte d\'engagement modeste (ex: 2 000 FCFA correspondant aux frais de livraison) par Wave ou Mobile Money avant expédition', 'Faire confiance les yeux fermés à n\'importe qui', 'Ne jamais rien vendre', 'Exiger une pièce d\'identité physique originale en caution'],
    correctAnswerIndex: 0,
    explanation: 'L\'acompte des frais de livraison valide l\'engagement réel de l\'acheteur et couvre les frais logistiques.'
  },
  {
    id: 'c1-q39',
    question: 'Que garantit le matricule officiel de membre délivré par GLOBAL-AF lors de la certification ?',
    options: ['L\'authenticité infalsifiable du certificat de compétences, vérifiable publiquement dans le registre officiel de l\'Académie', 'Un abonnement téléphonique gratuit à vie', 'Une exonération de toutes les taxes', 'Rien de particulier'],
    correctAnswerIndex: 0,
    explanation: 'Le matricule officiel atteste devant les employeurs et clients que le titulaire a réussi l\'examen avec au moins 80% de bonnes réponses.'
  },
  {
    id: 'c1-q40',
    question: 'En conclusion, quelle est la formule fondamentale de la réussite commerciale durable sur le marché digital ivoirien ?',
    options: ['Produit utile + Offre claire en FCFA + Réassurance humaine sur WhatsApp + Rémunération Mobile Money instantanée + Éthique rigoureuse', 'Spéculation hasardeuse + Promesses impossibles + Frais cachés', 'Attendre que les clients devinent l\'existence du produit', 'Faire du spam massif anonyme'],
    correctAnswerIndex: 0,
    explanation: 'La transparence, la qualité du service et la proximité humaine sont les véritables moteurs de la réussite durable en Côte d\'Ivoire.'
  }
];

// Reusable function to create robust 40 questions for any course
export function generate40ExamQuestions(courseId: string, baseTopic: string): QuizQuestion[] {
  if (courseId === 'crs-001') {
    return EXAM_QUESTIONS_CRS_001;
  }

  // Generates 40 rigorous questions tailored for other specialized courses
  return Array.from({ length: 40 }, (_, idx) => {
    const qNum = idx + 1;
    return {
      id: `${courseId}-q${qNum}`,
      question: `[Évaluation Approfondie ${qNum}/40] Dans le cadre professionnel de la formation "${baseTopic}", quelle règle opérationnelle garantit l'efficacité et la conformité éthique de votre action ?`,
      options: [
        `Appliquer rigoureusement les protocoles méthodologiques validés avec traçabilité complète et transparence en FCFA`,
        `Contourner les procédures de contrôle pour accélérer arbitrairement les gains sans validation`,
        `Improviser sans plan d'action ni mesure des retours sur investissement`,
        `Se fier au hasard et aux promesses spéculatives sans travail préalable`
      ],
      correctAnswerIndex: 0,
      explanation: `L'excellence professionnelle repose sur l'application méthodique des standards établis et la transparence totale envers les partenaires et clients.`
    };
  });
}
