import React from 'react';
import { Globe, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrandLogo, AhMark } from '../common/BrandLogo';

export interface AdminNavItem { id: string; label: string; icon: LucideIcon; badge?: number }

interface Props {
  items: AdminNavItem[];
  active: string;
  onSelect: (id: string) => void;
  roleLabel: string;
  email: string;
  onLogout: () => void;
  onPublic?: () => void;
  children: React.ReactNode;
}

export const AdminShell: React.FC<Props> = ({ items, active, onSelect, roleLabel, email, onLogout, onPublic, children }) => {
  const current = items.find(i => i.id === active);
  return (
    <div className="min-h-screen bg-mist md:flex">
      {/* Barre latérale */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink p-4 text-white md:flex" aria-label="Menu de la console">
        <div className="px-2 pt-1"><BrandLogo size="md" variant="admin" /></div>
        <div className="mt-5 rounded-2xl bg-white/8 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Connecté</p>
          <p className="mt-0.5 truncate text-sm font-bold">{roleLabel}</p>
          <p className="truncate text-xs text-white/55">{email}</p>
        </div>
        <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto">
          {items.map(i => {
            const Icon = i.icon; const on = i.id === active;
            return (
              <button key={i.id} onClick={() => onSelect(i.id)} aria-current={on ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-[15px] font-semibold transition ${on ? 'bg-wax text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}>
                <span className="flex items-center gap-3"><Icon className="h-[18px] w-[18px]" />{i.label}</span>
                {!!i.badge && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${on ? 'bg-white text-wax-deep' : 'bg-wax text-white'}`}>{i.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="mt-4 space-y-1 border-t border-white/12 pt-3">
          {onPublic && <button onClick={onPublic} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-white/70 hover:bg-white/8"><Globe className="h-[18px] w-[18px]" />Site public</button>}
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-rose-300 hover:bg-white/8"><LogOut className="h-[18px] w-[18px]" />Déconnexion</button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Barre mobile : titre + onglets défilants */}
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur-xl md:hidden" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <div className="flex min-w-0 items-center gap-3"><AhMark className="h-8 w-8 shrink-0" title="AH GLOBAL" /><h1 className="truncate font-display text-lg font-extrabold">{current?.label}</h1></div>
            <button onClick={onLogout} aria-label="Déconnexion" className="rounded-full p-2.5 text-rose-600 hover:bg-rose-50"><LogOut className="h-5 w-5" /></button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3" role="tablist" aria-label="Sections">
            {items.map(i => (
              <button key={i.id} role="tab" aria-selected={i.id === active} onClick={() => onSelect(i.id)}
                className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${i.id === active ? 'bg-ink text-white' : 'bg-mist text-ink/70'}`}>
                {i.label}{!!i.badge && <span className="ml-1.5 rounded-full bg-wax px-1.5 text-[11px] text-white">{i.badge}</span>}
              </button>
            ))}
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 md:pt-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
};
