import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { ArrowRight, Award, BookOpen, Clock, Lock, X } from 'lucide-react';
import { BabiVector } from '../brand/BabiVector';
import { IlluAcademy, ScarfRibbon } from '../brand/Illustrations';
import { CtaBand, Eyebrow, GhostButton, PageHero, PrimaryButton } from '../ui/kit';

interface AcademyPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

type Tab = 'all' | 'standard' | 'premium';

export const AcademyPage: React.FC<AcademyPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { courses, currentUser } = useApp();
  const [tab, setTab] = useState<Tab>('all');
  const [preview, setPreview] = useState<Course | null>(null);

  const list = courses.filter(c => (tab === 'all' ? true : tab === 'premium' ? c.isPremium : !c.isPremium));
  const start = () => (currentUser ? onGoToDashboard() : onOpenAuth('signup'));

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPreview(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [preview]);

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow="Digital Academy"
        title="Des formations pratiques, à votre rythme."
        subtitle="Marketing digital, création de contenu, IA, e-commerce, productivité. Des modules courts avec quiz, pensés pour la réalité du marché ivoirien. Un Pass actif est nécessaire pour suivre les formations."
        actions={
          <>
            <PrimaryButton onClick={start}>{currentUser ? 'Étudier dans mon espace' : 'Créer mon compte gratuit'} <ArrowRight className="h-5 w-5" /></PrimaryButton>
            <GhostButton onClick={() => document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth' })}>Voir les formations</GhostButton>
          </>
        }
        illustration={<IlluAcademy className="w-full" title="Illustration : livre ouvert, toque et vidéo de cours" />}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Eyebrow>Comment suivre une formation</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Trois gestes, depuis votre espace personnel.</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { t: 'Choisissez un parcours', d: 'Parcourez les thèmes : réseaux sociaux, IA, marketing, e-commerce, selon votre objectif.' },
            { t: 'Étudiez module par module', d: 'Lisez les leçons, retenez les points clés et reprenez là où vous vous étiez arrêté.' },
            { t: 'Validez vos acquis', d: "Passez les quiz de l'espace membre. Les récompenses de quiz sont fixées à l'avance, sans tirage au sort." },
          ].map((s, i) => (
            <li key={s.t} className="rounded-3xl border border-ink/10 bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf font-display text-lg font-extrabold text-white">{i + 1}</span>
              <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="formations" className="scroll-mt-24 bg-mist py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Eyebrow>Catalogue</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Les formations</h2>
            </div>
            <div className="inline-flex self-start rounded-full bg-white p-1 ring-1 ring-ink/10 md:self-auto" role="tablist" aria-label="Type de formation">
              {([['all', 'Toutes'], ['standard', 'Pass membre'], ['premium', 'VIP Premium']] as [Tab, string][]).map(([id, label]) => (
                <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === id ? 'bg-ink text-white' : 'text-ink/65 hover:text-ink'}`}>{label}</button>
              ))}
            </div>
          </div>

          {list.length === 0 ? (
            <div className="mt-8 grid items-center gap-6 rounded-[2rem] border-2 border-dashed border-ink/15 bg-white p-8 sm:grid-cols-[auto_1fr]">
              <BabiVector mood="think" prop="book" size={120} className="mx-auto" />
              <p className="text-center text-[15px] text-ink/65 sm:text-left">Aucune formation dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map(course => (
                <article key={course.id} className="flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-ink/10">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ink/70">{course.category}</span>
                      {course.isPremium
                        ? <span className="inline-flex items-center gap-1 rounded-full bg-sun/30 px-2.5 py-1 text-xs font-bold"><Lock className="h-3 w-3" />VIP Premium</span>
                        : <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-bold text-leaf-deep">Inclus dans le Pass</span>}
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold leading-snug">{course.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink/65">{course.description}</p>
                    <div className="mt-4 flex items-center gap-4 text-[13px] font-semibold text-ink/55">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{Math.round(course.durationHours * 60)} min</span>
                      <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{course.modules.length} modules</span>
                      <span>{course.level}</span>
                    </div>
                    <ul className="mt-4 space-y-1.5 text-[14px] text-ink/70">
                      {course.modules.slice(0, 3).map((m, i) => (
                        <li key={m.id || i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wax" /><span className="truncate">{m.title.replace(/^Palier \d+ : /, '')}</span></li>
                      ))}
                      {course.modules.length > 3 && <li className="pl-3.5 text-ink/50">+ {course.modules.length - 3} autre(s) module(s)</li>}
                    </ul>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2.5">
                    <button onClick={() => setPreview(course)} className="rounded-full border-2 border-ink/15 py-2.5 text-sm font-bold hover:border-ink/40">Programme</button>
                    <button onClick={start} className="rounded-full bg-ink py-2.5 text-sm font-bold text-white hover:bg-wax">{currentUser ? 'Étudier' : "S'inscrire"}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-6 rounded-[2rem] bg-ink p-8 text-white sm:grid-cols-[auto_1fr] sm:p-12">
          <Award className="h-14 w-14 text-sun" />
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Les attestations ne sont pas encore délivrées.</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-white/75">
              Nous ne montrons pas de faux certificat. Lorsqu'elles ouvriront, les attestations de la Digital Academy seront des attestations internes de suivi, qui ne valent pas diplôme reconnu.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Apprenez un module aujourd'hui."
        text="Le compte est gratuit. Vous lisez le contenu du Pass avant de payer, avec 7 jours pour vous rétracter."
        cta={currentUser ? 'Aller à mon espace' : 'Créer mon compte gratuit'}
        onClick={start}
      />
      <ScarfRibbon />

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="course-title" onClick={() => setPreview(null)}>
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ink/70">{preview.category}</span>
                <h3 id="course-title" className="mt-3 font-display text-2xl font-extrabold">{preview.title}</h3>
                <p className="mt-1 text-sm text-ink/55">{Math.round(preview.durationHours * 60)} min · niveau {preview.level}</p>
              </div>
              <button onClick={() => setPreview(null)} aria-label="Fermer" className="rounded-full p-2 text-ink/50 hover:bg-mist"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/70">{preview.description}</p>
            <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-ink/45">Programme</h4>
            <ol className="mt-3 space-y-2">
              {preview.modules.map((m, i) => (
                <li key={m.id || i} className="flex items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-3">
                  <span className="flex items-center gap-3 text-[15px] font-bold"><span className="grid h-6 w-6 place-items-center rounded-lg bg-wax text-xs font-extrabold text-white">{i + 1}</span>{m.title.replace(/^Palier \d+ : /, '')}</span>
                  <span className="shrink-0 text-xs font-semibold text-ink/50">{m.durationMinutes} min</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-2xl bg-leaf/10 p-4 text-[14px] leading-relaxed text-leaf-deep">La formation et ses quiz se déroulent dans votre espace personnel sécurisé.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setPreview(null)} className="rounded-full px-5 py-2.5 text-sm font-bold text-ink/70 hover:bg-mist">Fermer</button>
              <button onClick={() => { setPreview(null); start(); }} className="rounded-full bg-wax px-6 py-2.5 text-sm font-bold text-white hover:bg-wax-deep">{currentUser ? 'Démarrer dans mon espace' : "S'inscrire pour étudier"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
