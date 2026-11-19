import React from 'react';
import { WaxPattern } from '../brand/Illustrations';

/** Surtitre de section : trait + libellé en capitales. */
export const Eyebrow: React.FC<{ children: React.ReactNode; dark?: boolean; className?: string }> = ({ children, dark, className = '' }) => (
  <span className={`inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] ${dark ? 'text-sun' : 'text-leaf'} ${className}`}>
    <span className="h-[3px] w-6 rounded-full bg-current" />
    {children}
  </span>
);

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  illustration?: React.ReactNode;
  tone?: 'mist' | 'ink';
}

/** En-tête commun des pages publiques : texte à gauche, illustration à droite. */
export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, subtitle, actions, illustration, tone = 'mist' }) => {
  const dark = tone === 'ink';
  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-ink text-white' : 'bg-mist text-ink'}`}>
      <WaxPattern tone={dark ? 'dark' : 'light'} className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_90%_at_85%_30%,black,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className={illustration ? 'lg:col-span-7' : 'lg:col-span-9'}>
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.6vw,3.5rem)] font-extrabold leading-[1.05]">{title}</h1>
          <p className={`mt-5 max-w-2xl text-pretty text-lg leading-relaxed ${dark ? 'text-white/75' : 'text-ink/70'}`}>{subtitle}</p>
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        {illustration && <div className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md">{illustration}</div>}
      </div>
    </section>
  );
};

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...p }) => (
  <button
    {...p}
    className={`inline-flex items-center gap-2 rounded-full bg-wax px-6 py-3.5 text-base font-bold text-white shadow-[0_14px_26px_-12px_rgba(255,119,0,0.85)] transition hover:-translate-y-0.5 hover:bg-wax-deep disabled:opacity-50 ${className}`}
  />
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { onDark?: boolean }> = ({ className = '', onDark, ...p }) => (
  <button
    {...p}
    className={`inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-base font-bold transition ${
      onDark ? 'border-white/30 text-white hover:border-white/70' : 'border-ink/15 bg-white text-ink hover:border-ink/40'
    } ${className}`}
  />
);

/** Bandeau final : une phrase, un bouton. */
export const CtaBand: React.FC<{ title: string; text: string; cta: string; onClick: () => void; babi?: React.ReactNode }> = ({ title, text, cta, onClick, babi }) => (
  <section className="relative overflow-hidden bg-wax text-white">
    <WaxPattern tone="orange" className="pointer-events-none absolute inset-0 opacity-70" />
    <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
      <div>
        <h2 className="max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-xl text-lg text-white/90">{text}</p>
        <button onClick={onClick} className="mt-7 rounded-full bg-ink px-7 py-3.5 font-bold text-white shadow-[0_18px_30px_-14px_rgba(15,42,30,0.9)] transition hover:-translate-y-0.5 hover:bg-ink-soft">{cta}</button>
      </div>
      {babi && <div className="mx-auto hidden lg:block">{babi}</div>}
    </div>
  </section>
);
