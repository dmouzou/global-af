import React, { useState } from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { POLICY } from '../../../lib/policy';
import { Btn, fcfa, inputCls, Modal, PageTitle, Panel } from '../ui';

const formatDay = (d: Date) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export const SettingsTab: React.FC<{ onRenew: () => void }> = ({ onRenew }) => {
  const { currentUser, selectedCountry, updateMonthlySpendingLimit, requestRetractionRefund } = useApp();
  const [limit, setLimit] = useState<number>(currentUser?.spendingLimitMonthly || 100000);
  const [limitMsg, setLimitMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [reason, setReason] = useState('Je souhaite exercer mon droit de rétractation de 7 jours');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [retractMsg, setRetractMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  if (!currentUser) return null;

  const hasSub = currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business';
  const expiry = currentUser.subscriptionExpiresAt ? new Date(currentUser.subscriptionExpiresAt) : null;
  const daysLeft = expiry ? Math.ceil((expiry.getTime() - Date.now()) / 86400000) : null;

  const saveLimit = async () => {
    setBusy(true);
    const res = await updateMonthlySpendingLimit(limit);
    setBusy(false);
    setLimitMsg({ ok: res.success, text: res.message });
  };
  const retract = async () => {
    setBusy(true);
    const res = await requestRetractionRefund(reason);
    setBusy(false);
    setConfirmOpen(false);
    setRetractMsg({ ok: res.success, text: res.message });
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Paramètres" subtitle="Votre protection financière, votre accès et votre droit de rétractation." />

      <Panel>
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-leaf/12 text-leaf-deep"><ShieldCheck className="h-5 w-5" /></span><h2 className="font-display text-xl font-extrabold">Plafond de dépense mensuel</h2></div>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/65">Fixez le maximum que vous acceptez de dépenser chaque mois sur AH GLOBAL. Une baisse s'applique tout de suite ; une hausse prend effet après 24 heures. Aucune incitation à l'endettement n'est tolérée.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="rounded-2xl bg-mist p-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-ink/45">Plafond actuel</p>
            <p className="mt-1 font-display text-2xl font-extrabold">{fcfa(currentUser.spendingLimitMonthly, selectedCountry.currency)}</p>
            <p className="mt-1 text-[13px] text-ink/55">Dépensé ce mois-ci : {fcfa(currentUser.spentThisMonth, selectedCountry.currency)}
              {currentUser.pendingSpendingLimit && ` · hausse à ${currentUser.pendingSpendingLimit.amount.toLocaleString('fr-FR')} en attente (effective le ${new Date(currentUser.pendingSpendingLimit.effectiveAtMs).toLocaleString('fr-FR')})`}</p>
          </div>
          <div className="flex items-end gap-2.5">
            <label className="text-sm font-bold">Nouveau plafond<input type="number" step={10000} min={10000} max={1000000} value={limit} onChange={e => setLimit(Number(e.target.value))} className={`${inputCls} w-40`} /></label>
            <Btn onClick={saveLimit} disabled={busy}>Enregistrer</Btn>
          </div>
        </div>
        {limitMsg && <p role="status" className={`mt-4 rounded-2xl p-3 text-[14px] font-semibold ${limitMsg.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{limitMsg.text}</p>}
      </Panel>

      <Panel>
        <h2 className="font-display text-xl font-extrabold">Mon accès</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          {hasSub && expiry ? (<>
            <strong>Abonnement {currentUser.subscriptionPlan === 'business' ? 'Business' : 'Premium'} actif</strong> jusqu'au <strong>{formatDay(expiry)}</strong>
            {daysLeft !== null && ` (${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''})`}. Chaque période dure {POLICY.subscriptionDays} jours. Le renouvellement est manuel : aucun prélèvement automatique, et un renouvellement avant l'échéance prolonge sans perdre de jours.
          </>) : currentUser.entryPass ? (
            <>Pass d'entrée actif, sans limite de durée. Vous pouvez en plus souscrire un abonnement Premium ({POLICY.subscriptionDays} jours, renouvelable à la main).</>
          ) : (
            <>Aucun Pass actif : missions, formations et retraits sont bloqués. Vos soldes sont conservés.</>
          )}
        </p>
        {(hasSub || !currentUser.entryPass) && <Btn kind="ink" className="mt-4" onClick={onRenew}>{hasSub ? 'Renouveler mon abonnement' : "Voir l'abonnement Premium"}</Btn>}
      </Panel>

      <Panel>
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-wax/12 text-wax-deep"><RotateCcw className="h-5 w-5" /></span><h2 className="font-display text-xl font-extrabold">Rétractation du Pass d'entrée ({POLICY.retractionDays} jours)</h2></div>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">Vous pouvez vous rétracter pendant {POLICY.retractionDays} jours à compter du paiement du Pass. Le remboursement est versé sur votre moyen de paiement, sous déduction des frais de transaction ({POLICY.refundFeePercent} %).</p>
        <p className="mt-3 max-w-2xl rounded-2xl bg-sun/20 p-3.5 text-[14px] leading-relaxed"><strong>VIP Premium :</strong> l'abonnement n'est pas remboursable, car l'accès aux fichiers, contacts et outils est immédiat et définitif.</p>
        {currentUser.entryPass ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-bold text-leaf-deep">Pass d'entrée actif (activé le {currentUser.activationDate ?? 'récemment'})</p>
            <label className="block text-sm font-bold">Motif<input value={reason} onChange={e => setReason(e.target.value)} className={inputCls} /></label>
            <Btn kind="ghost" onClick={() => setConfirmOpen(true)} className="!text-rose-700 ring-rose-200 hover:ring-rose-400">Demander la rétractation de mon Pass</Btn>
          </div>
        ) : (
          <p className="mt-4 text-[15px] text-ink/60">{hasSub ? "Votre abonnement n'est pas remboursable : seul le Pass d'entrée ouvre un droit de rétractation." : "Aucun Pass d'entrée actif à rétracter."}</p>
        )}
        {retractMsg && <p role="status" className={`mt-4 rounded-2xl p-3 text-[14px] font-semibold ${retractMsg.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{retractMsg.text}</p>}
      </Panel>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirmer la rétractation ?">
        <p className="text-[15px] leading-relaxed text-ink/70">La rétractation désactivera vos accès (missions, formations, retraits). Le remboursement sera le montant payé moins {POLICY.refundFeePercent} % de frais de transaction.</p>
        <div className="mt-5 flex justify-end gap-2.5"><Btn kind="ghost" onClick={() => setConfirmOpen(false)}>Annuler</Btn><Btn onClick={retract} disabled={busy} className="!bg-rose-600 hover:!bg-rose-700">{busy ? 'Envoi…' : 'Oui, me rétracter'}</Btn></div>
      </Modal>
    </div>
  );
};
