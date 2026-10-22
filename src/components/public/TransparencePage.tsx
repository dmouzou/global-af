import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Users, 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Lock, 
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { OperatorLogo } from '../common/OperatorLogo';

interface TransparencePageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const TransparencePage: React.FC<TransparencePageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { ethicalIndicators } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Engagements & Statistiques Réelles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparence Intégrale & Charte Éthique
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Chez GLOBAL-AF, nous rejetons formellement les promesses illusoires de richesse rapide. 
            Découvrez nos chiffres réels, audités et vérifiables pour le marché ivoirien.
          </p>
        </div>

        {/* Real KPI Cards */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span>Indicateurs d'Activité Réelle des Membres</span>
              </h2>
              <p className="text-xs text-slate-500">Mises à jour consolidées sur les 30 derniers jours d'activité en Côte d'Ivoire</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold self-start sm:self-auto">
              100% Données Réelles Audités
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-gradient-to-br from-orange-50/50 to-white p-5 rounded-2xl border border-orange-200/80 shadow-xs relative overflow-hidden">
              <div className="text-xs text-slate-500 font-semibold">Revenu mensuel médian</div>
              <div className="text-xl sm:text-2xl font-extrabold text-orange-600 font-notable mt-1">
                {ethicalIndicators.medianMonthlyIncomeXOF.toLocaleString()} XOF
              </div>
              <div className="text-[11px] text-slate-600 mt-2 leading-tight">
                Constaté sur les membres réalisant au moins 4 micro-jobs par mois.
              </div>
            </div>

            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="text-xs text-slate-500 font-semibold">Membres sans premier retrait</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-notable mt-1">
                {ethicalIndicators.percentUnwithdrawnMembers}%
              </div>
              <div className="text-[11px] text-slate-600 mt-2 leading-tight">
                Membres en cours d'accumulation de solde ou inscrits récemment.
              </div>
            </div>

            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="text-xs text-slate-500 font-semibold">Délai moyen premier retrait</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-notable mt-1">
                {ethicalIndicators.averageDaysToFirstPayout} jours
              </div>
              <div className="text-[11px] text-slate-600 mt-2 leading-tight">
                Délai moyen observé entre la création de compte et le 1er virement.
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/50 to-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs relative overflow-hidden">
              <div className="text-xs text-slate-500 font-semibold">Total reversé aux membres</div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-notable mt-1">
                {ethicalIndicators.totalWithdrawnXOF.toLocaleString()} XOF
              </div>
              <div className="text-[11px] text-slate-600 mt-2 leading-tight">
                Versé directement par Wave, Orange Money, MTN MoMo et Moov Money.
              </div>
            </div>

          </div>
        </div>

        {/* The 6 Fundamental Ethical Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Nos 6 Piliers Fondamentaux
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Des règles de gestion immuables gravées dans l'architecture technique de la plateforme.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Commissions sur Ventes Réelles Uniquement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le recrutement seul ne rapporte aucun centime. Aucune commission n'est attribuée lors de la simple inscription d'un contact. Les gains proviennent exclusivement d'achats réels de formations ou d'abonnements utiles, avec un plafond strict de 2 niveaux.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Palier Gratuit Garanti & Droit de Rétractation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tout utilisateur peut effectuer des micro-jobs et retirer 100% de ses gains sans jamais avoir à acheter de pack. En cas de souscription d'une option payante, le membre bénéficie d'un droit de rétractation de 7 jours avec remboursement intégral Mobile Money.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Statistiques Publiques & Vérifiables</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publication transparente et mise à jour périodique des revenus médians, des délais réels de versement et du pourcentage de membres en cours de progression, afin de préserver les utilisateurs de toute illusion ou promesse trompeuse.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Interdiction Absolue des Jeux de Hasard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bannissement complet des roues de la fortune, des tirages au sort, des tombolas et des boîtes mystères payantes. Chaque récompense est 100% déterministe, connue à l'avance et directement liée à un effort fourni.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Protection des Membres & Plafonds Éthiques</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque membre a la possibilité de configurer un plafond de dépense mensuel personnel et peut activer une suspension volontaire temporaire de son compte pour prévenir tout emballement financier ou usage excessif.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                6
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Conformité ARTCI & Traçabilité Financière</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Respect des réglementations ivoiriennes sur la protection des données personnelles et le commerce électronique. Toutes les opérations de crédit et débit sont inscrites dans un grand livre comptable immuable avec référence d'opérateur.
              </p>
            </div>

          </div>
        </div>

        {/* Mobile Money Integration Showcase */}
        <div className="p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-bold text-white">Retraits sécurisés sur vos portefeuilles officiels</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vos gains sont transférés directement sans intermédiaire bancaire vers votre compte Wave, Orange Money, MTN MoMo ou Moov Africa Côte d'Ivoire dès 2 000 FCFA.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <OperatorLogo operator="Wave" variant="pill" size="md" className="bg-white/10 text-white border-white/20" />
            <OperatorLogo operator="Orange Money" variant="pill" size="md" className="bg-white/10 text-white border-white/20" />
            <OperatorLogo operator="MTN MoMo" variant="pill" size="md" className="bg-white/10 text-white border-white/20" />
            <OperatorLogo operator="Moov Money" variant="pill" size="md" className="bg-white/10 text-white border-white/20" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Créer mon compte en toute transparence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
