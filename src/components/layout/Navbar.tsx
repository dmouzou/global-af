import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  User as UserIcon, 
  Menu, 
  X, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { CountryCode, UserRole, AppView } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenAuth }) => {
  const { currentUser, switchProfile, selectedCountry, setCountryCode, notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (view: AppView, hash?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (hash && typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const roleLabel: Record<UserRole, string> = {
    member: 'Membre Standard',
    member_premium: 'Membre Premium',
    moderator: 'Modérateur',
    support: 'Support',
    financial_manager: 'Gestionnaire Financier',
    content_manager: 'Gestionnaire Contenu',
    admin: 'Administrateur',
    super_admin: 'Super Admin'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-zone top bar contract: Brand - Nav Links - Primary Action */}
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand Zone with Côte d'Ivoire identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('landing')}
              className="text-left group flex items-center focus-visible:outline-none"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Zone 2: Multi-Page Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button 
              onClick={() => handleNavClick('landing')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 py-1 ${currentView === 'landing' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavClick('missions')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 py-1 ${currentView === 'missions' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''}`}
            >
              Micro-jobs
            </button>
            <button 
              onClick={() => handleNavClick('academie')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 py-1 ${currentView === 'academie' || currentView === 'academy' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''}`}
            >
              Académie
            </button>
            <button 
              onClick={() => handleNavClick('affiliation')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 py-1 ${currentView === 'affiliation' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''}`}
            >
              Affiliation
            </button>
            <button 
              onClick={() => handleNavClick('outils')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 py-1 ${currentView === 'outils' || currentView === 'tools' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''}`}
            >
              Outils IA
            </button>
            <button 
              onClick={() => handleNavClick('transparence')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${currentView === 'transparence' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'text-emerald-700/90'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transparence & Charte</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action + role/country utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Exclusive Country Badge (Côte d'Ivoire) */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-orange-50/80 border border-orange-200/80 rounded-lg shadow-2xs">
              <div className="flex items-center h-2.5 w-3.5 rounded-2xs overflow-hidden border border-slate-300" title="Côte d'Ivoire">
                <span className="w-1/3 h-full bg-[#FF7700]"></span>
                <span className="w-1/3 h-full bg-white"></span>
                <span className="w-1/3 h-full bg-[#009E49]"></span>
              </div>
              <span className="text-xs font-bold text-slate-800">Côte d'Ivoire (FCFA)</span>
            </div>

            {/* User Session Info (Member Only - No Admin/Mod Roles on Public Site) */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors border border-slate-200/80"
              title="Mon Espace Personnel"
            >
              <UserIcon className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden md:inline">{currentUser.firstName}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase font-bold hidden sm:inline">
                {currentUser.subscriptionPlan === 'premium' ? 'Premium' : 'Membre'}
              </span>
            </button>

            {/* Main Action Button */}
            {currentView === 'landing' ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-orange-500/20 active:scale-95"
              >
                <span>Mon Espace Personnel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('landing')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Site Public
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <button 
              onClick={() => handleNavClick('landing')}
              className={`text-left py-2 px-3 rounded font-medium ${currentView === 'landing' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavClick('missions')}
              className={`text-left py-2 px-3 rounded font-medium ${currentView === 'missions' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'}`}
            >
              Micro-jobs rémunérés
            </button>
            <button 
              onClick={() => handleNavClick('academie')}
              className={`text-left py-2 px-3 rounded font-medium ${currentView === 'academie' || currentView === 'academy' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'}`}
            >
              Académie Digitale
            </button>
            <button 
              onClick={() => handleNavClick('affiliation')}
              className={`text-left py-2 px-3 rounded font-medium ${currentView === 'affiliation' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'}`}
            >
              Affiliation Éthique (Max 2 Niveaux)
            </button>
            <button 
              onClick={() => handleNavClick('outils')}
              className={`text-left py-2 px-3 rounded font-medium ${currentView === 'outils' || currentView === 'tools' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'}`}
            >
              Outils & Générateur IA
            </button>
            <button 
              onClick={() => handleNavClick('transparence')}
              className={`text-left py-2 px-3 rounded flex items-center gap-2 font-medium ${currentView === 'transparence' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-emerald-700'}`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparence & Charte Éthique</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full text-center py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg hover:from-orange-600 hover:to-amber-600 shadow-sm"
            >
              Mon Espace Personnel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
