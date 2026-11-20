import React from 'react';
import { ArrowRight, ArrowUpRight, Briefcase, Users } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Task } from '../../../types';
import { BabiVector } from '../../brand/BabiVector';
import { Btn, EmptyState, fcfa, Panel, Pill, Stat } from '../ui';

const LEVEL_MAX: Record<string, number> = { Starter: 300, Bronze: 1000, Silver: 2500, Gold: 5000, Platinum: 10000 };
const DEBITS = ['withdrawal', 'activation_payment', 'subscription_payment'];

interface Props {
  onNavigate: (tab: string) => void;
  onSelectTask: (t: Task) => void;
  onWithdraw: () => void;
}

export const OverviewTab: React.FC<Props> = ({ onNavigate, onSelectTask, onWithdraw }) => {
  const { currentUser, wallet, tasks, ledger } = useApp();
  if (!currentUser) return null;

  const mine = ledger.filter(l => l.userId === currentUser.id);
  const levelMax = LEVEL_MAX[currentUser.level] ?? 300;
  const pct = Math.min(100, Math.round((currentUser.points / levelMax) * 100));
  const limitPct = currentUser.spendingLimitMonthly > 0 ? Math.min(100, Math.round((currentUser.spentThisMonth / currentUser.spendingLimitMonthly) * 100)) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="space-y-6">
      {/* Salutation */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 ring-1 ring-ink/10 sm:p-8">
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-leaf">Tableau de bord</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{greeting}, {currentUser.firstName}.</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/65">
              {currentUser.subscriptionPlan === 'premium'
                ? 'Votre offre VIP Premium est active.'
                : currentUser.isActivated
                  ? 'Votre Pass est actif. Choisissez une mission ou avancez dans une formation.'
                  : "Votre compte est créé. Activez votre Pass pour participer aux missions rémunérées et demander des retraits."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Btn onClick={() => onNavigate('tasks')}><Briefcase className="h-4 w-4" />Voir les missions</Btn>
              <Btn kind="ghost" onClick={onWithdraw}><ArrowUpRight className="h-4 w-4" />Retirer</Btn>
              <Btn kind="ghost" onClick={() => onNavigate('team')}><Users className="h-4 w-4" />Inviter</Btn>
            </div>
          </div>
          <div className="hidden justify-self-end sm:block"><BabiVector mood="wave" size={170} /></div>
        </div>
      </div>

      {/* Chiffres */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 [&>*]:min-w-0">
        <Stat accent="wax" label="Solde disponible" value={fcfa(wallet.availableBalance, wallet.currency)} hint="Retirable sur Mobile Money" />
        <Stat accent="sun" label="En attente" value={fcfa(wallet.pendingBalance, wallet.currency)} hint="Preuves en cours de vérification" />
        <Stat accent="leaf" label="Commissions" value={fcfa(wallet.commissionBalance, wallet.currency)} hint="Ventes réelles, niveaux 1 et 2" />
        <Stat accent="ink" label="Plafond du mois" value={<>{currentUser.spentThisMonth.toLocaleString('fr-FR')}<span className="text-base text-ink/45"> / {currentUser.spendingLimitMonthly.toLocaleString('fr-FR')}</span></>} hint="Votre protection financière">
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-ink" style={{ width: `${limitPct}%` }} /></div>
        </Stat>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 [&>*]:min-w-0">
        {/* Carte de membre */}
        <section className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white lg:col-span-5">
          <div className="scarf-ribbon absolute inset-x-0 top-0" aria-hidden="true" />
          <div className="mt-2 flex items-center justify-between">
            <span className="font-display text-lg font-extrabold"><span className="text-wax">AH</span> GLOBAL</span>
            <Pill tone="sunSolid">Carte de membre</Pill>
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-white/50">Titulaire</p>
          <p className="font-display text-2xl font-extrabold">{currentUser.firstName} {currentUser.lastName}</p>
          <p className="mt-0.5 text-sm tracking-wider text-sun">{currentUser.memberNumber || 'N° de membre en attente'}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/12 pt-4 text-sm">
            <div><p className="text-[11px] text-white/50">Opérateur favori</p><p className="font-bold">{currentUser.defaultPayoutOperator || 'Wave'}</p></div>
            <div><p className="text-[11px] text-white/50">Ville</p><p className="truncate font-bold">{currentUser.city || '—'}</p></div>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs"><span className="font-bold">Niveau {currentUser.level}</span><span className="text-white/55">{currentUser.points} / {levelMax} points</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-sun" style={{ width: `${pct}%` }} /></div>
            <p className="mt-1.5 text-[11px] text-white/45">Les points sont gagnés de façon déterministe : jamais au hasard.</p>
          </div>
          <button onClick={() => onNavigate('profile')} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sun hover:gap-2.5 transition-all">Voir mon profil <ArrowRight className="h-4 w-4" /></button>
        </section>

        {/* Missions du moment */}
        <Panel className="lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold">Missions du moment</h2>
              <p className="text-[13px] text-ink/55">La récompense est indiquée à l'avance.</p>
            </div>
            <button onClick={() => onNavigate('tasks')} className="text-sm font-bold text-wax-deep hover:underline">Toutes ({tasks.length})</button>
          </div>
          <div className="mt-4 space-y-3">
            {tasks.length === 0 ? (
              <EmptyState title="Pas encore de mission ouverte" text="Les premières missions arrivent. En attendant, avancez dans l'Académie." mood="think" prop="book" action={<Btn kind="ink" onClick={() => onNavigate('academy')}>Ouvrir l'Académie</Btn>} />
            ) : tasks.slice(0, 3).map(t => (
              <button key={t.id} onClick={() => onSelectTask(t)} className="flex w-full items-center justify-between gap-4 rounded-2xl bg-mist p-4 text-left transition hover:bg-wax/8">
                <span className="min-w-0">
                  <span className="block truncate font-bold">{t.title}</span>
                  <span className="text-[13px] text-ink/55">{t.quotaCurrent}/{t.quotaMax} participants · {t.verificationType === 'automatic' ? 'validation automatique' : t.verificationType === 'hybrid' ? 'code ou revue' : 'vérification manuelle'}</span>
                </span>
                <span className="shrink-0 text-right"><span className="block font-display text-lg font-extrabold text-leaf-deep">+{fcfa(t.rewardAmount, t.currency)}</span><span className="text-xs font-bold text-wax-deep">Participer</span></span>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* Dernières opérations */}
      <Panel>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold">Dernières opérations</h2>
          <button onClick={() => onNavigate('wallet')} className="text-sm font-bold text-wax-deep hover:underline">Grand livre complet</button>
        </div>
        {mine.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-mist p-5 text-[15px] text-ink/60">Aucune opération pour le moment. Chaque crédit et chaque retrait apparaîtra ici, avec sa référence.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/8">
            {mine.slice(0, 4).map(e => {
              const debit = DEBITS.includes(e.type);
              return (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="min-w-0"><span className="block truncate font-bold">{e.origin}</span><span className="text-[13px] text-ink/50">Réf. {e.reference} · {e.date} · {e.operator || 'Système'}</span></span>
                  <span className={`shrink-0 font-display text-lg font-extrabold tabular-nums ${debit ? 'text-ink' : 'text-leaf-deep'}`}>{debit ? '−' : '+'}{fcfa(e.amount, e.currency)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
};
