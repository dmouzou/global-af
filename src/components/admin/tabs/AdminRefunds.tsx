import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AdminRefund } from '../../../types';
import { Btn, EmptyState, fcfa, PageTitle, Panel, Pill } from '../../dashboard/ui';
import { ActionDialog } from '../ActionDialog';

export const AdminRefunds: React.FC = () => {
  const { adminRefunds, processRefundAdmin } = useApp();
  const [target, setTarget] = useState<AdminRefund | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const pending = adminRefunds.filter(r => r.status === 'pending');
  const done = adminRefunds.filter(r => r.status !== 'pending');

  const Row = (r: AdminRefund) => (
    <li key={r.id}><Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0"><p className="font-bold">Remboursement · …{r.userId.slice(-6)}</p><p className="text-[13px] text-ink/55">{r.createdAt} · {r.provider} · {r.method}</p><p className="mt-1 text-[13px] text-ink/65">Motif du membre : {r.reason || '—'}</p></div>
        <div className="text-right"><p className="font-display text-xl font-extrabold text-leaf-deep">{fcfa(r.refundAmount, r.currency)}</p><p className="text-[12px] text-ink/50">payé {r.amount.toLocaleString('fr-FR')} − frais {r.fee.toLocaleString('fr-FR')}</p></div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone={r.status === 'pending' ? 'sun' : 'leaf'}>{r.status === 'pending' ? 'À payer' : 'Payé'}</Pill>
        {r.providerReference && <span className="text-[13px] text-ink/55">Réf. {r.providerReference}</span>}
        {r.status === 'pending' && <Btn onClick={() => setTarget(r)}>Marquer comme payé</Btn>}
      </div>
    </Panel></li>
  );

  return (
    <div className="space-y-5">
      <PageTitle title="Remboursements" subtitle="Rétractation du Pass d'entrée (7 jours). Remboursez le membre depuis votre compte marchand, puis enregistrez ici la référence." />
      {flash && <p role="status" className={`rounded-2xl p-3.5 text-[14px] font-semibold ${flash.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{flash.text}</p>}
      {pending.length === 0 ? <EmptyState title="Aucun remboursement à payer" text="Les demandes de rétractation apparaîtront ici." mood="happy" /> : <ul className="space-y-3">{pending.map(Row)}</ul>}
      {done.length > 0 && <><h2 className="pt-2 font-display text-xl font-extrabold">Déjà traités</h2><ul className="space-y-3">{done.map(Row)}</ul></>}
      <ActionDialog open={!!target} onClose={() => setTarget(null)} title="Confirmer le remboursement" description={target ? `${fcfa(target.refundAmount, target.currency)} remboursés au membre. Saisissez la référence du remboursement chez le prestataire.` : ''} fieldLabel="Référence du prestataire" confirmLabel="Confirmer"
        onConfirm={async v => { const res = await processRefundAdmin(target!.id, v); setFlash({ ok: res.success, text: res.message }); return res.success ? null : res.message; }} />
    </div>
  );
};
