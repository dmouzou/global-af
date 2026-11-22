import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { WithdrawalRequest } from '../../../types';
import { Btn, EmptyState, fcfa, PageTitle, Panel, Pill, Tone } from '../../dashboard/ui';
import { ActionDialog } from '../ActionDialog';

type Action = 'approve' | 'payout_initiated' | 'paid' | 'failed' | 'reject' | 'reconcile';
const STATUS: Record<string, { label: string; tone: Tone }> = {
  reserved: { label: 'À contrôler', tone: 'sun' }, approved: { label: 'Approuvé', tone: 'wax' }, payout_initiated: { label: 'Virement lancé', tone: 'wax' },
  paid: { label: 'Payé', tone: 'leaf' }, reconciled: { label: 'Rapproché', tone: 'leaf' }, rejected: { label: 'Rejeté', tone: 'rose' }, failed: { label: 'Échec', tone: 'rose' },
};
const OPEN = ['reserved', 'approved', 'payout_initiated'];

export const AdminWithdrawals: React.FC = () => {
  const { adminWithdrawals, processWithdrawalAdmin } = useApp();
  const [filter, setFilter] = useState<'open' | 'all'>('open');
  const [dialog, setDialog] = useState<{ w: WithdrawalRequest; kind: 'reject' | 'paid' | 'failed' } | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const list = filter === 'open' ? adminWithdrawals.filter(w => OPEN.includes(w.status)) : adminWithdrawals;
  const run = async (id: string, action: Action, text?: string) => {
    const res = await processWithdrawalAdmin(id, action, text ?? '');
    setFlash({ ok: res.success, text: res.message });
    return res.success ? null : res.message;
  };

  return (
    <div className="space-y-5">
      <PageTitle title="Retraits Mobile Money" subtitle="Contrôle, réservation, virement puis rapprochement. Le virement se fait chez l'opérateur ; ici, vous en enregistrez la référence." />
      <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-ink/10">
        {([['open', `À traiter (${adminWithdrawals.filter(w => OPEN.includes(w.status)).length})`], ['all', 'Tous']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id} className={`min-h-10 rounded-full px-4 text-sm font-bold ${filter === id ? 'bg-ink text-white' : 'text-ink/65'}`}>{label}</button>
        ))}
      </div>
      {flash && <p role="status" className={`rounded-2xl p-3.5 text-[14px] font-semibold ${flash.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{flash.text}</p>}

      {list.length === 0 ? <EmptyState title="Rien à traiter" text={filter === 'open' ? 'Aucune demande de retrait en cours.' : 'Aucune demande enregistrée.'} mood="happy" prop="phone" /> : (
        <ul className="space-y-3">
          {list.map(w => {
            const st = STATUS[w.status] ?? { label: w.status, tone: 'mist' as Tone };
            return (
              <li key={w.id}><Panel>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold">{w.userName} · {w.operator}</p>
                    <p className="text-[13px] text-ink/55">{w.operatorPhone} · demandé le {w.requestedAt}{w.processedAt ? ` · traité le ${w.processedAt}` : ''}</p>
                    {w.transactionRef && <p className="text-[13px] text-ink/55">Réf. opérateur : {w.transactionRef}</p>}
                  </div>
                  <div className="text-right"><p className="font-display text-xl font-extrabold">{fcfa(w.netAmount, w.currency)}</p><p className="text-[12px] text-ink/50">brut {w.amount.toLocaleString('fr-FR')} · frais {w.fees.toLocaleString('fr-FR')}</p></div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Pill tone={st.tone}>{st.label}</Pill>
                  {w.status === 'reserved' && <Btn onClick={() => run(w.id, 'approve')}>Approuver</Btn>}
                  {w.status === 'approved' && <Btn onClick={() => run(w.id, 'payout_initiated')}>Virement lancé</Btn>}
                  {w.status === 'payout_initiated' && <><Btn onClick={() => setDialog({ w, kind: 'paid' })}>Confirmer le paiement</Btn><Btn kind="ghost" onClick={() => setDialog({ w, kind: 'failed' })}>Signaler un échec</Btn></>}
                  {w.status === 'paid' && <Btn kind="ink" onClick={() => run(w.id, 'reconcile')}>Marquer rapproché</Btn>}
                  {(w.status === 'reserved' || w.status === 'approved') && <Btn kind="ghost" className="!text-rose-700" onClick={() => setDialog({ w, kind: 'reject' })}>Rejeter</Btn>}
                </div>
                {w.status === 'rejected' && w.rejectReason && <p className="mt-2 text-[13px] text-rose-700">Motif : {w.rejectReason}</p>}
              </Panel></li>
            );
          })}
        </ul>
      )}

      <ActionDialog
        open={!!dialog}
        onClose={() => setDialog(null)}
        danger={dialog?.kind !== 'paid'}
        title={dialog?.kind === 'paid' ? 'Confirmer le paiement' : dialog?.kind === 'failed' ? 'Signaler un échec de virement' : 'Rejeter la demande'}
        description={dialog ? `${dialog.w.userName} · ${fcfa(dialog.w.netAmount, dialog.w.currency)} via ${dialog.w.operator}. ${dialog.kind === 'paid' ? 'Saisissez la référence donnée par l’opérateur.' : 'Le montant est rendu au solde du membre.'}` : ''}
        fieldLabel={dialog?.kind === 'paid' ? `Référence ${dialog.w.operator} du virement` : 'Motif (transmis au membre)'}
        confirmLabel={dialog?.kind === 'paid' ? 'Confirmer' : dialog?.kind === 'failed' ? 'Signaler l’échec' : 'Rejeter'}
        onConfirm={v => run(dialog!.w.id, dialog!.kind, v)}
      />
    </div>
  );
};
