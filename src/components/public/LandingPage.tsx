import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Award, 
  BookOpen, 
  Sparkles, 
  Users, 
  Check, 
  HelpCircle, 
  ExternalLink, 
  DollarSign, 
  Briefcase, 
  AlertTriangle, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lock,
  Zap,
  TrendingUp,
  Building
} from 'lucide-react';
import { Task } from '../../types';
import { OperatorLogo } from '../common/OperatorLogo';
import { BabiMascot } from '../common/BabiMascot';
import { FAQGemini } from './FAQGemini';

interface LandingPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectTask: (task: Task) => void;
  onNavigatePage?: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDashboard, onOpenAuth, onSelectTask, onNavigatePage }) => {
  const { selectedCountry, tasks, ethicalIndicators } = useApp();
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: "Comment fonctionne la rémunération sur GLOBAL-AF ?",
      a: "Vous gagnez des récompenses en réalisant des micro-missions numériques vérifiées (sondages, tests d'applications locales, revues de contenu) ou en vendant de réels produits utiles (formations, abonnements). Toutes les rémunérations sont fixes et déterministes. Aucun hasard n'intervient jamais."
    },
    {
      q: "Qu'est-ce que la charte éthique et transparence de GLOBAL-AF ?",
      a: "C'est notre règle fondamentale inviolable : 1. Commissions calculées exclusivement sur des ventes réelles (jamais sur les frais d'inscription). 2. Rétractation garantie de 7 jours avec remboursement Mobile Money. 3. Transparence totale sur les indicateurs de gains sans slogans trompeurs. 4. Interdiction absolue des jeux de hasard et des tombolas. 5. Protection des membres avec plafonds de dépenses configurables."
    },
    {
      q: "Quels opérateurs Mobile Money sont acceptés en Côte d'Ivoire ?",
      a: "Nous supportons nativement Wave, Orange Money, MTN MoMo et Moov Money, aussi bien pour les paiements d'activation que pour les retraits de vos gains à partir de 2 000 FCFA."
    },
    {
      q: "Le compte gratuit permet-il vraiment de gagner de l'argent et de retirer ?",
      a: "Absolument. Conformément à nos engagements de transparence, un palier gratuit réellement utile est disponible. Les membres gratuits ont accès aux micro-jobs standard, à des modules de formation et peuvent retirer l'intégralité de leurs gains sans obligation d'achat."
    },
    {
      q: "Comment s'applique le droit de rétractation de 7 jours ?",
      a: "Le délai de rétractation de 7 jours avec remboursement intégral Mobile Money s'applique exclusivement à l'abonnement mensuel VIP Premium (9 900 FCFA/mois). Il ne s'applique pas au Pass Membre Standard (3 000 FCFA), dont la fourniture et l'accès numérique aux formations et micro-jobs sont immédiats. De plus, les commissions d'affiliation (10%, soit 990 FCFA) sont conservées en réserve de sécurité pendant 7 jours et ne sont définitivement versées au parrain qu'une fois ce délai de rétractation expiré."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      
      {/* HERO SECTION WITH CINEMATIC BACKGROUND PHOTO CAROUSEL (Netflix / Lupin Aesthetic) */}
      <section 
        className="relative overflow-hidden min-h-[620px] sm:min-h-[680px] flex flex-col justify-between border-b border-slate-800 bg-slate-950 text-white select-none"
      >
        {/* Dynamic High-Contrast Background Photos - Vivid and clearly visible */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[
            '/images/hero-freelancers.jpg',
            '/images/academy-student.jpg',
            '/images/mobile-money-success.jpg',
            '/images/support-agent.jpg'
          ].map((bgImg, idx) => (
            <img 
              key={bgImg}
              src={bgImg} 
              alt="GLOBAL-AF Côte d'Ivoire" 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                currentSlideIndex === idx ? 'opacity-80 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))}
          {/* Cinematic Scrim: Dark on the left for crisp text contrast, gentle fade out to reveal photos */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Carousel Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Dynamic Informative Slide Content with Maximum Space */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              
              {/* Slide 0: Plateforme Éthique de Micro-Jobs */}
              {currentSlideIndex === 0 && (
                <div className="space-y-4 text-left animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                    <div className="flex items-center h-2.5 w-4 rounded-xs overflow-hidden border border-slate-400">
                      <span className="w-1/3 h-full bg-[#FF7700]"></span>
                      <span className="w-1/3 h-full bg-white"></span>
                      <span className="w-1/3 h-full bg-[#009E49]"></span>
                    </div>
                    <span className="text-orange-400 font-bold uppercase tracking-wider text-[11px]">N°1 Écosystème Côte d'Ivoire (XOF)</span>
                    <span className="text-slate-500">·</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Conforme ARTCI & Charte Éthique
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Plateforme éthique de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">micro-jobs</span>, formation & outils digitaux
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                    Réalisez des missions digitales rémunérées, monétisez vos compétences et retirez vos gains en toute sécurité via <strong className="text-white">Wave, Orange Money, MTN MoMo</strong> et <strong className="text-white">Moov Money</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Créer mon compte</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {onNavigatePage ? (
                      <button
                        onClick={() => onNavigatePage('missions')}
                        className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition-colors text-center"
                      >
                        Découvrir les micro-jobs
                      </button>
                    ) : (
                      <a
                        href="#opportunites"
                        className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition-colors text-center"
                      >
                        Découvrir les micro-jobs
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Slide 1: Digital Academy & 40 Questions Exams */}
              {currentSlideIndex === 1 && (
                <div className="space-y-4 text-left animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/30 text-orange-300 font-bold border border-orange-500/40 text-[11px] uppercase tracking-wider">
                      Digital Academy · Formations Certifiantes (18h - 26h)
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Des compétences réelles avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">40 questions d'examen</span> certifiant
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                    Fini les certificats bidons délivrés en 5 minutes. Nos parcours approfondis exigent un passage d'examen rigoureux avec 80% de réussite pour attester de vos capacités opérationnelles.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    {onNavigatePage && (
                      <button
                        onClick={() => onNavigatePage('academie')}
                        className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>Découvrir l'Académie</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition-colors text-center"
                    >
                      S'inscrire pour étudier
                    </button>
                  </div>
                </div>
              )}

              {/* Slide 2: Mobile Money Direct Payments */}
              {currentSlideIndex === 2 && (
                <div className="space-y-4 text-left animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 text-[11px] uppercase tracking-wider">
                      Mobile Money Garanti · Wave, OM, MTN & Moov
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Vos gains crédités <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">directement</span> sur votre numéro mobile
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                    Dès 2 000 FCFA de gains accumulés, demandez un virement vers votre compte personnel. Vérification sécurisée par email sans frais de SMS.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Créer mon compte</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {onNavigatePage && (
                      <button
                        onClick={() => onNavigatePage('transparence')}
                        className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition-colors text-center"
                      >
                        Consulter la Charte Éthique
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Slide 3: Espace Partenaire & Entreprise */}
              {currentSlideIndex === 3 && (
                <div className="space-y-4 text-left animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-bold border border-blue-500/40 text-[11px] uppercase tracking-wider">
                      Espace Partenaire · Recrutement & Campagnes Entreprises
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Entreprises : <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Déléguez vos micro-tâches</span> à des profils certifiés
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                    Études d'usage, tests d'ergonomie, enquêtes terrain ou avis produits : bénéficiez d'une communauté ivoirienne active et suivez vos résultats en temps réel sur votre tableau de bord dédié.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    {onNavigatePage && (
                      <button
                        onClick={() => onNavigatePage('partenaire')}
                        className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Building className="w-4 h-4" />
                        <span>Accéder à l'Espace Partenaire</span>
                      </button>
                    )}
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition-colors text-center"
                    >
                      Créer un compte
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: 3D Mascot & Speech Bubble ON TOP of the 'Réseau National Actif' Card */}
            <div className="lg:col-span-5 xl:col-span-5 relative flex flex-col items-center lg:items-end space-y-4">
              
              {/* Mascot & Speech Bubble resting right on top of the card */}
              <div className="w-full flex items-center justify-center lg:justify-start pl-1 sm:pl-2 animate-fadeIn">
                <BabiMascot 
                  variant={
                    currentSlideIndex === 0 ? 'welcome' :
                    currentSlideIndex === 1 ? 'academic' :
                    currentSlideIndex === 2 ? 'wallet' : 'security'
                  }
                  size="md"
                  speechText={
                    currentSlideIndex === 0 ? "Akwaba ! Retirez vos gains dès 2 000 FCFA sur Wave & MoMo !" :
                    currentSlideIndex === 1 ? "40 questions chronométrées en 45 min ! Obtenez un vrai diplôme !" :
                    currentSlideIndex === 2 ? "Zéro jeu de hasard, zéro frais caché. Vos gains de missions à 100% !" :
                    "Inscrivez votre entreprise avec RCCM pour lancer vos missions !"
                  }
                />
              </div>

              {/* Floating Interactive Card */}
              <div className="w-full relative liquid-glass-dark p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4">
                
                {/* Header of Glass Card */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Réseau National Actif 🇨🇮
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    28 500 FCFA Médian
                  </span>
                </div>

                {/* Micro-jobs Live Metric */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Missions Récentes</div>
                    <div className="text-lg font-extrabold text-white font-mono mt-0.5">32 450+</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Validées sans litige</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Retraits Mobile Money</div>
                    <div className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5">100%</div>
                    <div className="text-[10px] text-slate-300 font-medium">Wave, OM, MTN, Moov</div>
                  </div>
                </div>

                {/* Operator Logos Pills */}
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
                    <span>Partenaires de Paiement Reconnus</span>
                    <span className="text-emerald-400 font-bold">Dès 2 000 FCFA</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all">
                      <img src="/logos/wave.svg" alt="Wave" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                      <span className="text-[10px] font-bold text-white mt-1">Wave</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all">
                      <img src="/logos/orange-money.svg" alt="Orange Money" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                      <span className="text-[10px] font-bold text-[#FF7900] mt-1">Orange</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all">
                      <img src="/logos/mtn-momo.png" alt="MTN MoMo" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                      <span className="text-[10px] font-bold text-amber-300 mt-1">MTN</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all">
                      <img src="/logos/moov-africa.svg" alt="Moov Africa" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                      <span className="text-[10px] font-bold text-blue-300 mt-1">Moov</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Netflix / Lupin Style Bottom Carousel Progress Dashes & Controls */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 font-mono">
              0{currentSlideIndex + 1} <span className="text-slate-500">/ 04</span>
            </span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlideIndex === idx 
                      ? 'w-10 sm:w-14 bg-gradient-to-r from-orange-400 to-amber-400' 
                      : 'w-4 sm:w-6 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? 3 : prev - 1))}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev === 3 ? 0 : prev + 1))}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* BANDEAU ACCÈS TRANSPARENCE & CHARTE */}
      <section className="py-5 bg-emerald-50/80 border-b border-emerald-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-emerald-950">Statistiques Réelles & Indicateurs Vérifiés :</span>
              <span className="text-emerald-800 ml-1">Revenu médian de 28 500 FCFA, transparence financière totale et zéro jeu de hasard.</span>
            </div>
          </div>
          {onNavigatePage && (
            <button
              onClick={() => onNavigatePage('transparence')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <span>Consulter les indicateurs réels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE EN 4 ÉTAPES AVEC MASCOTTES VECTORIELLES 3D */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Parcours Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1">
              Comment fonctionne GLOBAL-AF en 4 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 relative hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-600 font-extrabold text-xs flex items-center justify-center font-mono shrink-0">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Inscription & Activation</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Créez votre compte en quelques instants. Activez votre Pass Membre pour débloquer l'accès complet à tous nos services rémunérés.
              </p>
            </div>

            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 relative hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-600 font-extrabold text-xs flex items-center justify-center font-mono shrink-0">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Réalisation de Micro-jobs</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Participez aux sondages, tests d'applications locales et missions partenaires. Rémunérations fixes garanties sans tirage au sort.
              </p>
            </div>

            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 relative hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-600 font-extrabold text-xs flex items-center justify-center font-mono shrink-0">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Formation & Certifications</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Suivez des formations denses de 18h à 26h, réussissez l'examen chronométré de 40 questions et obtenez votre certificat vérifiable.
              </p>
            </div>

            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 relative hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-600 font-extrabold text-xs flex items-center justify-center font-mono shrink-0">
                  04
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Retrait Mobile Money</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demandez le retrait de vos gains disponibles vers Wave, Orange Money ou MTN MoMo dès 2 000 FCFA avec validation sécurisée par email.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* OPPORTUNITÉS & MICRO-JOBS DIRECTORY */}
      <section id="opportunites" className="py-16 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missions Actuelles</span>
              <h2 className="text-2xl sm:text-3xl font-anton text-slate-900 mt-1 tracking-wide">
                Micro-jobs & Missions Rémunérées
              </h2>
            </div>
            <button
              onClick={() => onNavigatePage ? onNavigatePage('missions') : onGoToDashboard()}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start"
            >
              <span>Voir toutes les missions disponibles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {task.category === 'survey' && 'Sondage & Habitudes'}
                      {task.category === 'app_test' && 'Test d\'application'}
                      {task.category === 'social_visit' && 'Sensibilisation & Vidéo'}
                      {task.category === 'content_review' && 'Revue de contenu'}
                      {task.category === 'partner_campaign' && 'Campagne Partenaire'}
                    </span>
                    <span className="font-extrabold text-emerald-700 font-mono text-sm tabular-nums">
                      +{task.rewardAmount.toLocaleString()} {task.currency}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500">
                    Quota : {task.quotaCurrent} / {task.quotaMax}
                  </div>
                  <button
                    onClick={() => {
                      onSelectTask(task);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                  >
                    Participer
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ACADÉMIE & OUTILS IA */}
      <section id="academie" className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Digital Academy & Outils IA
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Développez des compétences utiles et rentables
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                GLOBAL-AF intègre des formations pratiques conçues pour le marché ivoirien et des assistants d'intelligence artificielle pour vos créations de contenus, devis et plans marketing.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900">Formations orientées résultats concrets</h4>
                    <p className="text-slate-500 mt-0.5">Marketing digital UEMOA, e-commerce rentable avec Wave, et création de vidéos percutantes.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900">Assistants IA intégrés</h4>
                    <p className="text-slate-500 mt-0.5">Rédacteur publicitaire, générateur d'idées marketing locales et résumeur de documents d'affaires.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                  <Award className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900">Quiz & Certifications internes</h4>
                    <p className="text-slate-500 mt-0.5">Validez vos acquis à la fin des modules pour débloquer des points et des certificats de réussite.</p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigatePage ? onNavigatePage('academie') : onGoToDashboard()}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <span>Explorer l'Académie Digitale</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visual preview box with real photo + Apple Liquid Glass Overlay */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
              <img
                src="/images/academy-student.jpg"
                alt="Apprenante de l'Académie Digitale GLOBAL-AF"
                className="w-full h-[380px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Babi Academy Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 shadow-lg text-white">
                <BabiMascot variant="academic" size="xs" />
                <div className="text-left">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Babi Académie</div>
                  <div className="text-[11px] font-bold">Certificat Inviolable</div>
                </div>
              </div>
              <div className="absolute inset-x-3 bottom-3 liquid-glass p-4 rounded-2xl border border-white/80 shadow-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-900 font-mono">
                    Module Pratique Certifié
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800">
                    Niveau Débutant & Pro
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  « Vendre efficacement avec WhatsApp & Wave en Côte d'Ivoire »
                </h3>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Méthode pas-à-pas pour convertir des contacts en clients fidèles avec des flux d'encaissement Mobile Money transparents.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PROGRAMME D'AFFILIATION : RÈGLES DE RÉMUNÉRATION DES PARRAINS */}
      <section id="affiliation" className="py-16 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 flex flex-col items-center">
            <BabiMascot 
              variant="wallet" 
              size="md" 
              speechBubble="Le parrainage continue chaque mois tant que votre filleul dépense dans l'application ! 10% Niveau 1 et 5% Niveau 2 garantis !" 
            />
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Programme Partenaire & Affiliation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Règles de Rémunération des Parrains
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Un système de rémunération récurrent, clair et éthique, calculé exclusivement sur les ventes réelles de services et produits utiles (abonnements et formations certifiantes).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Niveau 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Niveau 1 · Direct
                  </span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">10%</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Parrainage Direct sur Ventes Réelles
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Percevez <strong>10% de commission nette</strong> sur chaque achat effectué par les membres que vous avez directement recommandés.
                </p>
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                  <div className="font-semibold text-emerald-900">Exemple concret :</div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Votre filleul achète une formation ou un pack à <strong>10 000 FCFA</strong> → Vous recevez <strong>1 000 FCFA</strong> crédités après validation du délai de rétractation (7 jours).
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                ✓ Retirable dès 2 000 FCFA sur Wave, Orange Money, MTN MoMo ou Moov Money
              </div>
            </div>

            {/* Niveau 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    Niveau 2 · Indirect
                  </span>
                  <span className="text-2xl font-black text-blue-600 font-mono">5%</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Parrainage Indirect de Réseau
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Percevez <strong>5% de commission nette</strong> sur l'ensemble des achats effectués par les membres recommandés par vos filleuls de niveau 1.
                </p>
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200/80 text-xs text-blue-950 space-y-1">
                  <div className="font-semibold text-blue-900">Exemple concret :</div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Un membre recommandé par votre filleul direct souscrit un service à <strong>10 000 FCFA</strong> → Vous recevez <strong>500 FCFA</strong> sans effort supplémentaire.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                ✓ Plafonnement strict à 2 niveaux · Aucun système infini
              </div>
            </div>

          </div>

          {/* Conditions & Principes de Transparence */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Ventes réelles uniquement
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Les commissions proviennent exclusivement de formations et d'outils réels achetés par les utilisateurs.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Zéro gain sur le recrutement
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                L'inscription est gratuite et ne génère aucune commission. Le spam et le recrutement trompeur sont strictement interdits.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Retrait libre & garanti
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Vos commissions sont immédiatement cumulées et retirables dès 2 000 FCFA par Mobile Money (Wave, Orange, MTN, Moov).
              </p>
            </div>
          </div>

          {/* CTA Link to Transparence */}
          {onNavigatePage && (
            <div className="text-center mt-8">
              <button
                onClick={() => onNavigatePage('transparence')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95"
              >
                <span>Consulter la Charte de Transparence & Barème Complet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* TARIFS & ACTIVATION : TICKET D'ENTRÉE & ABONNEMENT VIP PREMIUM */}
      <section id="tarifs" className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <BabiMascot 
              variant="waving" 
              size="md" 
              speechBubble="Des montants adaptés à la réalité ivoirienne et rentabilisés dès vos premières missions !" 
            />
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                Grille Tarifaire Transparente (XOF)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Choisissez votre formule selon vos ambitions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              L'inscription crée votre compte gratuitement. L'accès aux missions rémunérées et aux formations est débloqué par le <strong className="text-slate-800">Pass Membre Standard (Ticket d'Entrée)</strong>. L'abonnement <strong className="text-slate-800">VIP Premium</strong> multiplie vos gains et vos opportunités.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* PALIER 1 : COMPTE DÉCOUVERTE */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Découverte
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-2">Compte Gratuit</h3>
                  <p className="text-xs text-slate-500">Pour créer son profil et explorer la plateforme</p>
                </div>

                <div className="text-3xl font-black text-slate-900 font-anton">
                  0 XOF
                  <span className="text-xs font-normal text-slate-500 block font-sans">Sans aucun engagement</span>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  <span className="font-bold block mb-0.5 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    Accès en mode consultation :
                  </span>
                  L'accès actif aux missions rémunérées, examens certifiants et retraits Mobile Money nécessite le règlement du Pass Membre Initial.
                </div>

                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                    <span>Création du profil membre sécurisé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                    <span>Consultation du catalogue des micro-jobs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                    <span>Consultation des résumés de cours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lien de parrainage éthique actif</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs hover:shadow-xs active:scale-95"
                >
                  Créer un Compte Gratuit
                </button>
              </div>
            </div>

            {/* PALIER 2 : PASS MEMBRE STANDARD (TICKET D'ENTRÉE) */}
            <div className="bg-white rounded-2xl border-2 border-orange-500 p-6 flex flex-col justify-between shadow-md relative">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] uppercase tracking-wider py-0.5 px-3 rounded-full shadow-2xs">
                Ticket d'Entrée
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                    Accès Complet Actif
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-2">Pass Membre Standard</h3>
                  <p className="text-xs text-slate-500">Le sésame pour débloquer l'ensemble de nos services</p>
                </div>

                <div className="text-3xl font-black text-orange-600 font-anton">
                  3 000 XOF
                  <span className="text-xs font-normal text-slate-600 block font-sans">
                    Paiement unique d'activation à vie
                  </span>
                </div>

                <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Accès complet et immédiat</strong> aux micro-jobs rémunérés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Accès aux 4 formations approfondies de l'Académie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Wallet & Retraits Mobile Money dès <strong>2 000 XOF</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Commissions de parrainage (10% N1 + 5% N2)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Support membre par ticket</span>
                  </li>
                </ul>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accès numérique immédiat à vie aux 15 cours et micro-jobs (non soumis au droit de rétractation).</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Activer mon Pass (3 000 FCFA)</span>
                </button>
              </div>
            </div>

            {/* PALIER 3 : MEMBRE VIP PREMIUM */}
            <div className="bg-slate-900 text-white rounded-2xl border-2 border-emerald-400 p-6 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3 right-6 bg-emerald-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider py-0.5 px-3 rounded-full shadow-2xs">
                Recommandé VIP
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Abonnement Mensuel
                  </span>
                  <h3 className="font-bold text-white text-lg mt-2">Membre VIP Premium</h3>
                  <p className="text-xs text-slate-400">Pour créateurs et entrepreneurs exigeant le meilleur</p>
                </div>

                <div className="text-3xl font-black text-white font-anton">
                  9 900 XOF
                  <span className="text-xs font-normal text-emerald-400 block font-sans">
                    Par mois · Sans engagement à long terme
                  </span>
                </div>

                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Tous les avantages du Pass Membre Standard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-emerald-300">Rémunérations majorées (+40%)</strong> sur chaque tâche</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Missions exclusives VIP à fort montant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Outils IA illimités</strong> (Gemini Flash sans quota)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Téléchargement illimité des répertoires VCF qualifiés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Retraits prioritaires traités <strong className="text-emerald-300">sous 2h ouvrées</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>4 Certifications Professionnelles vérifiées</span>
                  </li>
                </ul>

                <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Délai de rétractation de 7 jours avec remboursement intégral Mobile Money. (Commission parrain de 10% / 990 FCFA débloquée après ce délai).</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Devenir Membre VIP (9 900 FCFA/m)</span>
                </button>
              </div>
            </div>

          </div>

          {/* BANNER : PARTENAIRES & ENTREPRISES */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                <Building className="w-3.5 h-3.5" />
                <span>Pour Entreprises, Marques & PME</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Vous souhaitez déposer des micro-jobs et recruter des testeurs ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Créez votre compte entreprise avec votre RCCM. Une fois votre compte validé par nos équipes administratives, diffusez vos campagnes et suivez vos retombées en temps réel sur votre Espace Partenaire dédié.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-4">
              {onNavigatePage ? (
                <button
                  onClick={() => onNavigatePage('partenaire')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Accéder à l'Espace Partenaire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Inscrire mon entreprise</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* CHARTE ÉTHIQUE & SÉCURITÉ */}
      <section id="ethique" className="py-16 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gouvernance & Sécurité
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Les 5 Engagements Éthiques Inviolables
            </h2>
            <p className="text-xs text-slate-600">
              Ces conditions priment sur toute considération commerciale et font l'objet d'un audit continu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-extrabold text-xs shadow-2xs">1</span>
                <span>Ventes réelles uniquement</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Aucune commission n'est versée sur les frais d'entrée d'autres membres. Rémunération liée exclusivement à des services utiles vendus à de vrais clients.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-extrabold text-xs shadow-2xs">2</span>
                <span>Biens réels & Rétractation 7j</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Toute activation payante donne accès à un bien identifiable (formations, outils IA, répertoires). Remboursement par Mobile Money garanti sous 7 jours.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-extrabold text-xs shadow-2xs">3</span>
                <span>Honnêteté sur les gains</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Interdiction des promesses trompeuses et des faux montages. Publication transparente du revenu médian réel et du délai d'obtention du premier virement.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-extrabold text-xs shadow-2xs">4</span>
                <span>Interdiction absolue des jeux de hasard</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Suppression totale des roues de la chance, loteries, tirages au sort et coffres aléatoires. Toutes les récompenses sont 100% déterministes.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-extrabold text-xs shadow-2xs">5</span>
                <span>Protection des membres</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Plafonds de dépense mensuels configurables, conformité aux CGU, validation éthique et mécanismes de suspension volontaire en cas de besoin.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-extrabold text-xs shadow-2xs">6</span>
                <span>Conformité ARTCI Côte d'Ivoire</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Respect de la réglementation ivoirienne relative à la protection des données personnelles, au commerce électronique et à la traçabilité financière.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* COMPOSANT CHATBOT INFORMATIONNEL & FAQ */}
      <FAQGemini onNavigateView={onNavigatePage} />

    </div>
  );
};
