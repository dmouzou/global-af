import React, { useEffect, useState } from 'react';
import { Check, Info } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { POLICY } from '../../../lib/policy';
import { Btn, inputCls, Modal } from '../ui';

export type ActivationPlan = 'standard' | 'premium';

interface Props {
  open: boolean;
  plan: ActivationPlan;
  onPlanChange: (p: ActivationPlan) => void;
  onClose: () => void;
}

export const ActivationModal: React.FC<Props> = ({ open, plan, onPlanChange, onClose }) => {
  const { currentUser, startActivationPayment } = useApp();
  const [method, setMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(currentUser?.city || '');
  const [zip, setZip] = useState('');
  const [acceptNoRefund, setAcceptNoRefund] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (open) { setError(null); setCity(c => c || currentUser?.city || ''); } }, [open, currentUser?.city]);

  if (!currentUser) return null;
  const hasSubscription = currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business';
  const price = plan === 'standard' ? '3 000 FCFA' : '9 900 FCFA';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await startActivationPayment(
      plan, method,
      method === 'card' ? { address: address.trim(), city: city.trim(), zipCode: zip.trim() } : undefined,
      plan === 'premium' ? acceptNoRefund : undefined,
    );
    setBusy(false);
    if (!res.success) { setError(res.message); return; }
    if (res.checkoutUrl) { window.location.href = res.checkoutUrl; } else { alert(res.message); }
    onClose();
  };

  const card = (on: boolean, color: 'wax' | 'leaf') => `relative w-full rounded-2xl border-2 p-4 text-left transition ${on ? (color === 'wax' ? 'border-wax bg-wax/8' : 'border-leaf bg-leaf/8') : 'border-ink/10 hover:border-ink/30'}`;

  return (
    <Modal open={open} onClose={onClose} wide title={hasSubscription ? 'Renouveler mon abonnement' : 'Activez votre accès'} subtitle="Le contenu, le prix et les conditions sont affichés avant tout paiement.">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {!currentUser.entryPass && (
            <button type="button" onClick={() => onPlanChange('standard')} aria-pressed={plan === 'standard'} className={card(plan === 'standard', 'wax')}>
              <p className="text-xs font-bold uppercase tracking-wider text-wax-deep">Ticket unique</p>
              <p className="mt-1 font-display text-lg font-extrabold">Pass membre</p>
              <p className="font-display text-3xl font-extrabold">3 000 <span className="text-base text-ink/50">FCFA</span></p>
              <ul className="mt-3 space-y-1.5 text-[13px] text-ink/70">
                {['Missions rémunérées (ouverture progressive)', 'Formations de l’Académie', 'Retraits Mobile Money après contrôle'].map(x => <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" strokeWidth={3} />{x}</li>)}
              </ul>
            </button>
          )}
          <button type="button" onClick={() => onPlanChange('premium')} aria-pressed={plan === 'premium'} className={card(plan === 'premium', 'leaf')}>
            <p className="text-xs font-bold uppercase tracking-wider text-leaf-deep">Recommandé</p>
            <p className="mt-1 font-display text-lg font-extrabold">VIP Premium</p>
            <p className="font-display text-3xl font-extrabold">9 900 <span className="text-base text-ink/50">FCFA / {POLICY.subscriptionDays} jours</span></p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-ink/70">
              {[`Abonnement de ${POLICY.subscriptionDays} jours, renouvelable à la main`, 'Missions, formations et retraits pendant la période', 'Outils IA et fichiers VCF : en cours d’ouverture'].map(x => <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" strokeWidth={3} />{x}</li>)}
            </ul>
          </button>
        </div>

        <fieldset>
          <legend className="text-sm font-bold">Moyen de paiement</legend>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            <button type="button" onClick={() => setMethod('mobile_money')} aria-pressed={method === 'mobile_money'} className={card(method === 'mobile_money', 'wax')}>
              <p className="font-bold">Mobile Money</p><p className="text-xs text-ink/55">Wave, Orange Money, MTN MoMo, Moov Money</p>
            </button>
            <button type="button" onClick={() => setMethod('card')} aria-pressed={method === 'card'} className={card(method === 'card', 'wax')}>
              <p className="font-bold">Carte bancaire Visa</p><p className="text-xs text-ink/55">Paiement sur page sécurisée</p>
            </button>
          </div>
          <p className="mt-2 text-[13px] text-ink/55">
            {method === 'mobile_money' ? 'Vous choisirez votre opérateur et confirmerez le paiement sur la page sécurisée CinetPay.' : 'Les données de votre carte sont saisies uniquement sur la page sécurisée CinetPay : AH GLOBAL ne les voit jamais.'}
          </p>
        </fieldset>

        {method === 'card' && (
          <div className="space-y-3 rounded-2xl bg-mist p-4">
            <p className="text-sm font-bold">Adresse de facturation (exigée pour le paiement par carte)</p>
            <input required autoComplete="street-address" placeholder="Adresse" maxLength={120} value={address} onChange={e => setAddress(e.target.value)} className={inputCls} />
            <div className="grid grid-cols-2 gap-3">
              <input required autoComplete="address-level2" placeholder="Ville" maxLength={60} value={city} onChange={e => setCity(e.target.value)} className={inputCls} />
              <input required autoComplete="postal-code" placeholder="Code postal" maxLength={5} value={zip} onChange={e => setZip(e.target.value)} className={inputCls} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-2xl bg-ink p-4 text-white">
          <span className="text-sm text-white/70">Total à régler</span>
          <span className="font-display text-xl font-extrabold">{plan === 'standard' ? '3 000 FCFA' : `9 900 FCFA pour ${POLICY.subscriptionDays} jours`}</span>
        </div>

        {plan === 'standard' ? (
          <p className="flex gap-2 rounded-2xl bg-leaf/10 p-3.5 text-[13px] leading-relaxed text-leaf-deep">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span><strong>Droit de rétractation de {POLICY.retractionDays} jours</strong> depuis « Paramètres ». Remboursement sur votre moyen de paiement, sous déduction des frais de transaction ({POLICY.refundFeePercent} %).</span>
          </p>
        ) : (
          <label className="flex items-start gap-3 rounded-2xl bg-sun/20 p-3.5 text-[13px] leading-relaxed">
            <input type="checkbox" required checked={acceptNoRefund} onChange={e => setAcceptNoRefund(e.target.checked)} className="mt-1 h-4 w-4 accent-wax" />
            <span>Je comprends que l'abonnement VIP Premium donne un <strong>accès immédiat</strong> aux contenus exclusifs et qu'il est <strong>définitif et non remboursable</strong>.</span>
          </label>
        )}

        {error && <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-[13px] font-semibold text-rose-700">{error}</p>}
        <Btn type="submit" disabled={busy} className="w-full py-3.5 text-base">{busy ? 'Ouverture du paiement…' : `Payer ${price} (${method === 'card' ? 'carte Visa' : 'Mobile Money'})`}</Btn>
      </form>
    </Modal>
  );
};
