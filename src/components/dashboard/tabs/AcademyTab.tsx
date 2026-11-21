import React, { useState } from 'react';
import { Award, BookOpen, Clock, Lock, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Course } from '../../../types';
import { Btn, EmptyState, Gate, Modal, PageTitle, Panel, Pill } from '../ui';

export const AcademyTab: React.FC<{ onActivate: (plan: 'standard' | 'premium') => void }> = ({ onActivate }) => {
  const { currentUser, courses, userCertificates, enrollInCourse, submitCourseQuiz } = useApp();
  const [active, setActive] = useState<Course | null>(null);
  const [moduleIdx, setModuleIdx] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ passed: boolean; score: number } | null>(null);
  if (!currentUser) return null;

  if (!currentUser.isActivated) {
    return (
      <div>
        <PageTitle title="Digital Academy" subtitle="Des formations en modules, avec quiz de révision." />
        <Gate pill="Pass requis" title="Les formations demandent un Pass actif." text="Le Pass d'entrée (3 000 FCFA, rétractation de 7 jours) ouvre les formations. Le catalogue public reste consultable sans compte.">
          <Btn onClick={() => onActivate('standard')}><Zap className="h-4 w-4" />Activer le Pass (3 000 FCFA)</Btn>
          <Btn kind="ghost" onClick={() => onActivate('premium')}>Voir le VIP Premium</Btn>
        </Gate>
      </div>
    );
  }

  const isVip = currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business';
  const open = (c: Course) => { enrollInCourse(c.id); setActive(c); setModuleIdx(0); setQuizMode(false); setAnswers({}); setResult(null); };
  const close = () => setActive(null);
  const mod = active?.modules[moduleIdx];
  const quiz = active?.quiz;

  return (
    <div>
      <PageTitle title="Digital Academy" subtitle="Étudiez module par module. Les quiz servent à réviser : les points et les attestations ne sont pas encore délivrés." />
      {userCertificates.length > 0 && <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sun/30 px-4 py-2 text-sm font-bold"><Award className="h-4 w-4" />{userCertificates.length} attestation(s)</p>}

      {courses.length === 0 ? (
        <EmptyState title="Aucune formation pour le moment" text="Le catalogue sera publié bientôt." mood="think" prop="book" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
          {courses.map(c => {
            const locked = c.isPremium && !isVip;
            return (
              <article key={c.id} className="flex flex-col justify-between rounded-3xl bg-white p-5 ring-1 ring-ink/10">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill>{c.category}</Pill>
                    {c.isPremium && <Pill tone="sun"><Lock className="h-3 w-3" />VIP Premium</Pill>}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold leading-snug">{c.title}</h3>
                  <p className="mt-1.5 line-clamp-3 text-[15px] leading-relaxed text-ink/65">{c.description}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-semibold text-ink/55">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{Math.round(c.durationHours * 60)} min</span>
                    <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{c.modules.length} modules</span>
                    {c.quiz && <span>Quiz de révision</span>}
                  </p>
                </div>
                <div className="mt-5">
                  {locked ? <Btn kind="ghost" onClick={() => onActivate('premium')} className="w-full"><Lock className="h-4 w-4" />Réservé VIP Premium</Btn>
                    : <Btn kind="ink" onClick={() => open(c)} className="w-full">Ouvrir le cours</Btn>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={!!active} onClose={close} wide title={active?.title ?? ''} subtitle={active?.category}>
        {active && !quizMode && mod && (
          <div>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Modules">
              {active.modules.map((m, i) => (
                <button key={m.id} role="tab" aria-selected={i === moduleIdx} onClick={() => setModuleIdx(i)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${i === moduleIdx ? 'bg-ink text-white' : 'bg-mist text-ink/70'}`}>Module {i + 1}</button>
              ))}
              {quiz && <button onClick={() => { setQuizMode(true); setResult(null); }} className="shrink-0 rounded-full bg-wax px-4 py-2 text-sm font-bold text-white">Quiz de révision</button>}
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{mod.title}</h3>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink/75">{mod.content}</p>
            {mod.keyTakeaways?.length > 0 && (
              <div className="mt-5 rounded-2xl bg-leaf/10 p-4">
                <p className="text-sm font-bold text-leaf-deep">À retenir</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-ink/75">{mod.keyTakeaways.map((k, i) => <li key={i}>{k}</li>)}</ul>
              </div>
            )}
            <div className="mt-6 flex justify-between gap-3">
              <Btn kind="ghost" disabled={moduleIdx === 0} onClick={() => setModuleIdx(i => i - 1)}>Précédent</Btn>
              {moduleIdx < active.modules.length - 1
                ? <Btn kind="ink" onClick={() => setModuleIdx(i => i + 1)}>Module suivant</Btn>
                : quiz ? <Btn onClick={() => { setQuizMode(true); setResult(null); }}>Passer le quiz</Btn> : <Btn kind="ink" onClick={close}>Terminer</Btn>}
            </div>
          </div>
        )}

        {active && quizMode && quiz && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display text-xl font-bold">{quiz.title}</h3>
              <p className="text-[13px] text-ink/55">Seuil de réussite : {quiz.passingScore} %. C'est un quiz de révision : aucun point ni attestation n'est enregistré pour le moment.</p>
            </div>
            {quiz.questions.map((q, qi) => (
              <fieldset key={q.id} className="rounded-2xl bg-mist p-4">
                <legend className="px-1 font-bold">{qi + 1}. {q.question}</legend>
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 text-[15px] ring-1 ${answers[q.id] === oi ? 'ring-wax' : 'ring-ink/10'}`}>
                      <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => setAnswers(a => ({ ...a, [q.id]: oi }))} className="mt-1 h-4 w-4 accent-wax" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            {result ? (
              <p role="status" className={`rounded-2xl p-4 text-[15px] font-semibold ${result.passed ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>
                {result.passed ? 'Quiz réussi' : 'Score insuffisant'} : {result.score} %. {result.passed ? 'Les points et attestations seront délivrés lorsque la validation côté serveur sera ouverte.' : 'Révisez les modules et retentez le quiz.'}
              </p>
            ) : null}
            <div className="flex justify-between gap-3">
              <Btn kind="ghost" onClick={() => setQuizMode(false)}>Retour au cours</Btn>
              <Btn onClick={() => setResult(submitCourseQuiz(active.id, answers))}>Valider mes réponses</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
