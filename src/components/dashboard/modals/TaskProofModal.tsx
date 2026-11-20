import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Task } from '../../../types';
import { Btn, fcfa, inputCls, Modal, Pill } from '../ui';

export const TaskProofModal: React.FC<{ task: Task | null; onClose: () => void }> = ({ task, onClose }) => {
  const { submitTaskProof } = useApp();
  const [type, setType] = useState<'text' | 'url'>('text');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => { setContent(''); setType('text'); setResult(null); }, [task?.id]);
  if (!task) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || busy) return;
    setBusy(true);
    const res = await submitTaskProof(task.id, type, content.trim());
    setBusy(false);
    setResult({ ok: res.success, text: res.message });
  };

  const done = result?.ok === true;
  return (
    <Modal open onClose={onClose} wide title={task.title} subtitle={task.verificationType === 'automatic' ? 'Validation automatique par code de fin' : task.verificationType === 'hybrid' ? 'Code de fin, sinon vérification manuelle' : 'Vérification manuelle par l’équipe'}>
      <div className="flex items-center justify-between rounded-2xl bg-leaf/10 p-4">
        <span className="text-sm font-bold text-leaf-deep">Récompense fixée à l'avance</span>
        <span className="font-display text-2xl font-extrabold text-leaf-deep">+{fcfa(task.rewardAmount, task.currency)}</span>
      </div>

      <h3 className="mt-5 text-sm font-bold">Instructions</h3>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink/75">
        {task.instructions.map((s, i) => <li key={i}>{s}</li>)}
      </ol>

      {task.targetUrl && (
        <a href={task.targetUrl} target="_blank" rel="noreferrer noopener" className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-mist p-3.5 text-sm font-bold text-ink hover:bg-ink/10">
          <span className="truncate">{task.targetUrl}</span><span className="inline-flex shrink-0 items-center gap-1 text-wax-deep">Ouvrir <ExternalLink className="h-4 w-4" /></span>
        </a>
      )}

      {done ? (
        <div className="mt-6 space-y-4">
          <p role="status" className="rounded-2xl bg-leaf/10 p-4 text-[15px] font-semibold text-leaf-deep">{result?.text}</p>
          <Btn kind="ink" onClick={onClose} className="w-full">Fermer</Btn>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <h3 className="text-sm font-bold">Votre preuve</h3>
          <div className="inline-flex rounded-full bg-mist p-1" role="tablist">
            {([['text', 'Texte ou code'], ['url', 'Lien https']] as const).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={type === id} onClick={() => setType(id)} className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${type === id ? 'bg-ink text-white' : 'text-ink/65'}`}>{label}</button>
            ))}
          </div>
          <textarea required rows={3} value={content} onChange={e => setContent(e.target.value)} className={inputCls}
            placeholder={type === 'url' ? 'https://…' : 'Votre code de fin ou un court compte rendu'} />
          <p className="text-xs text-ink/50">Une seule participation par mission. {task.verificationType !== 'manual' ? 'Saisissez le code de fin exactement.' : ''}</p>
          {result && !result.ok && <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-[13px] font-semibold text-rose-700">{result.text}</p>}
          <div className="flex justify-end gap-2.5 pt-1">
            <Btn type="button" kind="ghost" onClick={onClose}>Annuler</Btn>
            <Btn type="submit" disabled={busy || !content.trim()}>{busy ? 'Envoi…' : 'Valider ma participation'}</Btn>
          </div>
        </form>
      )}
    </Modal>
  );
};
