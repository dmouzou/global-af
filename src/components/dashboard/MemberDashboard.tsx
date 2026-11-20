import { POLICY } from '../../lib/policy';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardShell, NavItem } from './DashboardShell';
import { Banners } from './Banners';
import { Btn } from './ui';
import { OverviewTab } from './tabs/OverviewTab';
import { TasksTab } from './tabs/TasksTab';
import { WalletTab } from './tabs/WalletTab';
import { WithdrawalsTab } from './tabs/WithdrawalsTab';
import { WithdrawalModal } from './modals/WithdrawalModal';
import { ActivationModal } from './modals/ActivationModal';
import { TaskProofModal } from './modals/TaskProofModal';
import { BabiVector } from '../brand/BabiVector';
import { 
  LayoutDashboard, 
  User as UserIcon,
  Briefcase, 
  Wallet as WalletIcon, 
  Users, 
  BookOpen, 
  Sparkles, 
  FolderDown, 
  ArrowUpRight, 
  MessageSquare, 
  LifeBuoy, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  Download,
  RotateCcw,
  Smartphone,
  Award,
  Bell,
  Gift,
  QrCode,
  MapPin,
  Check,
  CreditCard,
  Edit3,
  Lock,
  Mail,
  Key,
  Zap,
  Menu,
  X,
  Globe,
  LogOut
} from 'lucide-react';
import { Task, Course, VCFResource, TaskCategory } from '../../types';
import { OperatorLogo } from '../common/OperatorLogo';
import { BabiMascot } from '../common/BabiMascot';
import { BrandLogo } from '../common/BrandLogo';

interface MemberDashboardProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigatePublic?: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onOpenAuth, onNavigatePublic }) => {
  const { 
    currentUser, 
    logout,
    updateProfile,
    selectedCountry, 
    wallet, 
    ledger, 
    withdrawals, 
    requestWithdrawal, 
    startActivationPayment,
    requestRetractionRefund,
    updateMonthlySpendingLimit,
    tasks, 
    submissions, 
    submitTaskProof,
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
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    resendEmailVerification,
    refreshEmailVerification,
    affiliation,
    refreshAffiliation
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'tasks' | 'wallet' | 'withdrawals' | 'team' | 'academy' | 'ai_tools' | 'vcf' | 'bonus' | 'notifications' | 'community' | 'support' | 'settings'
  >('overview');

  // Task selection & submission modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Withdrawal modal state
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);


  // Activation modal state (Standard: 3 000 FCFA single, VIP Premium: 9 900 FCFA/m)
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [activationPlan, setActivationPlan] = useState<'standard' | 'premium'>('standard');

  // Profile Edit State
  const [editFirstName, setEditFirstName] = useState(currentUser?.firstName || '');
  const [editLastName, setEditLastName] = useState(currentUser?.lastName || '');
  const [editCity, setEditCity] = useState(currentUser?.city || '');
  const [editDefaultOperator, setEditDefaultOperator] = useState<'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money'>(currentUser?.defaultPayoutOperator || 'Orange Money');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);

  // Sync state if currentUser loads from Firebase Auth
  useEffect(() => {
    if (currentUser) {
      setEditFirstName(currentUser.firstName);
      setEditLastName(currentUser.lastName);
      setEditCity(currentUser.city || '');
      setEditDefaultOperator(currentUser.defaultPayoutOperator || 'Orange Money');
      setEditBio(currentUser.bio || '');
    }
  }, [currentUser]);

  // Course & Quiz Viewer state
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ passed: boolean; score: number; pointsEarned: number } | null>(null);

  // AI Tool interactive runner
  const [aiToolType, setAiToolType] = useState<'copywriter' | 'marketing_ideas' | 'summarizer' | 'prompts'>('copywriter');
  const [aiInputText, setAiInputText] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRemaining, setAiRemaining] = useState<number | null>(null);
  const [aiOutputResult, setAiOutputResult] = useState('');
  const [aiCopied, setAiCopied] = useState(false);

  // Support ticket form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<any>('Paiement Mobile Money');
  const [newTicketPriority, setNewTicketPriority] = useState<any>('Moyenne');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Community post form
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<any>('Conseils & Astuces');

  // Retraction modal
  const [retractionReason, setRetractionReason] = useState('Je souhaite exercer mon droit de rétractation de 7 jours');

  // Spending limit input
  const [spendingLimitInput, setSpendingLimitInput] = useState(currentUser?.spendingLimitMonthly || 100000);

  // Copy referral code state
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Les statistiques d'affiliation sont comptées par le serveur à l'ouverture de l'onglet.
  useEffect(() => {
    if (activeTab === 'team' && currentUser) {
      refreshAffiliation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentUser?.id]);

  const handleCopyReferral = () => {
    if (!currentUser) return;
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${currentUser.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  if (!currentUser) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-mist p-4">
        <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center ring-1 ring-ink/10 sm:p-10">
          <BabiVector mood="wave" size={130} className="mx-auto" />
          <h2 className="mt-4 font-display text-3xl font-extrabold">Votre espace personnel</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink/65">
            Connectez-vous, ou créez gratuitement votre compte, pour retrouver votre portefeuille, vos missions et votre Académie.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Btn onClick={() => onOpenAuth?.('signup')} className="py-3.5 text-base">Créer mon compte gratuit</Btn>
            <Btn kind="ghost" onClick={() => onOpenAuth?.('login')} className="py-3.5 text-base">Se connecter</Btn>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveError(null);
    const res = await updateProfile({
      firstName: editFirstName,
      lastName: editLastName,
      city: editCity,
      defaultPayoutOperator: editDefaultOperator,
      bio: editBio
    });
    if (res.success) {
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } else {
      setProfileSaveError(res.message);
    }
  };




  const handleRunAI = async () => {
    if (!aiInputText.trim()) return;
    setAiError(null);
    const res = await runAITool(aiToolType, aiInputText);
    if (res.success) {
      setAiOutputResult(res.text);
      setAiRemaining(res.remaining ?? null);
    } else {
      setAiOutputResult('');
      setAiError(res.text);
    }
  };

  const handleCopyAI = () => {
    navigator.clipboard.writeText(aiOutputResult);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  const handleQuizSubmit = () => {
    if (!activeCourse) return;
    const result = submitCourseQuiz(activeCourse.id, quizAnswers);
    setQuizResult(result);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Deterministic Level bounds (Section 14 & 15 : Zéro hasard)
  const levelPointsMax: Record<string, number> = {
    Starter: 300,
    Bronze: 1000,
    Silver: 2500,
    Gold: 5000,
    Platinum: 10000
  };

  // Abonnement : échéance et jours restants (l'accès réel est contrôlé par le serveur).
  const subExpiry = currentUser.subscriptionExpiresAt ? new Date(currentUser.subscriptionExpiresAt) : null;
  const subDaysLeft = subExpiry ? Math.ceil((subExpiry.getTime() - Date.now()) / 86400000) : null;
  const hasSubscription = currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business';
  const formatDay = (d: Date) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const openRenewal = () => {
    setActivationPlan('premium');
    setIsActivationModalOpen(true);
  };

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Accueil', icon: LayoutDashboard, group: 'Mon activité' },
    { id: 'tasks', label: 'Missions', icon: Briefcase, group: 'Mon activité' },
    { id: 'wallet', label: 'Portefeuille', icon: WalletIcon, group: 'Mon activité' },
    { id: 'withdrawals', label: 'Retraits', icon: Smartphone, group: 'Mon activité' },
    { id: 'team', label: 'Équipe et affiliation', icon: Users, group: 'Réseau' },
    { id: 'community', label: 'Communauté', icon: MessageSquare, group: 'Réseau' },
    { id: 'academy', label: 'Académie', icon: BookOpen, group: 'Apprendre' },
    { id: 'ai_tools', label: 'Outils IA', icon: Sparkles, group: 'Apprendre' },
    { id: 'vcf', label: 'Répertoires VCF', icon: FolderDown, group: 'Apprendre' },
    { id: 'bonus', label: 'Bonus', icon: Gift, group: 'Apprendre' },
    { id: 'profile', label: 'Mon profil', icon: UserIcon, group: 'Compte' },
    { id: 'notifications', label: 'Notifications', icon: Bell, group: 'Compte', badge: unreadCount },
    { id: 'support', label: 'Support', icon: LifeBuoy, group: 'Compte' },
    { id: 'settings', label: 'Paramètres', icon: Settings, group: 'Compte' },
  ];

  const activate = (plan: 'standard' | 'premium') => {
    setActivationPlan(plan);
    setIsActivationModalOpen(true);
  };

  return (
    <>
      <DashboardShell
        items={navItems}
        active={activeTab}
        onSelect={setActiveTab}
        user={currentUser}
        balance={wallet.availableBalance}
        currency={wallet.currency}
        onWithdraw={() => setIsWithdrawalModalOpen(true)}
        onNavigatePublic={onNavigatePublic}
        onLogout={logout}
        primary={['overview', 'tasks', 'wallet', 'team']}
      >
        <Banners onActivate={() => activate('standard')} onRenew={openRenewal} showActivation={activeTab !== 'tasks' && activeTab !== 'withdrawals'} />

        {activeTab === 'overview' && (
          <OverviewTab onNavigate={(t) => setActiveTab(t as typeof activeTab)} onSelectTask={setSelectedTask} onWithdraw={() => setIsWithdrawalModalOpen(true)} />
        )}

        {/* 2. MON PROFIL PERSONNEL (Section 3 & 7 du Cahier des Charges) */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Mon Profil Personnel & Conformité
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gérez vos coordonnées, votre compte Mobile Money de retrait et votre attestation d'adhésion officielle.
                </p>
              </div>

              {profileSaveError && (
                <div role="alert" className="mb-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">{profileSaveError}</div>
              )}
              {profileSaveSuccess && (
                <div className="px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Profil mis à jour avec succès !</span>
                </div>
              )}
            </div>

            {/* Official Digital Membership Card Preview */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-orange-100 font-bold">
                    CARTE DE MEMBRE AH GLOBAL
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-white">
                    {currentUser.firstName} {currentUser.lastName}
                  </h3>
                  <p className="text-xs text-white/90 font-mono">
                    Matricule : {currentUser.memberNumber || '—'} · {currentUser.country}
                  </p>
                </div>

              </div>

              <div className="pt-3 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-white/70 block text-[10px]">Statut Adhésion</span>
                  <strong className="text-white">{({ free: 'Palier gratuit', standard: 'Pass Standard', premium: 'Pack Premium', business: 'Pack Business' } as Record<string, string>)[currentUser.subscriptionPlan] || 'Palier gratuit'}</strong>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px]">N° Mobile Money</span>
                  <strong className="text-white font-mono">{currentUser.phone}</strong>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px]">Résidence</span>
                  <strong className="text-white truncate block">{currentUser.city || '—'}</strong>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px]">Statut Compte</span>
                  <strong className="text-white flex items-center gap-1">
                    <CheckCircle className={`w-3.5 h-3.5 ${currentUser.isEmailVerified ? 'text-emerald-400' : 'text-amber-300'}`} /> {currentUser.isEmailVerified ? 'E-mail vérifié' : 'E-mail à confirmer'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-600" />
                <span>Modifier mes informations personnelles</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Numéro Mobile Money (Wave / Orange / MTN)</label>
                  <input
                    type="tel"
                    readOnly
                    value={currentUser.phone}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Opérateur de retrait favori</label>
                    <OperatorLogo operator={editDefaultOperator} variant="icon" size="xs" />
                  </div>
                  <select
                    value={editDefaultOperator}
                    onChange={(e) => setEditDefaultOperator(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                  >
                    <option value="Wave">Wave Côte d'Ivoire</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Moov Money">Moov Money</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ville / Commune de résidence</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="ex. Abidjan (Cocody)"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Activité professionnelle</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Présentez brièvement vos compétences..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-xs"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>

            {/* Security and KYC Check Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">État de votre compte</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${currentUser.isEmailVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <CheckCircle className={`w-5 h-5 shrink-0 ${currentUser.isEmailVerified ? 'text-emerald-600' : 'text-amber-500'}`} />
                  <div>
                    <div className="font-bold text-slate-900">{currentUser.isEmailVerified ? 'E-mail vérifié' : 'E-mail à confirmer'}</div>
                    <div className="text-[11px] text-slate-600">{currentUser.email}</div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Âge minimum & CGU</div>
                    <div className="text-[11px] text-slate-600">18 ans vérifiés et conditions acceptées à l'inscription</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Numéro Mobile Money</div>
                    <div className="text-[11px] text-slate-600">{currentUser.phone} · utilisé pour vos retraits, non modifiable en ligne</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'tasks' && <TasksTab onSelectTask={setSelectedTask} onActivate={activate} />}
        {activeTab === 'wallet' && <WalletTab onWithdraw={() => setIsWithdrawalModalOpen(true)} />}
        {activeTab === 'withdrawals' && <WithdrawalsTab onWithdraw={() => setIsWithdrawalModalOpen(true)} onActivate={activate} />}

        {/* 6. TEAM & ETHICAL AFFILIATION TAB */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BabiMascot variant="waving" size="sm" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Mon Parrainage Direct (1 Niveau)
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    10 % sur le Pass Membre activé + 5 % sur la 1ère commande réelle de chaque filleul.
                  </p>
                </div>
              </div>

            </div>

            {/* Direct Sponsorship Rule Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-white to-orange-500/10 rounded-2xl border border-emerald-200 flex items-start gap-3.5 shadow-2xs text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-slate-900 font-bold block">
                  Règles du Parrainage Direct :
                </strong>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Vous touchez <strong>10 % sur le Pass Membre</strong> activé par vos filleuls directs, puis <strong>5 % sur leur première commande réelle</strong> sur l'application (abonnement VIP, formation, consultation). Les gains sont crédités sur votre portefeuille pour retrait Mobile Money.
                </p>
              </div>
            </div>

            {/* Referral Link & Code Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">Vos Identifiants de Parrainage</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Votre Code Unique :</span>
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900 text-base">
                    <span>{currentUser.referralCode}</span>
                    <button 
                      onClick={handleCopyReferral}
                      className="px-2.5 py-1 text-xs font-bold text-orange-700 bg-white hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
                    >
                      Copier
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">Lien Direct Partageable :</span>
                  <div className="flex items-center justify-between font-mono text-xs text-slate-800 truncate">
                    <span className="truncate">{window.location.origin}/?ref={currentUser.referralCode}</span>
                    <button 
                      onClick={handleCopyReferral}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors shrink-0 ml-2"
                    >
                      Copier le lien
                    </button>
                  </div>
                </div>
              </div>

              {copiedReferral && (
                <div className="text-xs text-emerald-700 font-bold">
                  ✓ Lien d'affiliation copié dans votre presse-papiers avec succès !
                </div>
              )}
            </div>

            {/* Réseau : chiffres réels comptés par le serveur */}
            {affiliation.error && (
              <div role="alert" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
                <span>Les statistiques du réseau sont momentanément indisponibles.</span>
                <button type="button" onClick={() => refreshAffiliation()} className="px-3 py-1 font-semibold bg-white border border-amber-300 rounded-lg hover:bg-amber-100">Réessayer</button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Filleuls Directs (Niveau 1)</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">
                  {affiliation.stats ? `${affiliation.stats.level1.count} filleul${affiliation.stats.level1.count > 1 ? 's' : ''}` : affiliation.loading ? '…' : '—'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {affiliation.stats ? `${affiliation.stats.level1.activeCount} actif${affiliation.stats.level1.activeCount > 1 ? 's' : ''} · 10 % sur le Pass Membre` : ' '}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Premières Commandes Réelles</span>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                  5 % de commission
                </div>
                <div className="text-[11px] text-slate-500">
                  Sur le 1er achat de chaque filleul (abonnement VIP, formation, etc.)
                </div>
              </div>
            </div>

            {/* Commissions réelles du membre */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-slate-900 text-sm">Vos commissions sur ventes réelles</h3>
                <span className="text-[11px] text-slate-500 font-medium">Réserve de sécurité légale : {affiliation.stats?.retractionDays ?? 7} jours</span>
              </div>

              {affiliation.commissions.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  Aucune commission pour le moment. Elles apparaissent ici lorsqu'un de vos filleuls effectue un achat éligible.
                </div>
              ) : (
                <div className="space-y-2">
                  {affiliation.commissions.map(com => (
                    <div key={com.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">Niveau {com.level}</span>
                          <span className={`px-2 py-0.5 text-[10px] rounded-md font-semibold ${
                            com.status === 'credited' ? 'bg-emerald-100 text-emerald-800' :
                            com.status === 'pending_retraction' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {com.status === 'credited' && 'Créditée'}
                            {com.status === 'pending_retraction' && 'En attente (délai de rétractation)'}
                            {com.status === 'cancelled_retraction' && 'Annulée (rétractation du filleul)'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">Enregistrée le {com.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold text-sm ${com.status === 'cancelled_retraction' ? 'text-slate-400 line-through' : 'text-emerald-700'}`}>
                          +{com.amount.toLocaleString('fr-FR')} {selectedCountry.currency}
                        </div>
                        {com.status === 'pending_retraction' && (
                          <div className="text-[10px] text-amber-700 font-semibold">Créditée à partir du {com.matureAt}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 7. ACADEMY TAB */}
        {activeTab === 'academy' && (
          <div className="space-y-6">
            {!currentUser.isActivated ? (
              <div className="bg-white rounded-3xl border-2 border-orange-300 p-8 sm:p-12 text-center space-y-6 shadow-lg max-w-2xl mx-auto my-6">
                <div className="flex justify-center">
                  <BabiMascot 
                    variant="academic" 
                    size="xl" 
                    speechBubble="Activez votre pass pour accéder aux 4 formations et certifications !" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Formations Verrouillées — Ticket d'Entrée Requis</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Accès aux Formations Approfondies & Examens Officiels
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                    Nos formations représentent des <strong>cours complets et approfondis</strong> sanctionnés par des <strong>examens officiels de 40 questions chronométrées (45 min)</strong>. L'accès à ces programmes de haute valeur professionnelle requiert l'activation du <strong>Pass Membre Standard (3 000 FCFA unique)</strong> ou l'abonnement <strong>VIP Premium (9 900 FCFA/mois)</strong>.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActivationPlan('standard');
                      setIsActivationModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Activer Pass Standard (3 000 FCFA)</span>
                  </button>
                  <button
                    onClick={() => {
                      setActivationPlan('premium');
                      setIsActivationModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all"
                  >
                    <span>VIP Premium (Accès complet + Outils IA)</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BabiMascot variant="academic" size="sm" />
                    <div>
                      <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                        Digital Academy & Certifications Professionnelles
                      </h1>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Formations certifiantes approfondies · Examens de 40 questions chronométrées (Passing score: 80%).
                      </p>
                    </div>
                  </div>

                  {userCertificates.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <span>{userCertificates.length} Certificat(s) obtenu(s)</span>
                    </div>
                  )}
                </div>

            {/* Courses list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs space-y-4 hover:border-orange-300 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-600 font-bold">{course.category}</span>
                      <span className="text-slate-500 font-mono">{course.durationHours}h</span>
                    </div>

                    <h3 className="font-display font-bold text-slate-900 text-sm leading-snug">{course.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{course.description}</p>
                    
                    <div className="text-[11px] text-slate-500 pt-1">
                      {course.modules.length} modules interactifs {course.quiz && '· Quiz de validation'}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {course.isPremium && currentUser.subscriptionPlan !== 'premium' && currentUser.subscriptionPlan !== 'business' ? (
                      <span className="text-xs font-bold text-amber-700">Réservé Premium</span>
                    ) : (
                      <button
                        onClick={() => {
                          enrollInCourse(course.id);
                          setActiveCourse(course);
                          setActiveModuleIndex(0);
                          setIsQuizMode(false);
                          setQuizResult(null);
                        }}
                        className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-orange-600 rounded-xl transition-colors text-center"
                      >
                        Ouvrir le cours
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Certificate display */}
            {userCertificates.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <h3 className="font-display font-bold text-slate-900 text-sm">Vos Certificats de Réussite</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userCertificates.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-orange-50/50 rounded-xl border border-orange-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-display font-bold text-slate-900">{cert.courseTitle}</div>
                        <div className="text-[11px] text-slate-500">Délivré le {cert.issueDate} · Score : {cert.score}%</div>
                      </div>
                      <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
              </>
            )}
          </div>
        )}

        {/* 8. AI TOOLS TAB (Section 13) */}
        {activeTab === 'ai_tools' && (
          <div className="space-y-6">
            {!currentUser.isActivated ? (
              <div className="bg-white rounded-3xl border-2 border-orange-300 p-8 sm:p-12 text-center space-y-6 shadow-lg max-w-2xl mx-auto my-6">
                <div className="flex justify-center">
                  <BabiMascot 
                    variant="ai" 
                    size="xl" 
                    speechBubble="Activez votre compte pour utiliser nos outils d'intelligence artificielle !" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Outils IA Verrouillés</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Assistants & Générateurs IA Réservés aux Membres
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                    Générez des accroches percutantes pour WhatsApp & Facebook, des plans marketing pour Abidjan et des résumés de textes professionnels. Activez votre <strong>Pass Membre Standard (3 essais/jour par outil)</strong> ou passez au <strong>VIP Premium (30 essais/jour par outil)</strong>.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActivationPlan('standard');
                      setIsActivationModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Activer Pass Standard (3 000 FCFA)</span>
                  </button>
                  <button
                    onClick={() => {
                      setActivationPlan('premium');
                      setIsActivationModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all"
                  >
                    <span>VIP Premium (30 essais/jour par outil)</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BabiMascot variant="ai" size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                          Outils IA & Assistants Numériques
                        </h1>
                        
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Générez des argumentaires de vente, des idées marketing locales et des synthèses adaptées au marché ouest-africain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
                  
                  {/* Tool Type Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setAiToolType('copywriter')}
                      className={`p-3 text-xs font-semibold rounded-xl border text-left transition-colors ${
                        aiToolType === 'copywriter' 
                          ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-orange-600 mb-1" />
                      <div>Assistant Rédactionnel</div>
                      <div className="text-[10px] text-slate-500 font-normal">WhatsApp / Facebook</div>
                    </button>

                    <button
                      onClick={() => setAiToolType('marketing_ideas')}
                      className={`p-3 text-xs font-semibold rounded-xl border text-left transition-colors ${
                        aiToolType === 'marketing_ideas' 
                          ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-orange-600 mb-1" />
                      <div>Idées Marketing Abidjan</div>
                      <div className="text-[10px] text-slate-500 font-normal">Plan d'action terrain</div>
                    </button>

                    <button
                      onClick={() => setAiToolType('summarizer')}
                      className={`p-3 text-xs font-semibold rounded-xl border text-left transition-colors ${
                        aiToolType === 'summarizer' 
                          ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-orange-600 mb-1" />
                      <div>Résumeur Pro</div>
                      <div className="text-[10px] text-slate-500 font-normal">Synthèse contrats/textes</div>
                    </button>

                    <button
                      onClick={() => setAiToolType('prompts')}
                      className={`p-3 text-xs font-semibold rounded-xl border text-left transition-colors ${
                        aiToolType === 'prompts' 
                          ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Award className="w-4 h-4 text-orange-600 mb-1" />
                      <div>Générateur de Prompts</div>
                      <div className="text-[10px] text-slate-500 font-normal">Requêtes expertes</div>
                    </button>
                  </div>

                  {/* Input Area */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      {aiToolType === 'copywriter' && 'Décrivez le produit ou service à promouvoir (ex. Vente de paniers vivriers à Cocody) :'}
                      {aiToolType === 'marketing_ideas' && 'Secteur d\'activité ou projet d\'entreprise :'}
                      {aiToolType === 'summarizer' && 'Collez le texte long à synthétiser :'}
                      {aiToolType === 'prompts' && 'Sujet sur lequel vous souhaitez créer des prompts optimisés :'}
                    </label>
                    <textarea
                      rows={4}
                      value={aiInputText}
                      onChange={(e) => setAiInputText(e.target.value)}
                      placeholder="Écrivez vos instructions détaillées..."
                      className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  {/* Run Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleRunAI}
                      disabled={isAILoading || !aiInputText.trim()}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 rounded-xl transition-all flex items-center gap-2 shadow-xs"
                    >
                      {isAILoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Génération en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Générer avec l'IA</span>
                        </>
                      )}
                    </button>
                  </div>

                  {aiRemaining !== null && !aiError && (
                    <p className="text-[11px] text-slate-500">
                      Il vous reste {aiRemaining} essai{aiRemaining > 1 ? 's' : ''} aujourd'hui pour cet outil. Relisez toujours le texte : l'IA peut se tromper, et n'y ajoutez que des informations exactes.
                    </p>
                  )}
                  {aiError && (
                    <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                      {aiError}
                    </div>
                  )}

                  {/* Output Display */}
                  {aiOutputResult && (
                    <div className="mt-4 p-4 bg-orange-50/40 rounded-xl border border-orange-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                        <span className="text-xs font-bold text-slate-900">Résultat généré</span>
                        <button
                          onClick={handleCopyAI}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{aiCopied ? 'Copié !' : 'Copier'}</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                        {aiOutputResult}
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}
          </div>
        )}

        {/* 9. VCF RESOURCES TAB (Section 17) */}
        {activeTab === 'vcf' && (
          <div className="space-y-6">
            {currentUser.subscriptionPlan !== 'premium' ? (
              <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 sm:p-12 text-center space-y-6 shadow-lg max-w-2xl mx-auto my-6">
                <div className="flex justify-center">
                  <BabiMascot 
                    variant="waving" 
                    size="xl" 
                    speechBubble="Passez VIP Premium pour télécharger nos annuaires VCF de Côte d'Ivoire !" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Exclusivité VIP Premium</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Annuaires & Fichiers VCF Qualifiés
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                    Des carnets de contacts professionnels par secteur en Côte d'Ivoire seront proposés ici. Le téléchargement n'est pas encore ouvert (droits d'usage des données en cours de validation) ; il sera <strong>réservé aux abonnés Premium</strong>.
                  </p>
                </div>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => {
                      setActivationPlan('premium');
                      setIsActivationModalOpen(true);
                    }}
                    className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Voir l'abonnement Premium (9 900 FCFA / 30 jours)</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BabiMascot variant="waving" size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                          Ressources Professionnelles & Annuaires VCF
                        </h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          ★ VIP Inclus
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Bases de contacts B2B qualifiées par secteur et pays. Téléchargement tracé et sécurisé (Section 17 & 38).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vcfResources.map(res => (
                    <div key={res.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs space-y-4 hover:border-orange-300 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-orange-600">{res.sector}</span>
                          <span className="font-mono text-slate-700 font-bold">{res.entriesCount} contacts</span>
                        </div>

                        <h3 className="font-display font-bold text-slate-900 text-sm leading-snug">{res.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>

                        <div className="text-[11px] text-slate-400 pt-1">
                          Format : {res.fileFormat} · Mis à jour : {res.verifiedDate}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700 font-bold">
                          ✓ Débloqué VIP
                        </span>

                        <button
                          onClick={() => {
                            const result = downloadVCFResource(res.id);
                            alert(result.message);
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Télécharger VCF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 10. BONUS & FIDÉLITÉ */}
        {activeTab === 'bonus' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BabiMascot variant="wallet" size="sm" />
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Mes Bonus & Fidélité
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-sm">Bonus en vigueur</h3>
                <div className="text-xl font-mono font-extrabold text-orange-600">Aucun pour l'instant</div>
                <p className="text-xs text-slate-500">Un bonus n'est crédité que si une règle publiée le prévoit. Tout bonus crédité apparaît dans votre historique du portefeuille.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-sm">Bonus Certification Académie</h3>
                <div className="text-xl font-mono font-extrabold text-emerald-700">Bientôt disponible</div>
                <p className="text-xs text-slate-500">Les points et certificats récompenseront la réussite d'un quiz de formation ; la délivrance se fera côté serveur, avec une règle connue à l'avance.</p>
                <div className="text-[11px] text-slate-600 font-medium pt-1">
                  Progression active : {currentUser.points} points
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 11. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BabiMascot variant="waving" size="md" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Centre de Notifications
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Suivi en direct de vos micro-jobs, de vos commissions d'affiliation et des retraits Mobile Money.
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="px-3.5 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  Tout marquer comme lu ({unreadCount})
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">Aucune notification pour le moment.</div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between text-xs ${
                      notif.read ? 'bg-slate-50 border-slate-100 hover:bg-slate-100/70' : 'bg-orange-50/50 border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-slate-900">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                        )}
                        {notif.type === 'commission' && (
                          <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-amber-100 text-amber-900">
                            Affiliation
                          </span>
                        )}
                        {notif.type === 'reward' && (
                          <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-emerald-100 text-emerald-900">
                            Micro-Job Validé
                          </span>
                        )}
                        {notif.type === 'system' && (
                          <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-blue-100 text-blue-900">
                            Information
                          </span>
                        )}
                        {notif.type === 'withdrawal' && (
                          <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-blue-100 text-blue-900">
                            Retrait
                          </span>
                        )}
                        {notif.type === 'mission' && (
                          <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-blue-100 text-blue-900">
                            Mission
                          </span>
                        )}
                        {notif.type === 'security' && (
                          <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-blue-100 text-blue-900">
                            Sécurité
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-3 whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 12. COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div role="status" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              La communauté n'est pas encore ouverte : les publications, réactions et signalements ne sont pas enregistrés pour le moment.
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BabiMascot variant="waving" size="sm" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Communauté Interne AH GLOBAL
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Échangez des astuces, partagez vos résultats et découvrez les retours d'expérience.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">Publier un message</h3>
              <textarea
                rows={3}
                placeholder="Partagez un conseil, une question ou une expérience..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <div className="flex items-center justify-between">
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as any)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
                >
                  <option value="Conseils & Astuces">Conseils & Astuces</option>
                  <option value="Témoignage">Témoignage</option>
                  <option value="Question">Question</option>
                </select>

                <button
                  onClick={() => {
                    if (!newPostContent.trim()) return;
                    const res = createPost(newPostContent, newPostCategory);
                    if (!res.success) { alert(res.message); return; }
                    setNewPostContent('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-xs"
                >
                  Publier
                </button>
              </div>
            </div>

            {/* Posts feed */}
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-display font-bold text-xs flex items-center justify-center">
                        {post.authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-display font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{post.authorName}</span>
                          {post.isOfficial && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                              Officiel
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{post.createdAt} · {post.category}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => { const r = reportPost(post.id); alert(r.message); }}
                      className="text-[11px] text-slate-400 hover:text-rose-600"
                    >
                      Signaler
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                    <button 
                      onClick={() => { const r = likePost(post.id); if (!r.success) alert(r.message); }}
                      className="hover:text-orange-600 font-semibold flex items-center gap-1"
                    >
                      <span>👍 {post.likes}</span>
                    </button>
                    <span>💬 {post.commentsCount} commentaires</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 13. SUPPORT TAB */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div role="status" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              Le support par tickets n'est pas encore ouvert : un ticket envoyé d'ici ne serait pas enregistré. Les demandes de remboursement et de rétractation se font depuis Paramètres.
            </div>
            
            <div className="flex items-center gap-3">
              <BabiMascot variant="support" size="sm" />
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Support & Centre d'Aide (Tickets)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Une équipe dédiée pour vos questions sur le Mobile Money, la validation des missions ou la rétractation.
                </p>
              </div>
            </div>

            {/* Create Ticket Modal or Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">Ouvrir un nouveau ticket</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sujet</label>
                  <input
                    type="text"
                    placeholder="ex. Retrait Wave en attente"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value as any)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Paiement Mobile Money">Paiement Mobile Money</option>
                    <option value="Validation de Mission">Validation de Mission</option>
                    <option value="Retrait">Retrait</option>
                    <option value="Rétractation / Remboursement">Rétractation / Remboursement</option>
                    <option value="Compte & Profil">Compte & Profil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priorité</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as any)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Votre message détaillé</label>
                <textarea
                  rows={3}
                  placeholder="Expliquez clairement votre situation avec le numéro de référence concerné..."
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;
                    const res = createTicket(newTicketSubject, newTicketCategory, newTicketPriority, newTicketMessage);
                    if (!res.success) { alert(res.message); return; }
                    setNewTicketSubject('');
                    setNewTicketMessage('');
                    alert('Ticket créé.');
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-xs"
                >
                  Envoyer le ticket
                </button>
              </div>
            </div>

            {/* Existing tickets list */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">Vos tickets ({tickets.filter(t => t.userId === currentUser.id).length})</h3>

              <div className="space-y-3">
                {tickets.filter(t => t.userId === currentUser.id).map(ticket => (
                  <div key={ticket.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">#{ticket.id} · {ticket.subject}</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ticket.category} · Créé le {ticket.createdAt}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ticket.status === 'resolu' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status === 'resolu' ? 'Résolu' : 'En traitement'}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                      <strong>Votre message :</strong>
                      <p className="mt-1">{ticket.message}</p>
                    </div>

                    {/* Responses */}
                    {ticket.responses.length > 0 && (
                      <div className="space-y-2 pl-4 border-l-2 border-orange-500">
                        {ticket.responses.map((resp, rIdx) => (
                          <div key={rIdx} className="p-3 bg-orange-50/50 rounded-lg border border-orange-100 text-xs text-slate-800 space-y-1">
                            <div className="flex items-center justify-between font-bold text-orange-950 text-[11px]">
                              <span>{resp.senderName}</span>
                              <span className="font-mono text-[10px] text-slate-400">{resp.timestamp}</span>
                            </div>
                            <p>{resp.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply box */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Répondre à ce ticket..."
                        value={selectedTicketId === ticket.id ? ticketReplyText : ''}
                        onFocus={() => setSelectedTicketId(ticket.id)}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        className="flex-1 p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => {
                          if (!ticketReplyText.trim()) return;
                          const res = replyTicket(ticket.id, ticketReplyText);
                          if (!res.success) { alert(res.message); return; }
                          setTicketReplyText('');
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Répondre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 14. SETTINGS & ETHICAL CONTROLS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            <div className="flex items-center gap-3">
              <BabiMascot variant="security" size="sm" />
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Paramètres du Compte & Engagements Éthiques
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Contrôles de protection financière, gestion du droit de rétractation et sécurité.
                </p>
              </div>
            </div>

            {/* Ethical Financial Protection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Protection Financière & Plafond Mensuel
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pour empêcher toute dépense excessive ou comportement compulsif, vous pouvez fixer un plafond maximal de dépense mensuelle sur AH GLOBAL. Aucune incitation à l'endettement n'est tolérée sur notre plateforme.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-semibold">Plafond mensuel actuel :</div>
                  <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                    {currentUser.spendingLimitMonthly.toLocaleString()} {selectedCountry.currency}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Dépensé ce mois-ci : {currentUser.spentThisMonth.toLocaleString()} {selectedCountry.currency}
                    {currentUser.pendingSpendingLimit && ` · Hausse à ${currentUser.pendingSpendingLimit.amount.toLocaleString()} en attente (effective le ${new Date(currentUser.pendingSpendingLimit.effectiveAtMs).toLocaleString('fr-FR')})`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step={10000}
                    min={10000}
                    max={1000000}
                    value={spendingLimitInput}
                    onChange={(e) => setSpendingLimitInput(Number(e.target.value))}
                    className="w-32 p-2 text-xs border border-slate-300 rounded-lg font-mono font-bold"
                  />
                  <button
                    onClick={async () => {
                      const res = await updateMonthlySpendingLimit(spendingLimitInput);
                      alert(res.message);
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>

            {/* Abonnement : durée et renouvellement */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">Mon accès</h3>
              <div className="text-xs text-slate-700 leading-relaxed">
                {hasSubscription && subExpiry ? (
                  <>
                    <strong>Abonnement {currentUser.subscriptionPlan === 'business' ? 'Business' : 'Premium'} actif</strong> jusqu'au <strong>{formatDay(subExpiry)}</strong>
                    {subDaysLeft !== null && ` (${subDaysLeft} jour${subDaysLeft > 1 ? 's' : ''} restant${subDaysLeft > 1 ? 's' : ''})`}.
                    Chaque période dure {POLICY.subscriptionDays} jours. Le renouvellement est manuel : aucun prélèvement automatique, et un renouvellement fait avant l'échéance prolonge sans perdre de jours.
                  </>
                ) : currentUser.entryPass ? (
                  <>Pass d'entrée actif, sans limite de durée. Vous pouvez en plus souscrire un abonnement Premium ({POLICY.subscriptionDays} jours, renouvelable à la main).</>
                ) : (
                  <>Aucun Pass actif : missions, formations et retraits sont bloqués. Vos soldes sont conservés.</>
                )}
              </div>
              {(hasSubscription || !currentUser.entryPass) && (
                <button
                  type="button"
                  onClick={openRenewal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  {hasSubscription ? "Renouveler mon abonnement" : "Voir l'abonnement Premium"}
                </button>
              )}
            </div>

            {/* 7-day Retraction & Mobile Money Refund */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Rétractation du Pass d'entrée ({POLICY.retractionDays} jours)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Si vous avez activé un Pass Membre Standard, vous pouvez vous rétracter pendant 7 jours à compter du paiement. Le remboursement est versé sur votre moyen de paiement sous déduction des frais de transaction (3 %).
              </p>
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Information VIP Premium :</strong> L'abonnement mensuel n'est pas remboursable en raison de l'accès immédiat et définitif aux fichiers et contacts VCF téléchargeables ainsi qu'aux outils IA.
              </div>

              {currentUser.entryPass ? (
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 space-y-3 text-xs">
                  <div className="font-semibold text-orange-900">
                    Pass Membre Standard actif (Activé le {currentUser.activationDate ?? 'récent'})
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-700 font-semibold mb-1">Motif de rétractation :</label>
                    <input
                      type="text"
                      placeholder="Ex: Changement d'avis"
                      value={retractionReason}
                      onChange={(e) => setRetractionReason(e.target.value)}
                      className="w-full p-2 text-xs border border-orange-300 rounded-lg bg-white"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm("Attention : la rétractation de votre Pass d'entrée sous 7 jours désactivera vos accès (micro-jobs, formations, retraits) Confirmer la demande de rétractation (remboursement montant - 3%) ?")) return;
                      const res = await requestRetractionRefund(retractionReason);
                      alert(res.message);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
                  >
                    Demander la rétractation de mon Pass d'entrée
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  {currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business'
                    ? "Votre abonnement VIP Premium n'est pas remboursable : l'accès aux répertoires VCF est immédiat. Seul le Pass d'entrée Standard est éligible à la rétractation de 7 jours."
                    : "Aucun Pass d'entrée actif à rétracter."}
                </div>
              )}
            </div>

          </div>
        )}

      </DashboardShell>

      <WithdrawalModal open={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} />
      <ActivationModal open={isActivationModalOpen} plan={activationPlan} onPlanChange={setActivationPlan} onClose={() => setIsActivationModalOpen(false)} />
      <TaskProofModal task={selectedTask} onClose={() => setSelectedTask(null)} />

      {/* COURSE & QUIZ VIEWER MODAL */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] text-orange-600 font-bold uppercase">{activeCourse.category}</span>
                <h3 className="font-display font-bold text-slate-900 text-sm">{activeCourse.title}</h3>
              </div>
              <button 
                onClick={() => setActiveCourse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Course Content or Quiz */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {!isQuizMode ? (
                <>
                  {/* Module Nav */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100">
                    {activeCourse.modules.map((mod, idx) => (
                      <button
                        key={mod.id}
                        onClick={() => setActiveModuleIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold transition-colors ${
                          activeModuleIndex === idx 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Module {idx + 1}
                      </button>
                    ))}
                    {activeCourse.quiz && (
                      <button
                        onClick={() => setIsQuizMode(true)}
                        className="px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold bg-orange-100 text-orange-900 hover:bg-orange-200"
                      >
                        Passer le Quiz de Certification 🏆
                      </button>
                    )}
                  </div>

                  {/* Current Module */}
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-slate-900 text-base">
                      {activeCourse.modules[activeModuleIndex]?.title}
                    </h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                      {activeCourse.modules[activeModuleIndex]?.content}
                    </p>

                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2">
                      <div className="font-bold text-emerald-900 text-xs">Points Clés à Retenir :</div>
                      <ul className="list-disc pl-4 space-y-1 text-emerald-800 text-[11px]">
                        {activeCourse.modules[activeModuleIndex]?.keyTakeaways.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                /* QUIZ MODE */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-display font-bold text-slate-900 text-sm">
                      {activeCourse.quiz?.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Seuil de réussite : {activeCourse.quiz?.passingScore}%
                    </span>
                  </div>

                  {activeCourse.quiz?.questions.map((q, qIndex) => (
                    <div key={q.id} className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs">
                        {qIndex + 1}. {q.question}
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt, oIndex) => (
                          <label key={oIndex} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              checked={quizAnswers[q.id] === oIndex}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIndex }))}
                              className="text-orange-600 focus:ring-orange-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {quizResult ? (
                    <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                      quizResult.passed 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}>
                      <div className="font-bold text-sm">
                        {quizResult.passed ? 'Quiz réussi' : 'Score insuffisant'}
                      </div>
                      <p>
                        Votre score : <strong>{quizResult.score}%</strong>.
                        {quizResult.passed 
                          ? ` Les points et certificats seront délivrés lorsque la validation côté serveur sera ouverte : aucun point ni certificat n'est enregistré pour le moment.` 
                          : ' Vous pouvez réviser les modules et retenter le test.'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsQuizMode(false)}
                        className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
                      >
                        Retour aux cours
                      </button>
                      <button
                        type="button"
                        onClick={handleQuizSubmit}
                        className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-xs"
                      >
                        Valider mes réponses
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Progression enregistrée sur votre profil membre
              </span>
              <button
                onClick={() => setActiveCourse(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};
