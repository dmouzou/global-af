import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule, QuizQuestion, CourseQuiz } from '../../types';
import { BabiMascot } from '../common/BabiMascot';
import { 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  Layers,
  FileCheck,
  Lock,
  Unlock,
  Check,
  HelpCircle,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  X,
  Timer
} from 'lucide-react';

interface AcademyPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

interface CourseUserProgress {
  completedModules: string[];
  passedQuizzes: string[];
  finalQuizScore?: number;
  isCertified: boolean;
  certifiedAt?: string;
  certificateId?: string;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { courses, currentUser } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all');
  
  // Interactive progress state per course (empty by default, requires login to save)
  const [progressState, setProgressState] = useState<Record<string, CourseUserProgress>>({
    'crs-001': {
      completedModules: [],
      passedQuizzes: [],
      isCertified: false
    },
    'crs-002': {
      completedModules: [],
      passedQuizzes: [],
      isCertified: false
    },
    'crs-003': {
      completedModules: [],
      passedQuizzes: [],
      isCertified: false
    },
    'crs-004': {
      completedModules: [],
      passedQuizzes: [],
      isCertified: false
    }
  });

  // State for active checkpoint quiz
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, number>>({});
  const [checkpointSubmitted, setCheckpointSubmitted] = useState<Record<string, boolean>>({});

  // State for Final Quiz (40 questions chronométrées en 45 minutes)
  const [isFinalQuizOpen, setIsFinalQuizOpen] = useState<boolean>(false);
  const [finalQuizAnswers, setFinalQuizAnswers] = useState<Record<string, number>>({});
  const [finalQuizSubmitted, setFinalQuizSubmitted] = useState<boolean>(false);
  const [finalQuizScore, setFinalQuizScore] = useState<number>(0);
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(2700); // 45 minutes

  // Countdown timer for certification exam
  useEffect(() => {
    if (!isFinalQuizOpen || finalQuizSubmitted) return;
    const timer = setInterval(() => {
      setExamSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGradeFinalQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinalQuizOpen, finalQuizSubmitted]);

  const formatExamTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // State for Certificate Modal
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Helper to calculate course progress percentage (0% if unauthenticated)
  const getCourseProgress = (course: Course): number => {
    if (!currentUser) return 0;
    const progress = progressState[course.id];
    if (!progress) return 0;
    if (progress.isCertified) return 100;
    
    const totalSteps = course.modules.length + (course.quiz ? 1 : 0);
    const completedSteps = progress.completedModules.length + (progress.isCertified ? 1 : 0);
    return Math.min(100, Math.round((completedSteps / totalSteps) * 100));
  };

  const isUserPremium = currentUser 
    ? (currentUser.role === 'member_premium' || currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business') 
    : false;
  const isCourseLocked = selectedCourse.isPremium && !isUserPremium;

  const currentCourseProgress = currentUser ? (progressState[selectedCourse.id] || {
    completedModules: [],
    passedQuizzes: [],
    isCertified: false
  }) : {
    completedModules: [],
    passedQuizzes: [],
    isCertified: false
  };

  const activeModule = selectedCourse.modules[activeModuleIndex] || selectedCourse.modules[0];
  const isCurrentModuleCompleted = currentCourseProgress.completedModules.includes(activeModule.id);

  // Handle module checkpoint quiz answer
  const handleSelectCheckpointAnswer = (questionId: string, optionIndex: number) => {
    if (!currentUser) {
      onOpenAuth('signup');
      return;
    }
    setCheckpointAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  // Validate palier checkpoint quiz (requires all questions correct)
  const handleValidateCheckpointQuiz = (quiz: CourseQuiz, moduleId: string) => {
    if (!currentUser) {
      onOpenAuth('signup');
      return;
    }
    const allAnswered = quiz.questions.every(q => checkpointAnswers[q.id] !== undefined);
    if (!allAnswered) return;

    setCheckpointSubmitted(prev => ({ ...prev, [quiz.id]: true }));

    const allCorrect = quiz.questions.every(q => checkpointAnswers[q.id] === q.correctAnswerIndex);

    if (allCorrect) {
      // Mark palier as completed & quiz passed
      setProgressState(prev => {
        const current = prev[selectedCourse.id] || { completedModules: [], passedQuizzes: [], isCertified: false };
        const newCompleted = current.completedModules.includes(moduleId) 
          ? current.completedModules 
          : [...current.completedModules, moduleId];
        const newPassed = current.passedQuizzes.includes(quiz.id)
          ? current.passedQuizzes
          : [...current.passedQuizzes, quiz.id];
        
        return {
          ...prev,
          [selectedCourse.id]: {
            ...current,
            completedModules: newCompleted,
            passedQuizzes: newPassed
          }
        };
      });
    }
  };

  // Complete a module without quiz or advance to next
  const handleAdvanceModule = () => {
    setProgressState(prev => {
      const current = prev[selectedCourse.id] || { completedModules: [], passedQuizzes: [], isCertified: false };
      const newCompleted = current.completedModules.includes(activeModule.id)
        ? current.completedModules
        : [...current.completedModules, activeModule.id];

      return {
        ...prev,
        [selectedCourse.id]: {
          ...current,
          completedModules: newCompleted
        }
      };
    });

    if (activeModuleIndex < selectedCourse.modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
    } else {
      // All modules done, open final quiz!
      setIsFinalQuizOpen(true);
    }
  };

  // Handle final quiz submission
  const handleGradeFinalQuiz = () => {
    if (!selectedCourse.quiz) return;
    
    const questions = selectedCourse.quiz.questions;
    let correctCount = 0;

    questions.forEach(q => {
      if (finalQuizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    setFinalQuizScore(scorePercent);
    setFinalQuizSubmitted(true);

    if (scorePercent >= selectedCourse.quiz.passingScore) {
      const certId = `GA-CERT-CI-${Math.floor(100000 + Math.random() * 900000)}`;
      setProgressState(prev => ({
        ...prev,
        [selectedCourse.id]: {
          completedModules: selectedCourse.modules.map(m => m.id),
          passedQuizzes: [...(prev[selectedCourse.id]?.passedQuizzes || []), selectedCourse.quiz!.id],
          isCertified: true,
          finalQuizScore: scorePercent,
          certifiedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
          certificateId: certId
        }
      }));
      setShowCertificateModal(true);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(c => {
    if (activeTab === 'free') return !c.isPremium;
    if (activeTab === 'premium') return c.isPremium;
    return true;
  });

  const memberMatricule = currentUser?.memberNumber || 'GA-CI-2026-0001';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header with 3D Mascot */}
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 rounded-3xl p-6 sm:p-8 border border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold shadow-2xs">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span>Digital Academy Côte d'Ivoire · Certifications Reconnues</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Formations Pratiques & Évaluations Certifiantes
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Montez en compétences avec des parcours conçus pour l'écosystème ivoirien. Validez chaque palier par un quiz de contrôle, réussissez l'examen final et recevez votre <span className="font-bold text-slate-800">Attestation Numérique Certifiée</span>.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-orange-200/80 shadow-md">
            <BabiMascot 
              variant="academic" 
              size="lg" 
              speechBubble="Chaque palier validé vous rapproche de votre certification officielle de 40 questions ! Bon courage !" 
            />
          </div>
        </div>

        {/* Featured Course Player / Interactive Study Station */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          
          {/* Subtle Ambient Flag Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-8">
            
            {/* Top Bar: Badges & Progress Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {selectedCourse.category}
                </span>

                {selectedCourse.isPremium ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Réservé Membre Premium</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Accès Libre & Gratuit</span>
                  </span>
                )}

                {currentCourseProgress.isCertified && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md animate-pulse">
                    <Award className="w-3.5 h-3.5" />
                    <span>Certifié GLOBAL-AF</span>
                  </span>
                )}
              </div>

              {/* Course Progress Bar Display (Guarded by authentication) */}
              {currentUser ? (
                <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Progression du cours</div>
                    <div className="text-xs font-notable text-orange-400">
                      {getCourseProgress(selectedCourse)}% {currentCourseProgress.isCertified ? '· VALIDÉ' : ''}
                    </div>
                  </div>
                  <div className="w-28 sm:w-36 bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getCourseProgress(selectedCourse)}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-orange-500/40 text-xs text-slate-300 hover:text-white transition-all shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <div className="text-left">
                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Progression du cours : 0%</div>
                    <div className="text-xs font-bold text-orange-400">Connectez-vous pour sauvegarder</div>
                  </div>
                </button>
              )}
            </div>

            {/* Course Headline & Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {selectedCourse.description}
                </p>

                {/* Course Metadata pills */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{Math.round(selectedCourse.durationHours * 60)} minutes totales</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span>{selectedCourse.modules.length} paliers avec quiz individuel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Quiz final de certification</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Niveau :</span>
                    <span className="font-semibold text-white">{selectedCourse.level}</span>
                  </div>
                </div>
              </div>

              {/* Price / Enrollment Card */}
              <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Tarif Formation</span>
                  {selectedCourse.isPremium ? (
                    <div className="text-right">
                      <span className="text-lg font-notable text-amber-400">
                        {selectedCourse.priceXOF?.toLocaleString()} FCFA
                      </span>
                      <span className="block text-[10px] text-slate-400">Inclus dans l'abonnement Premium</span>
                    </div>
                  ) : (
                    <span className="text-sm font-notable text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
                      GRATUIT (0 FCFA)
                    </span>
                  )}
                </div>

                {isCourseLocked ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Ce cours certifiant est réservé aux membres Premium. Passez au niveau supérieur pour débloquer l'accès complet.</span>
                    </div>
                    <button
                      onClick={() => onGoToDashboard()}
                      className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Débloquer avec le Pass Premium</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {currentCourseProgress.isCertified ? (
                      <button
                        onClick={() => setShowCertificateModal(true)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        <span>Voir mon Attestation Certifiée</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            onOpenAuth('signup');
                            return;
                          }
                          const el = document.getElementById('module-reader-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{currentUser ? 'Continuer la formation' : 'Commencer la formation'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Paliers / Module Stepper Bar - UNIFORM NUMBERING 1, 2, 3, 4 */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Parcours par Paliers ({selectedCourse.modules.length} paliers + Quiz Final)</span>
                <span className="text-[11px] text-orange-400 lowercase font-mono">
                  {currentCourseProgress.completedModules.length} sur {selectedCourse.modules.length} terminés
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedCourse.modules.map((mod, idx) => {
                  const isDone = currentCourseProgress.completedModules.includes(mod.id);
                  const isSelected = activeModuleIndex === idx && !isFinalQuizOpen;
                  const stepNumber = idx + 1;

                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuth('signup');
                          return;
                        }
                        setActiveModuleIndex(idx);
                        setIsFinalQuizOpen(false);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 relative ${
                        isSelected 
                          ? 'bg-orange-500/20 border-orange-500 text-white shadow-xs' 
                          : isDone 
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200 hover:bg-slate-800'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      {/* Consistent Step Badge with uniform number and checkmark if done */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-extrabold ${
                        isDone 
                          ? 'bg-emerald-500 text-slate-950' 
                          : isSelected 
                            ? 'bg-orange-500 text-white shadow-xs' 
                            : 'bg-slate-700 text-slate-300'
                      }`}>
                        {isDone ? (
                          <div className="flex items-center gap-0.5">
                            <span>{stepNumber}</span>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span>{stepNumber}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          Palier {stepNumber}
                        </div>
                        <div className="text-xs font-bold truncate text-slate-200">
                          {mod.title.replace(/^Palier \d+ : /, '')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                          <span>{mod.durationMinutes} min</span>
                          {mod.checkpointQuiz && <span className="text-amber-400">· Avec quiz</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Final Certification Step in Stepper - Uniform Number 4 */}
                <button
                  onClick={() => {
                    if (!currentUser) {
                      onOpenAuth('signup');
                      return;
                    }
                    setIsFinalQuizOpen(true);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isFinalQuizOpen 
                      ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500' 
                      : currentCourseProgress.isCertified
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-extrabold ${
                    currentCourseProgress.isCertified 
                      ? 'bg-emerald-500 text-slate-950' 
                      : isFinalQuizOpen
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  }`}>
                    {currentCourseProgress.isCertified ? (
                      <div className="flex items-center gap-0.5">
                        <span>{selectedCourse.modules.length + 1}</span>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span>{selectedCourse.modules.length + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span>Palier {selectedCourse.modules.length + 1}</span>
                      <span>· Étape Finale</span>
                    </div>
                    <div className="text-xs font-bold truncate text-white">
                      Quiz de Certification
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {currentCourseProgress.isCertified ? '✓ Diplômé avec succès' : 'Validation diplôme'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Active Module Lesson & Checkpoint Quiz Viewer */}
        <div id="module-reader-section" className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
          
          {!isFinalQuizOpen ? (
            /* PALIER MODULE CONTENT + CHECKPOINT QUIZ */
            <div className="space-y-8">
              
              {/* Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Palier {activeModuleIndex + 1} sur {selectedCourse.modules.length}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {activeModule.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Durée estimée : {activeModule.durationMinutes} minutes</span>
                </div>
              </div>

              {/* Course Lesson Body */}
              <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                <p className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-slate-800 leading-relaxed font-normal">
                  {activeModule.content}
                </p>

                {/* Key Takeaways Card */}
                {activeModule.keyTakeaways && activeModule.keyTakeaways.length > 0 && (
                  <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
                    <h4 className="font-bold text-orange-950 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span>Points clés à retenir pour l'évaluation :</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {activeModule.keyTakeaways.map((takeaway, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Unauthenticated User Callout */}
              {!currentUser && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-slate-100 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-600 shrink-0 shadow-2xs">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold text-slate-900">Accès Réservé aux Membres GLOBAL-AF</div>
                      <div className="text-[11px] sm:text-xs text-slate-600">Vous consultez un extrait libre. Créez votre compte gratuit pour valider vos paliers et passer l'examen officiel.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Créer mon compte gratuit
                  </button>
                </div>
              )}

              {/* PALIER CHECKPOINT QUIZ SECTION */}
              {activeModule.checkpointQuiz && (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Quiz de Contrôle du Palier {activeModuleIndex + 1}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        {activeModule.checkpointQuiz.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Répondez aux questions ci-dessous pour valider ce palier et débloquer la suite.
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-notable text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        +{activeModule.checkpointQuiz.rewardPoints} PTS
                      </span>
                    </div>
                  </div>

                  {/* Multi-Question Container */}
                  <div className="space-y-5">
                    {activeModule.checkpointQuiz.questions.map((q, qIndex) => {
                      const selectedIdx = checkpointAnswers[q.id];
                      const isSubmitted = checkpointSubmitted[activeModule.checkpointQuiz!.id];
                      const isCorrect = selectedIdx === q.correctAnswerIndex;

                      return (
                        <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-start gap-2">
                            <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {qIndex + 1}
                            </span>
                            <span>{q.question}</span>
                          </div>

                          <div className="space-y-2 pl-7">
                            {q.options.map((opt, optIdx) => {
                              const isThisSelected = selectedIdx === optIdx;
                              let btnStyle = 'bg-white border-slate-200 hover:border-orange-300 text-slate-700';

                              if (isSubmitted) {
                                if (optIdx === q.correctAnswerIndex) {
                                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                                } else if (isThisSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                                }
                              } else if (isThisSelected) {
                                btnStyle = 'bg-orange-50 border-orange-500 text-orange-950 font-semibold ring-1 ring-orange-500';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={isSubmitted && isCorrect}
                                  onClick={() => handleSelectCheckpointAnswer(q.id, optIdx)}
                                  className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span>{opt}</span>
                                  </div>

                                  {isSubmitted && (
                                    <span className="shrink-0 text-xs font-bold">
                                      {optIdx === q.correctAnswerIndex ? '✓ Exact' : (isThisSelected ? '✗ Faux' : '')}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Individual feedback if submitted */}
                          {isSubmitted && (
                            <div className={`mt-2 pl-7 text-xs p-3 rounded-xl border ${
                              isCorrect ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200' : 'bg-rose-50/80 text-rose-900 border-rose-200'
                            }`}>
                              <span className="font-bold">{isCorrect ? '✓ Exact : ' : '✗ Explication : '}</span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission and Palier Validation Controls */}
                  <div className="pt-2">
                    {!checkpointSubmitted[activeModule.checkpointQuiz.id] ? (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-600">
                          Questions répondues : <strong className="text-slate-900 font-mono">
                            {activeModule.checkpointQuiz.questions.filter(q => checkpointAnswers[q.id] !== undefined).length} / {activeModule.checkpointQuiz.questions.length}
                          </strong>
                        </span>
                        <button
                          disabled={activeModule.checkpointQuiz.questions.some(q => checkpointAnswers[q.id] === undefined)}
                          onClick={() => handleValidateCheckpointQuiz(activeModule.checkpointQuiz!, activeModule.id)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                        >
                          Valider toutes les questions du Palier {activeModuleIndex + 1}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeModule.checkpointQuiz.questions.every(q => checkpointAnswers[q.id] === q.correctAnswerIndex) ? (
                          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                              <span>🎉 Bravo ! Toutes les questions sont validées. Ce palier est validé avec succès.</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 font-notable">
                              +{activeModule.checkpointQuiz.rewardPoints} PTS
                            </span>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs">
                              Certaines réponses sont inexactes. Relisez les explications ci-dessus et retentez votre chance.
                            </div>
                            <button
                              onClick={() => {
                                setCheckpointSubmitted(prev => ({ ...prev, [activeModule.checkpointQuiz!.id]: false }));
                              }}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs"
                            >
                              Réessayer ce quiz
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Bottom Navigation between paliers */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={activeModuleIndex === 0}
                  onClick={() => setActiveModuleIndex(activeModuleIndex - 1)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-xl text-xs font-semibold text-slate-700"
                >
                  ← Palier précédent
                </button>

                <button
                  onClick={handleAdvanceModule}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>
                    {activeModuleIndex < selectedCourse.modules.length - 1 
                      ? 'Passer au palier suivant →' 
                      : 'Accéder au Quiz Final de Certification 🎓'}
                  </span>
                </button>
              </div>

            </div>
          ) : (
            /* FINAL CERTIFICATION EXAM (40 QUESTIONS - 45 MIN) */
            <div className="space-y-6">
              {/* Sticky Exam Progress Bar & Timer */}
              <div className="sticky top-20 z-20 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BabiMascot variant="academic" size="xs" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Examen Certifiant · {selectedCourse.quiz?.questions.length || 40} Questions
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Progression :</span>
                      <span className="text-orange-400 font-mono">
                        {Object.keys(finalQuizAnswers).length} / {selectedCourse.quiz?.questions.length || 40} répondues
                      </span>
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                    examSecondsLeft < 300 
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse' 
                      : 'bg-slate-800 border-slate-700 text-amber-300'
                  }`}>
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span>Temps restant : {formatExamTimer(examSecondsLeft)}</span>
                  </div>

                  <div className="text-xs text-slate-300 hidden sm:block">
                    Seuil de passage : <span className="font-bold text-emerald-400">80% requis (32/40)</span>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Grand Examen de Certification Officielle</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedCourse.quiz?.title || 'Grand Examen Certifiant (40 Questions Chronométrées)'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Épreuve d'évaluation rigoureuse de 40 questions en temps limité (45 min). Une note minimale de <span className="font-bold text-slate-900 font-notable">80% (32/40)</span> est strictement exigée pour délivrer votre attestation certifiée conforme et remporter <span className="font-bold text-emerald-600 font-notable">+{selectedCourse.quiz?.rewardPoints || 200} PTS</span>.
                </p>
              </div>

              {/* Questions List */}
              <div className="space-y-6 max-w-3xl mx-auto">
                {selectedCourse.quiz?.questions.map((question, qIdx) => {
                  const selectedOpt = finalQuizAnswers[question.id];
                  return (
                    <div key={question.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {question.question}
                        </div>
                      </div>

                      <div className="space-y-2 pl-9">
                        {question.options.map((opt, oIdx) => {
                          const isChosen = selectedOpt === oIdx;
                          let optStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';

                          if (finalQuizSubmitted) {
                            if (oIdx === question.correctAnswerIndex) {
                              optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                            } else if (isChosen) {
                              optStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                            }
                          } else if (isChosen) {
                            optStyle = 'bg-orange-50 border-orange-500 text-orange-950 font-semibold ring-1 ring-orange-500';
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={finalQuizSubmitted}
                              onClick={() => setFinalQuizAnswers(prev => ({ ...prev, [question.id]: oIdx }))}
                              className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {finalQuizSubmitted && oIdx === question.correctAnswerIndex && (
                                <span className="text-xs text-emerald-700 font-bold">✓ Réponse exacte</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {finalQuizSubmitted && (
                        <div className="pl-9 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-800">Justification : </span>
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Score & Submission */}
                <div className="pt-4 text-center space-y-4">
                  {!finalQuizSubmitted ? (
                    <button
                      onClick={handleGradeFinalQuiz}
                      disabled={Object.keys(finalQuizAnswers).length < (selectedCourse.quiz?.questions.length || 0)}
                      className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95"
                    >
                      Soumettre l'Examen Final pour Correction
                    </button>
                  ) : (
                    <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 max-w-lg mx-auto shadow-lg">
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Résultat de l'Épreuve</div>
                      <div className="text-4xl font-notable text-amber-400">
                        {finalQuizScore}%
                      </div>
                      <p className="text-xs text-slate-300">
                        {finalQuizScore >= (selectedCourse.quiz?.passingScore || 75) ? (
                          <span className="text-emerald-400 font-bold">
                            Félicitations ! Vous avez validé la certification avec succès.
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold">
                            Score insuffisant (minimum {selectedCourse.quiz?.passingScore}%). Vous pouvez réviser et retenter.
                          </span>
                        )}
                      </p>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        {finalQuizScore >= (selectedCourse.quiz?.passingScore || 75) ? (
                          <button
                            onClick={() => setShowCertificateModal(true)}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
                          >
                            <Award className="w-4 h-4" />
                            <span>Voir mon Attestation</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setFinalQuizSubmitted(false);
                              setFinalQuizAnswers({});
                            }}
                            className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs transition-colors"
                          >
                            Retenter l'épreuve
                          </button>
                        )}
                        <button
                          onClick={() => setIsFinalQuizOpen(false)}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                        >
                          Retour au cours
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Catalog of all courses with individual progress bars and certified badges */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Catalogue Complet des Formations & Certifications
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Suivez votre avancement en temps réel pour chaque compétence.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Toutes ({courses.length})
              </button>
              <button
                onClick={() => setActiveTab('free')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'free' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Standard Gratuites
              </button>
              <button
                onClick={() => setActiveTab('premium')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'premium' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Réservées Premium
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const isSelected = selectedCourse.id === course.id;
              const progress = getCourseProgress(course);
              const courseData = progressState[course.id];
              const isCertified = courseData?.isCertified;
              const isPremiumLocked = course.isPremium && !isUserPremium;

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setActiveModuleIndex(0);
                    setIsFinalQuizOpen(false);
                    const el = document.getElementById('module-reader-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-6 bg-white rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 hover:shadow-md ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {course.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {isCertified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Certifié</span>
                          </span>
                        ) : course.isPremium ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>Réservé Premium</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            Gratuit
                          </span>
                        )}
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.round(course.durationHours * 60)} min
                        </span>
                      </div>
                    </div>

                    {/* Course Title & Description */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1.5">
                        {course.description}
                      </p>
                    </div>

                    {/* PROGRESS BAR SECTION PER COURSE */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          {isCertified ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Layers className="w-3.5 h-3.5 text-orange-600" />
                          )}
                          <span>
                            {isCertified ? 'Parcours validé & certifié' : 'Progression pédagogique'}
                          </span>
                        </span>
                        <span className="font-notable text-slate-800 text-xs">
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCertified ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{course.modules.length} paliers avec quiz</span>
                        {isCertified ? (
                          <span className="text-emerald-700 font-bold">Attestation délivrée</span>
                        ) : (
                          <span>{(courseData?.completedModules.length || 0)} palier(s) validé(s)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {course.isPremium ? (
                        <span className="text-xs font-notable text-amber-700">
                          {course.priceXOF?.toLocaleString()} FCFA
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700">
                          Accès Libre
                        </span>
                      )}
                    </div>

                    <button 
                      className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700'
                      }`}
                    >
                      <span>{isCertified ? 'Revoir la formation' : 'Suivre ce cours'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* OFFICIAL CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 text-white text-center relative border-b-4 border-orange-500">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7700] via-amber-500 to-[#009E49] p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-notable text-xs">
                    GA
                  </div>
                </div>
                <span className="font-notable tracking-tight text-lg">
                  GLOBAL<span className="text-orange-400">-AF</span>
                </span>
              </div>
              <h3 className="text-xs uppercase tracking-widest text-orange-400 font-bold">
                Digital Academy · République de Côte d'Ivoire
              </h3>
              <div className="text-xl sm:text-2xl font-bold mt-1 text-white">
                Attestation Numérique de Réussite
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-8 space-y-6 text-center bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
              
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Il est officiellement certifié que :
              </p>

              {/* Student Name */}
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Apprenant Certifié'}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs">
                  <span className="text-slate-500">Matricule Officiel :</span>
                  <span className="font-notable text-slate-900">{memberMatricule}</span>
                </div>
              </div>

              {/* Course Completed Statement */}
              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-xs text-slate-600 leading-relaxed">
                  A validé avec succès l'ensemble des modules d'évaluation pratique et satisfait à l'examen de certification de la formation :
                </p>
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-sm font-bold text-slate-900">
                  {selectedCourse.title}
                </div>
              </div>

              {/* Certificate Verification Details */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-left">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">ID Certificat</div>
                  <div className="text-xs font-notable text-slate-800">
                    {currentCourseProgress.certificateId || 'GA-CERT-CI-9042'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Points Reçus</div>
                  <div className="text-xs font-notable text-emerald-600">
                    +{(selectedCourse.quiz?.rewardPoints || 120)} PTS
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Date de Validation</div>
                  <div className="text-xs font-medium text-slate-800">
                    {currentCourseProgress.certifiedAt || new Date().toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* Official Seal / Signature Stamp */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Vérifié & Signé Numériquement</div>
                    <div className="text-[10px] text-slate-500">Inviolabilité conforme à la charte éthique</div>
                  </div>
                </div>

                {/* Prestigious Mascot Seal */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 rounded-2xl border border-orange-300 shadow-xs">
                  <img
                    src="/images/mascot-academy.jpg"
                    alt="Sceau Babi l'Éléphant Diplômé"
                    className="w-9 h-9 rounded-full object-cover border-2 border-amber-500 shadow-xs"
                  />
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold text-orange-950">Sceau d'Honneur</div>
                    <div className="text-[10px] font-extrabold text-orange-600">Babi Académie 🇨🇮</div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => alert(`Téléchargement de l'attestation ${currentCourseProgress.certificateId || 'GA-CERT-CI-9042'} au format PDF en cours...`)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger en PDF</span>
                </button>
                <button
                  onClick={() => {
                    const text = `Je viens d'obtenir ma certification "${selectedCourse.title}" sur la Digital Academy GLOBAL-AF Côte d'Ivoire ! Matricule : ${memberMatricule}`;
                    navigator.clipboard?.writeText(text);
                    alert("Texte copié dans le presse-papier pour WhatsApp ou LinkedIn !");
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager mon succès</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
