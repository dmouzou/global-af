import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OperatorLogo } from '../../common/OperatorLogo';
import { Btn, inputCls, PageTitle, Panel, Pill } from '../ui';

type Op = 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money';
const PLAN: Record<string, string> = { free: 'Compte gratuit', standard: 'Pass membre', premium: 'VIP Premium', business: 'Business' };

export const ProfileTab: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [city, setCity] = useState('');
  const [op, setOp] = useState<Op>('Orange Money');
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setFirst(currentUser.firstName); setLast(currentUser.lastName); setCity(currentUser.city || '');
    setOp(currentUser.defaultPayoutOperator || 'Orange Money'); setBio(currentUser.bio || '');
  }, [currentUser]);

  if (!currentUser) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const res = await updateProfile({ firstName: first, lastName: last, city, defaultPayoutOperator: op, bio });
    setBusy(false);
    setMsg({ ok: res.success, text: res.success ? 'Profil mis à jour.' : res.message });
    if (res.success) setTimeout(() => setMsg(null), 3000);
  };

  const checks = [
    { ok: currentUser.isEmailVerified, t: currentUser.isEmailVerified ? 'E-mail vérifié' : 'E-mail à confirmer', d: currentUser.email },
    { ok: true, t: 'Âge minimum et conditions', d: "18 ans vérifiés et conditions acceptées à l'inscription" },
    { ok: true, t: 'Numéro Mobile Money', d: `${currentUser.phone} · utilisé pour vos retraits, non modifiable en ligne` },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Mon profil" subtitle="Vos coordonnées, votre opérateur de retrait favori et l'état de votre compte." />
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white lg:col-span-2">
          <div className="scarf-ribbon absolute inset-x-0 top-0" aria-hidden="true" />
          <p className="mt-2 font-display text-lg font-extrabold"><span className="text-wax">AH</span> GLOBAL</p>
          <p className="mt-5 font-display text-2xl font-extrabold">{currentUser.firstName} {currentUser.lastName}</p>
          <p className="mt-0.5 text-sm tracking-wider text-sun">{currentUser.memberNumber || 'N° de membre en attente'} · {currentUser.country}</p>
          <dl className="mt-5 space-y-3 border-t border-white/12 pt-4 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-white/55">Offre</dt><dd className="font-bold">{PLAN[currentUser.subscriptionPlan] ?? currentUser.subscriptionPlan}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/55">Mobile Money</dt><dd className="font-bold">{currentUser.phone}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/55">Résidence</dt><dd className="font-bold">{currentUser.city || '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/55">Compte</dt><dd><Pill tone={currentUser.isEmailVerified ? 'sunSolid' : 'mist'}>{currentUser.isEmailVerified ? 'E-mail vérifié' : 'E-mail à confirmer'}</Pill></dd></div>
          </dl>
        </section>

        <Panel className="lg:col-span-3">
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <h2 className="font-display text-xl font-extrabold sm:col-span-2">Mes informations</h2>
            <label className="text-sm font-bold">Prénom<input required value={first} onChange={e => setFirst(e.target.value)} autoComplete="given-name" className={inputCls} /></label>
            <label className="text-sm font-bold">Nom<input required value={last} onChange={e => setLast(e.target.value)} autoComplete="family-name" className={inputCls} /></label>
            <label className="text-sm font-bold sm:col-span-2">Numéro Mobile Money<input readOnly value={currentUser.phone} className={`${inputCls} bg-mist text-ink/60`} /></label>
            <label className="text-sm font-bold">Opérateur de retrait favori
              <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-ink/15 bg-white px-3 py-1.5">
                <OperatorLogo operator={op} variant="icon" size="xs" />
                <select value={op} onChange={e => setOp(e.target.value as Op)} className="min-h-10 w-full bg-transparent text-[15px] outline-none">
                  <option value="Wave">Wave Côte d'Ivoire</option><option value="Orange Money">Orange Money</option><option value="MTN MoMo">MTN MoMo</option><option value="Moov Money">Moov Money</option>
                </select>
              </div>
            </label>
            <label className="text-sm font-bold">Ville ou commune<input value={city} onChange={e => setCity(e.target.value)} autoComplete="address-level2" placeholder="ex. Abidjan (Cocody)" className={inputCls} /></label>
            <label className="text-sm font-bold sm:col-span-2">Activité ou présentation<textarea rows={2} value={bio} onChange={e => setBio(e.target.value)} placeholder="Présentez brièvement vos compétences…" className={inputCls} /></label>
            {msg && <p role={msg.ok ? 'status' : 'alert'} className={`rounded-2xl p-3 text-[14px] font-semibold sm:col-span-2 ${msg.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{msg.text}</p>}
            <div className="sm:col-span-2"><Btn type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? 'Enregistrement…' : 'Enregistrer les modifications'}</Btn></div>
          </form>
        </Panel>
      </div>

      <Panel>
        <h2 className="font-display text-xl font-extrabold">État de votre compte</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {checks.map(c => (
            <li key={c.t} className="flex gap-3 rounded-2xl bg-mist p-4">
              {c.ok ? <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-leaf" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-wax" />}
              <div className="min-w-0"><p className="font-bold">{c.t}</p><p className="break-words text-[13px] leading-snug text-ink/60">{c.d}</p></div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};
