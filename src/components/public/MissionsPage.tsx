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

        {/* Interactive Earnings Simulator */}
        <div className="bg-gradient-to-br from-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-orange-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulateur d'activité réelle</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-anton text-white tracking-wide">
                Combien pouvez-vous générer avec vos micro-jobs ?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ajustez le curseur selon le temps que vous souhaitez consacrer quotidiennement. Vos gains sont cumulés et retirables dès 2 000 FCFA sur Wave, Orange Money, MTN MoMo ou Moov Africa.
              </p>

              {/* Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Temps consacré :</span>
                  <span className="text-orange-400 font-bold">{hoursPerDay} heure(s) / jour</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1h (temps libre)</span>
                  <span>3h (régulier)</span>
                  <span>6h (assidu)</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4 text-center">
              <div className="text-xs uppercase tracking-wider text-orange-300 font-bold">
                Estimation Réaliste Constatée
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-notable">
                  ~{estimatedMonthly.toLocaleString()} FCFA
                </div>
                <div className="text-[11px] text-slate-300">par mois (26 jours d'activité)</div>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-around text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Gain journalier</div>
                  <div className="font-bold text-orange-400 font-notable text-xs sm:text-sm">~{estimatedDaily.toLocaleString()} FCFA</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Retrait minimum</div>
                  <div className="font-bold text-emerald-400 font-notable text-xs sm:text-sm">2 000 FCFA</div>
                </div>
              </div>
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Commencer à postuler</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
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
                <p className="text-xs text-slate-500 mt-0.5">La rémunération est fixe et garantie dès la validation de votre mission.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Retraits Instantanés</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dès 2 000 FCFA vers Wave, Orange Money, MTN MoMo ou Moov Africa.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
