import React from 'react';
import { useApp } from '../../context/AppContext';
import { fmtPct, PublicRates, usePublicRates } from '../../lib/useRates';
import { ArrowRight, Dices, HeartHandshake, Landmark, Lock, Scale, Sparkles } from 'lucide-react';
import { OperatorLogo } from '../common/OperatorLogo';
import { BabiVector } from '../brand/BabiVector';
import { IlluShield, ScarfRibbon, WaxPattern } from '../brand/Illustrations';
import { CtaBand, Eyebrow, GhostButton, PageHero, PrimaryButton } from '../ui/kit';

interface TransparencePageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const pillarsFor = (r: PublicRates) => [
  { icon: Scale, tag: 'Condition 1', t: 'Parrainage direct, règles publiées', d: `Un seul niveau de parrainage direct, sans niveaux cachés. Le parrain touche ${fmtPct(r.passPct)} % du prix du Pass Membre activé par son filleul, puis ${fmtPct(r.firstSalePct)} % sur la première commande réelle de ce filleul. Pas d'auto-parrainage, aucune commission sur des comptes artificiels, commission annulée si la vente est remboursée.` },
  { icon: Lock, tag: 'Condition 2', t: "Un prix, un contenu, avant paiement", d: `Le Pass d'entrée se rétracte pendant ${r.retractionDays} jours, remboursé sous déduction des frais de transaction (${fmtPct(r.refundFeePct)} %). Le VIP Premium n'est pas remboursable : l'accès aux fichiers et contacts est immédiat et définitif.` },
  { icon: Sparkles, tag: 'Condition 3', t: 'Honnêteté sur les gains', d: "Nous publions des indicateurs réels, même modestes. Pas de slogan « gagne X par jour », pas de mise en scène d'argent, pas de « jusqu'à » trompeur, pour l'équipe, les affiliés et les partenaires." },
  { icon: Dices, tag: 'Condition 4', t: 'Interdiction des jeux de hasard', d: "Ni roue, ni loterie, ni tombola, ni tirage au sort, ni loot box, gratuits ou payants. Chaque récompense est connue à l'avance. Les campagnes partenaires contenant du hasard sont refusées." },
  { icon: HeartHandshake, tag: 'Condition 5', t: 'Protection des membres', d: "18 ans minimum vérifié à l'inscription, plafond de dépense mensuel réglable, aucune incitation à s'endetter. Pause, suspension volontaire ou clôture du compte : demandez-les par e-mail, nous les traitons." },
  { icon: Landmark, tag: 'Traçabilité', t: 'Chaque mouvement est enregistré', d: "Toutes les opérations de crédit et de débit sont inscrites dans un registre financier conservé, avec la référence de l'opérateur. Les modifications de règles sont tracées dans un journal d'audit." },
];

export const TransparencePage: React.FC<TransparencePageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { ethicalIndicators, currentUser } = useApp();
  const PILLARS = pillarsFor(usePublicRates());
  const start = () => (currentUser ? onGoToDashboard() : onOpenAuth('signup'));

  return (
    <div className="bg-white text-ink">
      <PageHero
        tone="ink"
        eyebrow="Transparence"
        title="Nos chiffres réels et nos engagements, sans promesse de richesse rapide."
        subtitle="Cinq conditions éthiques priment sur toute règle commerciale. Elles s'appliquent à l'équipe, aux affiliés et aux partenaires."
        actions={
          <>
            <PrimaryButton onClick={() => document.getElementById('indicateurs')?.scrollIntoView({ behavior: 'smooth' })}>Voir les indicateurs <ArrowRight className="h-5 w-5" /></PrimaryButton>
            <GhostButton onDark onClick={() => document.getElementById('engagements')?.scrollIntoView({ behavior: 'smooth' })}>Lire la charte</GhostButton>
          </>
        }
        illustration={<IlluShield className="w-full" title="Illustration : bouclier de protection des membres" />}
      />

      {/* Indicateurs */}
      <section id="indicateurs" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Indicateurs réels</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Ce que gagnent vraiment les membres</h2>
          </div>
          <span className="self-start rounded-full bg-mist px-3.5 py-1.5 text-sm font-bold text-ink/70 sm:self-auto">
            {ethicalIndicators ? `Mis à jour le ${ethicalIndicators.lastUpdated}` : 'En cours de collecte'}
          </span>
        </div>

        {ethicalIndicators ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { v: `${ethicalIndicators.medianMonthlyIncomeXOF.toLocaleString('fr-FR')} FCFA`, l: 'Revenu mensuel médian', n: 'Membres actifs : au moins 4 missions par mois.' },
              { v: `${ethicalIndicators.percentUnwithdrawnMembers} %`, l: "N'ont encore rien retiré", n: "Membres qui accumulent un solde ou viennent de s'inscrire." },
              { v: `${ethicalIndicators.averageDaysToFirstPayout} jours`, l: 'Avant un premier retrait', n: 'Entre la création du compte et le premier virement.' },
            ].map(k => (
              <div key={k.l} className="rounded-3xl border border-ink/10 bg-white p-7">
                <p className="font-display text-4xl font-extrabold">{k.v}</p>
                <p className="mt-2 font-bold">{k.l}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink/60">{k.n}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid items-center gap-6 rounded-[2rem] border-2 border-dashed border-ink/15 bg-mist p-8 sm:grid-cols-[auto_1fr] sm:p-10">
            <BabiVector mood="think" size={120} className="mx-auto" />
            <div className="text-center sm:text-left">
              <h3 className="font-display text-2xl font-bold">Indicateurs en cours de collecte.</h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/70">
                Le revenu médian des membres actifs, la part des membres n'ayant encore rien retiré et le délai moyen avant un premier retrait seront publiés ici, calculés à partir des retraits réellement effectués. Tant qu'ils n'existent pas, nous ne les inventons pas.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Engagements */}
      <section id="engagements" className="scroll-mt-24 bg-mist py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>La charte</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Des règles qui priment sur toute règle commerciale.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ icon: Icon, tag, t, d }) => (
              <article key={t} className="rounded-3xl bg-white p-7 ring-1 ring-ink/10">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf/10 text-leaf-deep"><Icon className="h-6 w-6" /></span>
                  <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink/55">{tag}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{d}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[14px] leading-relaxed text-ink/60">
            Les mécanismes liés aux frais d'activation, aux commissions, aux paiements et aux retraits font l'objet d'une validation juridique et réglementaire dans chaque pays avant leur activation commerciale. Cette validation est en cours.
          </p>
        </div>
      </section>

      {/* Serment + retraits */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-wax p-8 text-white sm:p-10">
          <WaxPattern tone="orange" className="pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <Eyebrow className="text-white!">L'engagement de Babi</Eyebrow>
            <blockquote className="mt-4 text-balance font-display text-2xl font-extrabold leading-snug sm:text-[1.7rem]">
              « Sur AH GLOBAL, personne ne doit payer sans savoir ce qu'il achète, ce qu'il peut retirer et ce qu'il risque. »
            </blockquote>
            <div className="mt-6 flex justify-center sm:justify-start"><BabiVector mood="happy" prop="shield" size={150} /></div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-10">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Des retraits vers vos portefeuilles Mobile Money</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/75">
            Chaque demande de retrait est contrôlée avant paiement. Le montant minimum, les frais et le net que vous recevez sont affichés avant que vous ne validiez.
          </p>
          <div className="mt-6 grid max-w-sm grid-cols-2 gap-2.5">
            <OperatorLogo operator="Wave" variant="pill" size="md" className="bg-white border-white" />
            <OperatorLogo operator="Orange Money" variant="pill" size="md" className="bg-white border-white" />
            <OperatorLogo operator="MTN MoMo" variant="pill" size="md" className="bg-white border-white" />
            <OperatorLogo operator="Moov Money" variant="pill" size="md" className="bg-white border-white" />
          </div>
        </div>
      </section>

      <CtaBand
        title="Créez votre compte en toute transparence."
        text="Le compte est gratuit. Vous lisez le prix, le contenu et les conditions avant de payer quoi que ce soit."
        cta={currentUser ? 'Aller à mon espace' : 'Créer mon compte gratuit'}
        onClick={start}
      />
      <ScarfRibbon />
    </div>
  );
};
