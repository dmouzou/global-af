import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  Edit3
} from 'lucide-react';
import { Task, Course, VCFResource, TaskCategory } from '../../types';
import { OperatorLogo } from '../common/OperatorLogo';

export const MemberDashboard: React.FC = () => {
  const { 
    currentUser, 
    updateProfile,
    selectedCountry, 
    wallet, 
    ledger, 
    withdrawals, 
    requestWithdrawal, 
    activateAccountWithMobileMoney,
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
    ethicalIndicators
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'tasks' | 'wallet' | 'withdrawals' | 'team' | 'academy' | 'ai_tools' | 'vcf' | 'bonus' | 'notifications' | 'community' | 'support' | 'settings'
  >('overview');

  // Task selection & submission modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [proofType, setProofType] = useState<'text' | 'url' | 'screenshot'>('text');
  const [proofContent, setProofContent] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | TaskCategory>('all');

  // Withdrawal modal state
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalOperator, setWithdrawalOperator] = useState<'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money'>(currentUser.defaultPayoutOperator || 'Wave');
  const [withdrawalPhone, setWithdrawalPhone] = useState(currentUser.phone);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(selectedCountry.minWithdrawal);

  // Activation modal state
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [activationOperator, setActivationOperator] = useState<'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money'>('Wave');
  const [activationPhone, setActivationPhone] = useState(currentUser.phone);

  // Profile Edit State
  const [editFirstName, setEditFirstName] = useState(currentUser.firstName);
  const [editLastName, setEditLastName] = useState(currentUser.lastName);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editCity, setEditCity] = useState(currentUser.city || 'Abidjan (Cocody)');
  const [editDefaultOperator, setEditDefaultOperator] = useState<'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money'>(currentUser.defaultPayoutOperator || 'Orange Money');
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Course & Quiz Viewer state
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ passed: boolean; score: number; pointsEarned: number } | null>(null);

  // AI Tool interactive runner
  const [aiToolType, setAiToolType] = useState<'copywriter' | 'marketing_ideas' | 'summarizer' | 'prompts'>('copywriter');
  const [aiInputText, setAiInputText] = useState('');
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
  const [spendingLimitInput, setSpendingLimitInput] = useState(currentUser.spendingLimitMonthly);

  // Copy referral code state
  const [copiedReferral, setCopiedReferral] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://global-af.ci/ref/${currentUser.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: editFirstName,
      lastName: editLastName,
      phone: editPhone,
      city: editCity,
      defaultPayoutOperator: editDefaultOperator,
      bio: editBio
    });
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestWithdrawal(withdrawalOperator, withdrawalPhone, Number(withdrawalAmount));
    alert(res.message);
    if (res.success) {
      setIsWithdrawalModalOpen(false);
    }
  };

  const handleActivationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = activateAccountWithMobileMoney('premium', activationOperator, activationPhone);
    if (success) {
      alert("Activation réussie ! Votre compte bénéficie désormais du pack Premium. Vous disposez d'un délai de rétractation de 7 jours avec remboursement Mobile Money.");
      setIsActivationModalOpen(false);
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!proofContent.trim()) {
      alert("Veuillez renseigner les détails ou le justificatif de votre mission.");
      return;
    }
    const res = submitTaskProof(selectedTask.id, proofType, proofContent);
    alert(res.message);
    setSelectedTask(null);
    setProofContent('');
  };

  const handleRunAI = async () => {
    if (!aiInputText.trim()) return;
    const output = await runAITool(aiToolType, aiInputText);
    setAiOutputResult(output);
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

  const filteredTasks = taskFilter === 'all' ? tasks : tasks.filter(t => t.category === taskFilter);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Deterministic Level bounds (Section 14 & 15 : Zéro hasard)
  const levelPointsMax: Record<string, number> = {
    Starter: 300,
    Bronze: 1000,
    Silver: 2500,
    Gold: 5000,
    Platinum: 10000
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION (Mobile-friendly & Desktop) */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 shrink-0 md:min-h-screen p-4 flex flex-col justify-between">
        <div className="space-y-5">
          
          {/* Member Card Mini Header with Côte d'Ivoire Colors */}
          <div className="p-3.5 rounded-xl border border-orange-200/80 bg-gradient-to-br from-orange-50/70 via-white to-emerald-50/40 shadow-xs space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-display font-bold text-sm flex items-center justify-center shadow-xs">
                  {currentUser.firstName.slice(0, 1)}{currentUser.lastName.slice(0, 1)}
                </div>
                <div>
                  <div className="font-display font-bold text-slate-900 text-xs truncate max-w-[120px]">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-notable tracking-wider">
                    {currentUser.memberNumber || 'GA-CI-2024-8891'}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentUser.subscriptionPlan === 'premium' 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {currentUser.subscriptionPlan === 'premium' ? 'VIP Premium' : 'Membre CI'}
              </span>
            </div>
            
            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Solde disponible :</span>
              <strong className="text-orange-600 font-notable text-xs sm:text-sm">
                {wallet.availableBalance.toLocaleString()} {wallet.currency}
              </strong>
            </div>

            {/* Deterministic progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">Rang {currentUser.level}</span>
                <span className="font-notable text-slate-700">{currentUser.points} / {levelPointsMax[currentUser.level] || 1000} PTS</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentUser.points / (levelPointsMax[currentUser.level] || 1000)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Menu (Section 7) */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'profile' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <UserIcon className="w-4 h-4 shrink-0" />
              <span>Mon Profil Personnel</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'tasks' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Mes Micro-jobs ({tasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'wallet' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <WalletIcon className="w-4 h-4 shrink-0" />
              <span>Mon Wallet & Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'withdrawals' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              <span>Retraits Mobile Money</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'team' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Mon Équipe & Affiliation</span>
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'academy' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Digital Academy & Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_tools')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'ai_tools' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Outils IA & Rédaction</span>
            </button>

            <button
              onClick={() => setActiveTab('vcf')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'vcf' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <FolderDown className="w-4 h-4 shrink-0" />
              <span>Ressources VCF Pro</span>
            </button>

            <button
              onClick={() => setActiveTab('bonus')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'bonus' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <Gift className="w-4 h-4 shrink-0" />
              <span>Bonus Déterministes</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-600 text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'community' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Communauté</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'support' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <LifeBuoy className="w-4 h-4 shrink-0" />
              <span>Support & Aide</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs shadow-orange-500/20' 
                  : 'text-slate-700 hover:bg-orange-50/70 hover:text-orange-700'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Paramètres & Éthique</span>
            </button>
          </nav>
        </div>

        {/* Côte d'Ivoire Tricolor Footer Badge */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center h-2.5 w-4 rounded-xs overflow-hidden border border-slate-200 shadow-2xs">
              <span className="w-1/3 h-full bg-[#FF7700]"></span>
              <span className="w-1/3 h-full bg-white"></span>
              <span className="w-1/3 h-full bg-[#009E49]"></span>
            </div>
            <span className="text-[11px] font-bold text-slate-800">GLOBAL-AF Côte d'Ivoire</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Plateforme conforme ARTCI · Zéro hasard garanti.
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">

        {/* Top Personal Space Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-600 p-0.5 shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-display font-extrabold text-orange-600 text-lg">
                {currentUser.firstName.slice(0, 1)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Espace Personnel de {currentUser.firstName} {currentUser.lastName}
                </h2>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Compte Actif"></span>
              </div>
              <p className="text-xs text-slate-500">
                Matricule Officiel : <span className="font-notable text-slate-900 tracking-wider">{currentUser.memberNumber || 'GA-CI-2024-8891'}</span> · {currentUser.city || 'Abidjan'} · Marché Côte d'Ivoire (XOF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Gérer mon Profil</span>
            </button>
            <button
              onClick={() => setIsWithdrawalModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-xs shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Retrait Wave / MoMo</span>
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Financial Ledger Metric Cards with Côte d'Ivoire Accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Solde disponible</span>
                <div className="text-xl sm:text-2xl font-notable text-orange-600 mt-1">
                  {wallet.availableBalance.toLocaleString()} {wallet.currency}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Prêt pour virement Wave / MoMo
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Gains en attente</span>
                <div className="text-xl sm:text-2xl font-notable text-amber-600 mt-1">
                  {wallet.pendingBalance.toLocaleString()} {wallet.currency}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Soumissions en cours de vérification</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Commissions Réelles</span>
                <div className="text-xl sm:text-2xl font-notable text-emerald-700 mt-1">
                  {wallet.commissionBalance.toLocaleString()} {wallet.currency}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Affiliation Niveaux 1 & 2 (ventes utiles)</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400"></div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Plafond de Dépense</span>
                <div className="text-xl sm:text-2xl font-notable text-slate-800 mt-1">
                  {currentUser.spentThisMonth.toLocaleString()} / {currentUser.spendingLimitMonthly.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">Protection Financière Active</div>
              </div>
            </div>

            {/* Personalized Member ID Showcase & Recommended Missions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Virtual Member Badge Card (Côte d'Ivoire Edition) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-slate-700 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-orange-500/10 blur-2xl pointer-events-none"></div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center h-3 w-5 rounded-xs overflow-hidden border border-white/20">
                        <span className="w-1/3 h-full bg-[#FF7700]"></span>
                        <span className="w-1/3 h-full bg-white"></span>
                        <span className="w-1/3 h-full bg-[#009E49]"></span>
                      </div>
                      <span className="font-display font-extrabold text-sm tracking-wide text-white">GLOBAL-AF</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 font-bold bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/40">
                      CARTE OFFICIELLE
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Titulaire du compte</div>
                    <div className="font-display font-bold text-lg text-white mt-0.5">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="text-xs text-orange-300 font-notable tracking-wider mt-0.5">
                      {currentUser.memberNumber || 'GA-CI-2024-8891'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Opérateur favori</span>
                      <strong className="text-white">{currentUser.defaultPayoutOperator || 'Wave'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Résidence</span>
                      <strong className="text-white truncate block">{currentUser.city || 'Abidjan'}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    <div>Inscrit le {currentUser.createdAt}</div>
                    <div className="text-emerald-400 font-semibold">● Compte Membre Vérifié</div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    <span>Afficher détails</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recommended Missions */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-sm">Missions recommandées du jour</h3>
                    <p className="text-[11px] text-slate-500">Gains garantis crédités instantanément sur votre ledger</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>Toutes ({tasks.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="p-3.5 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Quota : {task.quotaCurrent}/{task.quotaMax} · {task.verificationType === 'automatic' ? 'Validation automatique' : 'Vérification manuelle'}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="font-mono font-bold text-xs text-emerald-700">+{task.rewardAmount} XOF</div>
                        <span className="text-[10px] text-orange-600 font-semibold group-hover:underline">Participer</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recent Ledger Operations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Dernières opérations financières enregistrées
                </h3>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Voir grand livre complet
                </button>
              </div>

              <div className="space-y-2">
                {ledger.filter(l => l.userId === currentUser.id).slice(0, 4).map(entry => (
                  <div key={entry.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900">{entry.origin}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Réf: {entry.reference} · {entry.date} · {entry.operator || 'Système'}</div>
                    </div>
                    <div className={`font-mono font-bold tabular-nums ${
                      entry.type === 'withdrawal' || entry.type === 'activation_payment' ? 'text-slate-900' : 'text-emerald-700'
                    }`}>
                      {entry.type === 'withdrawal' || entry.type === 'activation_payment' ? '-' : '+'}
                      {entry.amount.toLocaleString()} {entry.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
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
                    ATTESTATION OFFICIELLE DE MEMBRE ACTIF
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-white">
                    {currentUser.firstName} {currentUser.lastName}
                  </h3>
                  <p className="text-xs text-white/90 font-mono">
                    Matricule Permanent : {currentUser.memberNumber || 'CI-2026-9042'} · {currentUser.country}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Téléchargement de l'attestation officielle de ${currentUser.firstName} ${currentUser.lastName} générée avec succès.`)}
                    className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-600" />
                    <span>Télécharger l'Attestation (PDF)</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-white/70 block text-[10px]">Statut Adhésion</span>
                  <strong className="text-white">{currentUser.subscriptionPlan === 'premium' ? 'Pack Premium VIP' : 'Membre Standard'}</strong>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px]">N° Mobile Money</span>
                  <strong className="text-white font-mono">{currentUser.phone}</strong>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px]">Résidence</span>
                  <strong className="text-white truncate block">{currentUser.city || 'Abidjan'}</strong>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px]">Statut Compte</span>
                  <strong className="text-white flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Profil Certifié
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
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
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

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">N° Pièce d'identité / CNI (facultatif)</label>
                  <input
                    type="text"
                    defaultValue={currentUser.idCardNumber || 'CI0039281729'}
                    placeholder="ex. CI0012345678"
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
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
              <h3 className="font-display font-bold text-slate-900 text-sm">Vérifications de Sécurité (Conformité ARTCI)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-950">E-mail Vérifié</div>
                    <div className="text-[11px] text-emerald-800">{currentUser.email}</div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-950">Capacité Juridique & CGU</div>
                    <div className="text-[11px] text-emerald-800">Conformité et approbation validées</div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-950">Mobile Money Certifié</div>
                    <div className="text-[11px] text-emerald-800">Protection anti-fraude active</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-anton text-slate-900 tracking-wide">
                  Catalogue des Micro-jobs & Missions Rémunérées
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tâches déterministes vérifiées. Rémunération garantie dès validation de votre preuve.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                    taskFilter === 'all' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setTaskFilter('survey')}
                  className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                    taskFilter === 'survey' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sondages
                </button>
                <button
                  onClick={() => setTaskFilter('app_test')}
                  className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                    taskFilter === 'app_test' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tests UX
                </button>
                <button
                  onClick={() => setTaskFilter('social_visit')}
                  className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                    taskFilter === 'social_visit' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vidéos
                </button>
                <button
                  onClick={() => setTaskFilter('partner_campaign')}
                  className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                    taskFilter === 'partner_campaign' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Partenaires
                </button>
              </div>
            </div>

            {/* Task list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map(task => {
                const userSub = submissions.find(s => s.taskId === task.id && s.userId === currentUser.id);
                return (
                  <div key={task.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs space-y-4 hover:border-orange-300 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold">
                          {task.verificationType === 'automatic' ? 'Validation automatique' : 'Vérification manuelle'}
                        </span>
                        <span className="font-extrabold text-emerald-700 font-mono text-sm tabular-nums">
                          +{task.rewardAmount.toLocaleString()} {task.currency}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-slate-900 text-sm">{task.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                      <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                        <span>Quota : {task.quotaCurrent} / {task.quotaMax}</span>
                        <span>·</span>
                        <span>Niveau requis : {task.requiredLevel}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {userSub ? (
                        <div className="text-xs flex items-center gap-1.5">
                          {userSub.status === 'approved' && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Validé & Payé (+{userSub.rewardAmount} XOF)
                            </span>
                          )}
                          {userSub.status === 'pending' && (
                            <span className="text-amber-600 font-bold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> En cours de vérification
                            </span>
                          )}
                          {userSub.status === 'rejected' && (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Non validé
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all ml-auto shadow-xs"
                        >
                          Participer & Soumettre preuve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 4. WALLET & LEDGER TAB */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Mon Wallet & Grand Livre Financier (Ledger)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Toutes les opérations sont historisées et immuables (Section 8). Aucun solde n'est écrasé sans trace.
                </p>
              </div>

              <button
                onClick={() => setIsWithdrawalModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Nouveau Retrait Mobile Money</span>
              </button>
            </div>

            {/* Balances summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Solde Disponible</span>
                <div className="text-lg font-bold text-orange-600 font-mono mt-1">
                  {wallet.availableBalance.toLocaleString()} {wallet.currency}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Solde en Attente</span>
                <div className="text-lg font-bold text-amber-600 font-mono mt-1">
                  {wallet.pendingBalance.toLocaleString()} {wallet.currency}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Commissions Réelles</span>
                <div className="text-lg font-bold text-emerald-700 font-mono mt-1">
                  {wallet.commissionBalance.toLocaleString()} {wallet.currency}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Bonus Déterministes</span>
                <div className="text-lg font-bold text-blue-600 font-mono mt-1">
                  {wallet.bonusBalance.toLocaleString()} {wallet.currency}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-semibold">Montants Réservés</span>
                <div className="text-lg font-bold text-slate-500 font-mono mt-1">
                  {wallet.reservedBalance.toLocaleString()} {wallet.currency}
                </div>
              </div>
            </div>

            {/* Immutable Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Grand Livre Financier des Transactions ({ledger.filter(l => l.userId === currentUser.id).length})
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Traçabilité Wave / Orange / MTN
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Référence</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Origine & Détails</th>
                      <th className="px-4 py-3">Opérateur</th>
                      <th className="px-4 py-3 text-right">Montant</th>
                      <th className="px-4 py-3 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ledger.filter(l => l.userId === currentUser.id).map(entry => (
                      <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-slate-500 font-mono whitespace-nowrap">{entry.date}</td>
                        <td className="px-4 py-3 font-mono font-medium text-slate-900 whitespace-nowrap">{entry.reference}</td>
                        <td className="px-4 py-3 capitalize text-slate-700 whitespace-nowrap font-medium">
                          {entry.type === 'reward' && 'Récompense'}
                          {entry.type === 'commission' && 'Commission Vente'}
                          {entry.type === 'bonus' && 'Bonus Déterministe'}
                          {entry.type === 'withdrawal' && 'Retrait'}
                          {entry.type === 'activation_payment' && 'Activation'}
                          {entry.type === 'refund' && 'Remboursement'}
                          {entry.type === 'adjustment' && 'Ajustement'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={entry.origin}>
                          {entry.origin}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-semibold">
                          {entry.operator || 'Système Interne'}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-bold whitespace-nowrap ${
                          entry.type === 'withdrawal' || entry.type === 'activation_payment' 
                            ? 'text-slate-900' 
                            : 'text-emerald-700'
                        }`}>
                          {entry.type === 'withdrawal' || entry.type === 'activation_payment' ? '-' : '+'}
                          {entry.amount.toLocaleString()} {entry.currency}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="font-bold text-emerald-700">Validé</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 5. RETRAITS MOBILE MONEY TAB */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Retraits Mobile Money (Côte d'Ivoire)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Workflow complet conforme à la section 20 : Demande → Contrôle → Réservation → Validation → Paiement.
                </p>
              </div>

              <button
                onClick={() => setIsWithdrawalModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Effectuer une demande de retrait</span>
              </button>
            </div>

            {/* Operator threshold notice */}
            <div className="p-5 bg-gradient-to-r from-orange-50 to-emerald-50 rounded-2xl border border-orange-200/80 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <strong className="text-orange-900 font-display">Conditions de retrait en vigueur :</strong>
                <p className="text-[11px] text-slate-600">
                  Seuil minimum : {selectedCountry.minWithdrawal.toLocaleString()} {selectedCountry.currency} · Frais de transfert : {selectedCountry.withdrawalFeePercent}% · Opérateurs supportés : Wave, Orange Money, MTN MoMo, Moov Money.
                </p>
              </div>
              <div className="font-mono font-extrabold text-sm text-emerald-800 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                Solde Retirable : {wallet.availableBalance.toLocaleString()} {wallet.currency}
              </div>
            </div>

            {/* Withdrawals list */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                Historique de vos demandes de retraits
              </h3>

              {withdrawals.filter(w => w.userId === currentUser.id).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Aucune demande de retrait effectuée pour le moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {withdrawals.filter(w => w.userId === currentUser.id).map(w => (
                    <div key={w.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">Retrait #{w.id}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-orange-700">{w.operator} ({w.operatorPhone})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Demandé le {w.requestedAt} {w.processedAt && `· Traité le ${w.processedAt}`}
                          {w.transactionRef && ` · Réf Opérateur : ${w.transactionRef}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900 text-sm">
                            {w.netAmount.toLocaleString()} {w.currency}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Brut: {w.amount} (Frais: {w.fees})
                          </div>
                        </div>

                        <div>
                          {w.status === 'payout_sent' && (
                            <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded-lg">
                              Payé & Reçu
                            </span>
                          )}
                          {w.status === 'approved' && (
                            <span className="px-2.5 py-1 text-[11px] font-bold text-blue-800 bg-blue-100 rounded-lg">
                              Validé en attente envoi
                            </span>
                          )}
                          {w.status === 'pending_control' && (
                            <span className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 rounded-lg">
                              Contrôle financier
                            </span>
                          )}
                          {w.status === 'rejected' && (
                            <span className="px-2.5 py-1 text-[11px] font-bold text-rose-800 bg-rose-100 rounded-lg">
                              Rejeté ({w.rejectReason})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 6. TEAM & ETHICAL AFFILIATION TAB */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Mon Réseau d'Affiliation Éthique (1 à 2 Niveaux)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Commissions éthiques : Rémunération exclusive sur des ventes réelles de formations et services, jamais sur le recrutement.
              </p>
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
                    <span className="truncate">https://global-af.ci/ref/{currentUser.referralCode}</span>
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

            {/* Network Structure Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Niveau 1 (Direct)</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">1 Filleul Actif</div>
                <div className="text-[11px] text-orange-600 font-semibold">Commission : 15% sur ventes réelles</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Niveau 2 (Indirect)</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">0 Filleul</div>
                <div className="text-[11px] text-slate-500">Commission : 5% sur ventes réelles</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Niveau 3</span>
                <div className="text-2xl font-extrabold text-slate-400 font-mono">DÉSACTIVÉ</div>
                <div className="text-[11px] text-rose-600 font-bold">Interdiction stricte anti-pyramide</div>
              </div>
            </div>

            {/* Referrals list */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-display font-bold text-slate-900 text-sm">Détail des Filleuls et Ventes Réelles Rémunérées</h3>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Aïcha Ouattara</span>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-md font-bold">Niveau 1</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Abonnement Premium activé (9 900 XOF) · Inscrite le 20 Sept 2026
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-700 text-sm">+1 500 XOF</div>
                  <div className="text-[10px] text-slate-500">Commission vente utile créditée</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 7. ACADEMY TAB */}
        {activeTab === 'academy' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Digital Academy & Certifications
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Formations concrètes axées sur l'écosystème ivoirien. Quiz déterministes et points de progression.
                </p>
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
                    {course.isPremium && currentUser.subscriptionPlan === 'free' ? (
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

          </div>
        )}

        {/* 8. AI TOOLS TAB (Section 13) */}
        {activeTab === 'ai_tools' && (
          <div className="space-y-6">
            
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Outils IA & Assistants Numériques
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Générez des argumentaires de vente, des idées marketing locales et des synthèses adaptées au marché ouest-africain.
              </p>
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

          </div>
        )}

        {/* 9. VCF RESOURCES TAB (Section 17) */}
        {activeTab === 'vcf' && (
          <div className="space-y-6">
            
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Ressources Professionnelles & Annuaires VCF
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Bases de contacts B2B qualifiées par secteur et pays. Téléchargement tracé et sécurisé (Section 17 & 38).
              </p>
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
                    <span className="text-xs font-semibold text-slate-500">
                      {res.requiredPlan === 'premium' ? 'Pack Premium requis' : 'Accès Libre'}
                    </span>

                    <button
                      onClick={() => {
                        const result = downloadVCFResource(res.id);
                        alert(result.message);
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 10. BONUS DÉTERMINISTES (Section 14 & 15 : Zéro hasard) */}
        {activeTab === 'bonus' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Mes Bonus Déterministes & Fidélité
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Conforme Section 15 & 39 : Zéro roue de la fortune, zéro tirage au sort. Tout bonus est fixe, connu à l'avance et garanti.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-sm">Bonus d'Inscription & Vérification</h3>
                <div className="text-xl font-mono font-extrabold text-orange-600">1 000 XOF</div>
                <p className="text-xs text-slate-500">Crédité automatiquement après la vérification de l'adresse e-mail et validation du premier profil.</p>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                  <Check className="w-3.5 h-3.5" /> Reçu sur votre ledger
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-sm">Bonus Certification Académie</h3>
                <div className="text-xl font-mono font-extrabold text-emerald-700">100 à 250 Pts</div>
                <p className="text-xs text-slate-500">Attribué dès l'obtention d'un score $\ge 70\%$ au quiz d'un cours. Débloque le rang Bronze / Silver.</p>
                <div className="text-[11px] text-slate-600 font-medium pt-1">
                  Progression active : {currentUser.points} points
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-sm">Garantie Déterministe</h3>
                <div className="text-sm font-bold text-slate-800">100% Transparent</div>
                <p className="text-xs text-slate-500">Interdiction légale des loteries et des jeux d'argent. Chaque point ou franc gagné récompense un travail réel.</p>
                <div className="text-[11px] text-blue-700 font-semibold pt-1">
                  Audit & Invariants Éthiques
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 11. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Centre de Notifications
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Suivi en direct de vos micro-jobs, de vos commissions d'affiliation et des retraits Mobile Money.
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="px-3.5 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  Tout marquer comme lu
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
                      notif.read ? 'bg-slate-50 border-slate-100' : 'bg-orange-50/40 border-orange-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-900">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        )}
                      </div>
                      <p className="text-slate-600">{notif.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-3">{notif.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 12. COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Communauté Interne GLOBAL-AF
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Échangez des astuces, partagez vos résultats et découvrez les retours d'expérience.
                </p>
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
                    createPost(newPostContent, newPostCategory);
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
                      onClick={() => { reportPost(post.id); alert('Publication signalée à la modération.'); }}
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
                      onClick={() => likePost(post.id)}
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
            
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Support & Centre d'Aide (Tickets)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Une équipe dédiée pour vos questions sur le Mobile Money, la validation des missions ou la rétractation.
              </p>
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
                    createTicket(newTicketSubject, newTicketCategory, newTicketPriority, newTicketMessage);
                    setNewTicketSubject('');
                    setNewTicketMessage('');
                    alert('Ticket créé avec succès !');
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
                          replyTicket(ticket.id, ticketReplyText);
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
            
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Paramètres du Compte & Engagements Éthiques
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Contrôles de protection financière, gestion du droit de rétractation et sécurité.
              </p>
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
                Pour empêcher toute dépense excessive ou comportement compulsif, vous pouvez fixer un plafond maximal de dépense mensuelle sur GLOBAL-AF. Aucune incitation à l'endettement n'est tolérée sur notre plateforme.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-semibold">Plafond mensuel actuel :</div>
                  <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                    {currentUser.spendingLimitMonthly.toLocaleString()} {selectedCountry.currency}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Dépensé ce mois-ci : {currentUser.spentThisMonth.toLocaleString()} {selectedCountry.currency}
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
                    onClick={() => {
                      updateMonthlySpendingLimit(spendingLimitInput);
                      alert('Plafond de dépense mensuel mis à jour.');
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>

            {/* 7-day Retraction & Mobile Money Refund */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Droit Légal de Rétractation de 7 Jours
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Si vous avez activé un compte payant (Pack Premium ou Business), vous bénéficiez d'un droit de rétractation garanti de 7 jours avec remboursement intégral par Mobile Money (Wave / Orange Money).
              </p>

              {currentUser.subscriptionPlan !== 'free' ? (
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 space-y-3 text-xs">
                  <div className="font-semibold text-orange-900">
                    Abonnement actif : {currentUser.subscriptionPlan.toUpperCase()} (Activé le {currentUser.activationDate})
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-700 font-semibold mb-1">Motif de rétractation :</label>
                    <input
                      type="text"
                      value={retractionReason}
                      onChange={(e) => setRetractionReason(e.target.value)}
                      className="w-full p-2 text-xs border border-orange-300 rounded-lg bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const res = requestRetractionRefund(retractionReason);
                      alert(res.message);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
                  >
                    Demander mon remboursement Mobile Money immédiat
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  Votre compte est actuellement sur le palier Gratuit. Aucun paiement actif n'est sujet à remboursement.
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* WITHDRAWAL MODAL */}
      {isWithdrawalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                Retrait Mobile Money (Côte d'Ivoire)
              </h3>
              <button 
                onClick={() => setIsWithdrawalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Opérateur de réception</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money'] as const).map(op => (
                    <button
                      type="button"
                      key={op}
                      onClick={() => setWithdrawalOperator(op)}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all text-left ${
                        withdrawalOperator === op 
                          ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-400' 
                          : 'border-slate-200 hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <OperatorLogo operator={op} variant="icon" size="sm" />
                      <div className="leading-tight truncate">
                        <div className="font-bold text-slate-900 text-xs truncate">{op}</div>
                        <div className="text-[10px] text-slate-500">Validation instantanée</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Numéro Mobile Money du bénéficiaire</label>
                <input
                  type="tel"
                  required
                  value={withdrawalPhone}
                  onChange={(e) => setWithdrawalPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Montant à retirer ({selectedCountry.currency})</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Max : {wallet.availableBalance.toLocaleString()} {selectedCountry.currency}
                  </span>
                </div>
                <input
                  type="number"
                  min={selectedCountry.minWithdrawal}
                  max={wallet.availableBalance}
                  step={500}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              {/* Fee and Net Calculation Breakdown */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Montant brut :</span>
                  <span>{withdrawalAmount.toLocaleString()} {selectedCountry.currency}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Frais de transfert ({selectedCountry.withdrawalFeePercent}%) :</span>
                  <span>-{Math.round(withdrawalAmount * (selectedCountry.withdrawalFeePercent / 100))} {selectedCountry.currency}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-slate-200 text-xs">
                  <span>Net reçu sur votre compte :</span>
                  <span>{Math.round(withdrawalAmount * (1 - selectedCountry.withdrawalFeePercent / 100)).toLocaleString()} {selectedCountry.currency}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={withdrawalAmount < selectedCountry.minWithdrawal || withdrawalAmount > wallet.availableBalance}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 rounded-xl transition-all shadow-xs"
              >
                Confirmer la demande de retrait
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVATION MODAL */}
      {isActivationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                Activation Pack Premium (9 900 XOF)
              </h3>
              <button 
                onClick={() => setIsActivationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleActivationSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Bien identifiable acheté (Section 6 & 39) :</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Accès illimité aux Outils IA, missions à forte rémunération, répertoires de contacts VCF et certification Académie.
                </p>
                <div className="text-[10px] text-emerald-700 font-bold pt-1">
                  ✓ Droit de rétractation de 7 jours avec remboursement Mobile Money.
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Moyen de paiement Mobile Money</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money'] as const).map(op => (
                    <button
                      type="button"
                      key={op}
                      onClick={() => setActivationOperator(op)}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all text-left ${
                        activationOperator === op 
                          ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-400' 
                          : 'border-slate-200 hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <OperatorLogo operator={op} variant="icon" size="sm" />
                      <div className="leading-tight truncate">
                        <div className="font-bold text-slate-900 text-xs truncate">{op}</div>
                        <div className="text-[10px] text-slate-500">Paiement instantané</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Votre numéro {activationOperator}</label>
                <input
                  type="tel"
                  required
                  value={activationPhone}
                  onChange={(e) => setActivationPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-between items-center font-bold text-slate-900 text-sm pt-2">
                <span>Total à régler :</span>
                <span className="font-mono text-orange-600 font-extrabold">9 900 XOF</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-xs"
              >
                Payer 9 900 XOF via {activationOperator}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAIL & PROOF SUBMISSION MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">{selectedTask.id}</span>
                <h3 className="font-display font-bold text-slate-900 text-sm">{selectedTask.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-50 to-orange-50 rounded-xl border border-emerald-100">
                <span className="text-slate-900 font-bold">Récompense garantie :</span>
                <span className="font-mono font-extrabold text-sm text-emerald-800">
                  +{selectedTask.rewardAmount.toLocaleString()} {selectedTask.currency}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Instructions de la mission :</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {selectedTask.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              {selectedTask.targetUrl && (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 text-[11px] truncate">Lien de la tâche : {selectedTask.targetUrl}</span>
                  <a 
                    href={selectedTask.targetUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-orange-600 font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2"
                  >
                    Ouvrir <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Submission Form */}
              <form onSubmit={handleTaskSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Soumettre votre justificatif de preuve :</h4>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProofType('text')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      proofType === 'text' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Texte / Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setProofType('url')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      proofType === 'url' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Lien URL
                  </button>
                </div>

                <textarea
                  rows={3}
                  required
                  value={proofContent}
                  onChange={(e) => setProofContent(e.target.value)}
                  placeholder={proofType === 'url' ? 'https://...' : 'Indiquez votre code de complétion ou compte-rendu...'}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-xs"
                  >
                    Valider ma participation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                        {quizResult.passed ? '🎉 Félicitations ! Quiz Réussi !' : 'Score insuffisant'}
                      </div>
                      <p>
                        Votre score : <strong>{quizResult.score}%</strong>.
                        {quizResult.passed 
                          ? ` Vous gagnez ${quizResult.pointsEarned} points et un certificat officiel est ajouté à votre profil personnel !` 
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

    </div>
  );
};
