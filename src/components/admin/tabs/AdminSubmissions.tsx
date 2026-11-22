import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TaskSubmission } from '../../../types';
import { Btn, EmptyState, fcfa, PageTitle, Panel, Pill } from '../../dashboard/ui';
import { ActionDialog } from '../ActionDialog';

export const AdminSubmissions: React.FC = () => {
  const { adminSubmissions, reviewSubmissionAdmin } = useApp();
  const [rejecting, setRejecting] = useState<TaskSubmission | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const approve = async (s: TaskSubmission) => { const r = await reviewSubmissionAdmin(s.id, 'approved'); if (!r.success) setFlash(r.message); };

  return (
    <div className="space-y-5">
      <PageTitle title="Preuves à vérifier" subtitle="Validez ou refusez. Une validation crédite la récompense ; un refus exige un motif, transmis au membre." />
      {flash && <p role="alert" className="rounded-2xl bg-rose-50 p-3.5 text-[14px] font-semibold text-rose-700">{flash}</p>}
      {adminSubmissions.length === 0 ? <EmptyState title="Rien à vérifier" text="Les participations en attente de revue apparaissent ici." mood="happy" /> : (
        <ul className="space-y-3">
          {adminSubmissions.map(s => (
            <li key={s.id}><Panel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0"><p className="font-bold">{s.taskTitle}</p><p className="text-[13px] text-ink/55">{s.userName || `Membre …${s.userId.slice(-6)}`} · {s.submittedAt}</p></div>
                <p className="font-display text-lg font-extrabold text-leaf-deep">{fcfa(s.rewardAmount)}</p>
              </div>
              <div className="mt-3 rounded-2xl bg-mist p-3.5 text-[14px]">
                <Pill>{s.proofType === 'url' ? 'Lien' : s.proofType === 'text' ? 'Texte' : 'Capture'}</Pill>
                {s.proofType === 'url'
                  ? <a href={s.proofContent} target="_blank" rel="noreferrer noopener" className="mt-2 flex min-h-11 items-center justify-between gap-3 break-all py-1 font-semibold text-wax-deep">{s.proofContent}<ExternalLink className="h-4 w-4 shrink-0" /></a>
                  : <p className="mt-2 whitespace-pre-wrap break-words">{s.proofContent}</p>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2"><Btn onClick={() => approve(s)}>Valider et créditer</Btn><Btn kind="ghost" className="!text-rose-700" onClick={() => setRejecting(s)}>Refuser</Btn></div>
            </Panel></li>
          ))}
        </ul>
      )}
      <ActionDialog open={!!rejecting} onClose={() => setRejecting(null)} danger title="Refuser la participation" description={rejecting ? `« ${rejecting.taskTitle} ». Le motif est transmis au membre. Ce refus est définitif.` : ''} fieldLabel="Motif du refus" confirmLabel="Refuser"
        onConfirm={async v => { const r = await reviewSubmissionAdmin(rejecting!.id, 'rejected', v); return r.success ? null : r.message; }} />
    </div>
  );
};
