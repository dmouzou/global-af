import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskCategory } from '../../types';
import { 
  Briefcase, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Calculator, 
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import { OperatorLogo } from '../common/OperatorLogo';
import { BabiMascot } from '../common/BabiMascot';

interface MissionsPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectTask: (task: Task) => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({ 
  onGoToDashboard, 
  onOpenAuth,
  onSelectTask 
}) => {
  const { tasks, selectedCountry } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);

  const categories = [
    { id: 'all', label: 'Toutes les catégories' },
    { id: 'survey', label: 'Sondages d\'opinion' },
    { id: 'app_test', label: 'Tests d\'applications' },
    { id: 'content_review', label: 'Revues de contenus' },
    { id: 'social_visit', label: 'Missions sociales' },
    { id: 'partner_campaign', label: 'Campagnes partenaires' },
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesCat = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Simulator: average ~1500 FCFA per hour based on 3-4 tasks
  const estimatedDaily = hoursPerDay * 1400;
  const estimatedMonthly = estimatedDaily * 26;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
            <Briefcase className="w-4 h-4" />
            <span>Missions Digitales Rémunérées</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-anton text-slate-900 tracking-wide">
            Micro-jobs & Missions Qualifiées en Côte d'Ivoire
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Participez à des études, testez les nouvelles applications ivoiriennes et réalisez des tâches vérifiées. Rémunération nette et prévisible dès la complétion.
          </p>
        </div>

        {/* Informative Micro-Jobs Overview Banner (Sans simulateur) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Missions Déterministes & Rémunérations Nettes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Réalisez des tâches concrètes et encaissez directement
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Chaque récompense validée est inscrite dans l'historique de votre portefeuille. Vous pouvez ensuite demander un retrait vers Wave, Orange Money, MTN MoMo ou Moov Africa : montant minimum, frais et montant net sont affichés avant validation, et chaque demande est contrôlée avant paiement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <BabiMascot variant="wallet" size="lg" />
            <button
              onClick={() => onOpenAuth('signup')}
              className="py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Accéder aux missions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Babi l'Éléphant Conseil Pratique */}
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 rounded-2xl p-4 sm:p-5 border border-orange-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
          <BabiMascot variant="wallet" size="md" />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-orange-950 text-sm">Le Conseil Rémunération de Babi 🇨🇮</span>
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                Mobile Money Immédiat
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              « La récompense de chaque mission validée s'ajoute à votre portefeuille. Vous demandez ensuite un retrait vers <strong>Wave, Orange Money, MTN MoMo ou Moov</strong> ; les frais éventuels sont affichés avant que vous validiez. »
            </p>
          </div>
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors shrink-0 shadow-xs"
          >
            Créer mon compte
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une mission..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200/60">
                    {task.category === 'survey' && 'Sondage'}
                    {task.category === 'app_test' && 'Test Mobile'}
                    {task.category === 'content_review' && 'Revue'}
                    {task.category === 'social_visit' && 'Missions Sociales'}
                    {task.category === 'partner_campaign' && 'Campagne'}
                    {task.category === 'quiz_challenge' && 'Quiz'}
                  </span>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-extrabold text-orange-600 font-notable">
                      +{task.rewardAmount.toLocaleString()} {task.currency || 'XOF'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-2">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {task.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5-15 min</span>
                  <span>·</span>
                  <Users className="w-3.5 h-3.5" />
                  <span>{Math.max(0, task.quotaMax - task.quotaCurrent)} places</span>
                </div>
                <button
                  onClick={() => {
                    onSelectTask(task);
                    onGoToDashboard();
                  }}
                  className="px-3 py-1.5 bg-slate-900 group-hover:bg-orange-600 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1"
                >
                  <span>Postuler</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real Success Story Banner with Mobile Money Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
          <img
            src="/images/mobile-money-success.jpg"
            alt="Membre GLOBAL-AF recevant son retrait Mobile Money à Abidjan"
            className="w-full h-[280px] sm:h-[350px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-x-4 bottom-4 liquid-glass p-4 rounded-2xl border border-white/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900">Paiements effectifs constatés sur le terrain</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Les retraits se font vers un compte Mobile Money en Côte d'Ivoire ; montant minimum et frais sont affichés avant validation.
              </p>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-xs shrink-0"
            >
              Rejoindre les membres
            </button>
          </div>
        </div>

        {/* Quality & Ethics Callout */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Validation en 5 Minutes</h4>
                <p className="text-xs text-slate-500 mt-0.5">Votre preuve est vérifiée et vos gains sont crédités automatiquement.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Zéro Tirage au Sort</h4>
                <p className="text-xs text-slate-500 mt-0.5">La récompense est indiquée à l'avance et versée si votre preuve est validée.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Retraits Sécurisés</h4>
                <p className="text-xs text-slate-500 mt-0.5">Vers Wave, Orange Money, MTN MoMo ou Moov Africa, après contrôle.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
