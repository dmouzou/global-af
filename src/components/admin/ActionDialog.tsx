import React, { useEffect, useState } from 'react';
import { Btn, inputCls, Modal } from '../dashboard/ui';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  /** Libellé du champ ; absent = simple confirmation. */
  fieldLabel?: string;
  placeholder?: string;
  confirmLabel: string;
  danger?: boolean;
  minLength?: number;
  onConfirm: (value: string) => Promise<string | null>;
  onClose: () => void;
}

/** Remplace window.prompt / confirm : un champ obligatoire, une erreur lisible, utilisable au doigt. */
export const ActionDialog: React.FC<Props> = ({ open, title, description, fieldLabel, placeholder, confirmLabel, danger, minLength = 3, onConfirm, onClose }) => {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (open) { setValue(''); setError(null); setBusy(false); } }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldLabel && value.trim().length < minLength) { setError(`Saisissez au moins ${minLength} caractères.`); return; }
    setBusy(true);
    const err = await onConfirm(value.trim());
    setBusy(false);
    if (err) setError(err); else onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={submit} className="space-y-4">
        {description && <p className="text-[15px] leading-relaxed text-ink/70">{description}</p>}
        {fieldLabel && (
          <label className="block text-sm font-bold">{fieldLabel}
            <input autoFocus value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className={inputCls} />
          </label>
        )}
        {error && <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-[14px] font-semibold text-rose-700">{error}</p>}
        <div className="flex justify-end gap-2.5">
          <Btn type="button" kind="ghost" onClick={onClose}>Annuler</Btn>
          <Btn type="submit" disabled={busy} className={danger ? '!bg-rose-600 hover:!bg-rose-700' : ''}>{busy ? 'Envoi…' : confirmLabel}</Btn>
        </div>
      </form>
    </Modal>
  );
};
