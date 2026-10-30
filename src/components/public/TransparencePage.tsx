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
import { BabiMascot } from '../common/BabiMascot';

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
            <span className="text-[11px] font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold self-start sm:self-auto">
              {ethicalIndicators ? `Mis à jour le ${ethicalIndicators.lastUpdated}` : 'En cours de collecte'}
            </span>
          </div>

          {ethicalIndicators ? (
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
          ) : (
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Indicateurs en cours de collecte.</strong> Le revenu médian des membres actifs, la part des membres n'ayant encore rien retiré et le délai moyen avant un premier retrait seront publiés ici, calculés à partir des retraits réellement effectués. Tant que ces données n'existent pas, aucun chiffre n'est affiché : nous ne publions pas d'estimations.
            </div>
          )}
        </div>

        {/* Ethical Architecture 3D Visual Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
          <img
            src="/images/ethical-economy-illustration.jpg"
            alt="Économie Numérique Éthique Côte d'Ivoire"
            className="w-full h-[280px] sm:h-[360px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-x-4 bottom-4 liquid-glass p-4 rounded-2xl border border-white/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900">Architecture éthique et déterministe (aucun tirage au sort)</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Chaque transaction est tracée dans un grand livre comptable. Zéro jeu de hasard, zéro promesse trompeuse.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase bg-slate-900 text-white px-3 py-1 rounded-full shrink-0">
              Conformité ARTCI & UEMOA : validation juridique en cours
            </span>
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
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-600 font-extrabold text-xs flex items-center justify-center font-mono">
                  01
                </div>
                <span className="text-[10px] font-bold uppercase text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">Anti-Pyramide</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Commissions sur Ventes Réelles Uniquement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le recrutement seul ne rapporte aucun centime. Aucune commission n'est attribuée lors de la simple inscription d'un contact. Les gains proviennent exclusivement d'achats réels de formations ou d'abonnements utiles, avec un plafond strict de 2 niveaux.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 font-extrabold text-xs flex items-center justify-center font-mono">
                  02
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Rétractation</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Rétractation du Pass d'entrée & délais d'affiliation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le Pass d'entrée (Standard) dispose d'un délai de rétractation de 7 jours, avec remboursement vers le moyen de paiement utilisé sous déduction des frais de transaction (3 %). En cas de rétractation, le parrainage échoue et aucune commission n'est versée au parrain. Les abonnements VIP Premium ne sont pas remboursables en raison de l'accès immédiat et définitif aux fichiers et contacts VCF.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-600 font-extrabold text-xs flex items-center justify-center font-mono">
                  03
                </div>
                <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Vérité des Gains</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Statistiques Publiques & Vérifiables</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publication transparente et mise à jour périodique des revenus médians, des délais réels de versement et du pourcentage de membres en cours de progression, afin de préserver les utilisateurs de toute illusion ou promesse trompeuse.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 font-extrabold text-xs flex items-center justify-center font-mono">
                  04
                </div>
                <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">Zéro Hasard</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Interdiction Absolue des Jeux de Hasard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bannissement complet des roues de la fortune, des tirages au sort, des tombolas et des boîtes mystères payantes. Chaque récompense est 100% déterministe, connue à l'avance et directement liée à un effort fourni.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-600 font-extrabold text-xs flex items-center justify-center font-mono">
                  05
                </div>
                <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Garde-fou</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Protection des Membres & Plafonds Éthiques</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque membre a la possibilité de configurer un plafond de dépense mensuel personnel et peut activer une suspension volontaire temporaire de son compte pour prévenir tout emballement financier ou usage excessif.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 font-extrabold text-xs flex items-center justify-center font-mono">
                  06
                </div>
                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Légalité</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Conformité ARTCI & Traçabilité Financière</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Respect des réglementations ivoiriennes sur la protection des données personnelles et le commerce électronique. Toutes les opérations de crédit et débit sont inscrites dans un grand livre comptable immuable avec référence d'opérateur.
              </p>
            </div>

          </div>
        </div>

        {/* SECTION AFFILIATION ÉTHIQUE INTÉGRÉE (2 NIVEAUX MAXIMUM) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BabiMascot variant="badge" size="sm" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Règles de Rémunération des Parrains & Affiliation Éthique
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Encadrement strict conforme aux lois UEMOA : commissions exclusives sur ventes réelles, plafonnées à 2 niveaux.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 self-start sm:self-auto">
              Niveau 1 : 10% · Niveau 2 : 5%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-2">
              <div className="text-xs font-bold text-orange-950 flex items-center gap-2">
                <BabiMascot variant="wallet" size="xs" />
                <span>Commissions sur ventes réelles</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Une commission est due lorsqu'un filleul achète réellement un produit ou un service éligible ; les taux en vigueur (niveaux 1 et 2) sont affichés dans l'espace membre. Aucun gain n'est garanti.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                <BabiMascot variant="security" size="xs" />
                <span>0 FCFA pour le simple Recrutement</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                La création d'un compte gratuit ou le simple ajout de filleuls ne génère strictement aucun revenu. Seuls les achats de biens utiles et identifiables ouvrent droit à rémunération.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <BabiMascot variant="academic" size="xs" />
                <span>Condition de Fin de Parrainage</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Le lien de parrainage et le versement des commissions cessent automatiquement dès que le parrain ou le filleul désactive ou supprime son compte de la plateforme.
              </p>
            </div>
          </div>

          {/* Ethical Comparison Table: GLOBAL-AF vs Illegal Pyramidal Schemes */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Tableau comparatif : GLOBAL-AF vs Systèmes Pyramidaux Illégaux
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-3 px-4 font-bold">Critères d'évaluation</th>
                    <th className="py-3 px-4 font-bold text-emerald-700">GLOBAL-AF (Modèle Vertueux)</th>
                    <th className="py-3 px-4 font-bold text-rose-600">Schémas Pyramidaux Illégaux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Source des revenus</td>
                    <td className="py-3 px-4 text-emerald-800 font-semibold bg-emerald-50/30">Ventes réelles de formations, outils IA et missions utiles</td>
                    <td className="py-3 px-4 text-rose-700 bg-rose-50/30">Frais d'adhésion des nouveaux membres recrutés</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Profondeur des commissions</td>
                    <td className="py-3 px-4 text-emerald-800 font-semibold bg-emerald-50/30">2 niveaux maximum stricts (10% N1, 5% N2)</td>
                    <td className="py-3 px-4 text-rose-700 bg-rose-50/30">Niveaux infinis ou profonds (8, 10, 15 niveaux)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Rétractation & Remboursement</td>
                    <td className="py-3 px-4 text-emerald-800 font-semibold bg-emerald-50/30">Rétractation de 7 jours du Pass d'entrée, avec remboursement sous déduction des frais (3 %)</td>
                    <td className="py-3 px-4 text-rose-700 bg-rose-50/30">Aucune rétractation, fonds bloqués sans recours</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Jeux de hasard / Loteries</td>
                    <td className="py-3 px-4 text-emerald-800 font-semibold bg-emerald-50/30">Formellement interdits (aucun tirage au sort)</td>
                    <td className="py-3 px-4 text-rose-700 bg-rose-50/30">Roues tournantes, tombolas et promesses irréalistes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Le Serment de Transparence de Babi l'Éléphant */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <BabiMascot variant="security" size="xl" />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-slate-900 text-base">Le Serment de Babi l'Éléphant 🇨🇮</span>
              <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                Loyauté & Clarté
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              « En Côte d'Ivoire, l'éléphant est le noble symbole de notre pays au football et dans notre culture. Il incarne la mémoire, la force et l'intégrité. Sur GLOBAL-AF, je veille à ce qu'aucune fausse promesse ne soit faite : chaque membre est protégé par un droit de rétractation de 7 jours, zéro loterie, et un grand livre comptable vérifié. »
            </p>
          </div>
        </div>

        {/* Mobile Money Integration Showcase */}
        <div className="p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-bold text-white">Retraits sécurisés sur vos portefeuilles officiels</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vos gains sont versés sur votre compte Wave, Orange Money, MTN MoMo ou Moov Africa Côte d'Ivoire après contrôle de la demande ; montant minimum et frais sont affichés avant validation.
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
