import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  ArrowRight, 
  Calculator,
  Lock,
  Sparkles
} from 'lucide-react';

interface AffiliationPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const AffiliationPage: React.FC<AffiliationPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const [level1Referrals, setLevel1Referrals] = useState(1);
  const [level2Referrals, setLevel2Referrals] = useState(0);
  const [averageBasket, setAverageBasket] = useState(10000); // exemple de panier, modifiable

  // Commissions: 10% on level 1, 5% on level 2
  const level1Earnings = level1Referrals * (averageBasket * 0.10);
  const level2Earnings = level2Referrals * (averageBasket * 0.05);
  const totalCommission = level1Earnings + level2Earnings;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>Programme de Partenariat Vertueux</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Affiliation Éthique sur Ventes Réelles
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Un modèle transparent limité à 2 niveaux maximum. Aucune prime au recrutement : vos gains proviennent uniquement de la valeur apportée et des achats utiles de vos filleuls.
          </p>
        </div>

        {/* Interactive Commission Calculator */}
        <div className="bg-gradient-to-br from-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-orange-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulateur de Commissions sur 2 Niveaux</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Simulez vos commissions d'affiliation
              </h2>
              
              <div className="space-y-4 pt-2">
                {/* Level 1 Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Filleuls directs Niveau 1 (10% commission) :</span>
                    <span className="text-orange-400 font-bold">{level1Referrals} acheteurs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={level1Referrals}
                    onChange={(e) => setLevel1Referrals(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Level 2 Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Filleuls indirects Niveau 2 (5% commission) :</span>
                    <span className="text-orange-400 font-bold">{level2Referrals} acheteurs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={level2Referrals}
                    onChange={(e) => setLevel2Referrals(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Average Basket */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Panier moyen d'achat utile :</span>
                    <span className="text-emerald-400 font-notable font-bold">{averageBasket.toLocaleString()} FCFA</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="5000"
                    value={averageBasket}
                    onChange={(e) => setAverageBasket(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Total Results */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4 text-center">
              <div className="text-xs uppercase tracking-wider text-orange-300 font-bold">
                Exemple de calcul (hypothétique)
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-notable">
                  {totalCommission.toLocaleString()} FCFA
                </div>
                <div className="text-[11px] text-slate-300">Illustration : aucun gain n'est garanti. Le montant dépend des achats réels de vos filleuls ; les taux en vigueur sont affichés dans l'espace membre.</div>
              </div>

              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-left">
                <div className="p-2.5 rounded-lg bg-black/20">
                  <div className="text-slate-400 text-[10px]">Niveau 1 (10%)</div>
                  <div className="font-bold text-orange-400 font-notable text-xs sm:text-sm">{level1Earnings.toLocaleString()} FCFA</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/20">
                  <div className="text-slate-400 text-[10px]">Niveau 2 (5%)</div>
                  <div className="font-bold text-emerald-400 font-notable text-xs sm:text-sm">{level2Earnings.toLocaleString()} FCFA</div>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Obtenir mon lien d'affilié</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Ethical Comparison Table: GLOBAL-AF vs Illegal Pyramidal Schemes */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Pourquoi ce modèle est conçu pour être éthique
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Comprendre la différence fondamentale entre notre affiliation vertueuse et les montages pyramidaux frauduleux.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-bold text-slate-900 bg-slate-50 rounded-l-xl">Critère de vérification</th>
                  <th className="py-3 px-4 font-bold text-emerald-700 bg-emerald-50/60">GLOBAL-AF (Éthique & Légal)</th>
                  <th className="py-3 px-4 font-bold text-rose-700 bg-rose-50/60 rounded-r-xl">Système Pyramidal (Illégal)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">Origine des commissions</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">Ventes réelles de cours et d'outils digitaux</td>
                  <td className="py-3.5 px-4 text-rose-800">Droit d'entrée payé par les nouveaux arrivants</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">Gain sur le simple recrutement</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">0 FCFA (Strictement aucun gain)</td>
                  <td className="py-3.5 px-4 text-rose-800">Rémunération par tête recrutée</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">Nombre de niveaux d'affiliation</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">2 niveaux maximum (Plafonné)</td>
                  <td className="py-3.5 px-4 text-rose-800">Niveaux infinis (Ponzi / Pyramide)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">Accès gratuit et sans achat</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">Inscription gratuite ; offres payantes optionnelles</td>
                  <td className="py-3.5 px-4 text-rose-800">Non, achat obligatoire pour participer</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">Droit de rétractation</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">7 jours avec remboursement Mobile Money</td>
                  <td className="py-3.5 px-4 text-rose-800">Fonds bloqués sans aucun recours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-8 py-3.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
          >
            <span>Rejoindre le réseau de partenaires</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
