import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Shield, ChevronDown, RotateCcw } from 'lucide-react';
import { DEMO_PROFILES } from '../../data/initialData';
import { AppView } from '../../types';

interface DemoSwitcherProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const DemoSwitcher: React.FC<DemoSwitcherProps> = ({ currentView, setCurrentView }) => {
  const { currentUser, switchProfile, resetDataToDefault } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-2xl border border-slate-300 p-4 w-72 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulateur de Profils</span>
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Choisir un profil membre test :</span>
            {DEMO_PROFILES.filter(p => p.role !== 'admin' && p.role !== 'financial_manager' && p.role !== 'moderator').map(profile => (
              <button
                key={profile.id}
                onClick={() => {
                  switchProfile(profile.id);
                }}
                className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                  currentUser.id === profile.id 
                    ? 'bg-orange-50 border border-orange-200 text-orange-950 font-bold' 
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div>{profile.firstName} {profile.lastName}</div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {profile.role.replace('_', ' ')}
                  </div>
                </div>
                {currentUser.id === profile.id && <span className="text-orange-600 font-bold">●</span>}
              </button>
            ))}
          </div>

          {/* Quick view switcher */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Vue active (Site Public) :</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setCurrentView('landing')}
                className={`p-1.5 rounded-lg text-[11px] font-semibold text-center transition-colors ${
                  currentView === 'landing' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Site Public
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`p-1.5 rounded-lg text-[11px] font-bold text-center transition-colors ${
                  currentView === 'dashboard' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Espace Membre
              </button>
            </div>
          </div>

          {/* Separate Annonceurs / Admin Portal Link */}
          <div className="pt-2 border-t border-slate-100">
            <a
              href="https://global-af-dev-admin.web.app"
              onClick={(e) => {
                if (window.location.hostname === 'localhost' || window.location.hostname.includes('web.app')) {
                  e.preventDefault();
                  window.location.href = window.location.hostname === 'localhost' ? '/?mode=admin' : 'https://global-af-dev-admin.web.app';
                }
              }}
              className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-lg text-[11px] font-bold flex items-center justify-between group transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Portail Annonceurs</span>
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-amber-300 font-mono">
                Admin →
              </span>
            </a>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={resetDataToDefault}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser les données démo</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Profil démo : {currentUser.firstName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
};
