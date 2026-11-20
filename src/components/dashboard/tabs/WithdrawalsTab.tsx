import React from 'react';
import { ArrowUpRight, Lock, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { BabiVector } from '../../brand/BabiVector';
import { Btn, EmptyState, fcfa, PageTitle, Panel, Pill } from '../ui';

const STEPS = ['Demande', 'Contrôle', 'Réservation', 'Validation', 'Paiement'];
const STATUS: Record<string, { label: string; tone: 'leaf' | 'sun' | 'mist' | 'rose' | 'wax'; step: number }> = {
  reserved: { label: 'Contrôle financier', tone: 'sun', step: 2 },
  approved: { label: 'Validé, virement à venir', tone: 'wax', step: 3 },
  payout_initiated: { label: 'Virement en cours', tone: 'wax', step: 4 },
  paid: { label: 'Payé', tone: 'leaf', step: 5 },
  reconciled: { label: 'Payé', tone: 'leaf', step: 5 },
  failed: { label: 'Échec : montant rendu à votre solde', tone: 'rose', step: 0 },
  rejected: { label: 'Rejeté', tone: 'rose', step: 0 },
};

export const WithdrawalsTab: React.FC<{ onWithdraw: () => void; onActivate: (plan: 'standard' | 'premium') => void }> = ({ onWithdraw, onActivate }) => {
  const { currentUser, selectedCountry, wallet, withdrawals } = useApp();
  if (!currentUser) return null;

  if (!currentUser.isActivated) {
    return (
      <div>
        <PageTitle title="Retraits Mobile Money" />
        <Panel className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:p-8">
          <BabiVector mood="think" prop="coin" size={140} className="mx-auto" />
          <div>
            <Pill tone="sun"><Lock className="h-3 w-3" />Pass requis</Pill>
            <h2 className="mt-3 font-display text-2xl font-extrabold">Les retraits demandent un Pass actif.</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/65">Le Pass d'entrée (3 000 FCFA, une seule fois) permet de demander des retraits vers Wave, Orange Money, MTN MoMo et Moov Money, après contrôle. Rétractation possible pendant 7 jours.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Btn onClick={() => onActivate('standard')}><Zap className="h-4 w-4" />Activer le Pass (3 000 FCFA)</Btn>
              <Btn kind="ghost" onClick={() => onActivate('premium')}>Voir le VIP Premium</Btn>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  const mine = withdrawals.filter(w => w.userId === currentUser.id);

  return (
    <div>
      <PageTitle title="Retraits Mobile Money" subtitle="Chaque demande suit le même parcours, du contrôle jusqu'au paiement." action={<Btn onClick={onWithdraw}><ArrowUpRight className="h-4 w-4" />Demander un retrait</Btn>} />

      <Panel className="grid gap-5 sm:grid-cols-3">
        <div><p className="text-[12px] font-bold uppercase tracking-wider text-ink/45">Solde retirable</p><p className="mt-1 font-display text-2xl font-extrabold text-leaf-deep">{fcfa(wallet.availableBalance, wallet.currency)}</p></div>
        <div><p className="text-[12px] font-bold uppercase tracking-wider text-ink/45">Minimum</p><p className="mt-1 font-display text-2xl font-extrabold">{fcfa(selectedCountry.minWithdrawal, selectedCountry.currency)}</p></div>
        <div><p className="text-[12px] font-bold uppercase tracking-wider text-ink/45">Frais de transfert</p><p className="mt-1 font-display text-2xl font-extrabold">{selectedCountry.withdrawalFeePercent} %</p></div>
      </Panel>

      <h2 className="mb-3 mt-8 font-display text-xl font-extrabold">Historique de vos demandes</h2>
      {mine.length === 0 ? (
        <EmptyState title="Aucune demande pour le moment" text="Quand vous demanderez un retrait, vous suivrez ici chaque étape, avec la référence de l'opérateur au paiement." mood="happy" prop="phone" />
      ) : (
        <ul className="space-y-3">
          {mine.map(w => {
            const st = STATUS[w.status] ?? { label: w.status, tone: 'mist' as const, step: 0 };
            return (
              <li key={w.id} className="rounded-3xl bg-white p-5 ring-1 ring-ink/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold">Retrait #{w.id} · {w.operator} ({w.operatorPhone})</p>
                    <p className="mt-0.5 text-[13px] text-ink/55">Demandé le {w.requestedAt}{w.processedAt ? ` · traité le ${w.processedAt}` : ''}{w.transactionRef ? ` · réf. opérateur ${w.transactionRef}` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-extrabold">{fcfa(w.netAmount, w.currency)}</p>
                    <p className="text-[12px] text-ink/50">Brut {w.amount.toLocaleString('fr-FR')} · frais {w.fees}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <Pill tone={st.tone}>{st.label}{w.status === 'rejected' && w.rejectReason ? ` : ${w.rejectReason}` : ''}</Pill>
                  {st.step > 0 && (
                    <ol className="flex items-center gap-1.5" aria-label="Étapes">
                      {STEPS.map((s, i) => (
                        <li key={s} className="flex items-center gap-1.5">
                          <span title={s} className={`h-2.5 w-7 rounded-full ${i < st.step ? 'bg-leaf' : 'bg-ink/10'}`} />
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
