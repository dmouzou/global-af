import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, LogOut, Menu, X } from 'lucide-react';
import { AppView } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { BabiVector } from '../brand/BabiVector';
import { ScarfRibbon } from '../brand/Illustrations';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const LINKS: { view: AppView; label: string; aliases?: AppView[] }[] = [
  { view: 'missions', label: 'Missions' },
  { view: 'academie', label: 'Académie', aliases: ['academy'] },
  { view: 'affiliation', label: 'Affiliation' },
  { view: 'outils', label: 'Outils IA', aliases: ['tools'] },
  { view: 'partenaire', label: 'Entreprises' },
  { view: 'transparence', label: 'Transparence' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenAuth }) => {
  const { currentUser, logout, notifications } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (view: AppView, hash?: string) => {
    setCurrentView(view);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (hash) {
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  };

  const isActive = (l: typeof LINKS[number]) => currentView === l.view || !!l.aliases?.includes(currentView);

  return (
    <header className="sticky top-0 z-40">
      <ScarfRibbon thin />
      <div className={`bg-white/90 backdrop-blur-xl transition-shadow ${scrolled ? 'shadow-[0_8px_30px_-18px_rgba(15,42,30,0.35)]' : ''} border-b border-ink/8`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <button onClick={() => go('landing')} className="shrink-0 text-left" aria-label="GLOBAL-AF, accueil">
            <BrandLogo size="md" />
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {LINKS.map(l => (
              <button
                key={l.view}
                onClick={() => go(l.view)}
                aria-current={isActive(l) ? 'page' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors ${
                  isActive(l) ? 'bg-ink text-white' : 'text-ink/70 hover:bg-mist hover:text-ink'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => go('dashboard')}
                  className="relative inline-flex items-center gap-2 rounded-full bg-wax px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(255,119,0,0.8)] transition hover:bg-wax-deep"
                >
                  Mon espace
                  <span className="hidden text-white/85 sm:inline">· {currentUser.firstName}</span>
                  {unread > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-white ring-2 ring-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="hidden rounded-full p-2.5 text-ink/50 transition hover:bg-rose-50 hover:text-rose-600 sm:block"
                  aria-label="Déconnexion"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hidden rounded-full px-4 py-2 text-[15px] font-semibold text-ink/80 transition hover:bg-mist sm:block"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-wax px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(255,119,0,0.8)] transition hover:bg-wax-deep"
                >
                  <span className="sm:hidden">S'inscrire</span>
                  <span className="hidden sm:inline">Créer mon compte</span>
                  <ArrowRight className="hidden h-4 w-4 sm:block" />
                </button>
              </>
            )}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="rounded-full p-2.5 text-ink transition hover:bg-mist lg:hidden"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[calc(4rem+4px)] z-30 overflow-y-auto bg-white lg:hidden">
          <div className="mx-auto flex min-h-full max-w-md flex-col px-5 pb-8 pt-4">
            <nav className="flex flex-col" aria-label="Navigation mobile">
              {[{ view: 'landing' as AppView, label: 'Accueil' }, ...LINKS].map(l => (
                <button
                  key={l.view}
                  onClick={() => go(l.view)}
                  className={`flex items-center justify-between border-b border-ink/8 py-4 text-left font-display text-2xl font-bold ${
                    currentView === l.view ? 'text-wax' : 'text-ink'
                  }`}
                >
                  {l.label}
                  <ArrowRight className="h-5 w-5 text-ink/30" />
                </button>
              ))}
            </nav>
            <div className="mt-6 grid gap-3">
              {currentUser ? (
                <>
                  <button onClick={() => go('dashboard')} className="rounded-full bg-wax py-3.5 font-bold text-white">
                    Mon espace personnel
                  </button>
                  <button onClick={() => setShowLogoutConfirm(true)} className="rounded-full py-3 font-semibold text-rose-600">
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMenuOpen(false); onOpenAuth('signup'); }} className="rounded-full bg-wax py-3.5 font-bold text-white">
                    Créer mon compte gratuit
                  </button>
                  <button onClick={() => { setMenuOpen(false); onOpenAuth('login'); }} className="rounded-full border-2 border-ink/15 py-3 font-bold text-ink">
                    Connexion
                  </button>
                </>
              )}
            </div>
            <div className="mt-auto flex justify-center pt-8">
              <BabiVector mood="wave" size={130} />
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto -mt-16 mb-1 w-fit"><BabiVector mood="think" size={96} /></div>
            <h3 id="logout-title" className="font-display text-xl font-bold text-ink">Se déconnecter ?</h3>
            <p className="mt-1 text-sm text-ink/60">Vous pourrez vous reconnecter à tout moment avec votre e-mail.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-full bg-mist py-3 text-sm font-bold text-ink hover:bg-ink/10">
                Rester connecté
              </button>
              <button
                onClick={async () => { setShowLogoutConfirm(false); setMenuOpen(false); await logout(); }}
                className="flex-1 rounded-full bg-ink py-3 text-sm font-bold text-white hover:bg-ink-soft"
              >
                Me déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
