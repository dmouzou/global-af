import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { ArrowRight, CalendarClock, Search, ShieldCheck, Star, Users } from 'lucide-react';
import { BabiVector } from '../brand/BabiVector';
import { IlluMissions, ScarfRibbon } from '../brand/Illustrations';
import { CtaBand, Eyebrow, GhostButton, PageHero, PrimaryButton } from '../ui/kit';

interface MissionsPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectTask: (task: Task) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Toutes' },
  { id: 'survey', label: 'Sondages' },
  { id: 'app_test', label: "Tests d'applications" },
  { id: 'content_review', label: 'Revues de contenu' },
  { id: 'social_visit', label: 'Découvertes' },
  { id: 'quiz_challenge', label: 'Quiz' },
  { id: 'partner_campaign', label: 'Campagnes partenaires' },
];
const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));

const formatEnd = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export const MissionsPage: React.FC<MissionsPageProps> = ({ onGoToDashboard, onOpenAuth, onSelectTask }) => {
  const { tasks, currentUser } = useApp();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = tasks.filter(t =>
    (category === 'all' || t.category === category) &&
    (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)));

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow="Missions numériques"
        title="Des missions courtes, avec une récompense connue d'avance."
        subtitle="Sondages, tests d'applications, quiz et découvertes. Le montant est fixé avant que vous ne commenciez : jamais de tirage au sort. Un Pass actif est nécessaire pour participer."
        actions={
          <>
            {!currentUser && <PrimaryButton onClick={() => onOpenAuth('signup')}>Créer mon compte gratuit <ArrowRight className="h-5 w-5" /></PrimaryButton>}
            <GhostButton onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}>Voir le catalogue</GhostButton>
          </>
        }
        illustration={<IlluMissions className="w-full" title="Illustration : liste de missions validées sur un téléphone" />}
      />

      {/* Parcours */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Eyebrow>Le parcours d'une mission</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">De la consigne à la récompense, en quatre temps.</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { t: 'Choisir', d: 'Consignes, récompense, quota et date limite sont visibles avant de commencer.' },
            { t: 'Réaliser', d: 'Vous suivez la consigne, sans faux engagement ni manipulation de plateforme.' },
            { t: 'Envoyer la preuve', d: 'Un lien https, un texte ou un code de fin, selon la mission. Une seule participation par mission.' },
            { t: 'Vérification', d: 'Automatique (code exact), manuelle ou mixte. La récompense est créditée une fois validée.' },
          ].map((s, i) => (
            <li key={s.t} className="rounded-3xl border border-ink/10 bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink font-display text-lg font-extrabold text-white">{i + 1}</span>
              <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="scroll-mt-24 bg-mist py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Catalogue</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
                {tasks.length > 0 ? `${tasks.length} mission${tasks.length > 1 ? 's' : ''} ouverte${tasks.length > 1 ? 's' : ''}` : 'Missions ouvertes'}
              </h2>
            </div>
            <label className="relative block w-full lg:w-80">
              <span className="sr-only">Rechercher une mission</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher une mission"
                className="w-full rounded-full border border-ink/10 bg-white py-3 pl-11 pr-4 text-[15px] outline-none focus:border-wax"
              />
            </label>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Catégories">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                role="tab"
                aria-selected={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === c.id ? 'bg-ink text-white' : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 grid items-center gap-6 rounded-[2rem] border-2 border-dashed border-ink/15 bg-white p-8 sm:grid-cols-[auto_1fr] sm:p-10">
              <BabiVector mood="think" prop="book" size={120} className="mx-auto" />
              <div className="text-center sm:text-left">
                <h3 className="font-display text-2xl font-bold">{tasks.length === 0 ? 'Les premières missions arrivent.' : 'Aucune mission ne correspond.'}</h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/65">
                  {tasks.length === 0
                    ? "Aucune mission n'est ouverte pour le moment. Créez votre compte et commencez par l'Académie : les missions apparaîtront dans votre espace dès leur publication."
                    : 'Essayez une autre catégorie ou effacez la recherche.'}
                </p>
                {tasks.length === 0 && !currentUser && <PrimaryButton className="mt-5" onClick={() => onOpenAuth('signup')}>Créer mon compte gratuit</PrimaryButton>}
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(task => {
                const left = Math.max(0, task.quotaMax - task.quotaCurrent);
                const pct = task.quotaMax > 0 ? Math.min(100, Math.round((task.quotaCurrent / task.quotaMax) * 100)) : 0;
                return (
                  <article key={task.id} className="flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-ink/10 transition hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(15,42,30,0.4)]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ink/70">{CATEGORY_LABEL[task.category] ?? 'Mission'}</span>
                        {task.isPremiumOnly && <span className="inline-flex items-center gap-1 rounded-full bg-sun/30 px-2.5 py-1 text-xs font-bold text-ink"><Star className="h-3 w-3" />Premium</span>}
                        {task.requiredLevel !== 'Starter' && <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-bold text-leaf-deep">Niveau {task.requiredLevel}</span>}
                      </div>
                      <h3 className="mt-4 font-display text-xl font-bold leading-snug">{task.title}</h3>
                      <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink/65">{task.description}</p>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Récompense fixée</p>
                          <p className="font-display text-2xl font-extrabold text-leaf-deep">{task.rewardAmount.toLocaleString('fr-FR')} <span className="text-base">{task.currency === 'XOF' ? 'FCFA' : task.currency}</span></p>
                        </div>
                        <div className="text-right text-xs text-ink/55">
                          <p className="flex items-center justify-end gap-1"><CalendarClock className="h-3.5 w-3.5" />jusqu'au {formatEnd(task.endDate)}</p>
                          <p className="mt-1 flex items-center justify-end gap-1"><Users className="h-3.5 w-3.5" />{left} place{left > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-leaf" style={{ width: `${pct}%` }} /></div>
                      <button onClick={() => onSelectTask(task)} disabled={left === 0} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 font-bold text-white transition hover:bg-wax disabled:bg-ink/30">
                        {left === 0 ? 'Complet' : 'Participer'} {left > 0 && <ArrowRight className="h-4 w-4" />}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Règles */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-[auto_1fr]">
          <ShieldCheck className="h-12 w-12 text-sun" />
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Ce qu'il faut savoir avant de participer</h2>
            <ul className="mt-5 grid gap-x-10 gap-y-3 text-[15px] leading-relaxed text-white/80 md:grid-cols-2">
              <li>Un Pass actif et une adresse e-mail vérifiée sont nécessaires. 18 ans minimum.</li>
              <li>Une seule participation par mission : les doublons et les multi-comptes sont refusés.</li>
              <li>Les missions sur les réseaux sociaux respectent les règles des plateformes : pas de faux engagement.</li>
              <li>La récompense est créditée seulement après validation. Un refus est toujours motivé.</li>
              <li>Aucun gain n'est garanti et aucune récompense ne dépend du hasard.</li>
              <li>Retrait possible dès 2 000 FCFA, frais et net affichés avant validation.</li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        title="Prêt à voir les missions de votre pays ?"
        text="Le compte est gratuit. Vous choisissez ensuite ce que vous activez."
        cta={currentUser ? 'Aller à mon espace' : 'Créer mon compte gratuit'}
        onClick={() => (currentUser ? onGoToDashboard() : onOpenAuth('signup'))}
      />
      <ScarfRibbon />
    </div>
  );
};
