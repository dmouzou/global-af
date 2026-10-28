import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  CountryConfig,
  EthicalIndicators,
  Task,
  TaskSubmission,
  Course,
  VCFResource,
  LedgerEntry,
  WithdrawalRequest,
  CommunityPost,
  SupportTicket,
  NotificationItem,
  AuditLogItem,
  RiskAlert,
  Wallet,
  CountryCode,
  UserRole
} from '../types';
import {
  COUNTRIES_CONFIG,
  INITIAL_TASKS,
  INITIAL_COURSES,
  INITIAL_VCF_RESOURCES
} from '../data/initialData';
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import {
  auth,
  db,
  registerUserCallable,
  requestWithdrawalCallable,
  initiateMobileMoneyPaymentCallable,
  requestPaymentRetractionCallable,
  adminProcessWithdrawalCallable,
  updateMyProfileCallable,
  setSpendingLimitCallable,
  RegisterUserInput
} from '../lib/firebase';

type OperatorLabel = 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money';
type ServerOperator = 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money';
type ActionResult = { success: boolean; message: string };

const FINANCE_ROLES: UserRole[] = ['financial_manager', 'admin', 'super_admin'];

interface AppContextType {
  currentUser: User | null;
  isLoadingAuth: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (input: RegisterUserInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resendEmailVerification: () => Promise<ActionResult>;
  /** Recharge l'état de vérification (après clic sur le lien reçu par e-mail). */
  refreshEmailVerification: () => Promise<boolean>;
  updateProfile: (updatedData: Partial<Pick<User, 'firstName' | 'lastName' | 'city' | 'bio' | 'defaultPayoutOperator'>>) => Promise<ActionResult>;
  selectedCountry: CountryConfig;
  setCountryCode: (code: CountryCode) => void;
  
  // Wallet & Ledger
  wallet: Wallet;
  ledger: LedgerEntry[];
  withdrawals: WithdrawalRequest[];
  /** Tous les retraits (réservé à la finance : back-office). */
  adminWithdrawals: WithdrawalRequest[];
  requestWithdrawal: (
    operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money', 
    phone: string, 
    amount: number
  ) => Promise<{ success: boolean; message: string }>;
  processWithdrawalAdmin: (
    withdrawalId: string, 
    action: 'approve' | 'payout_initiated' | 'paid' | 'failed' | 'reject' | 'reconcile',
    reasonOrReference?: string
  ) => Promise<ActionResult>;
  activateAccountWithMobileMoney: (
    plan: 'standard' | 'premium' | 'business', 
    operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money', 
    phone: string
  ) => Promise<{ success: boolean; message: string; checkoutUrl?: string }>;
  requestRetractionRefund: (reason: string) => Promise<{ success: boolean; message: string }>;
  updateMonthlySpendingLimit: (amount: number) => Promise<ActionResult>;

  // Tasks & Micro-jobs
  tasks: Task[];
  submissions: TaskSubmission[];
  submitTaskProof: (taskId: string, proofType: 'url' | 'text' | 'screenshot', content: string) => ActionResult;
  reviewSubmissionAdmin: (submissionId: string, status: 'approved' | 'rejected', feedback?: string) => ActionResult;
  createTaskAdmin: (newTask: Omit<Task, 'id' | 'quotaCurrent'>) => ActionResult;

  // Academy & Quiz
  courses: Course[];
  userCertificates: Array<{ courseId: string; courseTitle: string; issueDate: string; score: number }>;
  enrollInCourse: (courseId: string) => void;
  submitCourseQuiz: (courseId: string, userAnswers: Record<string, number>) => { passed: boolean; score: number; pointsEarned: number };

  // AI Tools
  runAITool: (toolType: 'copywriter' | 'marketing_ideas' | 'summarizer' | 'prompts', input: string, tone?: string) => Promise<string>;
  isAILoading: boolean;

  // VCF Resources
  vcfResources: VCFResource[];
  downloadVCFResource: (resourceId: string) => ActionResult;

  // Community
  posts: CommunityPost[];
  createPost: (content: string, category: CommunityPost['category']) => ActionResult;
  likePost: (postId: string) => ActionResult;
  reportPost: (postId: string) => ActionResult;

  // Support
  tickets: SupportTicket[];
  createTicket: (subject: string, category: SupportTicket['category'], priority: SupportTicket['priority'], message: string) => ActionResult;
  replyTicket: (ticketId: string, message: string) => ActionResult;
  resolveTicketAdmin: (ticketId: string) => ActionResult;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Audit & Ethics & Risk
  auditLogs: AuditLogItem[];
  riskAlerts: RiskAlert[];
  /** null tant qu'aucun indicateur réel n'est calculé (condition 3). */
  ethicalIndicators: EthicalIndicators | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const OPERATOR_MAP: Record<OperatorLabel, ServerOperator> = {
  'Wave': 'wave',
  'Orange Money': 'orange_money',
  'MTN MoMo': 'mtn_momo',
  'Moov Money': 'moov_money',
};
const OPERATOR_LABEL: Record<string, OperatorLabel> = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  mtn_momo: 'MTN MoMo',
  moov_money: 'Moov Money',
};

const NOT_AVAILABLE = (what: string): ActionResult => ({
  success: false,
  message: `${what} n'est pas encore disponible. Aucune donnée n'a été enregistrée.`
});

/** Date lisible AAAA-MM-JJ HH:mm depuis un Timestamp Firestore. */
const fmtDate = (v: unknown): string => {
  const t = v as { toDate?: () => Date } | null | undefined;
  const d = t && typeof t.toDate === 'function' ? t.toDate() : null;
  return d ? d.toISOString().replace('T', ' ').slice(0, 16) : '';
};

/** Message d'erreur lisible d'une Cloud Function (messages métier en français). */
const fnError = (err: unknown, fallback: string): string => {
  const e = err as { message?: string; code?: string };
  if (e?.code === 'functions/unauthenticated') return 'Connexion requise.';
  if (e?.code === 'functions/resource-exhausted') return 'Trop de demandes. Réessayez plus tard.';
  if (e?.message && e.message !== 'internal' && e.message !== 'INTERNAL') return e.message;
  return fallback;
};

/**
 * Document ledger serveur → ligne du grand livre.
 * Phases des retraits : reserve (demande), rejected/failed (libération du
 * montant = remboursement), paid (versement).
 */
const mapLedger = (id: string, d: any): LedgerEntry => {
  const phase: string = d.phase ?? '';
  const released = d.type === 'withdrawal' && (phase === 'rejected' || phase === 'failed');
  return {
    id,
    userId: d.userId,
    amount: Number(d.posting?.amount ?? 0),
    currency: d.currency || 'XOF',
    type: released ? 'refund' : d.type,
    origin: released ? `Retrait non abouti — montant rendu à votre solde (${phase === 'failed' ? 'échec' : 'rejet'})` : (d.origin || ''),
    status: d.type === 'withdrawal' && phase === 'reserve' ? 'pending' : 'completed',
    date: fmtDate(d.createdAt),
    reference: id,
    operatorReference: d.meta?.providerReference || undefined,
  };
};

const mapWithdrawal = (id: string, d: any, userName: string): WithdrawalRequest => ({
  id,
  userId: d.userId,
  userName,
  userPhone: d.payoutPhone || '',
  amount: Number(d.amount ?? 0),
  fees: Number(d.fee ?? 0),
  netAmount: Number(d.net ?? 0),
  currency: d.currency || 'XOF',
  operator: OPERATOR_LABEL[d.operator] || 'Wave',
  operatorPhone: d.payoutPhone || '',
  status: d.status,
  requestedAt: fmtDate(d.requestedAt),
  processedAt: d.processedAt ? fmtDate(d.processedAt) : undefined,
  transactionRef: d.providerReference || undefined,
  rejectReason: d.rejectReason || undefined,
});

const mapNotification = (id: string, d: any): NotificationItem => ({
  id,
  userId: d.userId,
  title: d.title || '',
  message: d.message || '',
  type: d.type || 'system',
  timestamp: fmtDate(d.createdAt),
  read: Boolean(d.read),
  link: d.link,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Firebase Auth & Live Profile State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [firestoreBalances, setFirestoreBalances] = useState<{
    available: number;
    pending: number;
    reserved: number;
    currency: string;
  } | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>('CI');
  const selectedCountry = COUNTRIES_CONFIG[selectedCountryCode] || COUNTRIES_CONFIG.CI;

  // Données personnelles : lues UNIQUEMENT depuis Firestore pour l'utilisateur connecté.
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [adminWithdrawals, setAdminWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Catalogues non personnels (démonstration, en attente des modules serveur).
  const [tasks] = useState<Task[]>(INITIAL_TASKS);
  const [courses, setCourses] = useState<Course[]>(
    INITIAL_COURSES.map(c => ({ ...c, enrolledUserIds: [] }))
  );
  const [vcfResources] = useState<VCFResource[]>(INITIAL_VCF_RESOURCES);

  // Modules sans stockage serveur : aucune donnée n'est inventée ni simulée.
  const submissions: TaskSubmission[] = [];
  const posts: CommunityPost[] = [];
  const tickets: SupportTicket[] = [];
  const auditLogs: AuditLogItem[] = [];
  const riskAlerts: RiskAlert[] = [];
  const userCertificates: Array<{ courseId: string; courseTitle: string; issueDate: string; score: number }> = [];
  const ethicalIndicators: EthicalIndicators | null = null;
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  const authGeneration = useRef(0);

  // Écoute temps réel : un seul abonnement par session, TOUS résiliés à chaque
  // changement d'utilisateur (sinon le profil d'un ancien compte pourrait
  // réapparaître après une reconnexion).
  useEffect(() => {
    let unsubs: Array<() => void> = [];
    const clearListeners = () => {
      unsubs.forEach(u => u());
      unsubs = [];
    };
    const resetPersonalState = () => {
      setCurrentUser(null);
      setFirestoreBalances(null);
      setLedger([]);
      setWithdrawals([]);
      setAdminWithdrawals([]);
      setNotifications([]);
      setCourses(INITIAL_COURSES.map(c => ({ ...c, enrolledUserIds: [] })));
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      const generation = ++authGeneration.current;
      clearListeners();
      resetPersonalState();

      if (!firebaseUser) {
        setIsLoadingAuth(false);
        return;
      }

      const token = await firebaseUser.getIdTokenResult();
      if (generation !== authGeneration.current) return; // utilisateur changé entre-temps
      const claimRole = (token.claims.role as UserRole | undefined) || 'member';
      const uid = firebaseUser.uid;

      unsubs.push(onSnapshot(doc(db, 'users', uid), (snap) => {
        if (generation !== authGeneration.current) return;
        if (!snap.exists()) {
          // Profil serveur pas encore créé : aucun espace n'est affiché.
          setCurrentUser(null);
          setIsLoadingAuth(false);
          return;
        }
        const d = snap.data();
        const created = d.createdAt && typeof d.createdAt.toDate === 'function'
          ? d.createdAt.toDate().toLocaleDateString('fr-FR')
          : '';
        const pending = d.pendingSpendingLimit as { amount: number; effectiveAtMs: number } | null | undefined;
        setCurrentUser({
          id: uid,
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: firebaseUser.email || d.email || '',
          phone: d.phone || '',
          country: (d.country as CountryCode) || 'CI',
          // Le rôle de référence est le claim signé, pas le document.
          role: claimRole,
          isActivated: Boolean(d.isActivated || d.activatedAt),
          activationDate: d.activationDate ? String(d.activationDate).slice(0, 10) : undefined,
          subscriptionPlan: d.subscriptionPlan || 'free',
          referralCode: d.referralCode || '',
          referredBy: d.referredBy || d.referredByUid,
          level: d.level || 'Starter',
          points: Number(d.points ?? 0),
          isEmailVerified: Boolean(firebaseUser.emailVerified),
          spendingLimitMonthly: Number(d.spendingLimitMonthly ?? 50000),
          pendingSpendingLimit: pending ?? undefined,
          spentThisMonth: d.spentMonth === new Date().toISOString().slice(0, 7) ? Number(d.spentThisMonth ?? 0) : 0,
          createdAt: created,
          city: d.city || '',
          defaultPayoutOperator: d.defaultPayoutOperator ? (OPERATOR_LABEL[d.defaultPayoutOperator] || d.defaultPayoutOperator) : undefined,
          bio: d.bio || '',
          memberNumber: d.memberNumber || undefined
        });
        if (d.country && COUNTRIES_CONFIG[d.country as CountryCode]) {
          setSelectedCountryCode(d.country as CountryCode);
        }
        setIsLoadingAuth(false);
      }, (error) => {
        console.warn('Lecture du profil refusée:', error.code);
        setIsLoadingAuth(false);
      }));

      unsubs.push(onSnapshot(doc(db, 'wallets', uid), (snap) => {
        if (generation !== authGeneration.current) return;
        if (snap.exists()) {
          const w = snap.data();
          setFirestoreBalances({
            available: w.available ?? 0,
            pending: w.pending ?? 0,
            reserved: w.reserved ?? 0,
            currency: w.currency || 'XOF'
          });
        } else {
          setFirestoreBalances({ available: 0, pending: 0, reserved: 0, currency: 'XOF' });
        }
      }, (err) => console.warn('Lecture du wallet refusée:', err.code)));

      unsubs.push(onSnapshot(
        query(collection(db, 'ledger'), where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(200)),
        (snap) => {
          if (generation !== authGeneration.current) return;
          setLedger(snap.docs.map(x => mapLedger(x.id, x.data())));
        },
        (err) => console.warn('Lecture du ledger refusée:', err.code)
      ));

      unsubs.push(onSnapshot(
        query(collection(db, 'withdrawals'), where('userId', '==', uid), orderBy('requestedAt', 'desc'), limit(100)),
        (snap) => {
          if (generation !== authGeneration.current) return;
          setWithdrawals(snap.docs.map(x => mapWithdrawal(x.id, x.data(), '')));
        },
        (err) => console.warn('Lecture des retraits refusée:', err.code)
      ));

      unsubs.push(onSnapshot(
        query(collection(db, 'notifications'), where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(100)),
        (snap) => {
          if (generation !== authGeneration.current) return;
          setNotifications(snap.docs.map(x => mapNotification(x.id, x.data())));
        },
        (err) => console.warn('Lecture des notifications refusée:', err.code)
      ));

      if (FINANCE_ROLES.includes(claimRole)) {
        unsubs.push(onSnapshot(
          query(collection(db, 'withdrawals'), orderBy('requestedAt', 'desc'), limit(200)),
          (snap) => {
            if (generation !== authGeneration.current) return;
            setAdminWithdrawals(snap.docs.map(x => mapWithdrawal(x.id, x.data(), `Membre …${String(x.data().userId).slice(-6)}`)));
          },
          (err) => console.warn('Lecture admin des retraits refusée:', err.code)
        ));
      }
    });

    return () => {
      clearListeners();
      unsubscribeAuth();
    };
  }, []);

  // Auth actions
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return { success: true };
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Adresse e-mail ou mot de passe incorrect.'
        : (err.message || 'Échec de connexion.');
      return { success: false, error: msg };
    }
  };

  const signup = async (input: RegisterUserInput): Promise<{ success: boolean; error?: string }> => {
    try {
      await registerUserCallable(input);
      if (input.password) {
        const cred = await signInWithEmailAndPassword(auth, input.email.trim(), input.password);
        // Sans cet envoi, personne ne recevrait jamais le lien de confirmation,
        // et les retraits/paiements (e-mail vérifié exigé) resteraient bloqués.
        try { await sendEmailVerification(cred.user); } catch (e) { console.warn('Envoi du lien de confirmation impossible:', e); }
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: fnError(err, 'Échec de création du compte.') };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth); // l'écouteur d'authentification vide toutes les données
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const resendEmailVerification = async (): Promise<ActionResult> => {
    const u = auth.currentUser;
    if (!u) return { success: false, message: 'Connexion requise.' };
    try {
      await sendEmailVerification(u);
      return { success: true, message: `Un e-mail de confirmation vient d'être envoyé à ${u.email}.` };
    } catch (err: any) {
      return {
        success: false,
        message: err?.code === 'auth/too-many-requests'
          ? 'Trop de demandes. Réessayez dans quelques minutes.'
          : "L'e-mail n'a pas pu être envoyé. Réessayez."
      };
    }
  };

  const refreshEmailVerification = async (): Promise<boolean> => {
    const u = auth.currentUser;
    if (!u) return false;
    await u.reload();
    await u.getIdToken(true); // le jeton porte email_verified, exigé côté serveur
    setCurrentUser(prev => prev ? { ...prev, isEmailVerified: u.emailVerified } : prev);
    return u.emailVerified;
  };

  // Solde : valeurs du serveur uniquement (jamais recalculées dans le navigateur).
  const wallet: Wallet = {
    userId: currentUser?.id || '',
    availableBalance: firestoreBalances?.available ?? 0,
    pendingBalance: firestoreBalances?.pending ?? 0,
    bonusBalance: ledger.filter(l => l.type === 'bonus' && l.status === 'completed').reduce((a, l) => a + l.amount, 0),
    commissionBalance: ledger.filter(l => l.type === 'commission' && l.status === 'completed').reduce((a, l) => a + l.amount, 0),
    reservedBalance: firestoreBalances?.reserved ?? 0,
    points: currentUser?.points || 0,
    currency: selectedCountry.currency
  };

  const updateProfile: AppContextType['updateProfile'] = async (updatedData) => {
    if (!currentUser) return { success: false, message: 'Connexion requise.' };
    try {
      await updateMyProfileCallable({
        ...updatedData,
        defaultPayoutOperator: updatedData.defaultPayoutOperator
          ? OPERATOR_MAP[updatedData.defaultPayoutOperator]
          : undefined
      });
      return { success: true, message: 'Profil mis à jour.' };
    } catch (err) {
      return { success: false, message: fnError(err, 'La mise à jour du profil a échoué.') };
    }
  };

  // Le pays d'un compte est fixé à l'inscription ; ce réglage ne change que l'affichage.
  const setCountryCode = (code: CountryCode) => {
    setSelectedCountryCode(code);
  };

  // Retrait : toute la logique (solde, minimum, frais, réservation) est côté serveur.
  const requestWithdrawal = async (
    operator: OperatorLabel,
    _phone: string,
    amount: number
  ): Promise<ActionResult> => {
    if (!currentUser) return { success: false, message: 'Connexion requise pour effectuer un retrait.' };
    if (!currentUser.isEmailVerified) {
      return { success: false, message: 'Confirmez votre adresse e-mail avant de demander un retrait.' };
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      return { success: false, message: 'Montant invalide.' };
    }
    try {
      // Un identifiant unique par ouverture du formulaire rend l'appel idempotent.
      const res = await requestWithdrawalCallable({
        amount,
        operator: OPERATOR_MAP[operator] || 'wave',
        requestId: `wd_${currentUser.id.slice(0, 8)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      });
      return {
        success: true,
        message: res.data.duplicate
          ? 'Cette demande a déjà été enregistrée.'
          : `Votre demande de retrait de ${amount.toLocaleString('fr-FR')} ${selectedCountry.currency} vers ${operator} est enregistrée. Elle sera contrôlée avant paiement, sur le numéro Mobile Money de votre inscription.`
      };
    } catch (err) {
      return { success: false, message: fnError(err, 'Erreur lors de la demande de retrait.') };
    }
  };

  // Traitement finance : aucune mise à jour locale, l'écoute Firestore reflète l'état réel.
  const processWithdrawalAdmin: AppContextType['processWithdrawalAdmin'] = async (withdrawalId, action, reasonOrReference) => {
    if (!currentUser || !FINANCE_ROLES.includes(currentUser.role)) {
      return { success: false, message: 'Action non autorisée.' };
    }
    const serverAction = ({
      approve: 'approve',
      payout_initiated: 'mark_payout_initiated',
      paid: 'confirm_paid',
      failed: 'mark_failed',
      reject: 'reject',
      reconcile: 'reconcile'
    } as const)[action];
    try {
      await adminProcessWithdrawalCallable({
        withdrawalId,
        action: serverAction,
        reason: action === 'reject' || action === 'failed' ? reasonOrReference : undefined,
        providerReference: action === 'paid' ? reasonOrReference : undefined
      });
      return { success: true, message: 'Statut du retrait mis à jour.' };
    } catch (err) {
      return { success: false, message: fnError(err, 'Le traitement du retrait a échoué.') };
    }
  };

  // Activation : le compte n'est activé QUE par la confirmation du prestataire (webhook).
  const activateAccountWithMobileMoney = async (
    plan: 'standard' | 'premium' | 'business',
    operator: OperatorLabel,
    phone: string
  ): Promise<{ success: boolean; message: string; checkoutUrl?: string }> => {
    if (!currentUser) return { success: false, message: 'Veuillez vous connecter pour activer un pack.' };
    try {
      // Le prix est fixé par le serveur : seul l'identifiant du pack est envoyé.
      const res = await initiateMobileMoneyPaymentCallable({
        operator: OPERATOR_MAP[operator] || 'wave',
        productId: plan,
        phone
      });
      return {
        success: true,
        message: res.data.instructions || 'Paiement initié. Votre compte sera activé dès la confirmation de l\'opérateur.',
        checkoutUrl: res.data.checkoutUrl
      };
    } catch (err) {
      return { success: false, message: fnError(err, "Erreur lors de l'initiation du paiement Mobile Money.") };
    }
  };

  const requestRetractionRefund = async (reason: string): Promise<ActionResult> => {
    if (!currentUser || !currentUser.isActivated || currentUser.subscriptionPlan === 'free') {
      return { success: false, message: "Vous n'avez aucun abonnement payant actif éligible au remboursement." };
    }
    try {
      const res = await requestPaymentRetractionCallable({ reason });
      return { success: res.data.success, message: res.data.message };
    } catch (err) {
      return { success: false, message: fnError(err, 'La demande de rétractation a échoué.') };
    }
  };

  // Plafond : le serveur applique une baisse immédiatement et une hausse après 24 h.
  const updateMonthlySpendingLimit = async (amount: number): Promise<ActionResult> => {
    if (!currentUser) return { success: false, message: 'Connexion requise.' };
    try {
      const res = await setSpendingLimitCallable({ limit: amount });
      return {
        success: true,
        message: res.data.pendingSpendingLimit
          ? 'Hausse enregistrée : elle prendra effet dans 24 h (délai de réflexion).'
          : 'Plafond de dépense mensuel mis à jour.'
      };
    } catch (err) {
      return { success: false, message: fnError(err, 'Le plafond n\'a pas pu être modifié.') };
    }
  };

  // ---- Modules sans serveur : aucune récompense, aucun point, aucun message simulé ----
  const submitTaskProof = (_taskId: string, _proofType: 'url' | 'text' | 'screenshot', _content: string): ActionResult =>
    NOT_AVAILABLE("L'envoi de missions rémunérées");
  const reviewSubmissionAdmin = (): ActionResult => NOT_AVAILABLE('La validation des missions');
  const createTaskAdmin = (): ActionResult => NOT_AVAILABLE('La création de missions');

  const enrollInCourse = (courseId: string) => {
    if (!currentUser) return;
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId || c.enrolledUserIds.includes(currentUser.id)) return c;
      return { ...c, enrolledUserIds: [...c.enrolledUserIds, currentUser.id] };
    }));
  };

  // Correction pédagogique seulement : ni points, ni certificat tant que le serveur ne les délivre pas.
  const submitCourseQuiz = (courseId: string, userAnswers: Record<string, number>) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.quiz || !currentUser) return { passed: false, score: 0, pointsEarned: 0 };
    let correctCount = 0;
    course.quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) correctCount++;
    });
    const score = Math.round((correctCount / course.quiz.questions.length) * 100);
    return { passed: score >= course.quiz.passingScore, score, pointsEarned: 0 };
  };

  const downloadVCFResource = (resourceId: string): ActionResult => {
    if (!currentUser) return { success: false, message: 'Connexion requise pour télécharger les ressources VCF.' };
    const res = vcfResources.find(r => r.id === resourceId);
    if (!res) return { success: false, message: 'Ressource introuvable.' };
    if (res.requiredPlan === 'premium' && currentUser.subscriptionPlan === 'free') {
      return { success: false, message: 'Cette ressource nécessite un compte Premium actif.' };
    }
    return NOT_AVAILABLE('Le téléchargement des ressources VCF (droits d\'usage à valider)');
  };

  const createPost = (): ActionResult => NOT_AVAILABLE('La communauté');
  const likePost = (): ActionResult => NOT_AVAILABLE('La communauté');
  const reportPost = (): ActionResult => NOT_AVAILABLE('Le signalement de publications');
  const createTicket = (): ActionResult => NOT_AVAILABLE('Le support par tickets');
  const replyTicket = (): ActionResult => NOT_AVAILABLE('Le support par tickets');
  const resolveTicketAdmin = (): ActionResult => NOT_AVAILABLE('Le support par tickets');

  // Notifications : le titulaire ne peut modifier que le champ « read » (règles Firestore).
  const markNotificationAsRead = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.read) return;
    const batch = writeBatch(db);
    batch.update(doc(db, 'notifications', id), { read: true });
    try { await batch.commit(); } catch (e) { console.warn('Notification non marquée lue:', e); }
  };

  const markAllNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.read).slice(0, 400);
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach(n => batch.update(doc(db, 'notifications', n.id), { read: true }));
    try { await batch.commit(); } catch (e) { console.warn('Notifications non marquées lues:', e); }
  };

  // Outils IA : modèles de texte locaux. Aucun appel direct à une API d'IA depuis le
  // navigateur (une clé embarquée dans le bundle serait publique).
  const runAITool = async (
    toolType: 'copywriter' | 'marketing_ideas' | 'summarizer' | 'prompts',
    input: string,
    _tone: string = 'professionnel et engageant'
  ): Promise<string> => {
    setIsAILoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsAILoading(false);

    if (toolType === 'copywriter') {
      return `✨ **Proposition Rédactionnelle Optimisée (Marché Ivoirien & UEMOA)**\n\n` +
        `🚀 **Accroche percutante :**\n` +
        `« Vous cherchez une solution fiable pour ${input.trim()} sans vous compliquer la vie ? »\n\n` +
        `💡 **Le bénéfice concret :**\n` +
        `Dans notre quotidien à Abidjan et partout en Côte d'Ivoire, la rapidité et la confiance font toute la différence. Plus besoin d'attendre des jours pour obtenir un résultat concret : tout est pensé pour être accessible directement depuis votre smartphone.\n\n` +
        `📲 **Comment en profiter dès aujourd'hui :**\n` +
        `1. Cliquez sur le lien direct WhatsApp ci-dessous.\n` +
        `2. Obtenez votre confirmation instantanée.\n` +
        `3. Règlement sécurisé via Wave ou Orange Money.\n\n` +
        `👉 *Contactez notre équipe dès maintenant pour réserver votre session !*`;
    }

    if (toolType === 'marketing_ideas') {
      return `📊 **Plan de 5 Actions Marketing à Fort Impact pour : "${input}"**\n\n` +
        `1. **Stratégie WhatsApp Status & Catalogue Pro :**\n` +
        `Diffusez 3 stories courtes par jour montrant les coulisses de votre service et l'avis d'un client satisfait à Cocody ou Marcory avec paiement Wave direct.\n\n` +
        `2. **Partenariat Micro-Influence Local :**\n` +
        `Identifiez 2 créateurs de contenu émergents sur TikTok à Abidjan axés sur l'authenticité plutôt que sur les gros volumes de followers factices.\n\n` +
        `3. **Offre Spéciale "Premier Pas" sans risque :**\n` +
        `Proposez une démonstration ou un échantillon avec garantie satisfait ou remboursé sous 7 jours pour lever tout frein psychologique.\n\n` +
        `4. **Missions Communautaires Éthiques sur GLOBAL-AF :**\n` +
        `Publiez un micro-job de test ergonomique pour recueillir 50 retours qualifiés d'utilisateurs réels.\n\n` +
        `5. **Paiement Mobile Money Simplifié :**\n` +
        `Affichez un QR Code Wave et un numéro MTN MoMo dès la première page de contact pour diviser par deux l'abandon de panier.`;
    }

    if (toolType === 'summarizer') {
      return `📋 **Synthèse Exécutive en 4 Points Clés :**\n\n` +
        `• **Constat initial :** L'analyse met en avant le besoin de clarté opérationnelle concernant "${input.slice(0, 80)}...".\n` +
        `• **Opportunité identifiée :** Simplification des démarches et adoption massive des outils numériques mobiles en Afrique de l'Ouest.\n` +
        `• **Facteur de succès :** Transparence totale sur les coûts et conformité éthique avec les directives de protection des consommateurs.\n` +
        `• **Recommandation immédiate :** Lancement progressif avec validation terrain et encaissement sécurisé par Mobile Money.`;
    }

    return `🎯 **3 Prompts Optimisés pour votre Assistant Numérique :**\n\n` +
      `**Prompt 1 (Expertise Métier) :**\n` +
      `« Agis comme un directeur marketing senior spécialisé dans le marché ouest-africain. Élabore une feuille de route détaillée sur 30 jours pour "${input}", en tenant compte des spécificités d'Abidjan. »\n\n` +
      `**Prompt 2 (Conversion & Ventes Réelles) :**\n` +
      `« Rédige une page de vente en 5 étapes pour "${input}", axée sur la transparence des prix en Francs CFA (XOF) et un appel à l'action WhatsApp clair. »\n\n` +
      `**Prompt 3 (Automatisation & Productivité) :**\n` +
      `« Crée un tableau comparatif sous forme de matrice reprenant les forces, faiblesses, opportunités et coûts estimés pour déployer "${input}". »`;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isLoadingAuth,
      login,
      signup,
      logout,
      resendEmailVerification,
      refreshEmailVerification,
      updateProfile,
      selectedCountry,
      setCountryCode,
      wallet,
      ledger,
      withdrawals,
      adminWithdrawals,
      requestWithdrawal,
      processWithdrawalAdmin,
      activateAccountWithMobileMoney,
      requestRetractionRefund,
      updateMonthlySpendingLimit,
      tasks,
      submissions,
      submitTaskProof,
      reviewSubmissionAdmin,
      createTaskAdmin,
      courses,
      userCertificates,
      enrollInCourse,
      submitCourseQuiz,
      runAITool,
      isAILoading,
      vcfResources,
      downloadVCFResource,
      posts,
      createPost,
      likePost,
      reportPost,
      tickets,
      createTicket,
      replyTicket,
      resolveTicketAdmin,
      notifications,
      markNotificationAsRead,
      markAllNotificationsRead,
      auditLogs,
      riskAlerts,
      ethicalIndicators
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
