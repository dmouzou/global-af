export type UserRole = 
  | 'member' 
  | 'member_premium' 
  | 'moderator' 
  | 'support' 
  | 'financial_manager' 
  | 'content_manager' 
  | 'admin' 
  | 'super_admin';

export type UserLevel = 'Starter' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type AppView = 
  | 'landing' 
  | 'missions' 
  | 'academy' 
  | 'academie'
  | 'affiliation' 
  | 'transparence' 
  | 'tools' 
  | 'outils'
  | 'dashboard' 
  | 'admin'
  | 'partenaire'
  | 'cgu'
  | 'confidentialite'
  | 'cookies'
  | 'mentions';

export type CountryCode = 'CI' | 'SN' | 'CM' | 'BF';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  currency: string;
  phonePrefix: string;
  minWithdrawal: number;
  withdrawalFeePercent: number;
  operators: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: CountryCode;
  role: UserRole;
  isActivated: boolean;
  activationDate?: string;
  subscriptionPlan: 'free' | 'standard' | 'premium' | 'business';
  referralCode: string;
  referredBy?: string; // ID or code
  level: UserLevel;
  points: number;
  isEmailVerified: boolean;
  spendingLimitMonthly: number;
  spentThisMonth: number;
  /** Hausse de plafond demandée, effective après un délai de réflexion de 24 h. */
  pendingSpendingLimit?: { amount: number; effectiveAtMs: number };
  createdAt: string;
  city?: string;
  defaultPayoutOperator?: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money';
  bio?: string;
  memberNumber?: string;
}

export type TransactionType = 
  | 'reward' 
  | 'bonus' 
  | 'commission' 
  | 'withdrawal' 
  | 'activation_payment' 
  | 'subscription_payment' 
  | 'refund' 
  | 'adjustment';

export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface LedgerEntry {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  origin: string; // e.g. "Mission #104", "Affiliation Vente Formation Niveau 1"
  status: TransactionStatus;
  date: string;
  reference: string;
  operator?: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money';
  operatorReference?: string;
  notes?: string;
}

export interface Wallet {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  bonusBalance: number;
  commissionBalance: number;
  reservedBalance: number;
  points: number;
  currency: string;
}

export type TaskCategory = 
  | 'survey' 
  | 'app_test' 
  | 'social_visit' 
  | 'content_review' 
  | 'partner_campaign' 
  | 'quiz_challenge';

export type TaskStatus = 'draft' | 'published' | 'paused' | 'archived';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  description: string;
  instructions: string[];
  rewardAmount: number;
  currency: string;
  quotaMax: number;
  quotaCurrent: number;
  requiredLevel: UserLevel;
  countries: CountryCode[];
  isPremiumOnly: boolean;
  startDate: string;
  endDate: string;
  targetPlatform?: 'Web' | 'YouTube' | 'TikTok' | 'PlayStore' | 'Autre';
  targetUrl?: string;
  verificationType: 'automatic' | 'manual' | 'hybrid';
  status: TaskStatus;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  submittedAt: string;
  proofType: 'url' | 'text' | 'screenshot';
  proofContent: string;
  status: SubmissionStatus;
  feedback?: string;
  rewardAmount: number;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  durationMinutes: number;
  content: string;
  videoPlaceholderUrl?: string;
  keyTakeaways: string[];
  checkpointQuiz?: CourseQuiz;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseQuiz {
  id: string;
  courseId: string;
  title: string;
  passingScore: number;
  rewardPoints: number;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  category: 'Marketing Digital' | 'Intelligence Artificielle' | 'E-Commerce' | 'Entrepreneuriat' | 'Productivité' | 'Réseaux Sociaux';
  description: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  durationHours: number;
  isPremium: boolean;
  priceXOF?: number; // Real sale item generating ethical commission
  modules: CourseModule[];
  quiz?: CourseQuiz;
  finalQuiz?: CourseQuiz;
  enrolledUserIds: string[];
  completedUserIds: string[];
}

export interface VCFResource {
  id: string;
  title: string;
  country: CountryCode;
  sector: 'BTP & Construction' | 'Agrobusiness' | 'E-commerce & Retail' | 'Services Pro' | 'Mode & Beauté' | 'Restauration';
  description: string;
  entriesCount: number;
  verifiedDate: string;
  requiredPlan: 'free' | 'premium' | 'business';
  fileFormat: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  fees: number;
  netAmount: number;
  currency: string;
  operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money';
  operatorPhone: string;
  status: 'reserved' | 'approved' | 'payout_initiated' | 'paid' | 'reconciled' | 'rejected' | 'failed';
  requestedAt: string;
  processedAt?: string;
  transactionRef?: string;
  rejectReason?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorLevel: UserLevel;
  content: string;
  category: 'Conseils & Astuces' | 'Témoignage' | 'Question' | 'Annonce Officielle';
  createdAt: string;
  likes: number;
  commentsCount: number;
  isOfficial?: boolean;
  reportsCount: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Paiement Mobile Money' | 'Validation de Mission' | 'Retrait' | 'Rétractation / Remboursement' | 'Compte & Profil' | 'Autre';
  priority: 'Basse' | 'Moyenne' | 'Haute';
  message: string;
  status: 'nouveau' | 'en_cours' | 'en_attente' | 'resolu' | 'ferme';
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    sender: 'user' | 'support';
    senderName: string;
    message: string;
    timestamp: string;
  }>;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reward' | 'commission' | 'withdrawal' | 'mission' | 'system' | 'security';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
  complianceRule?: string; // e.g. "Règle Éthique: Ventes réelles"
}

export interface RiskAlert {
  id: string;
  timestamp: string;
  userId: string;
  type: 'multi_account_suspected' | 'rapid_withdrawal_pattern' | 'self_referral_attempt' | 'submission_automation';
  severity: 'low' | 'medium' | 'high';
  details: string;
  resolved: boolean;
}

export interface EthicalIndicators {
  medianMonthlyIncomeXOF: number;
  percentUnwithdrawnMembers: number;
  averageDaysToFirstPayout: number;
  totalWithdrawnXOF: number;
  activeMembersCount: number;
  lastUpdated: string;
}

export interface PartnerApplication {
  id: string;
  companyName: string;
  rccm: string;
  sector: string;
  contactName: string;
  contactRole: string;
  phone: string;
  email: string;
  city: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  submittedAt?: string;
  reviewedAt?: string;
}

/** Commission d'affiliation du membre (lue dans Firestore : commissions/{id}). */
export interface AffiliationCommission {
  id: string;
  level: 1 | 2;
  amount: number;
  /** pending_retraction : en attente de la fin du délai de rétractation. */
  status: 'pending_retraction' | 'credited' | 'cancelled_retraction';
  date: string;
  matureAt: string;
}
