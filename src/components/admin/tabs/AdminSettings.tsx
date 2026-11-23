import React, { useCallback, useEffect, useState } from 'react';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, adminUpdateCountryConfigCallable, adminUpdatePlatformConfigCallable } from '../../../lib/firebase';
import { Btn, inputCls, PageTitle, Panel, Pill } from '../../dashboard/ui';
import { ActionDialog } from '../ActionDialog';

interface Platform {
  retractionDays: number; subscriptionDays: number; refundFeeBps: number;
  aiDailyQuota: { standard: number; premium: number; business: number };
  affiliation: { level1Bps: number; level2Bps: number; maxTotalBps: number };
}
interface Country { code: string; enabled: boolean; withdrawal: { minAmount: number; maxAmount: number | null; feeBps: number } }
interface HistoryItem { id: string; scope: string; reason: string; createdAt: string; changes: { field: string; from: unknown; to: unknown }[] }

const pct = (bps: number) => bps / 100;
const bps = (p: number) => Math.round(p * 100);
const LABEL: Record<string, string> = {
  'affiliation.level1Bps': 'Commission sur le Pass', 'affiliation.level2Bps': 'Commission sur la 1re commande', 'affiliation.maxTotalBps': 'Plafond de commission',
  refundFeeBps: 'Frais de remboursement', subscriptionDays: "Durée d'abonnement", retractionDays: 'Délai de rétractation',
  'aiDailyQuota.standard': 'Quota IA Pass', 'aiDailyQuota.premium': 'Quota IA Premium', 'aiDailyQuota.business': 'Quota IA Business',
  enabled: 'Pays ouvert', 'withdrawal.minAmount': 'Retrait minimum', 'withdrawal.maxAmount': 'Plafond par retrait', 'withdrawal.feeBps': 'Frais de retrait',
};
const show = (field: string, v: unknown) => v === null ? 'aucun' : typeof v === 'boolean' ? (v ? 'oui' : 'non') : field.endsWith('Bps') ? `${pct(Number(v))} %` : String(v);

const Num: React.FC<{ label: string; value: string; onChange: (v: string) => void; suffix?: string; hint?: string; step?: string }> = ({ label, value, onChange, suffix, hint, step = '1' }) => (
  <label className="block text-sm font-bold">{label}
    <div className="relative"><input type="number" inputMode="decimal" step={step} min={0} value={value} onChange={e => onChange(e.target.value)} className={`${inputCls} ${suffix ? 'pr-14' : ''}`} />
      {suffix && <span className="pointer-events-none absolute right-4 top-1/2 mt-0.5 -translate-y-1/2 text-sm font-semibold text-ink/45">{suffix}</span>}</div>
    {hint && <span className="mt-1 block text-xs font-normal text-ink/50">{hint}</span>}
  </label>
);

export const AdminSettings: React.FC = () => {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  // formulaire (chaînes pour une saisie fluide)
  const [f, setF] = useState<Record<string, string>>({});
  const [enabled, setEnabled] = useState(true);
  const [pending, setPending] = useState<{ scope: 'platform' | 'country'; patch: Record<string, unknown>; summary: string[] } | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([getDoc(doc(db, 'config', 'platform')), getDoc(doc(db, 'countries', 'CI'))]);
      if (!p.exists() || !c.exists()) { setLoadError("La configuration n'existe pas encore : lancez le script de seed."); return; }
      const pd = p.data() as Platform; const cd = c.data() as Country;
      setPlatform(pd); setCountry(cd); setEnabled(cd.enabled);
      setF({
        l1: String(pct(pd.affiliation.level1Bps)), l2: String(pct(pd.affiliation.level2Bps)), cap: String(pct(pd.affiliation.maxTotalBps)), refund: String(pct(pd.refundFeeBps)),
        retr: String(pd.retractionDays), sub: String(pd.subscriptionDays), qs: String(pd.aiDailyQuota.standard), qp: String(pd.aiDailyQuota.premium), qb: String(pd.aiDailyQuota.business),
        wmin: String(cd.withdrawal.minAmount), wmax: cd.withdrawal.maxAmount === null ? '' : String(cd.withdrawal.maxAmount), wfee: String(pct(cd.withdrawal.feeBps)),
      });
      setLoadError(null);
    } catch { setLoadError('Lecture de la configuration impossible.'); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => onSnapshot(query(collection(db, 'configHistory'), orderBy('createdAt', 'desc'), limit(20)), snap =>
    setHistory(snap.docs.map(d => { const x = d.data() as any; return { id: d.id, scope: x.scope, reason: x.reason, changes: x.changes || [], createdAt: x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('fr-FR') : '' }; })), () => {}), []);

  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const n = (k: string) => Number(f[k]);

  const prepare = (scope: 'platform' | 'country') => {
    if (!platform || !country) return;
    const patch: Record<string, unknown> = {}; const summary: string[] = [];
    const add = (path: string, label: string, from: unknown, to: unknown, target: Record<string, unknown>, key: string, sub?: string) => {
      if (from === to) return;
      if (sub) { (target[sub] = (target[sub] as Record<string, unknown>) || {}); (target[sub] as Record<string, unknown>)[key] = to; } else target[key] = to;
      summary.push(`${label} : ${show(path, from)} → ${show(path, to)}`);
    };
    if (scope === 'platform') {
      add('affiliation.level1Bps', 'Commission sur le Pass', platform.affiliation.level1Bps, bps(n('l1')), patch, 'level1Bps', 'affiliation');
      add('affiliation.level2Bps', 'Commission sur la 1re commande', platform.affiliation.level2Bps, bps(n('l2')), patch, 'level2Bps', 'affiliation');
      add('affiliation.maxTotalBps', 'Plafond de commission', platform.affiliation.maxTotalBps, bps(n('cap')), patch, 'maxTotalBps', 'affiliation');
      add('refundFeeBps', 'Frais de remboursement', platform.refundFeeBps, bps(n('refund')), patch, 'refundFeeBps');
      add('retractionDays', 'Délai de rétractation (jours)', platform.retractionDays, n('retr'), patch, 'retractionDays');
      add('subscriptionDays', "Durée d'abonnement (jours)", platform.subscriptionDays, n('sub'), patch, 'subscriptionDays');
      add('aiDailyQuota.standard', 'Quota IA Pass', platform.aiDailyQuota.standard, n('qs'), patch, 'standard', 'aiDailyQuota');
      add('aiDailyQuota.premium', 'Quota IA Premium', platform.aiDailyQuota.premium, n('qp'), patch, 'premium', 'aiDailyQuota');
      add('aiDailyQuota.business', 'Quota IA Business', platform.aiDailyQuota.business, n('qb'), patch, 'business', 'aiDailyQuota');
    } else {
      add('enabled', 'Pays ouvert', country.enabled, enabled, patch, 'enabled');
      add('withdrawal.minAmount', 'Retrait minimum', country.withdrawal.minAmount, n('wmin'), patch, 'minAmount', 'withdrawal');
      add('withdrawal.maxAmount', 'Plafond par retrait', country.withdrawal.maxAmount, f.wmax === '' ? null : n('wmax'), patch, 'maxAmount', 'withdrawal');
      add('withdrawal.feeBps', 'Frais de retrait', country.withdrawal.feeBps, bps(n('wfee')), patch, 'feeBps', 'withdrawal');
    }
    if (summary.length === 0) { setFlash({ ok: false, text: 'Aucun changement à enregistrer.' }); return; }
    setFlash(null); setPending({ scope, patch, summary });
  };

  const confirm = async (reason: string): Promise<string | null> => {
    if (!pending) return null;
    try {
      if (pending.scope === 'platform') await adminUpdatePlatformConfigCallable({ patch: pending.patch, reason });
      else await adminUpdateCountryConfigCallable({ code: 'CI', patch: pending.patch, reason });
      setFlash({ ok: true, text: 'Paramètres enregistrés. Ils s’appliquent aux opérations futures ; l’historique a été mis à jour.' });
      await load();
      return null;
    } catch (e: any) { return e?.message || "L'enregistrement a échoué."; }
  };

  if (loadError) return <div className="space-y-5"><PageTitle title="Paramètres" /><p role="alert" className="rounded-2xl bg-rose-50 p-4 text-[15px] font-semibold text-rose-700">{loadError}</p></div>;
  if (!platform || !country) return <div className="space-y-5"><PageTitle title="Paramètres" /><p className="text-ink/60">Chargement…</p></div>;

  return (
    <div className="space-y-6">
      <PageTitle title="Paramètres" subtitle="Réservé au super administrateur. Chaque modification exige un motif, est bornée par des plafonds de sécurité, s'applique aux opérations futures seulement et reste dans l'historique." />
      {flash && <p role={flash.ok ? 'status' : 'alert'} className={`rounded-2xl p-3.5 text-[14px] font-semibold ${flash.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{flash.text}</p>}

      <Panel>
        <h2 className="font-display text-xl font-extrabold">Parrainage, remboursement, abonnement et IA</h2>
        <p className="mt-1 text-[14px] text-ink/60">Parrainage direct sur un seul niveau (non modifiable ici). Plafond de sécurité du code : 30 % par commission.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Num label="Commission sur le Pass" suffix="%" step="0.5" value={f.l1} onChange={set('l1')} hint="Sur le prix du Pass activé par le filleul" />
          <Num label="Commission sur la 1re commande" suffix="%" step="0.5" value={f.l2} onChange={set('l2')} hint="Sur la première commande réelle du filleul" />
          <Num label="Plafond de commission" suffix="%" step="0.5" value={f.cap} onChange={set('cap')} hint="Aucune commission ne peut dépasser ce plafond" />
          <Num label="Frais de remboursement" suffix="%" step="0.5" value={f.refund} onChange={set('refund')} hint="Retenus à la rétractation du Pass (max 20 %)" />
          <Num label="Délai de rétractation" suffix="jours" value={f.retr} onChange={set('retr')} hint="Entre 7 et 14 jours" />
          <Num label="Durée d'un abonnement" suffix="jours" value={f.sub} onChange={set('sub')} />
          <Num label="Quota IA / jour : Pass" value={f.qs} onChange={set('qs')} />
          <Num label="Quota IA / jour : Premium" value={f.qp} onChange={set('qp')} />
          <Num label="Quota IA / jour : Business" value={f.qb} onChange={set('qb')} />
        </div>
        <Btn className="mt-5" onClick={() => prepare('platform')}>Vérifier et enregistrer</Btn>
      </Panel>

      <Panel>
        <div className="flex items-center gap-2"><h2 className="font-display text-xl font-extrabold">Pays : Côte d'Ivoire</h2><Pill tone={country.enabled ? 'leaf' : 'rose'}>{country.enabled ? 'Ouvert' : 'Fermé'}</Pill></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Num label="Retrait minimum" suffix="FCFA" step="100" value={f.wmin} onChange={set('wmin')} />
          <Num label="Plafond par retrait" suffix="FCFA" step="1000" value={f.wmax} onChange={set('wmax')} hint="Vide = aucun plafond" />
          <Num label="Frais de retrait" suffix="%" step="0.1" value={f.wfee} onChange={set('wfee')} hint="Max 10 %" />
        </div>
        <label className="mt-4 flex items-start gap-3 rounded-2xl bg-sun/20 p-3.5 text-[14px]"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="mt-1 h-4 w-4 accent-wax" /><span><strong>Pays ouvert.</strong> Décocher bloque les inscriptions, les paiements et les retraits dans ce pays.</span></label>
        <Btn className="mt-5" onClick={() => prepare('country')}>Vérifier et enregistrer</Btn>
      </Panel>

      <Panel>
        <h2 className="font-display text-xl font-extrabold">Historique des modifications</h2>
        {history.length === 0 ? <p className="mt-3 text-[15px] text-ink/60">Aucune modification depuis la mise en place.</p> : (
          <ul className="mt-3 divide-y divide-ink/8">
            {history.map(h => (
              <li key={h.id} className="py-3.5">
                <div className="flex flex-wrap items-center gap-2"><Pill>{h.scope}</Pill><span className="text-[13px] text-ink/50">{h.createdAt}</span></div>
                <ul className="mt-1.5 space-y-0.5 text-[14px]">{h.changes.map((c, i) => <li key={i}><strong>{LABEL[c.field] ?? c.field}</strong> : {show(c.field, c.from)} → {show(c.field, c.to)}</li>)}</ul>
                <p className="mt-1 text-[13px] italic text-ink/55">Motif : {h.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <ActionDialog open={!!pending} onClose={() => setPending(null)} minLength={10} fieldLabel="Motif de la modification (obligatoire, conservé dans l'historique)" confirmLabel="Enregistrer"
        title="Confirmer les modifications"
        description={pending ? `${pending.summary.join(' · ')}. Ces valeurs s'appliqueront aux opérations futures.` : ''} onConfirm={confirm} />
    </div>
  );
};
