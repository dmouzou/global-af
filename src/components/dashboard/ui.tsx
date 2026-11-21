import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { BabiMood, BabiProp, BabiVector } from '../brand/BabiVector';

export const fcfa = (n: number, currency = 'XOF') => `${n.toLocaleString('fr-FR')} ${currency === 'XOF' ? 'FCFA' : currency}`;

export const Panel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <section className={`rounded-3xl bg-white p-5 ring-1 ring-ink/10 sm:p-6 ${className}`}>{children}</section>
);

export const PageTitle: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-ink/60">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const TONES = {
  wax: 'bg-wax/12 text-wax-deep',
  leaf: 'bg-leaf/12 text-leaf-deep',
  sun: 'bg-sun/30 text-ink',
  sunSolid: 'bg-sun text-ink',
  ink: 'bg-ink text-white',
  mist: 'bg-mist text-ink/70',
  rose: 'bg-rose-100 text-rose-700',
} as const;
export type Tone = keyof typeof TONES;

export const Pill: React.FC<React.PropsWithChildren<{ tone?: Tone; className?: string }>> = ({ tone = 'mist', className = '', children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${TONES[tone]} ${className}`}>{children}</span>
);

export const Stat: React.FC<{ label: string; value: React.ReactNode; hint?: React.ReactNode; accent?: 'wax' | 'leaf' | 'sun' | 'ink'; children?: React.ReactNode }> = ({ label, value, hint, accent = 'ink', children }) => {
  const bar = { wax: 'bg-wax', leaf: 'bg-leaf', sun: 'bg-sun', ink: 'bg-ink' }[accent];
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-ink/10">
      <span className={`absolute left-0 top-0 h-1 w-full ${bar}`} aria-hidden="true" />
      <p className="text-[12px] font-bold uppercase tracking-wider text-ink/50">{label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold leading-none text-ink sm:text-[1.7rem]">{value}</p>
      {hint && <p className="mt-2 text-[13px] leading-snug text-ink/55">{hint}</p>}
      {children}
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; text: string; mood?: BabiMood; prop?: BabiProp; action?: React.ReactNode }> = ({ title, text, mood = 'think', prop = 'none', action }) => (
  <div className="grid items-center gap-5 rounded-3xl border-2 border-dashed border-ink/15 bg-mist/60 p-7 sm:grid-cols-[auto_1fr]">
    <BabiVector mood={mood} prop={prop} size={112} className="mx-auto" />
    <div className="text-center sm:text-left">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink/65">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  </div>
);

export const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'primary' | 'ink' | 'ghost' | 'sun' }> = ({ kind = 'primary', className = '', ...p }) => {
  const k = {
    primary: 'bg-wax text-white hover:bg-wax-deep shadow-[0_10px_20px_-10px_rgba(255,119,0,0.8)]',
    ink: 'bg-ink text-white hover:bg-ink-soft',
    ghost: 'bg-white text-ink ring-1 ring-ink/15 hover:ring-ink/40',
    sun: 'bg-sun text-ink hover:bg-[#FFD459]',
  }[kind];
  return <button {...p} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${k} ${className}`} />;
};

export const Modal: React.FC<React.PropsWithChildren<{ open: boolean; onClose: () => void; title: string; subtitle?: string; wide?: boolean }>> = ({ open, onClose, title, subtitle, wide, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-ink/60 backdrop-blur-sm sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <div onMouseDown={e => e.stopPropagation()} className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8 ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold leading-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-ink/55">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-full p-2 text-ink/50 hover:bg-mist hover:text-ink"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export const inputCls = 'mt-1.5 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-wax';

/** Écran verrouillé : même présentation partout (Pass requis, Premium requis…). */
export const Gate: React.FC<React.PropsWithChildren<{ pill: string; title: string; text: string; prop?: BabiProp; mood?: BabiMood }>> = ({ pill, title, text, prop = 'shield', mood = 'think', children }) => (
  <Panel className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:p-8">
    <BabiVector mood={mood} prop={prop} size={140} className="mx-auto" />
    <div>
      <Pill tone="sun">{pill}</Pill>
      <h2 className="mt-3 font-display text-2xl font-extrabold">{title}</h2>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/65">{text}</p>
      {children && <div className="mt-4 flex flex-wrap gap-2.5">{children}</div>}
    </div>
  </Panel>
);
