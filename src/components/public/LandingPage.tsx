import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, BookOpen, Check, ChevronDown, Dices, Lock, Scale, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Task } from '../../types';
import { OperatorLogo } from '../common/OperatorLogo';
import { BabiHero } from '../brand/BabiHero';
import { BabiVector } from '../brand/BabiVector';
import {
  IlluAcademy, IlluAffiliation, IlluMissions, IlluPartners, IlluShield, IlluTools, IlluWallet,
  ScarfRibbon, WaxPattern,
} from '../brand/Illustrations';

interface LandingPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSelectTask: (task: Task) => void;
  onNavigatePage?: (page: string) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  survey: 'Sondage',
  app_test: "Test d'application",
  social_visit: 'Découverte vidéo',
  content_review: 'Revue de contenu',
  partner_campaign: 'Campagne partenaire',
  quiz_challenge: 'Quiz',
};

const FAQS = [
  {
    q: "Comment fonctionne la rémunération sur AH GLOBAL ?",
    a: "Les récompenses de missions sont fixées et publiées à l'avance ; aucun hasard n'intervient jamais. Le parrainage est direct, sur un seul niveau : le parrain touche 10 % du prix du Pass Membre activé par son filleul, puis 5 % sur la première commande réelle de ce filleul. L'ouverture des missions rémunérées est en cours : consultez votre espace pour l'état actuel. Aucun gain n'est garanti.",
  },
  {
    q: "Le compte gratuit permet-il vraiment de gagner de l'argent et de retirer ?",
    a: "L'inscription est gratuite. Pour participer aux missions rémunérées, suivre les formations et demander un retrait, un Pass actif est nécessaire : le Pass d'entrée (rétractation de 7 jours) ou un abonnement VIP Premium. Le prix et le contenu sont affichés avant tout paiement. Aucun gain n'est garanti : ne payez jamais dans l'espoir d'un revenu, ni en vous endettant.",
  },
  {
    q: "Quels opérateurs Mobile Money sont acceptés en Côte d'Ivoire ?",
    a: "Les paiements d'offres se font sur une page sécurisée (CinetPay) par Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) ou par carte bancaire Visa. Les retraits de gains se font vers un compte Mobile Money ; le montant minimum et les frais sont affichés avant validation.",
  },
  {
    q: "Comment s'applique le droit de rétractation de 7 jours ?",
    a: "Le Pass d'entrée (Standard) se rétracte pendant 7 jours à compter du paiement, depuis « Paramètres » : le remboursement, sous déduction des frais de transaction (3 %), est traité vers le moyen de paiement utilisé. L'abonnement VIP Premium n'est pas remboursable car l'accès aux fichiers et contacts VCF est immédiat et définitif.",
  },
  {
    q: "Qu'est-ce que la charte éthique d'AH GLOBAL ?",
    a: "Cinq engagements : un parrainage direct sur un seul niveau, aux règles et aux taux publiés ; une offre payante correspond à un contenu décrit avant paiement ; aucune promesse de gain facile, avec des indicateurs réels publiés dès qu'ils existent ; interdiction des jeux de hasard et des tombolas ; protection des membres (18 ans minimum, plafond de dépense mensuel réglable).",
  },
];

const Eyebrow: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <span className={`inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] ${dark ? 'text-sun' : 'text-leaf'}`}>
    <span className="h-[3px] w-6 rounded-full bg-current" />
    {children}
  </span>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDashboard, onOpenAuth, onSelectTask, onNavigatePage }) => {
  const { tasks, ethicalIndicators } = useApp();
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const go = (page: string) => (onNavigatePage ? onNavigatePage(page) : onGoToDashboard());
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-white text-ink">
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden">
        <WaxPattern tone="light" className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_70%_at_82%_35%,black,transparent)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink/80 shadow-sm">
              <span className="flex h-3 w-5 overflow-hidden rounded-[3px] ring-1 ring-ink/15" aria-hidden="true">
                <i className="h-full w-1/3 bg-wax" /><i className="h-full w-1/3 bg-white" /><i className="h-full w-1/3 bg-leaf" />
              </span>
              Lancement en Côte d'Ivoire
            </p>
            <h1 className="mt-6 text-balance font-display text-[clamp(2.4rem,5vw,3.9rem)] font-extrabold leading-[1.02] text-ink">
              Missions, formations et retraits Mobile Money, au même endroit.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink/70">
              Créez un compte gratuit et explorez la plateforme. Un Pass débloque la participation aux missions rémunérées, l'Académie et les retraits vers Wave, Orange Money, MTN MoMo et Moov Money. Aucun gain n'est garanti.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-2 rounded-full bg-wax px-7 py-4 text-base font-bold text-white shadow-[0_16px_30px_-12px_rgba(255,119,0,0.85)] transition hover:-translate-y-0.5 hover:bg-wax-deep"
              >
                Créer mon compte gratuit <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollTo('comment-ca-marche')}
                className="rounded-full border-2 border-ink/15 bg-white px-6 py-3.5 text-base font-bold text-ink transition hover:border-ink/40"
              >
                Comment ça marche
              </button>
            </div>
            <ul className="mt-9 grid max-w-xl gap-3 text-[15px] font-semibold text-ink/80 sm:grid-cols-3">
              {[
                { icon: Dices, text: 'Aucun jeu de hasard' },
                { icon: Scale, text: 'Parrainage direct, un seul niveau' },
                { icon: UserCheck, text: 'Rétractation de 7 jours sur le Pass' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-leaf/10 text-leaf"><Icon className="h-4 w-4" /></span>
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scène Babi */}
          <div className="relative mx-auto w-full max-w-[28rem] lg:col-span-5 lg:max-w-none">
            <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
              <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFD27A_0%,#FF9A2E_45%,#FF7700_100%)]" />
              <div className="absolute inset-[1%] rounded-full border-2 border-dashed border-wax/35" />
              <div className="absolute inset-x-[9%] bottom-[6%] top-[4%]">
                <BabiHero className="mt-[6%]" />
              </div>

              <div className="drift-a absolute -left-1 top-[22%] hidden sm:block w-[11.5rem] rounded-2xl bg-white p-3.5 shadow-[0_18px_40px_-18px_rgba(15,42,30,0.45)] ring-1 ring-ink/8 sm:-left-8">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-leaf text-white"><Check className="h-4 w-4" strokeWidth={3} /></span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-ink">Mission validée</p>
                    <p className="text-[11px] text-ink/55">Récompense fixée à l'avance</p>
                  </div>
                </div>
              </div>

              <div className="drift-b absolute -right-1 top-[46%] hidden sm:block w-[11rem] rounded-2xl bg-white p-3.5 shadow-[0_18px_40px_-18px_rgba(15,42,30,0.45)] ring-1 ring-ink/8 sm:-right-6">
                <div className="flex items-center gap-2 text-[13px] font-bold text-ink"><BookOpen className="h-4 w-4 text-leaf" /> Académie</div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist"><div className="h-full w-2/5 rounded-full bg-leaf" /></div>
                <p className="mt-1.5 text-[11px] text-ink/55">Module 2 sur 5</p>
              </div>

              <div className="drift-a absolute bottom-[4%] left-[2%] hidden sm:block w-[12.5rem] rounded-2xl bg-ink p-3.5 text-white shadow-[0_18px_40px_-14px_rgba(15,42,30,0.7)] sm:-left-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">Retrait · Wave</p>
                <p className="mt-1 text-[13px] font-bold leading-snug">Frais et net affichés avant validation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── OPÉRATEURS ───────────── */}
      <section aria-label="Opérateurs Mobile Money" className="border-y border-ink/8 bg-mist">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <p className="text-center text-[15px] font-semibold text-ink/70 md:text-left">Payez et retirez avec les opérateurs que vous utilisez déjà</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <OperatorLogo operator="Wave" size="sm" variant="pill" />
            <OperatorLogo operator="Orange Money" size="sm" variant="pill" />
            <OperatorLogo operator="MTN MoMo" size="sm" variant="pill" />
            <OperatorLogo operator="Moov Money" size="sm" variant="pill" />
          </div>
        </div>
      </section>

      {/* ───────────── COMMENT ÇA MARCHE ───────────── */}
      <section id="comment-ca-marche" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <Eyebrow>Comment ça marche</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">Quatre étapes, aucune surprise.</h2>
          <p className="mt-4 text-lg text-ink/65">Chaque prix, chaque frais et chaque condition est affiché avant que vous ne payiez ou ne retiriez.</p>
        </div>
        <ol className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { t: 'Créez votre compte', d: 'Gratuit. Une adresse e-mail, votre numéro Mobile Money, 18 ans minimum.', c: 'bg-wax' },
            { t: 'Activez votre Pass', d: '3 000 FCFA, contenu décrit avant paiement. Rétractation possible pendant 7 jours.', c: 'bg-leaf' },
            { t: 'Participez et apprenez', d: 'Missions à récompense fixée à l’avance, Académie et outils IA à votre rythme.', c: 'bg-ink' },
            { t: 'Retirez sur Mobile Money', d: 'Dès 2 000 FCFA. Chaque demande est contrôlée avant paiement.', c: 'bg-sun !text-ink' },
          ].map((s, i) => (
            <li key={s.t} className="relative rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_1px_0_rgba(15,42,30,0.04)]">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl font-display text-xl font-extrabold text-white ${s.c}`}>{i + 1}</span>
              <h3 className="mt-5 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{s.d}</p>
              {i === 0 && <div className="pointer-events-none absolute -top-12 right-3 hidden lg:block"><BabiVector mood="wave" size={78} /></div>}
              {i === 3 && <div className="pointer-events-none absolute -top-[52px] right-3 hidden lg:block"><BabiVector mood="cheer" prop="coin" size={78} /></div>}
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── FONCTIONNALITÉS (bento) ───────────── */}
      <section id="fonctionnalites" className="relative bg-mist py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>Tout-en-un</Eyebrow>
            <h2 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">Une seule plateforme pour apprendre, participer et être payé.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-6">
            <article className="group relative overflow-hidden rounded-[2rem] bg-white p-7 ring-1 ring-ink/8 lg:col-span-4 lg:flex lg:items-center lg:gap-6">
              <div className="lg:w-1/2">
                <span className="rounded-full bg-wax/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-wax-deep">Micro-jobs</span>
                <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight">Des missions courtes, à récompense fixée à l'avance.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/65">Sondages, tests d'applications, quiz, découvertes. Le montant est connu avant de commencer, jamais tiré au sort.</p>
                <button onClick={() => go('missions')} className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-wax-deep hover:gap-3 transition-all">
                  {tasks.length > 0 ? `${tasks.length} mission${tasks.length > 1 ? 's' : ''} ouverte${tasks.length > 1 ? 's' : ''}` : 'Voir les missions'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <IlluMissions className="mx-auto mt-6 w-full max-w-xs lg:mt-0 lg:w-1/2 lg:max-w-none" />
            </article>

            <article className="relative overflow-hidden rounded-[2rem] bg-leaf p-7 text-white lg:col-span-2">
              <IlluAcademy className="mx-auto w-full max-w-[15rem]" />
              <h3 className="mt-3 font-display text-2xl font-extrabold">Digital Academy</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/85">Marketing digital, création de contenu, IA, e-commerce. Des modules et des quiz, à votre rythme.</p>
              <button onClick={() => go('academie')} className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-white hover:gap-3 transition-all">Découvrir <ArrowRight className="h-4 w-4" /></button>
            </article>

            <article className="rounded-[2rem] bg-white p-7 ring-1 ring-ink/8 lg:col-span-2">
              <IlluAffiliation className="mx-auto w-full max-w-[14rem]" />
              <h3 className="mt-3 font-display text-2xl font-extrabold">Parrainage direct, un seul niveau</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">10 % du prix du Pass activé par votre filleul, puis 5 % sur sa première commande réelle. Chaque commission est détaillée dans votre espace.</p>
              <button onClick={() => go('affiliation')} className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-leaf-deep hover:gap-3 transition-all">Voir les règles <ArrowRight className="h-4 w-4" /></button>
            </article>

            <article className="rounded-[2rem] bg-white p-7 ring-1 ring-ink/8 lg:col-span-2">
              <IlluTools className="mx-auto w-full max-w-[14rem]" />
              <h3 className="mt-3 font-display text-2xl font-extrabold">Outils IA</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">Rédaction, idées marketing, résumés, prompts. Des quotas clairs selon votre offre.</p>
              <button onClick={() => go('outils')} className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-leaf-deep hover:gap-3 transition-all">Essayer <ArrowRight className="h-4 w-4" /></button>
            </article>

            <article className="rounded-[2rem] bg-ink p-7 text-white lg:col-span-2">
              <IlluWallet className="mx-auto w-full max-w-[14rem]" />
              <h3 className="mt-3 font-display text-2xl font-extrabold">Un portefeuille traçable</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">Solde disponible, en attente, commissions : chaque opération est enregistrée et ne s'efface jamais.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ───────────── MISSIONS OUVERTES ───────────── */}
      <section id="opportunites" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>Missions du moment</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">Ouvertes en ce moment</h2>
          </div>
          <button onClick={() => go('missions')} className="inline-flex items-center gap-2 self-start font-bold text-leaf-deep hover:gap-3 transition-all md:self-auto">
            Toutes les missions <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="mt-10 grid items-center gap-6 rounded-[2rem] border-2 border-dashed border-ink/15 bg-mist p-8 sm:grid-cols-[auto_1fr] sm:p-10">
            <BabiVector mood="think" prop="book" size={130} className="mx-auto" />
            <div className="text-center sm:text-left">
              <h3 className="font-display text-2xl font-bold">Les premières missions arrivent.</h3>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/65">
                Aucune mission n'est ouverte pour le moment. Créez votre compte et commencez par l'Académie : vous retrouverez les missions dans votre espace dès leur publication.
              </p>
              <button onClick={() => onOpenAuth('signup')} className="mt-5 rounded-full bg-wax px-6 py-3 font-bold text-white hover:bg-wax-deep">Créer mon compte gratuit</button>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tasks.slice(0, 6).map(task => {
              const pct = task.quotaMax > 0 ? Math.min(100, Math.round((task.quotaCurrent / task.quotaMax) * 100)) : 0;
              return (
                <article key={task.id} className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(15,42,30,0.4)]">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ink/70">{CATEGORY_LABEL[task.category] ?? 'Mission'}</span>
                      <span className="font-display text-lg font-extrabold text-leaf-deep">{task.rewardAmount.toLocaleString('fr-FR')} {task.currency === 'XOF' ? 'FCFA' : task.currency}</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold leading-snug">{task.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink/65">{task.description}</p>
                  </div>
                  <div className="mt-6">
                    <div className="h-2 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-leaf" style={{ width: `${pct}%` }} /></div>
                    <div className="mt-2 flex items-center justify-between text-[13px] text-ink/55">
                      <span>{task.quotaCurrent} / {task.quotaMax} participants</span>
                      <button onClick={() => onSelectTask(task)} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-ink-soft">Participer</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ───────────── TARIFS ───────────── */}
      <section id="tarifs" className="scroll-mt-24 bg-mist py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Tarifs et activation</Eyebrow>
            <h2 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">Le prix, le contenu et les conditions, avant de payer.</h2>
            <p className="mt-4 text-lg text-ink/65">Un Pass ne garantit aucun gain. Ne payez jamais dans l'espoir d'un revenu, ni en vous endettant.</p>
          </div>
          <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
            <div className="flex flex-col rounded-[2rem] bg-white p-8 ring-1 ring-ink/10">
              <h3 className="font-display text-2xl font-bold">Compte gratuit</h3>
              <p className="mt-4 font-display text-5xl font-extrabold">0 <span className="text-xl font-bold text-ink/50">FCFA</span></p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink/75">
                {['Créer et vérifier son compte', 'Explorer son espace personnel', 'Consulter le catalogue des missions et de l’Académie'].map(x => (
                  <li key={x} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-leaf" strokeWidth={3} />{x}</li>
                ))}
              </ul>
              <button onClick={() => onOpenAuth('signup')} className="mt-auto rounded-full border-2 border-ink/15 py-3.5 font-bold text-ink hover:border-ink/40 mt-8">Créer mon compte</button>
            </div>

            <div className="relative flex flex-col rounded-[2rem] bg-white p-8 ring-2 ring-wax">
              <span className="absolute -top-3 left-8 rounded-full bg-wax px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Pass d'entrée</span>
              <h3 className="font-display text-2xl font-bold">Pass membre</h3>
              <p className="mt-4 font-display text-5xl font-extrabold">3 000 <span className="text-xl font-bold text-ink/50">FCFA</span></p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink/75">
                {['Participation aux missions rémunérées dès leur ouverture', 'Formations de l’Académie', 'Retraits Mobile Money dès 2 000 FCFA', 'Parrainage : commissions détaillées dans votre espace'].map(x => (
                  <li key={x} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-leaf" strokeWidth={3} />{x}</li>
                ))}
              </ul>
              <p className="mt-5 rounded-2xl bg-leaf/10 p-3.5 text-[13px] leading-relaxed text-leaf-deep">Rétractation de 7 jours, remboursement déduction faite des frais de transaction (3 %).</p>
              <button onClick={() => onOpenAuth('signup')} className="mt-6 rounded-full bg-wax py-3.5 font-bold text-white shadow-[0_14px_26px_-12px_rgba(255,119,0,0.85)] hover:bg-wax-deep">Activer mon Pass</button>
            </div>

            <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-ink p-8 text-white">
              <WaxPattern tone="dark" className="pointer-events-none absolute inset-0 opacity-70" />
              <div className="relative flex h-full flex-col">
                <h3 className="font-display text-2xl font-bold">VIP Premium</h3>
                <p className="mt-4 font-display text-5xl font-extrabold">9 900 <span className="text-xl font-bold text-white/55">FCFA / mois</span></p>
                <ul className="mt-6 space-y-3 text-[15px] text-white/85">
                  {['Tous les avantages du Pass membre', 'Contenu exact détaillé avant paiement', 'Fonctions Premium (outils IA, répertoires VCF, attestations) en cours d’ouverture'].map(x => (
                    <li key={x} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-sun" strokeWidth={3} />{x}</li>
                  ))}
                </ul>
                <p className="mt-5 rounded-2xl bg-white/10 p-3.5 text-[13px] leading-relaxed text-white/75">Non remboursable : l'accès aux fichiers et contacts est immédiat et définitif.</p>
                <button onClick={() => onOpenAuth('signup')} className="mt-6 rounded-full bg-sun py-3.5 font-bold text-ink hover:bg-[#FFD459]">Devenir membre VIP</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── CHARTE ÉTHIQUE ───────────── */}
      <section id="charte" className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
        <WaxPattern tone="dark" className="pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <Eyebrow dark>Charte éthique</Eyebrow>
            <h2 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">Cinq engagements qui priment sur toute règle commerciale.</h2>
            <IlluShield className="mt-8 w-full max-w-sm" />
          </div>
          <ul className="grid gap-3 lg:col-span-7">
            {[
              { icon: Scale, t: 'Parrainage direct, règles publiées', d: 'Un seul niveau, des taux affichés, aucune commission sur les comptes artificiels ni en cas de remboursement.' },
              { icon: Lock, t: 'Un prix, un contenu, avant paiement', d: 'Une offre payante correspond à un bien identifiable. Rétractation de 7 jours sur le Pass.' },
              { icon: Sparkles, t: 'Aucune promesse de gain facile', d: 'Pas de slogan « gagne X par jour ». Des indicateurs réels sont publiés dès qu’ils existent.' },
              { icon: Dices, t: 'Zéro jeu de hasard', d: 'Ni roue, ni loterie, ni tirage au sort, ni loot box, gratuits ou payants.' },
              { icon: ShieldCheck, t: 'Protection des membres', d: '18 ans minimum, plafond de dépense mensuel réglable, aide pour une pause ou la clôture du compte.' },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4 rounded-3xl bg-ink-soft p-5 ring-1 ring-white/10">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun text-ink"><Icon className="h-6 w-6" /></span>
                <div>
                  <h3 className="font-display text-xl font-bold">{t}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-white/70">{d}</p>
                </div>
              </li>
            ))}
            <li>
              <button onClick={() => go('transparence')} className="mt-2 inline-flex items-center gap-2 font-bold text-sun hover:gap-3 transition-all">
                Lire la charte et les indicateurs <ArrowRight className="h-4 w-4" />
              </button>
            </li>
          </ul>
        </div>
      </section>

      {/* ───────────── INDICATEURS RÉELS ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-[2rem] border border-ink/10 bg-white p-8 sm:p-10">
          <Eyebrow>Indicateurs réels</Eyebrow>
          {ethicalIndicators ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div><p className="font-display text-4xl font-extrabold">{ethicalIndicators.medianMonthlyIncomeXOF.toLocaleString('fr-FR')} <span className="text-lg text-ink/50">FCFA</span></p><p className="mt-1 text-[15px] text-ink/65">Revenu mensuel médian des membres actifs</p></div>
              <div><p className="font-display text-4xl font-extrabold">{ethicalIndicators.percentUnwithdrawnMembers} %</p><p className="mt-1 text-[15px] text-ink/65">Des membres n'ont encore rien retiré</p></div>
              <div><p className="font-display text-4xl font-extrabold">{ethicalIndicators.averageDaysToFirstPayout} jours</p><p className="mt-1 text-[15px] text-ink/65">Délai moyen avant un premier retrait</p></div>
            </div>
          ) : (
            <div className="mt-4 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              <BabiVector mood="think" size={100} className="mx-auto" />
              <div>
                <h3 className="font-display text-2xl font-bold">Nous publierons la réalité, même quand elle est modeste.</h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/65">
                  Revenu médian des membres actifs, part des membres n'ayant encore rien retiré, délai avant un premier retrait : ces trois chiffres seront affichés ici dès que les premiers retraits auront eu lieu. Tant qu'ils n'existent pas, nous ne les inventons pas.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ───────────── ENTREPRISES ───────────── */}
      <section id="partenaires" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[#FFF1D6] p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Entreprises</Eyebrow>
            <h2 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.08]">Touchez une audience mobile, avec des campagnes validées.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">Bannières, contenus sponsorisés, missions partenaires. Chaque campagne est relue avant publication ; les mécanismes de hasard et la promotion de paris sont refusés.</p>
            <button onClick={() => go('partenaire')} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-white hover:bg-ink-soft">Espace entreprises <ArrowRight className="h-4 w-4" /></button>
          </div>
          <IlluPartners className="mx-auto w-full max-w-sm" />
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="text-center">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">On répond avant que vous payiez.</h2>
        </div>
        <div className="mt-10 divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-white">
          {FAQS.map((f, i) => (
            <div key={f.q}>
              <h3>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-bold hover:bg-mist/70"
                >
                  {f.q}
                  <ChevronDown className={`h-5 w-5 shrink-0 text-leaf transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
              </h3>
              {faqOpen === i && <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink/70">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── APPEL FINAL ───────────── */}
      <section className="relative overflow-hidden bg-wax text-white">
        <WaxPattern tone="orange" className="pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8 lg:py-20">
          <div>
            <h2 className="max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">Prêt à découvrir AH GLOBAL ?</h2>
            <p className="mt-4 max-w-xl text-lg text-white/90">Créez votre compte gratuit en quelques minutes. Vous décidez ensuite, en toute connaissance de cause, de ce que vous activez.</p>
            <button onClick={() => onOpenAuth('signup')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(15,42,30,0.9)] transition hover:-translate-y-0.5 hover:bg-ink-soft">
              Créer mon compte gratuit <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mx-auto hidden w-60 lg:block"><BabiHero bubble={false} /></div>
        </div>
      </section>
      <ScarfRibbon />
    </div>
  );
};
