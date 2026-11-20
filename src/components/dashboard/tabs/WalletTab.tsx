import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Btn, EmptyState, fcfa, PageTitle, Panel, Pill, Stat } from '../ui';

const TYPE_LABEL: Record<string, string> = {
  reward: 'Récompense', commission: 'Commission', bonus: 'Bonus', withdrawal: 'Retrait',
  activation_payment: 'Activation', subscription_payment: 'Abonnement', refund: 'Remboursement', adjustment: 'Ajustement',
};
const DEBITS = ['withdrawal', 'activation_payment', 'subscription_payment'];
const STATUS: Record<string, { label: string; tone: 'leaf' | 'sun' | 'mist' | 'rose' }> = {
  completed: { label: 'Validé', tone: 'leaf' }, pending: { label: 'En attente', tone: 'sun' },
  cancelled: { label: 'Annulé', tone: 'mist' }, refunded: { label: 'Remboursé', tone: 'rose' },
};

export const WalletTab: React.FC<{ onWithdraw: () => void }> = ({ onWithdraw }) => {
  const { currentUser, wallet, ledger } = useApp();
  if (!currentUser) return null;
  const mine = ledger.filter(l => l.userId === currentUser.id);

  return (
    <div>
      <PageTitle
        title="Portefeuille et grand livre"
        subtitle="Chaque opération est enregistrée et ne s'efface jamais : un solde n'est jamais modifié sans laisser de trace."
        action={<Btn onClick={onWithdraw}><ArrowUpRight className="h-4 w-4" />Nouveau retrait</Btn>}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat accent="wax" label="Disponible" value={fcfa(wallet.availableBalance, wallet.currency)} />
        <Stat accent="sun" label="En attente" value={fcfa(wallet.pendingBalance, wallet.currency)} />
        <Stat accent="leaf" label="Commissions" value={fcfa(wallet.commissionBalance, wallet.currency)} />
        <Stat accent="ink" label="Bonus" value={fcfa(wallet.bonusBalance, wallet.currency)} />
        <Stat accent="ink" label="Réservé" value={fcfa(wallet.reservedBalance, wallet.currency)} hint="Retraits en cours" />
      </div>

      <Panel className="mt-6 !p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-5 py-4 sm:px-6">
          <h2 className="font-display text-xl font-extrabold">Opérations ({mine.length})</h2>
          <span className="text-xs font-semibold text-ink/45">Wave · Orange · MTN · Moov</span>
        </div>
        {mine.length === 0 ? (
          <div className="p-5"><EmptyState title="Aucune opération" text="Dès votre première mission validée, commission ou retrait, la ligne apparaît ici avec sa référence." mood="think" prop="coin" /></div>
        ) : (
          <>
            {/* Mobile : cartes */}
            <ul className="divide-y divide-ink/8 md:hidden">
              {mine.map(e => {
                const debit = DEBITS.includes(e.type);
                const st = STATUS[e.status] ?? STATUS.completed;
                return (
                  <li key={e.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0"><p className="truncate font-bold">{e.origin}</p><p className="text-[13px] text-ink/50">{TYPE_LABEL[e.type] ?? e.type} · {e.date}</p></div>
                      <p className={`shrink-0 font-display text-lg font-extrabold tabular-nums ${debit ? 'text-ink' : 'text-leaf-deep'}`}>{debit ? '−' : '+'}{fcfa(e.amount, e.currency)}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[12px] text-ink/45"><span>Réf. {e.reference}</span><Pill tone={st.tone}>{st.label}</Pill></div>
                  </li>
                );
              })}
            </ul>
            {/* Ordinateur : tableau */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-mist text-[12px] font-bold uppercase tracking-wider text-ink/50">
                  <tr><th className="px-6 py-3">Date</th><th className="px-3 py-3">Référence</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Détail</th><th className="px-3 py-3">Opérateur</th><th className="px-3 py-3 text-right">Montant</th><th className="px-6 py-3">Statut</th></tr>
                </thead>
                <tbody className="divide-y divide-ink/8">
                  {mine.map(e => {
                    const debit = DEBITS.includes(e.type);
                    const st = STATUS[e.status] ?? STATUS.completed;
                    return (
                      <tr key={e.id}>
                        <td className="whitespace-nowrap px-6 py-3.5 text-ink/65">{e.date}</td>
                        <td className="px-3 py-3.5 font-mono text-[12px] text-ink/55">{e.reference}</td>
                        <td className="px-3 py-3.5 font-semibold">{TYPE_LABEL[e.type] ?? e.type}</td>
                        <td className="max-w-[16rem] truncate px-3 py-3.5" title={e.origin}>{e.origin}</td>
                        <td className="px-3 py-3.5 text-ink/65">{e.operator || 'Interne'}</td>
                        <td className={`whitespace-nowrap px-3 py-3.5 text-right font-display font-extrabold tabular-nums ${debit ? 'text-ink' : 'text-leaf-deep'}`}>{debit ? '−' : '+'}{fcfa(e.amount, e.currency)}</td>
                        <td className="px-6 py-3.5"><Pill tone={st.tone}>{st.label}</Pill></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
};
