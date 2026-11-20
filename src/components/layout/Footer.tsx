import React from 'react';
import { Mail, MapPin, AlertCircle } from 'lucide-react';
import { OperatorLogo } from '../common/OperatorLogo';
import { BrandLogo } from '../common/BrandLogo';
import { BabiVector } from '../brand/BabiVector';
import { ScarfRibbon, WaxPattern } from '../brand/Illustrations';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const nav = (sec: string) => onNavigateSection?.(sec);
  const link = 'text-left text-white/70 transition-colors hover:text-white';

  return (
    <footer className="relative bg-ink text-sm text-white/80">
      <ScarfRibbon />
      <WaxPattern tone="dark" className="pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <BrandLogo size="md" variant="white" />
            <p className="max-w-md text-[15px] leading-relaxed text-white/70">
              Missions numériques, Académie, outils IA et affiliation sur ventes réelles, avec un portefeuille relié au Mobile Money. Lancement en Côte d'Ivoire.
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-wax" /> Plateau / Cocody, Abidjan, Côte d'Ivoire</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-wax" /> contact@global-af.ci</li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 font-display text-base font-bold text-white">Découvrir</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><button onClick={() => nav('missions')} className={link}>Micro-jobs et missions</button></li>
              <li><button onClick={() => nav('academie')} className={link}>Digital Academy</button></li>
              <li><button onClick={() => nav('affiliation')} className={link}>Affiliation sur ventes réelles</button></li>
              <li><button onClick={() => nav('outils')} className={link}>Outils IA</button></li>
              <li><button onClick={() => nav('partenaire')} className={link}>Espace entreprises</button></li>
              <li><button onClick={() => nav('transparence')} className={link}>Transparence et charte</button></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-4 font-display text-base font-bold text-white">Paiements Mobile Money</h4>
            <div className="grid max-w-xs grid-cols-2 gap-2.5">
              <OperatorLogo operator="Wave" size="sm" variant="pill" className="bg-white border-white" />
              <OperatorLogo operator="Orange Money" size="sm" variant="pill" className="bg-white border-white" />
              <OperatorLogo operator="MTN MoMo" size="sm" variant="pill" className="bg-white border-white" />
              <OperatorLogo operator="Moov Money" size="sm" variant="pill" className="bg-white border-white" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/12 pt-6 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p>© 2026 AH GLOBAL. Tous droits réservés.</p>
            <nav aria-label="Informations légales" className="flex flex-wrap gap-x-5 gap-y-1">
              <button type="button" onClick={() => nav('cgu')} className="hover:text-white">Conditions générales</button>
              <button type="button" onClick={() => nav('confidentialite')} className="hover:text-white">Confidentialité</button>
              <button type="button" onClick={() => nav('cookies')} className="hover:text-white">Cookies</button>
              <button type="button" onClick={() => nav('mentions')} className="hover:text-white">Mentions légales</button>
            </nav>
          </div>
          <p className="flex items-start gap-2 md:max-w-sm md:text-right">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-sun" />
            Aucune promesse de gain garanti. Les résultats dépendent du travail réel.
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-[112px] left-6 hidden sm:block sm:left-[55%]" aria-hidden="true">
        <BabiVector mood="wave" size={110} />
      </div>
    </footer>
  );
};
