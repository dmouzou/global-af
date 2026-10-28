/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/public/LandingPage';
import { MissionsPage } from './components/public/MissionsPage';
import { AcademyPage } from './components/public/AcademyPage';
import { AffiliationPage } from './components/public/AffiliationPage';
import { ToolsPage } from './components/public/ToolsPage';
import { TransparencePage } from './components/public/TransparencePage';
import { PartnerPage } from './components/public/PartnerPage';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdvertiserAdminLogin } from './components/admin/AdvertiserAdminLogin';
import { AuthModal } from './components/auth/AuthModal';
import { FloatingChatbotWidget } from './components/common/InformationalChatbot';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Task, AppView } from './types';

export const isExplicitAdminPortal = (): boolean => {
  if (typeof window === 'undefined') return false;
  // Strictly isolated: only when built as admin or on the dedicated admin domain
  const host = window.location.hostname.toLowerCase();
  return (
    host.includes('global-af-dev-admin') ||
    (import.meta as any).env?.VITE_APP_MODE === 'admin'
  );
};

function AppContent() {
  const { currentUser, logout } = useApp();
  const [isAdminPortal] = useState<boolean>(isExplicitAdminPortal);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'onboarding'>('signup');

  const isAdminUser = Boolean(
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'financial_manager')
  );

  const [advertiserAuth, setAdvertiserAuth] = useState<{
    email: string;
    companyName: string;
    role: 'admin' | 'advertiser';
  } | null>(null);

  useEffect(() => {
    if (isAdminUser && currentUser) {
      setAdvertiserAuth({
        email: currentUser.email,
        companyName: 'GLOBAL-AF Direction Générale',
        role: 'admin'
      });
    } else if (!isAdminUser) {
      setAdvertiserAuth(null);
    }
  }, [isAdminUser, currentUser]);

  // Lien de parrainage (?ref=CODE) : ouvre l'inscription (le code est prérempli par le formulaire).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && !currentUser) {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
    // une seule fois au chargement de la page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthComplete = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTaskFromLanding = (_task: Task) => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      handleOpenAuth('signup');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToView = (view: AppView) => {
    // Completely severed: frontend navigation NEVER switches to admin portal
    if (view === 'admin') return;

    let targetView = view;
    if (targetView === 'academy') targetView = 'academie';
    if (targetView === 'tools') targetView = 'outils';

    setCurrentView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = async () => {
    await logout();
    setAdvertiserAuth(null);
  };

  const handleReturnToPublic = () => {
    window.location.href = 'https://global-af-dev.web.app';
  };

  // 1. ISOLATED ADMIN & ADVERTISER PORTAL (global-af-dev-admin)
  if (isAdminPortal) {
    if (!advertiserAuth) {
      return (
        <AdvertiserAdminLogin 
          onLoginSuccess={(auth) => setAdvertiserAuth(auth)}
          onReturnToPublicSite={handleReturnToPublic}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReturnToPublic}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Revenir au site public
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono text-emerald-400">global-af-dev-admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">{advertiserAuth.email}</span>
            <button
              onClick={handleAdminLogout}
              className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded bg-red-950/40 border border-red-800/40"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AdminDashboard 
            advertiserInfo={advertiserAuth}
            onLogout={handleAdminLogout}
          />
        </main>
      </div>
    );
  }

  // 2. MAIN PUBLIC & MEMBER PLATFORM (global-af-dev.web.app)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* 3-Zone Top Navigation Contract */}
      <Navbar 
        currentView={currentView}
        setCurrentView={navigateToView}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area: Multi-Page Routing */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
            onSelectTask={handleSelectTaskFromLanding}
            onNavigatePage={(page) => navigateToView(page as AppView)}
          />
        )}

        {currentView === 'missions' && (
          <MissionsPage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
            onSelectTask={handleSelectTaskFromLanding}
          />
        )}

        {(currentView === 'academy' || currentView === 'academie') && (
          <AcademyPage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'affiliation' && (
          <TransparencePage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'partenaire' && (
          <PartnerPage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {(currentView === 'tools' || currentView === 'outils') && (
          <ToolsPage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'transparence' && (
          <TransparencePage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'dashboard' && (
          <ErrorBoundary>
            <MemberDashboard onOpenAuth={handleOpenAuth} />
          </ErrorBoundary>
        )}

        {/* Fallback to prevent blank white screens for any unmapped route */}
        {!['landing', 'missions', 'academy', 'academie', 'affiliation', 'partenaire', 'tools', 'outils', 'transparence', 'dashboard'].includes(currentView) && (
          <LandingPage 
            onGoToDashboard={() => {
              if (currentUser) {
                navigateToView('dashboard');
              } else {
                handleOpenAuth('login');
              }
            }}
            onOpenAuth={handleOpenAuth}
            onSelectTask={handleSelectTaskFromLanding}
            onNavigatePage={(page) => navigateToView(page as AppView)}
          />
        )}
      </main>

      {/* Footer with multi-page and section routing */}
      <Footer 
        onNavigateSection={(sec) => {
          if (['missions', 'academie', 'affiliation', 'outils', 'transparence', 'dashboard'].includes(sec)) {
            navigateToView(sec as AppView);
          } else {
            setCurrentView('landing');
            setTimeout(() => {
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }} 
      />

      {/* Auth & Onboarding Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onComplete={handleAuthComplete}
      />

      {/* Floating High-Performance Informational Chatbot */}
      <FloatingChatbotWidget onNavigateView={(v) => navigateToView(v as AppView)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
