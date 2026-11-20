import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OperatorLogo } from '../../common/OperatorLogo';
import { Btn, fcfa, inputCls, Modal } from '../ui';

type Operator = 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money';
const OPERATORS: Operator[] = ['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money'];

export const WithdrawalModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { currentUser, selectedCountry, wallet, requestWithdrawal } = useApp();
  const [operator, setOperator] = useState<Operator>(currentUser?.defaultPayoutOperator || 'Wave');
  const [amount, setAmount] = useState<number>(selectedCountry.minWithdrawal);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (open) { setMessage(null); setAmount(selectedCountry.minWithdrawal); setOperator(currentUser?.defaultPayoutOperator || 'Wave'); }
  }, [open, selectedCountry.minWithdrawal, currentUser?.defaultPayoutOperator]);

  if (!currentUser) return null;
  const fee = Math.round(amount * (selectedCountry.withdrawalFeePercent / 100));
  const net = amount - fee;
  const invalid = amount < selectedCountry.minWithdrawal || amount > wallet.availableBalance || !currentUser.isEmailVerified;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || invalid) return;
    setBusy(true);
    const res = await requestWithdrawal(operator, currentUser.phone, Number(amount));
    setBusy(false);
    if (res.success) { alert(res.message); onClose(); } else { setMessage({ ok: false, text: res.message }); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Retrait Mobile Money" subtitle="Chaque demande est contrôlée avant paiement.">
      {currentUser.subscriptionPlan === 'premium' && (
        <p className="mb-4 flex items-start gap-2 rounded-2xl bg-sun/25 p-3.5 text-[13px] leading-relaxed"><Zap className="mt-0.5 h-4 w-4 shrink-0" />Le virement est effectué sur le numéro Mobile Money de votre inscription, après contrôle.</p>
      )}
      <form onSubmit={submit} className="space-y-5">
        <fieldset>
          <legend className="text-sm font-bold">Opérateur de réception</legend>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            {OPERATORS.map(op => (
              <button type="button" key={op} onClick={() => setOperator(op)} aria-pressed={operator === op}
                className={`flex items-center gap-2.5 rounded-2xl border-2 p-2.5 text-left transition ${operator === op ? 'border-wax bg-wax/8' : 'border-ink/10 hover:border-ink/30'}`}>
                <OperatorLogo operator={op} variant="icon" size="sm" />
                <span className="text-[13px] font-bold leading-tight">{op}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm font-bold">Numéro Mobile Money du bénéficiaire
          <input type="tel" readOnly value={currentUser.phone} className={`${inputCls} bg-mist text-ink/70`} />
          <span className="mt-1 block text-xs font-normal text-ink/50">Le virement part vers le numéro de votre inscription.</span>
        </label>

        <label className="block text-sm font-bold">
          <span className="flex items-center justify-between"><span>Montant à retirer ({selectedCountry.currency === 'XOF' ? 'FCFA' : selectedCountry.currency})</span><span className="text-xs font-normal text-ink/50">Max : {wallet.availableBalance.toLocaleString('fr-FR')}</span></span>
          <input type="number" min={selectedCountry.minWithdrawal} max={wallet.availableBalance} step={500} value={amount} onChange={e => setAmount(Number(e.target.value))} className={inputCls} />
        </label>

        <dl className="space-y-2 rounded-2xl bg-mist p-4 text-[14px]">
          <div className="flex justify-between"><dt className="text-ink/65">Montant brut</dt><dd className="font-bold">{fcfa(amount, selectedCountry.currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink/65">Frais de transfert ({selectedCountry.withdrawalFeePercent} %)</dt><dd className="font-bold">− {fcfa(fee, selectedCountry.currency)}</dd></div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base"><dt className="font-bold">Net reçu</dt><dd className="font-display font-extrabold text-leaf-deep">{fcfa(Math.max(0, net), selectedCountry.currency)}</dd></div>
        </dl>

        {!currentUser.isEmailVerified && <p role="alert" className="rounded-2xl bg-amber-50 p-3 text-[13px] font-semibold text-amber-900">Confirmez d'abord votre adresse e-mail pour retirer.</p>}
        {amount < selectedCountry.minWithdrawal && <p className="text-[13px] font-semibold text-rose-600">Montant minimum : {fcfa(selectedCountry.minWithdrawal, selectedCountry.currency)}.</p>}
        {amount > wallet.availableBalance && <p className="text-[13px] font-semibold text-rose-600">Montant supérieur à votre solde disponible.</p>}
        {message && <p role="alert" className={`rounded-2xl p-3 text-[13px] font-semibold ${message.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{message.text}</p>}

        <Btn type="submit" disabled={invalid || busy} className="w-full py-3.5 text-base">{busy ? 'Envoi…' : 'Confirmer la demande de retrait'}</Btn>
      </form>
    </Modal>
  );
};
