import React, { useState } from 'react';
import { ArrowRight, Ban, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BabiVector } from '../brand/BabiVector';
import { IlluAffiliation, ScarfRibbon } from '../brand/Illustrations';
import { CtaBand, Eyebrow, GhostButton, PageHero, PrimaryButton } from '../ui/kit';

interface AffiliationPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const L1 = 0.10;
const L2 = 0.05;
const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');

export const AffiliationPage: React.FC<AffiliationPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { currentUser } = useApp();
  const [price, setPrice] = useState(9900);
  const safePrice = Number.isFinite(price) && price > 0 ? price : 0;

  const start = () => (currentUser ? onGoToDashboard() : onOpenAuth('signup'));

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow="Affiliation"
        title="Des commissions sur de vraies ventes, jamais sur le simple recrutement."
        subtitle="Deux niveaux au maximum, des taux publiés et des commissions plafonnées par rapport au prix du produit vendu. Inscrire quelqu'un ne rapporte rien : seule une vente réelle compte."
        actions={
          <>
            <PrimaryButton onClick={start}>{currentUser ? 'Mon lien d\'affilié' : 'Créer mon compte gratuit'} <ArrowRight className="h-5 w-5" /></PrimaryButton>
            <GhostButton onClick={() => document.getElementById('calcul')?.scrollIntoView({ behavior: 'smooth' })}>Comprendre le calcul</GhostButton>
          </>
        }
        illustration={<IlluAffiliation className="w-full" title="Illustration : un parrain, deux niveaux de filleuls" />}
      />

      {/* Niveaux */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Eyebrow>Les niveaux</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Deux niveaux, pas un de plus.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] bg-wax p-7 text-white">
            <p className="text-sm font-bold uppercase tracking-wider text-white/80">Niveau 1</p>
            <p className="mt-3 font-display text-6xl font-extrabold">10 %</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">Sur chaque vente réelle faite à une personne que vous avez parrainée directement.</p>
          </div>
          <div className="rounded-[2rem] bg-leaf p-7 text-white">
            <p className="text-sm font-bold uppercase tracking-wider text-white/80">Niveau 2</p>
            <p className="mt-3 font-display text-6xl font-extrabold">5 %</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">Sur les ventes réelles faites aux personnes parrainées par vos filleuls directs.</p>
          </div>
          <div className="rounded-[2rem] border-2 border-dashed border-ink/20 p-7">
            <p className="text-sm font-bold uppercase tracking-wider text-ink/50">Niveau 3</p>
            <p className="mt-3 flex items-center gap-3 font-display text-4xl font-extrabold text-ink/40"><Ban className="h-9 w-9" /> Désactivé</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">Il n'existe pas. Son ajout éventuel nécessiterait une validation explicite au regard de la charte éthique.</p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink/65">
          Les commissions portent sur les ventes réelles : abonnements, formations et campagnes partenaires payées. L'activation du compte, à elle seule, ne génère aucune commission. Les taux en vigueur sont modifiables par GLOBAL-AF et toujours affichés dans votre espace.
        </p>
      </section>

      {/* Calcul */}
      <section id="calcul" className="scroll-mt-24 bg-mist py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Eyebrow>Le calcul</Eyebrow>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Comprendre une commission, sur une seule vente.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/65">
              Cet exemple montre la règle de calcul pour <strong>une</strong> vente. Il ne représente pas un revenu attendu : tout dépend de ventes réelles à de vrais clients.
            </p>
            <label className="mt-6 block">
              <span className="text-sm font-bold">Prix du produit vendu (FCFA)</span>
              <input
                type="number"
                min={0}
                step={100}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="mt-2 w-full max-w-xs rounded-2xl border border-ink/15 bg-white px-4 py-3 font-display text-xl font-bold outline-none focus:border-wax"
              />
              <span className="mt-1 block text-xs text-ink/50">Par exemple 9 900 FCFA, le prix du VIP Premium.</span>
            </label>
          </div>
          <div className="rounded-[2rem] bg-white p-7 ring-1 ring-ink/10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-wax/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-wax-deep">Filleul niveau 1 achète</p>
                <p className="mt-2 font-display text-4xl font-extrabold">{fmt(safePrice * L1)} <span className="text-lg text-ink/50">FCFA</span></p>
                <p className="mt-1 text-sm text-ink/60">10 % du prix</p>
              </div>
              <div className="rounded-2xl bg-leaf/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-leaf-deep">Filleul niveau 2 achète</p>
                <p className="mt-2 font-display text-4xl font-extrabold">{fmt(safePrice * L2)} <span className="text-lg text-ink/50">FCFA</span></p>
                <p className="mt-1 text-sm text-ink/60">5 % du prix</p>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-ink/55">
              Une commission est créditée une fois la vente définitive. Elle est annulée si la vente est remboursée.
            </p>
          </div>
        </div>
      </section>

      {/* Test de contrôle */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
        <BabiVector mood="think" size={110} className="mx-auto" />
        <Eyebrow className="mt-4">Notre test de contrôle</Eyebrow>
        <blockquote className="mt-4 text-balance font-display text-2xl font-extrabold leading-snug sm:text-3xl">
          « Si plus personne ne s'inscrivait pendant un an, le parrain gagnerait-il encore grâce à de vrais clients ? »
        </blockquote>
        <p className="mt-4 text-[15px] text-ink/65">Si la réponse est non, le mécanisme est à corriger. C'est écrit dans notre charte.</p>
      </section>

      {/* Ce que nous faisons / refusons */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <Eyebrow>Nos règles</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Ce que nous faisons, et ce que nous refusons.</h2>
        <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10">
          <div className="hidden grid-cols-[1.1fr_1.4fr_1.4fr] bg-mist px-6 py-3 text-sm font-bold md:grid">
            <span>Sujet</span><span className="text-leaf-deep">Chez GLOBAL-AF</span><span className="text-rose-700">Ce que nous refusons</span>
          </div>
          {[
            ['Origine des commissions', 'Ventes réelles : abonnements, formations, campagnes payées.', 'Droits d\'entrée payés par les nouveaux arrivants.'],
            ['Gain sur le simple recrutement', 'Aucun.', 'Une prime par personne recrutée.'],
            ['Niveaux', '2 au maximum, commissions plafonnées par rapport au prix.', 'Des niveaux illimités.'],
            ['Faux comptes et auto-parrainage', 'Aucune commission, comptes suspendus.', 'Tolérés tant qu\'ils rapportent.'],
            ['Droit de rétractation', 'Pass : 7 jours, remboursement sous déduction des frais de transaction (3 %).', 'Fonds bloqués, sans recours.'],
          ].map(([topic, ours, theirs]) => (
            <div key={topic} className="grid gap-1 border-t border-ink/10 px-6 py-4 first:border-t-0 md:grid-cols-[1.1fr_1.4fr_1.4fr] md:gap-4">
              <p className="font-display text-base font-bold">{topic}</p>
              <p className="flex gap-2 text-[15px] text-ink/80"><Check className="mt-0.5 h-5 w-5 shrink-0 text-leaf" strokeWidth={3} />{ours}</p>
              <p className="flex gap-2 text-[15px] text-ink/55"><X className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" strokeWidth={3} />{theirs}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-ink p-7 text-white">
          <h3 className="font-display text-xl font-bold">Règles de communication pour les affiliés</h3>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-white/75">
            Pas de slogan du type « gagne X par jour », pas de mise en scène d'argent, pas de formulation « jusqu'à » trompeuse. Les affiliés et partenaires s'engagent par écrit à respecter la charte, et des sanctions sont prévues en cas de manquement.
          </p>
        </div>
      </section>

      <CtaBand
        title="Parrainez en toute transparence."
        text="Votre lien d'affiliation est disponible dans votre espace, avec le détail de chaque commission : en attente, validée ou annulée."
        cta={currentUser ? 'Aller à mon espace' : 'Créer mon compte gratuit'}
        onClick={start}
      />
      <ScarfRibbon />
    </div>
  );
};
