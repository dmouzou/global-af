import React from 'react';
import { Mail, MapPin, AlertCircle, Lock } from 'lucide-react';
import { OperatorLogo } from '../common/OperatorLogo';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const handleNav = (sec: string) => {
    if (onNavigateSection) {
      onNavigateSection(sec);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Market context */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" variant="white" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Plateforme ouest-africaine de valorisation des compétences numériques, de micro-missions rémunérées et d'affiliation éthique. Conçue pour un lancement en Côte d'Ivoire avec intégration native Wave, Orange Money, MTN MoMo et Moov Money.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Plateau / Cocody, Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>contact@global-af.ci</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Pages & Fonctionnalités
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('missions')} className="hover:text-white transition-colors text-left">
                  Micro-jobs & Missions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('academie')} className="hover:text-white transition-colors text-left">
                  Digital Academy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('affiliation')} className="hover:text-white transition-colors text-left">
                  Affiliation (1-2 Niveaux)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('outils')} className="hover:text-white transition-colors text-left">
                  Outils IA & Rédaction
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('transparence')} className="hover:text-white transition-colors text-left">
                  Transparence & Statistiques
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Money Operators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Paiements Supportés
            </h4>
            <div className="space-y-2">
              <OperatorLogo operator="Wave" size="sm" variant="pill" className="bg-slate-800/80 border-slate-700 text-slate-200" />
              <OperatorLogo operator="Orange Money" size="sm" variant="pill" className="bg-slate-800/80 border-slate-700 text-slate-200" />
              <OperatorLogo operator="MTN MoMo" size="sm" variant="pill" className="bg-slate-800/80 border-slate-700 text-slate-200" />
              <OperatorLogo operator="Moov Money" size="sm" variant="pill" className="bg-slate-800/80 border-slate-700 text-slate-200" />
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>© 2026 GLOBAL-AF. Tous droits réservés.</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Aucune promesse de gain garanti. Les résultats dépendent du travail réel.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
