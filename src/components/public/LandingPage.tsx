import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { Task } from '../../types';
import { OperatorLogo } from '../common/OperatorLogo';
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
      a: "Si vous activez un pack Premium ou Business et que vous n'avez pas largement consommé les contenus, vous pouvez demander votre rétractation en un clic depuis votre espace membre. Le remboursement est renvoyé directement sur votre numéro Mobile Money sous 48h."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Clean text kicker with Côte d'Ivoire flag */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center h-2.5 w-4 rounded-xs overflow-hidden border border-slate-200">
                  <span className="w-1/3 h-full bg-[#FF7700]"></span>
                  <span className="w-1/3 h-full bg-white"></span>
                  <span className="w-1/3 h-full bg-[#009E49]"></span>
                </div>
                <span className="text-orange-700 font-bold uppercase tracking-wider text-[11px]">Marché Côte d'Ivoire (XOF)</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Conforme Charte Éthique & ARTCI
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">
                Plateforme éthique de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600">micro-jobs</span>, formation & outils digitaux
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Réalisez des missions digitales rémunérées, monétisez vos compétences et retirez vos gains instantanément via <strong className="text-slate-900">Wave, Orange Money, MTN MoMo</strong> et <strong className="text-slate-900">Moov Money</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onGoToDashboard}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Mon Espace Personnel (Accès Libre)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#opportunites"
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-orange-50/50 hover:text-orange-600 border border-slate-300 rounded-xl transition-colors text-center"
                >
                  Découvrir les micro-jobs
                </a>
              </div>

              {/* Trust statement */}
              <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center gap-3">
                <span className="text-emerald-700 font-semibold">✓ Inscription rapide & gratuite</span>
                <span>·</span>
                <span>✓ Retraits dès 2 000 FCFA</span>
                <span>·</span>
                <span>✓ Zéro jeu de hasard</span>
                <span>·</span>
                <span>✓ Rétractation 7 jours</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Container - Mobile Money Operators */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-center">
                
                {/* Single Clean Title */}
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 leading-snug">
                    Paiements sécurisés à travers tous les opérateurs
                  </h3>
                </div>

                {/* 4 Large & Prominent Square Logos */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full">
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 hover:bg-[#00C2E0]/5 rounded-2xl border border-slate-200/80 hover:border-[#00C2E0]/50 transition-all group shadow-2xs hover:shadow-md">
                    <img 
                      src="/logos/wave.svg" 
                      alt="Wave Côte d'Ivoire" 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#003B73] mt-2.5">Wave</span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 hover:bg-[#FF7900]/5 rounded-2xl border border-slate-200/80 hover:border-[#FF7900]/50 transition-all group shadow-2xs hover:shadow-md">
                    <img 
                      src="/logos/orange-money.svg" 
                      alt="Orange Money" 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#FF7900] mt-2.5">Orange Money</span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 hover:bg-[#FFCC00]/5 rounded-2xl border border-slate-200/80 hover:border-[#FFCC00]/50 transition-all group shadow-2xs hover:shadow-md">
                    <img 
                      src="/logos/mtn-momo.png" 
                      alt="MTN MoMo" 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#002B49] mt-2.5">MTN MoMo</span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 hover:bg-[#0058A8]/5 rounded-2xl border border-slate-200/80 hover:border-[#0058A8]/50 transition-all group shadow-2xs hover:shadow-md">
                    <img 
                      src="/logos/moov-africa.svg" 
                      alt="Moov Africa" 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#0058A8] mt-2.5">Moov Africa</span>
                  </div>
                </div>

              </div>
            </div>

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

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Parcours Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1">
              Comment fonctionne GLOBAL-AF en 4 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Inscription & Vérification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Créez votre compte en quelques instants avec votre numéro Mobile Money et commencez vos missions qualifiées.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Réalisation de Micro-jobs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Participez aux sondages, tests d'applications locales et modules éducatifs. Chaque gain est connu à l'avance sans tirage au sort.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Formation & Outils IA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Développez vos compétences concrètes grâce à l'Académie et utilisez nos générateurs de textes pour booster vos affaires.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Retrait Mobile Money</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demandez le retrait de votre solde disponible vers votre compte Wave, Orange Money ou MTN MoMo dès 2 000 FCFA.
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
              onClick={onGoToDashboard}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start"
            >
              <span>Voir toutes les missions sur le dashboard</span>
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
                      onGoToDashboard();
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
                  onClick={onGoToDashboard}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Explorer l'Académie sur le Dashboard
                </button>
              </div>
            </div>

            {/* Visual preview box */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-emerald-400">MODULE EXCLUSIF ACADÉMIE</span>
                <span className="text-xs text-slate-400">Niveau Débutant</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                « Vendre efficacement avec WhatsApp & Wave en Côte d'Ivoire »
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Apprenez la méthode pas-à-pas pour convertir des contacts en clients fidèles sans dépenser des fortunes en publicité, avec des flux d'encaissement Mobile Money transparents.
              </p>
              <div className="p-3 bg-slate-800/80 rounded border border-slate-700 text-xs space-y-1.5 font-mono text-slate-300">
                <div>✓ 3 vidéos explicatives pas-à-pas</div>
                <div>✓ Modèles de messages de prospection prêts à l'emploi</div>
                <div>✓ Quiz d'évaluation avec récompense en points</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PROGRAMME D'AFFILIATION : RÈGLES DE RÉMUNÉRATION DES PARRAINS */}
      <section id="affiliation" className="py-16 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Programme Partenaire & Affiliation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Règles de Rémunération des Parrains
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Un système de rémunération clair, éthique et transparent, calculé exclusivement sur les ventes réelles de services et produits utiles (formations certifiantes et outils digitaux).
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
                  <span className="text-2xl font-black text-emerald-600 font-mono">15%</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Parrainage Direct sur Ventes Réelles
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Percevez <strong>15% de commission nette</strong> sur chaque achat effectué par les membres que vous avez directement recommandés.
                </p>
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                  <div className="font-semibold text-emerald-900">Exemple concret :</div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Votre filleul achète une formation ou un pack à <strong>10 000 FCFA</strong> → Vous recevez <strong>1 500 FCFA</strong> immédiatement crédités sur votre solde retirable.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                ✓ Crédité instantanément · Retirable dès 2 000 FCFA sur Wave, Orange, MTN ou Moov
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

          {/* CTA Link */}
          {onNavigatePage && (
            <div className="text-center mt-8">
              <button
                onClick={() => onNavigatePage('affiliation')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95"
              >
                <span>Accéder au simulateur et détails d'affiliation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* TARIFS & ACTIVATION (SECTION 6 & 18 & 39 CONDITION 2) */}
      <section id="tarifs" className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Offres & Transparence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Des tarifs clairs en Francs CFA (XOF)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Le palier gratuit est réellement utile et pérenne. Les offres payantes achètent des biens identifiables et bénéficient de la garantie de rétractation 7 jours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PALIER GRATUIT */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Membre Gratuit</h3>
                  <p className="text-xs text-slate-500">Pour débuter et réaliser des micro-missions</p>
                </div>

                <div className="text-3xl font-black text-slate-900 font-anton">
                  0 XOF
                  <span className="text-xs font-normal text-slate-500 block font-sans">Gratuit pour toujours</span>
                </div>

                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Accès aux micro-jobs standard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Formations d'initiation Académie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wallet & Retraits Mobile Money dès 2 000 XOF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lien d'affiliation éthique 2 niveaux</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Support par ticket</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={onGoToDashboard}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Accès Libre Immédiat
                </button>
              </div>
            </div>

            {/* PACK PREMIUM */}
            <div className="bg-slate-900 text-white rounded-xl border-2 border-emerald-500 p-6 flex flex-col justify-between shadow-lg relative">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider py-0.5 px-2.5 rounded-full">
                Recommandé
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-lg">Membre Premium</h3>
                  <p className="text-xs text-slate-400">Pour créateurs et entrepreneurs digitaux</p>
                </div>

                <div className="text-3xl font-black text-white font-anton">
                  9 900 XOF
                  <span className="text-xs font-normal text-emerald-400 block font-sans">
                    Bien identifiable · Rétractation 7j
                  </span>
                </div>

                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tous les avantages du palier Gratuit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Missions prioritaires et rémunérations majorées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Outils IA illimités (Assistant Rédactionnel & Idées)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Téléchargement des répertoires VCF qualifiés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Certifications reconnues de l'Académie</span>
                  </li>
                </ul>

                {/* Retraction guarantee notice */}
                <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Délai de rétractation de 7 jours avec remboursement intégral par Mobile Money.</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={onGoToDashboard}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  Activer par Mobile Money
                </button>
              </div>
            </div>

            {/* PACK BUSINESS / PARTENAIRE */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Partenaire & Entreprise</h3>
                  <p className="text-xs text-slate-500">Pour diffuser des campagnes et micro-jobs</p>
                </div>

                <div className="text-3xl font-black text-slate-900 font-anton">
                  25 000 XOF
                  <span className="text-xs font-normal text-slate-500 block font-sans">À partir de / campagne</span>
                </div>

                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Publication de micro-jobs vérifiés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ciblage précis Côte d'Ivoire & UEMOA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vérification anti-fraude des soumissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tableau de bord de reporting en temps réel</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={onGoToDashboard}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Contacter le service Partenariats
                </button>
              </div>
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
            
            <div className="p-5 bg-white rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</span>
                Ventes réelles uniquement
              </div>
              <p className="text-slate-600 leading-relaxed">
                Aucune commission n'est versée sur les frais d'entrée d'autres membres. Rémunération liée exclusivement à des services utiles vendus à de vrais clients.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">2</span>
                Biens réels & Rétractation 7j
              </div>
              <p className="text-slate-600 leading-relaxed">
                Toute activation payante donne accès à un bien identifiable (formations, outils IA, répertoires). Remboursement par Mobile Money garanti sous 7 jours.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">3</span>
                Honnêteté sur les gains
              </div>
              <p className="text-slate-600 leading-relaxed">
                Interdiction des promesses trompeuses et des faux montages. Publication transparente du revenu médian réel et du délai d'obtention du premier virement.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">4</span>
                Interdiction absolue des jeux de hasard
              </div>
              <p className="text-slate-600 leading-relaxed">
                Suppression totale des roues de la chance, loteries, tirages au sort et coffres aléatoires. Toutes les récompenses sont 100% déterministes.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">5</span>
                Protection des membres
              </div>
              <p className="text-slate-600 leading-relaxed">
                Plafonds de dépense mensuels configurables, conformité aux CGU, validation éthique et mécanismes de suspension volontaire en cas de besoin.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">6</span>
                Conformité ARTCI Côte d'Ivoire
              </div>
              <p className="text-slate-600 leading-relaxed">
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
