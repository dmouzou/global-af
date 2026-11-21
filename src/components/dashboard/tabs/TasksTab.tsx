import React, { useState } from 'react';
import { AlertCircle, CalendarClock, CheckCircle, Clock, Lock, Star, Users, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Task } from '../../../types';
import { BabiVector } from '../../brand/BabiVector';
import { Btn, EmptyState, fcfa, PageTitle, Panel, Pill } from '../ui';

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Toutes' }, { id: 'survey', label: 'Sondages' }, { id: 'app_test', label: 'Tests' },
  { id: 'content_review', label: 'Revues' }, { id: 'social_visit', label: 'Découvertes' },
  { id: 'quiz_challenge', label: 'Quiz' }, { id: 'partner_campaign', label: 'Partenaires' },
];

const endLabel = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export const TasksTab: React.FC<{ onSelectTask: (t: Task) => void; onActivate: (plan: 'standard' | 'premium') => void }> = ({ onSelectTask, onActivate }) => {
  const { currentUser, tasks, submissions } = useApp();
  const [filter, setFilter] = useState('all');
  if (!currentUser) return null;

  if (!currentUser.isActivated) {
    return (
      <div>
        <PageTitle title="Missions" subtitle="Des missions courtes, avec une récompense connue d'avance." />
        <Panel className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:p-8">
          <BabiVector mood="think" prop="shield" size={140} className="mx-auto" />
          <div>
            <Pill tone="sun"><Lock className="h-3 w-3" />Pass requis</Pill>
            <h2 className="mt-3 font-display text-2xl font-extrabold">La participation aux missions demande un Pass actif.</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/65">Le Pass d'entrée coûte 3 000 FCFA, avec 7 jours pour vous rétracter. Le catalogue ci-dessous reste consultable.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Btn onClick={() => onActivate('standard')}><Zap className="h-4 w-4" />Activer le Pass (3 000 FCFA)</Btn>
              <Btn kind="ghost" onClick={() => onActivate('premium')}>Voir le VIP Premium</Btn>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  const list = filter === 'all' ? tasks : tasks.filter(t => t.category === filter);
  const mine = submissions.filter(s => s.userId === currentUser.id);

  return (
    <div>
      <PageTitle title="Missions" subtitle="La récompense est fixée à l'avance et versée une fois votre preuve validée. Une seule participation par mission." />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Catégories">
        {FILTERS.map(f => (
          <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
            className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${filter === f.id ? 'bg-ink text-white' : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink'}`}>{f.label}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title={tasks.length === 0 ? 'Aucune mission ouverte pour le moment' : 'Aucune mission dans cette catégorie'} text={tasks.length === 0 ? "Les missions apparaîtront ici dès leur publication. Vous pouvez avancer dans l'Académie en attendant." : 'Essayez une autre catégorie.'} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map(t => {
            const sub = mine.find(s => s.taskId === t.id);
            const left = Math.max(0, t.quotaMax - t.quotaCurrent);
            return (
              <article key={t.id} className="flex flex-col justify-between rounded-3xl bg-white p-5 ring-1 ring-ink/10">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill>{t.verificationType === 'automatic' ? 'Validation automatique' : t.verificationType === 'hybrid' ? 'Code ou revue' : 'Vérification manuelle'}</Pill>
                    {t.isPremiumOnly && <Pill tone="sun"><Star className="h-3 w-3" />Premium</Pill>}
                    {t.requiredLevel !== 'Starter' && <Pill tone="leaf">Niveau {t.requiredLevel}</Pill>}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold leading-snug">{t.title}</h3>
                  <p className="mt-1.5 line-clamp-3 text-[15px] leading-relaxed text-ink/65">{t.description}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink/55">
                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" />jusqu'au {endLabel(t.endDate)}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{left} place{left > 1 ? 's' : ''}</span>
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/8 pt-4">
                  <span className="font-display text-2xl font-extrabold text-leaf-deep">+{fcfa(t.rewardAmount, t.currency)}</span>
                  {sub ? (
                    sub.status === 'approved' ? <Pill tone="leaf"><CheckCircle className="h-3.5 w-3.5" />Validée et payée</Pill>
                      : sub.status === 'pending' ? <Pill tone="sun"><Clock className="h-3.5 w-3.5" />En vérification</Pill>
                        : <Pill tone="rose"><AlertCircle className="h-3.5 w-3.5" />Non validée</Pill>
                  ) : (
                    <Btn onClick={() => onSelectTask(t)} disabled={left === 0}>{left === 0 ? 'Complet' : 'Participer'}</Btn>
                  )}
                </div>
                {sub?.status === 'rejected' && sub.feedback && <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-[13px] text-rose-700">Motif : {sub.feedback}</p>}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
