import React, { useEffect, useState } from 'react';
import { Bell, Globe, LogOut, MoreHorizontal, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { User } from '../../types';
import { BrandLogo, AhMark } from '../common/BrandLogo';
import { fcfa, Pill } from './ui';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  group: string;
  badge?: number;
}

interface ShellProps {
  items: NavItem[];
  active: string;
  onSelect: (id: any) => void;
  user: User;
  balance: number;
  currency: string;
  onWithdraw: () => void;
  onNavigatePublic?: () => void;
  onLogout: () => void;
  /** Identifiants affichés dans la barre du bas (mobile) ; les autres vont dans « Plus ». */
  primary: string[];
  children: React.ReactNode;
}

const planLabel = (u: User) =>
  u.subscriptionPlan === 'premium' ? 'VIP Premium' : u.subscriptionPlan === 'business' ? 'Business' : u.isActivated ? 'Pass membre' : 'Compte gratuit';

export const DashboardShell: React.FC<ShellProps> = ({ items, active, onSelect, user, balance, currency, onWithdraw, onNavigatePublic, onLogout, primary, children }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const current = items.find(i => i.id === active);
  const groups = Array.from(new Set(items.map(i => i.group)));
  const notif = items.find(i => i.id === 'notifications');

  useEffect(() => {
    document.body.classList.add('has-bottom-nav');
    return () => document.body.classList.remove('has-bottom-nav');
  }, []);

  const select = (id: string) => { setMoreOpen(false); onSelect(id); window.scrollTo({ top: 0 }); };

  return (
    <div className="min-h-screen bg-mist md:flex">
      {/* ── Barre latérale (ordinateur) ── */}
      <aside className="sticky top-[68px] hidden h-[calc(100vh-68px)] w-72 shrink-0 flex-col overflow-y-auto border-r border-ink/8 bg-white p-4 md:flex" aria-label="Menu de l'espace personnel">
        <div className="rounded-3xl bg-ink p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-wax font-display text-base font-extrabold">
              {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-bold leading-tight">{user.firstName} {user.lastName}</p>
              <p className="truncate text-xs text-white/55">{user.memberNumber || 'N° de membre en attente'}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Pill tone={user.isActivated ? 'sunSolid' : 'mist'}>{planLabel(user)}</Pill>
            <span className="text-[11px] text-white/50">Niveau {user.level}</span>
          </div>
          <div className="mt-3 rounded-2xl bg-white/10 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">Solde disponible</p>
            <p className="mt-0.5 font-display text-xl font-extrabold">{fcfa(balance, currency)}</p>
            <button onClick={onWithdraw} className="mt-2.5 w-full rounded-full bg-wax py-2 text-[13px] font-bold text-white hover:bg-wax-deep">Retirer sur Mobile Money</button>
          </div>
        </div>

        <nav className="mt-5 flex-1 space-y-5">
          {groups.map(g => (
            <div key={g}>
              <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">{g}</p>
              <ul className="space-y-0.5">
                {items.filter(i => i.group === g).map(i => {
                  const Icon = i.icon;
                  const on = i.id === active;
                  return (
                    <li key={i.id}>
                      <button onClick={() => select(i.id)} aria-current={on ? 'page' : undefined}
                        className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-[15px] font-semibold transition ${on ? 'bg-wax text-white shadow-[0_10px_20px_-12px_rgba(255,119,0,0.9)]' : 'text-ink/75 hover:bg-mist hover:text-ink'}`}>
                        <span className="flex items-center gap-3"><Icon className="h-[18px] w-[18px]" />{i.label}</span>
                        {!!i.badge && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${on ? 'bg-white text-wax-deep' : 'bg-wax text-white'}`}>{i.badge}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-5 space-y-1 border-t border-ink/8 pt-4">
          {onNavigatePublic && (
            <button onClick={onNavigatePublic} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-ink/70 hover:bg-mist"><Globe className="h-[18px] w-[18px]" />Voir le site public</button>
          )}
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-[18px] w-[18px]" />Se déconnecter</button>
        </div>
      </aside>

      {/* ── Contenu ── */}
      <div className="min-w-0 flex-1">
        {/* Barre du haut (mobile) */}
        <header className="sticky top-0 z-30 border-b border-ink/8 bg-white/92 backdrop-blur-xl md:hidden" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <div className="flex min-w-0 items-center gap-3">
              <AhMark className="h-8 w-8 shrink-0" title="AH GLOBAL" />
              <h1 className="truncate font-display text-lg font-extrabold">{current?.label ?? 'Espace personnel'}</h1>
            </div>
            <button onClick={() => select('notifications')} aria-label="Notifications" className="relative rounded-full p-2.5 text-ink hover:bg-mist">
              <Bell className="h-5 w-5" />
              {!!notif?.badge && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-wax px-1 text-[10px] font-bold text-white">{notif.badge}</span>}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pt-8 lg:px-8">{children}</main>
      </div>

      {/* ── Barre du bas (mobile) ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur-xl md:hidden" aria-label="Navigation principale" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-1">
          {primary.map(id => {
            const i = items.find(x => x.id === id)!;
            const Icon = i.icon;
            const on = i.id === active;
            return (
              <li key={id} className="flex-1">
                <button onClick={() => select(id)} aria-current={on ? 'page' : undefined} className={`flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-bold ${on ? 'text-wax' : 'text-ink/55'}`}>
                  <span className={`grid h-7 w-12 place-items-center rounded-full transition ${on ? 'bg-wax/12' : ''}`}><Icon className="h-5 w-5" /></span>
                  {i.label.split(' ')[0]}
                </button>
              </li>
            );
          })}
          <li className="flex-1">
            <button onClick={() => setMoreOpen(true)} className="flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-bold text-ink/55">
              <span className="grid h-7 w-12 place-items-center rounded-full"><MoreHorizontal className="h-5 w-5" /></span>Plus
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/60 backdrop-blur-sm md:hidden" onMouseDown={() => setMoreOpen(false)} role="dialog" aria-modal="true" aria-label="Tous les menus">
          <div onMouseDown={e => e.stopPropagation()} className="max-h-[85vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5" style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
            <div className="flex items-center justify-between">
              <BrandLogo size="sm" showSubtitle={false} />
              <button onClick={() => setMoreOpen(false)} aria-label="Fermer" className="rounded-full p-2 hover:bg-mist"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {items.map(i => {
                const Icon = i.icon;
                return (
                  <button key={i.id} onClick={() => select(i.id)} className={`relative flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center text-[12px] font-bold ${i.id === active ? 'bg-wax text-white' : 'bg-mist text-ink'}`}>
                    <Icon className="h-6 w-6" />
                    <span className="leading-tight">{i.label}</span>
                    {!!i.badge && <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-wax px-1 text-[10px] font-bold text-white">{i.badge}</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {onNavigatePublic && <button onClick={onNavigatePublic} className="flex items-center justify-center gap-2 rounded-full bg-mist py-3 text-sm font-bold"><Globe className="h-4 w-4" />Site public</button>}
              <button onClick={onLogout} className="flex items-center justify-center gap-2 rounded-full bg-rose-50 py-3 text-sm font-bold text-rose-600"><LogOut className="h-4 w-4" />Déconnexion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
