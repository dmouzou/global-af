import React, { useState } from 'react';
import { ArrowRight, Sparkles, Users, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IlluAffiliation, ScarfRibbon } from '../brand/Illustrations';
import { CtaBand, Eyebrow, GhostButton, PageHero, PrimaryButton } from '../ui/kit';

interface AffiliationPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');

export const AffiliationPage: React.FC<AffiliationPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { currentUser } = useApp();
  const [referralsCount, setReferralsCount] = useState(5);
  const [passPrice, setPassPrice] = useState(3000);
  const [firstOrderPrice, setFirstOrderPrice] = useState(9900);

  const start = () => (currentUser ? onGoToDashboard() : onOpenAuth('signup'));

  const safeCount = Math.max(1, referralsCount || 1);
  const safePassPrice = Math.max(0, passPrice || 0);
  const safeFirstOrder = Math.max(0, firstOrderPrice || 0);

  const bonusPass = safeCount * (safePassPrice * 0.10);
  const bonusFirstOrder = safeCount * (safeFirstOrder * 0.05);
  const totalGains = bonusPass + bonusFirstOrder;

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow="Programme de Parrainage"
        title="Partagez AH GLOBAL et touchez des commissions sur chaque filleul actif."
        subtitle="Un système simple et transparent à un niveau : 10 % sur le Pass Membre de vos filleuls, puis 5 % sur leur première commande réelle sur l'application."
        actions={
          <>
            <PrimaryButton onClick={start}>
              {currentUser ? "Accéder à mon lien d'affilié" : 'Créer mon compte gratuit'} <ArrowRight className="h-5 w-5" />
            </PrimaryButton>
            <GhostButton onClick={() => document.getElementById('calcul')?.scrollIntoView({ behavior: 'smooth' })}>
              Simuler mes gains
            </GhostButton>
          </>
        }
        illustration={<IlluAffiliation className="w-full" title="Illustration : parrainage direct sur AH GLOBAL" />}
      />

      {/* Règle claire : Les 2 sources de gains */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Eyebrow>Fonctionnement</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          Deux commissions pour chaque filleul parrainé.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-gradient-to-br from-wax to-wax-deep p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Étape 1 · Activation</span>
              <Award className="h-6 w-6 text-white/80" />
            </div>
            <p className="mt-4 font-display text-6xl font-extrabold">10 %</p>
            <h3 className="mt-2 text-xl font-bold">Sur le Pass Membre</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">
              Dès que votre filleul direct active son Pass Membre, vous recevez automatiquement 10 % du montant du Pass sur votre solde.
            </p>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-leaf to-leaf-deep p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Étape 2 · Première vente</span>
              <Sparkles className="h-6 w-6 text-white/80" />
            </div>
            <p className="mt-4 font-display text-6xl font-extrabold">5 %</p>
            <h3 className="mt-2 text-xl font-bold">Sur sa 1ère commande</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">
              Sur le premier achat de votre filleul sur la plateforme : abonnement VIP, formation certifiante, consultation ou prestation.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-mist p-5 text-sm text-ink/75 flex items-center gap-3">
          <Users className="h-5 w-5 text-leaf shrink-0" />
          <span>
            <strong>Parrainage direct (1 niveau) :</strong> vos commissions sont calculées uniquement sur les membres que vous parrainez directement. Tout est consultable en temps réel dans votre espace personnel.
          </span>
        </div>
      </section>

      {/* Simulateur interactif de gains */}
      <section id="calcul" className="scroll-mt-24 bg-mist py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <Eyebrow>Simulateur</Eyebrow>
              <h2 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Estimez vos gains de parrainage.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
                Calculez vos gains potentiels en fonction du nombre de filleuls que vous invitez à rejoindre AH GLOBAL.
              </p>
            </div>

            <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm border border-ink/10">
              <div>
                <div className="flex justify-between text-sm font-bold">
                  <span>Nombre de filleuls parrainés</span>
                  <span className="text-wax font-display text-base font-extrabold">{safeCount}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={referralsCount}
                  onChange={e => setReferralsCount(Number(e.target.value))}
                  className="mt-2 w-full accent-wax cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="block">
                  <span className="text-xs font-bold text-ink/70">Prix du Pass Membre (FCFA)</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={passPrice}
                    onChange={e => setPassPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-wax"
                  />
                  <span className="text-[11px] text-ink/50 block mt-0.5">Actuellement 3 000 FCFA</span>
                </label>

                <label className="block">
                  <span className="text-xs font-bold text-ink/70">1ère commande moyenne (FCFA)</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={firstOrderPrice}
                    onChange={e => setFirstOrderPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-wax"
                  />
                  <span className="text-[11px] text-ink/50 block mt-0.5">Ex: 9 900 FCFA (VIP)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl border border-ink/10 space-y-6">
              <h3 className="font-display text-xl font-bold text-ink">Vos commissions estimées</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-wax/10">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-wax-deep">10 % sur le Pass Membre</div>
                    <div className="text-xs text-ink/60 mt-0.5">{safeCount} filleul(s) × {fmt(safePassPrice * 0.10)} FCFA</div>
                  </div>
                  <div className="font-display text-2xl font-black text-wax-deep">
                    {fmt(bonusPass)} <span className="text-xs text-ink/60 font-normal">FCFA</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-leaf/10">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-leaf-deep">5 % sur la 1ère commande</div>
                    <div className="text-xs text-ink/60 mt-0.5">{safeCount} commande(s) × {fmt(safeFirstOrder * 0.05)} FCFA</div>
                  </div>
                  <div className="font-display text-2xl font-black text-leaf-deep">
                    {fmt(bonusFirstOrder)} <span className="text-xs text-ink/60 font-normal">FCFA</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-ink">Total de vos gains</div>
                  <div className="text-xs text-ink/50">Disponibles pour retrait Mobile Money</div>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
                  {fmt(totalGains)} <span className="text-sm font-bold text-ink/50">FCFA</span>
                </div>
              </div>

              <PrimaryButton onClick={start} className="w-full justify-center">
                {currentUser ? 'Obtenir mon lien dans mon espace' : 'Commencer dès maintenant'}
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Partagez votre lien et suivez vos filleuls en direct."
        text="Votre lien d'affiliation personnel et le tableau de bord de vos commissions sont accessibles à tout moment depuis votre espace membre."
        cta={currentUser ? 'Aller à mon espace' : 'Créer mon compte gratuit'}
        onClick={start}
      />
      <ScarfRibbon />
    </div>
  );
};
