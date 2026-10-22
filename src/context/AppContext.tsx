import React, { createContext, useContext, useState, useEffect } from 'react';
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
  INITIAL_ETHICAL_INDICATORS, 
  INITIAL_CURRENT_USER, 
  DEMO_PROFILES, 
  INITIAL_TASKS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_COURSES, 
  INITIAL_VCF_RESOURCES, 
  INITIAL_LEDGER, 
  INITIAL_WITHDRAWALS, 
  INITIAL_POSTS, 
  INITIAL_TICKETS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_RISK_ALERTS 
} from '../data/initialData';
import { GoogleGenAI } from '@google/genai';

interface AppContextType {
  currentUser: User;
  switchProfile: (userId: string) => void;
  updateUserRole: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  selectedCountry: CountryConfig;
  setCountryCode: (code: CountryCode) => void;
  
  // Wallet & Ledger
  wallet: Wallet;
  ledger: LedgerEntry[];
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money', phone: string, amount: number) => { success: boolean; message: string };
  processWithdrawalAdmin: (withdrawalId: string, action: 'approve' | 'payout' | 'reject', reason?: string) => void;
  activateAccountWithMobileMoney: (plan: 'premium' | 'business', operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money', phone: string) => boolean;
  requestRetractionRefund: (reason: string) => { success: boolean; message: string };
  updateMonthlySpendingLimit: (amount: number) => void;

  // Tasks & Micro-jobs
  tasks: Task[];
  submissions: TaskSubmission[];
  submitTaskProof: (taskId: string, proofType: 'url' | 'text' | 'screenshot', content: string) => { success: boolean; message: string };
  reviewSubmissionAdmin: (submissionId: string, status: 'approved' | 'rejected', feedback?: string) => void;
  createTaskAdmin: (newTask: Omit<Task, 'id' | 'quotaCurrent'>) => void;

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
  downloadVCFResource: (resourceId: string) => { success: boolean; message: string };

  // Community
  posts: CommunityPost[];
  createPost: (content: string, category: CommunityPost['category']) => void;
  likePost: (postId: string) => void;
  reportPost: (postId: string) => void;

  // Support
  tickets: SupportTicket[];
  createTicket: (subject: string, category: SupportTicket['category'], priority: SupportTicket['priority'], message: string) => void;
  replyTicket: (ticketId: string, message: string) => void;
  resolveTicketAdmin: (ticketId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Audit & Ethics & Risk
  auditLogs: AuditLogItem[];
  riskAlerts: RiskAlert[];
  ethicalIndicators: EthicalIndicators;

  // Demo helper
  resetDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('global_af_user');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(currentUser.country || 'CI');
  const selectedCountry = COUNTRIES_CONFIG[selectedCountryCode] || COUNTRIES_CONFIG.CI;

  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('global_af_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('global_af_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('global_af_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem('global_af_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('global_af_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [userCertificates, setUserCertificates] = useState<Array<{ courseId: string; courseTitle: string; issueDate: string; score: number }>>(() => {
    const saved = localStorage.getItem('global_af_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  const [vcfResources] = useState<VCFResource[]>(INITIAL_VCF_RESOURCES);

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('global_af_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('global_af_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('global_af_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('global_af_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(() => {
    const saved = localStorage.getItem('global_af_risks');
    return saved ? JSON.parse(saved) : INITIAL_RISK_ALERTS;
  });

  const [ethicalIndicators] = useState<EthicalIndicators>(INITIAL_ETHICAL_INDICATORS);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('global_af_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('global_af_ledger', JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    localStorage.setItem('global_af_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('global_af_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('global_af_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('global_af_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('global_af_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('global_af_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('global_af_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('global_af_certificates', JSON.stringify(userCertificates));
  }, [userCertificates]);

  useEffect(() => {
    localStorage.setItem('global_af_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Derived wallet calculations for current user
  const userLedger = ledger.filter(l => l.userId === currentUser.id);
  const userWithdrawals = withdrawals.filter(w => w.userId === currentUser.id);

  const availableBalance = userLedger
    .filter(l => l.status === 'completed')
    .reduce((acc, entry) => {
      if (entry.type === 'reward' || entry.type === 'bonus' || entry.type === 'commission' || entry.type === 'refund') {
        return acc + entry.amount;
      }
      if (entry.type === 'withdrawal' || entry.type === 'activation_payment' || entry.type === 'subscription_payment') {
        return acc - entry.amount;
      }
      return acc;
    }, 0);

  const pendingSubmissionsRewards = submissions
    .filter(s => s.userId === currentUser.id && s.status === 'pending')
    .reduce((acc, s) => acc + s.rewardAmount, 0);

  const reservedWithdrawalsAmount = userWithdrawals
    .filter(w => w.status === 'pending_control' || w.status === 'reserved' || w.status === 'approved')
    .reduce((acc, w) => acc + w.amount, 0);

  const bonusBalance = userLedger
    .filter(l => l.type === 'bonus' && l.status === 'completed')
    .reduce((acc, l) => acc + l.amount, 0);

  const commissionBalance = userLedger
    .filter(l => l.type === 'commission' && l.status === 'completed')
    .reduce((acc, l) => acc + l.amount, 0);

  const wallet: Wallet = {
    userId: currentUser.id,
    availableBalance: Math.max(0, availableBalance),
    pendingBalance: pendingSubmissionsRewards,
    bonusBalance,
    commissionBalance,
    reservedBalance: reservedWithdrawalsAmount,
    points: currentUser.points,
    currency: selectedCountry.currency
  };

  const addAuditLog = (action: string, details: string, rule?: string) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      actorRole: currentUser.role,
      action,
      details,
      complianceRule: rule || 'Section 26 - Audit & Traçabilité'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchProfile = (userId: string) => {
    const profile = DEMO_PROFILES.find(p => p.id === userId);
    if (profile) {
      setCurrentUser(profile);
      setSelectedCountryCode(profile.country);
      addAuditLog('Changement de profil démo', `Session commutée sur ${profile.firstName} ${profile.lastName} (${profile.role})`);
    }
  };

  const updateUserRole = (newRole: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role: newRole }));
    addAuditLog('Attribution de rôle', `Rôle changé en ${newRole} pour ${currentUser.firstName}`);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    addAuditLog('Mise à jour du profil membre', `Données du profil mises à jour pour ${currentUser.firstName} ${currentUser.lastName}`);
  };

  const setCountryCode = (code: CountryCode) => {
    setSelectedCountryCode(code);
    setCurrentUser(prev => ({ ...prev, country: code }));
  };

  // Withdrawals workflow (Section 20 & 39)
  const requestWithdrawal = (
    operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money', 
    phone: string, 
    amount: number
  ) => {
    if (amount < selectedCountry.minWithdrawal) {
      return { 
        success: false, 
        message: `Le montant minimum de retrait pour ${selectedCountry.name} est de ${selectedCountry.minWithdrawal.toLocaleString()} ${selectedCountry.currency}.` 
      };
    }

    if (amount > wallet.availableBalance) {
      return { 
        success: false, 
        message: `Solde insuffisant. Vous disposez de ${wallet.availableBalance.toLocaleString()} ${selectedCountry.currency}.` 
      };
    }

    const fee = Math.round(amount * (selectedCountry.withdrawalFeePercent / 100));
    const netAmount = amount - fee;

    const newWithdrawal: WithdrawalRequest = {
      id: `wth-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userPhone: currentUser.phone,
      amount,
      fees: fee,
      netAmount,
      currency: selectedCountry.currency,
      operator,
      operatorPhone: phone,
      status: 'pending_control',
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    // Immutably record in ledger (withdrawal pending reservation)
    const newLedgerEntry: LedgerEntry = {
      id: `ldg-${Date.now()}`,
      userId: currentUser.id,
      amount,
      currency: selectedCountry.currency,
      type: 'withdrawal',
      origin: `Demande de retrait ${operator} (${phone})`,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reference: `RET-${Date.now().toString().slice(-6)}`,
      operator,
      operatorReference: `PENDING-${operator.toUpperCase().slice(0, 3)}`
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setLedger(prev => [newLedgerEntry, ...prev]);

    // Send notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Demande de retrait initiée',
      message: `Votre demande de ${amount.toLocaleString()} ${selectedCountry.currency} via ${operator} est en cours de contrôle financier.`,
      type: 'withdrawal',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog(
      'Demande de retrait Mobile Money',
      `Retrait de ${amount} ${selectedCountry.currency} via ${operator} vers ${phone}`,
      'Section 20 - Workflow de retrait'
    );

    return { 
      success: true, 
      message: `Votre demande de retrait de ${amount.toLocaleString()} ${selectedCountry.currency} vers ${operator} a été enregistrée avec succès.` 
    };
  };

  const processWithdrawalAdmin = (withdrawalId: string, action: 'approve' | 'payout' | 'reject', reason?: string) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id !== withdrawalId) return w;
      if (action === 'approve') {
        return { ...w, status: 'approved' };
      }
      if (action === 'payout') {
        return { 
          ...w, 
          status: 'payout_sent', 
          processedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          transactionRef: `${w.operator.toUpperCase().slice(0, 3)}-CI-${Date.now().toString().slice(-6)}`
        };
      }
      if (action === 'reject') {
        return { 
          ...w, 
          status: 'rejected', 
          rejectReason: reason || 'Non conformité des justificatifs ou contestation' 
        };
      }
      return w;
    }));

    if (action === 'reject') {
      const target = withdrawals.find(w => w.id === withdrawalId);
      if (target) {
        // Reimburse amount into user ledger
        const reimbursement: LedgerEntry = {
          id: `ldg-${Date.now()}`,
          userId: target.userId,
          amount: target.amount,
          currency: target.currency,
          type: 'adjustment',
          origin: `Remboursement suite au rejet du retrait #${withdrawalId}`,
          status: 'completed',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reference: `REIMB-${withdrawalId}`,
          notes: reason
        };
        setLedger(l => [reimbursement, ...l]);
      }
    }

    addAuditLog(
      `Traitement Retrait (${action.toUpperCase()})`,
      `Retrait #${withdrawalId} marqué ${action}. Raison: ${reason || 'Vérification effectuée'}`,
      'Section 25 & 20 - Contrôle financier'
    );
  };

  // Mobile Money Activation & 14-day retraction (Section 6 & 39 Condition 2)
  const activateAccountWithMobileMoney = (
    plan: 'premium' | 'business', 
    operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money', 
    phone: string
  ) => {
    const cost = plan === 'premium' ? 9900 : 25000;
    
    // Check spending limit (Financial Protection)
    if (currentUser.spentThisMonth + cost > currentUser.spendingLimitMonthly) {
      alert(`Plafond de dépense mensuel dépassé (${currentUser.spendingLimitMonthly.toLocaleString()} XOF max). Vous pouvez l'ajuster dans vos paramètres éthiques.`);
      return false;
    }

    setCurrentUser(prev => ({
      ...prev,
      role: 'member_premium',
      subscriptionPlan: plan,
      isActivated: true,
      activationDate: new Date().toISOString().replace('T', ' ').slice(0, 10),
      spentThisMonth: prev.spentThisMonth + cost,
      level: prev.level === 'Starter' ? 'Bronze' : prev.level
    }));

    // Register into ledger
    const entry: LedgerEntry = {
      id: `ldg-${Date.now()}`,
      userId: currentUser.id,
      amount: cost,
      currency: selectedCountry.currency,
      type: 'activation_payment',
      origin: `Activation Pack ${plan.toUpperCase()} via ${operator} (${phone})`,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reference: `ACT-${Date.now().toString().slice(-6)}`,
      operator,
      operatorReference: `${operator.slice(0, 2).toUpperCase()}-PAY-${Date.now().toString().slice(-5)}`,
      notes: 'Donne accès immédiat aux outils IA, Académie avancée et missions premium. Droit de rétractation 7 jours actif.'
    };
    setLedger(prev => [entry, ...prev]);

    // Ethical affiliate commission on real sale
    if (currentUser.referredBy) {
      const commissionAmount = Math.round(cost * 0.15); // 15% capped ethical commission
      const commissionEntry: LedgerEntry = {
        id: `ldg-com-${Date.now()}`,
        userId: 'usr_kouame_01', // demo sponsor
        amount: commissionAmount,
        currency: selectedCountry.currency,
        type: 'commission',
        origin: `Affiliation Niveau 1 : Vente réelle Pack ${plan.toUpperCase()}`,
        status: 'completed',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reference: `COM-${Date.now().toString().slice(-6)}`,
        notes: 'Commission sur vente réelle d\'un produit tangible'
      };
      setLedger(prev => [commissionEntry, ...prev]);
    }

    addAuditLog(
      'Paiement Activation Mobile Money',
      `Activation réussie du compte ${currentUser.id} au pack ${plan} (${cost} XOF via ${operator})`,
      'Activation & Mobile Money'
    );

    return true;
  };

  const requestRetractionRefund = (reason: string) => {
    // 7 days retraction with Mobile Money refund
    if (!currentUser.isActivated || currentUser.subscriptionPlan === 'free') {
      return { success: false, message: "Vous n'avez aucun abonnement payant actif éligible au remboursement." };
    }

    const refundAmount = currentUser.subscriptionPlan === 'premium' ? 9900 : 25000;

    setCurrentUser(prev => ({
      ...prev,
      role: 'member',
      subscriptionPlan: 'free',
      spentThisMonth: Math.max(0, prev.spentThisMonth - refundAmount)
    }));

    const refundEntry: LedgerEntry = {
      id: `ldg-ref-${Date.now()}`,
      userId: currentUser.id,
      amount: refundAmount,
      currency: selectedCountry.currency,
      type: 'refund',
      origin: `Rétractation légale 7 jours : Remboursement Mobile Money`,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reference: `REF-${Date.now().toString().slice(-6)}`,
      operator: 'Wave',
      operatorReference: `WAVE-REFUND-${Date.now().toString().slice(-4)}`,
      notes: `Motif fourni : ${reason}`
    };

    setLedger(prev => [refundEntry, ...prev]);

    addAuditLog(
      'Rétractation & Remboursement Mobile Money',
      `Remboursement de ${refundAmount} XOF accordé pour ${currentUser.email}. Motif: ${reason}`,
      'Charte Éthique : Droit de rétractation 7 jours'
    );

    return { 
      success: true, 
      message: `Votre rétractation a été validée conformément à nos engagements éthiques. Le montant de ${refundAmount.toLocaleString()} ${selectedCountry.currency} a été re-crédité et transféré par Mobile Money.` 
    };
  };

  const updateMonthlySpendingLimit = (amount: number) => {
    setCurrentUser(prev => ({ ...prev, spendingLimitMonthly: amount }));
    addAuditLog('Ajustement plafond de dépense', `Plafond mensuel fixé à ${amount} XOF pour protection financière`, 'Charte Éthique : Protection financière');
  };

  // Tasks & Submissions
  const submitTaskProof = (taskId: string, proofType: 'url' | 'text' | 'screenshot', content: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Mission introuvable.' };

    const newSubmission: TaskSubmission = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      taskId,
      taskTitle: task.title,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      proofType,
      proofContent: content,
      status: task.verificationType === 'automatic' ? 'approved' : 'pending',
      rewardAmount: task.rewardAmount,
      feedback: task.verificationType === 'automatic' ? 'Validation automatique instantanée.' : undefined,
      verifiedAt: task.verificationType === 'automatic' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
      verifiedBy: task.verificationType === 'automatic' ? 'Algorithme vérificateur' : undefined
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // Update quota
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, quotaCurrent: t.quotaCurrent + 1 } : t));

    if (task.verificationType === 'automatic') {
      // Credit wallet ledger immediately
      const entry: LedgerEntry = {
        id: `ldg-${Date.now()}`,
        userId: currentUser.id,
        amount: task.rewardAmount,
        currency: task.currency,
        type: 'reward',
        origin: `Mission #${task.id} : ${task.title}`,
        status: 'completed',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reference: `TSK-${Date.now().toString().slice(-6)}`,
        notes: 'Récompense déterministe créditée (Zéro hasard, Section 15)'
      };
      setLedger(prev => [entry, ...prev]);

      // Add points
      setCurrentUser(prev => ({
        ...prev,
        points: prev.points + Math.round(task.rewardAmount / 10),
        level: prev.points > 1000 ? 'Silver' : (prev.points > 300 ? 'Bronze' : 'Starter')
      }));

      return { 
        success: true, 
        message: `Félicitations ! Mission validée automatiquement. Vous recevez ${task.rewardAmount.toLocaleString()} ${task.currency}.` 
      };
    }

    return { 
      success: true, 
      message: `Votre participation a été soumise. Elle sera vérifiée sous 24h par l'équipe de modération.` 
    };
  };

  const reviewSubmissionAdmin = (submissionId: string, status: 'approved' | 'rejected', feedback?: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    setSubmissions(prev => prev.map(s => {
      if (s.id !== submissionId) return s;
      return {
        ...s,
        status,
        feedback: feedback || (status === 'approved' ? 'Preuve vérifiée et conforme.' : 'Preuve incomplète ou non vérifiable.'),
        verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        verifiedBy: `${currentUser.firstName} ${currentUser.lastName}`
      };
    }));

    if (status === 'approved') {
      const entry: LedgerEntry = {
        id: `ldg-${Date.now()}`,
        userId: sub.userId,
        amount: sub.rewardAmount,
        currency: selectedCountry.currency,
        type: 'reward',
        origin: `Validation manuelle Mission : ${sub.taskTitle}`,
        status: 'completed',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reference: `TSK-VAL-${submissionId}`,
        notes: 'Validé par modérateur'
      };
      setLedger(prev => [entry, ...prev]);
    }

    addAuditLog(
      `Revue Mission (${status.toUpperCase()})`,
      `Soumission #${submissionId} traitée pour ${sub.userName}. Montant: ${sub.rewardAmount} XOF`,
      'Section 10 & 25 - Gestion des micro-jobs'
    );
  };

  const createTaskAdmin = (newTaskData: Omit<Task, 'id' | 'quotaCurrent'>) => {
    const created: Task = {
      ...newTaskData,
      id: `tsk-${(tasks.length + 1).toString().padStart(3, '0')}`,
      quotaCurrent: 0
    };
    setTasks(prev => [created, ...prev]);
    addAuditLog('Création Mission', `Nouvelle mission créée : ${created.title} (${created.rewardAmount} ${created.currency})`, 'Section 10');
  };

  // Courses & Quiz
  const enrollInCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      if (c.enrolledUserIds.includes(currentUser.id)) return c;
      return { ...c, enrolledUserIds: [...c.enrolledUserIds, currentUser.id] };
    }));
  };

  const submitCourseQuiz = (courseId: string, userAnswers: Record<string, number>) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.quiz) return { passed: false, score: 0, pointsEarned: 0 };

    let correctCount = 0;
    course.quiz.questions.forEach((q, idx) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / course.quiz.questions.length) * 100);
    const passed = score >= course.quiz.passingScore;
    const pointsEarned = passed ? course.quiz.rewardPoints : 0;

    if (passed) {
      setUserCertificates(prev => [
        ...prev,
        {
          courseId,
          courseTitle: course.title,
          issueDate: new Date().toLocaleDateString('fr-FR'),
          score
        }
      ]);

      setCurrentUser(prev => ({
        ...prev,
        points: prev.points + pointsEarned,
        level: prev.points + pointsEarned > 1000 ? 'Silver' : 'Bronze'
      }));

      // Record in notifications
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: 'Certificat Académie obtenu !',
        message: `Félicitations pour votre réussite au cours "${course.title}" avec un score de ${score}%. +${pointsEarned} points !`,
        type: 'reward',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    }

    return { passed, score, pointsEarned };
  };

  // VCF Download
  const downloadVCFResource = (resourceId: string) => {
    const res = vcfResources.find(r => r.id === resourceId);
    if (!res) return { success: false, message: 'Ressource introuvable.' };

    if (res.requiredPlan === 'premium' && currentUser.subscriptionPlan === 'free') {
      return { success: false, message: 'Cette ressource VCF vérifiée nécessite un compte Premium actif.' };
    }

    addAuditLog('Téléchargement VCF', `Téléchargement du répertoire "${res.title}" par ${currentUser.email}`, 'Section 17 - VCF et ressources Premium');
    return { success: true, message: `Fichier "${res.title}.vcf" téléchargé avec succès.` };
  };

  // Community Posts
  const createPost = (content: string, category: CommunityPost['category']) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorRole: currentUser.role,
      authorLevel: currentUser.level,
      content,
      category,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      likes: 0,
      commentsCount: 0,
      reportsCount: 0,
      isOfficial: currentUser.role === 'admin' || currentUser.role === 'super_admin'
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const reportPost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, reportsCount: p.reportsCount + 1 } : p));
    addAuditLog('Signalement Communauté', `Publication #${postId} signalée pour modération`, 'Section 23 - Communauté & Modération');
  };

  // Support Tickets
  const createTicket = (
    subject: string, 
    category: SupportTicket['category'], 
    priority: SupportTicket['priority'], 
    message: string
  ) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userEmail: currentUser.email,
      subject,
      category,
      priority,
      message,
      status: 'nouveau',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      responses: []
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const replyTicket = (ticketId: string, message: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        responses: [
          ...t.responses,
          {
            sender: currentUser.role === 'support' || currentUser.role === 'admin' ? 'support' : 'user',
            senderName: `${currentUser.firstName} ${currentUser.lastName}`,
            message,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
          }
        ]
      };
    }));
  };

  const resolveTicketAdmin = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolu' } : t));
    addAuditLog('Ticket Résolu', `Ticket #${ticketId} clôturé par le support`, 'Section 24 - Support et centre d\'aide');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // AI Tool Runner (Section 13)
  const runAITool = async (
    toolType: 'copywriter' | 'marketing_ideas' | 'summarizer' | 'prompts',
    input: string,
    tone: string = 'professionnel et engageant'
  ): Promise<string> => {
    setIsAILoading(true);

    const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY;

    try {
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        let promptText = '';
        if (toolType === 'copywriter') {
          promptText = `Tu es l'assistant de rédaction marketing de GLOBAL-AF pour l'Afrique de l'Ouest (Côte d'Ivoire). Rédige une publication captivante sur le ton ${tone} basée sur cette idée : "${input}". Inclus des accroches puissantes, une structure fluide et un appel à l'action orienté WhatsApp/Mobile Money sans fausse promesse.`;
        } else if (toolType === 'marketing_ideas') {
          promptText = `Tu es un consultant en stratégie marketing à Abidjan. Propose 5 idées concrètes, adaptées au marché ivoirien et UEMOA, pour développer cette activité : "${input}". Utilise le Mobile Money (Wave/Orange Money) et WhatsApp Business.`;
        } else if (toolType === 'summarizer') {
          promptText = `Résume de manière synthétique, claire et professionnelle le texte suivant sous forme de 4 points clés majeurs : "${input}".`;
        } else {
          promptText = `Génère 3 prompts avancés et ultra-précis pour une IA générative permettant d'obtenir le meilleur résultat sur le sujet : "${input}".`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText
        });

        if (response.text) {
          setIsAILoading(false);
          return response.text;
        }
      }
    } catch (err) {
      console.warn('Gemini API call bypassed or quota limit, using domain engine generator:', err);
    }

    // Graceful intelligent domain generator fallback tailored to Côte d'Ivoire & West Africa
    await new Promise(r => setTimeout(r, 650));
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

  const resetDataToDefault = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_CURRENT_USER);
    setLedger(INITIAL_LEDGER);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setTasks(INITIAL_TASKS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setCourses(INITIAL_COURSES);
    setPosts(INITIAL_POSTS);
    setTickets(INITIAL_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUserCertificates([]);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setRiskAlerts(INITIAL_RISK_ALERTS);
    alert('Les données de démonstration ont été réinitialisées.');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchProfile,
      updateUserRole,
      updateProfile,
      selectedCountry,
      setCountryCode,
      wallet,
      ledger,
      withdrawals,
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
      ethicalIndicators,
      resetDataToDefault
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
