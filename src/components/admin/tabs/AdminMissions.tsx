import React, { useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import { useApp, NewMission } from '../../../context/AppContext';
import { Task, TaskCategory, UserLevel } from '../../../types';
import { Btn, EmptyState, fcfa, inputCls, Modal, PageTitle, Panel, Pill } from '../../dashboard/ui';

const CATEGORIES: { id: TaskCategory; label: string }[] = [
  { id: 'survey', label: 'Sondage' }, { id: 'app_test', label: "Test d'application" }, { id: 'social_visit', label: 'Découverte vidéo / page' },
  { id: 'content_review', label: 'Revue de contenu' }, { id: 'partner_campaign', label: 'Campagne partenaire' }, { id: 'quiz_challenge', label: 'Quiz' },
];
const LEVELS: UserLevel[] = ['Starter', 'Bronze', 'Silver', 'Gold', 'Platinum'];
const STATUS_LABEL: Record<string, string> = { published: 'Publiée', draft: 'Brouillon', paused: 'En pause', archived: 'Archivée' };
const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

interface Form {
  title: string; category: TaskCategory; reward: number; quota: number; desc: string; inst1: string; inst2: string;
  verification: 'automatic' | 'manual' | 'hybrid'; level: UserLevel; start: string; end: string; countries: string;
  platform: '' | 'Web' | 'YouTube' | 'TikTok' | 'PlayStore' | 'Autre'; url: string; code: string; premium: boolean; publish: boolean;
}
const EMPTY: Form = { title: '', category: 'survey', reward: 600, quota: 100, desc: '', inst1: '', inst2: '', verification: 'manual', level: 'Starter', start: today(), end: inDays(30), countries: 'CI', platform: '', url: '', code: '', premium: false, publish: true };

export const AdminMissions: React.FC = () => {
  const { adminMissions, createTaskAdmin, setMissionStatusAdmin, selectedCountry } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [f, setF] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(p => ({ ...p, [k]: v }));

  const startNew = () => { setEditing(null); setF({ ...EMPTY, start: today(), end: inDays(30) }); setMsg(null); setOpen(true); };
  const startEdit = (m: Task) => {
    setEditing(m.id);
    setF({ title: m.title, category: m.category, reward: m.rewardAmount, quota: m.quotaMax, desc: m.description, inst1: m.instructions[0] || '', inst2: m.instructions[1] || '', verification: m.verificationType, level: m.requiredLevel, start: m.startDate, end: m.endDate, countries: m.countries.join(', '), platform: (m.targetPlatform as Form['platform']) || '', url: m.targetUrl || '', code: '', premium: m.isPremiumOnly, publish: m.status === 'published' });
    setMsg(null); setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const mission: NewMission = {
      title: f.title, category: f.category, description: f.desc, instructions: [f.inst1, f.inst2].filter(Boolean),
      rewardAmount: Number(f.reward), currency: selectedCountry.currency, quotaMax: Number(f.quota), requiredLevel: f.level,
      countries: f.countries.split(/[\s,;]+/).map(c => c.trim().toUpperCase()).filter(Boolean) as Task['countries'],
      isPremiumOnly: f.premium, startDate: f.start, endDate: f.end, targetPlatform: f.platform || undefined, targetUrl: f.url.trim() || undefined,
      verificationType: f.verification, completionCode: f.verification === 'manual' ? undefined : f.code.trim() || undefined, status: f.publish ? 'published' : 'draft',
    };
    const res = await createTaskAdmin(mission, editing || undefined);
    setBusy(false);
    if (res.success) setOpen(false); else setMsg({ ok: false, text: res.message });
  };
  const status = async (m: Task, s: Task['status'], confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    const r = await setMissionStatusAdmin(m.id, s);
    if (!r.success) setMsg({ ok: false, text: r.message });
  };

  return (
    <div className="space-y-5">
      <PageTitle title="Missions" subtitle="Une fois qu'un membre a participé, la récompense et le mode de vérification sont verrouillés : elle est publiée à l'avance."
        action={<Btn onClick={startNew}><Plus className="h-4 w-4" />Nouvelle mission</Btn>} />
      {msg && !open && <p role="alert" className="rounded-2xl bg-rose-50 p-3.5 text-[14px] font-semibold text-rose-700">{msg.text}</p>}

      {adminMissions.length === 0 ? <EmptyState title="Aucune mission" text="Créez la première : choisissez la récompense, le quota, la période et le mode de vérification." mood="wave" prop="coin" action={<Btn onClick={startNew}>Créer une mission</Btn>} /> : (
        <ul className="space-y-3">
          {adminMissions.map(m => (
            <li key={m.id}><Panel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0"><p className="font-display text-lg font-bold leading-snug">{m.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/55"><span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" />{m.startDate} → {m.endDate}</span><span>{m.countries.join(', ')}</span><span>{m.quotaCurrent}/{m.quotaMax} participations</span></p></div>
                <div className="text-right"><p className="font-display text-xl font-extrabold text-leaf-deep">{fcfa(m.rewardAmount, m.currency)}</p><Pill tone={m.status === 'published' ? 'leaf' : m.status === 'archived' ? 'mist' : 'sun'}>{STATUS_LABEL[m.status]}</Pill></div>
              </div>
              {m.status !== 'archived' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Btn kind="ghost" onClick={() => startEdit(m)}>Modifier</Btn>
                  {(m.status === 'draft' || m.status === 'paused') && <Btn onClick={() => status(m, 'published')}>Publier</Btn>}
                  {m.status === 'published' && <Btn kind="ghost" onClick={() => status(m, 'paused')}>Mettre en pause</Btn>}
                  <Btn kind="ghost" className="!text-rose-700" onClick={() => status(m, 'archived', 'Archiver cette mission ? Cette action est définitive.')}>Archiver</Btn>
                </div>
              )}
            </Panel></li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} wide title={editing ? 'Modifier la mission' : 'Nouvelle mission'}>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold sm:col-span-2">Titre<input required value={f.title} onChange={e => set('title', e.target.value)} className={inputCls} /></label>
          <label className="text-sm font-bold">Catégorie<select value={f.category} onChange={e => set('category', e.target.value as TaskCategory)} className={inputCls}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
          <label className="text-sm font-bold">Vérification<select value={f.verification} onChange={e => set('verification', e.target.value as Form['verification'])} className={inputCls}><option value="manual">Manuelle (équipe)</option><option value="automatic">Automatique (code de fin exact)</option><option value="hybrid">Mixte (code exact, sinon revue)</option></select></label>
          <label className="text-sm font-bold">Récompense ({selectedCountry.currency === 'XOF' ? 'FCFA' : selectedCountry.currency})<input required type="number" min={100} step={50} value={f.reward} onChange={e => set('reward', Number(e.target.value))} className={inputCls} /></label>
          <label className="text-sm font-bold">Quota de participants<input required type="number" min={1} value={f.quota} onChange={e => set('quota', Number(e.target.value))} className={inputCls} /></label>
          <label className="text-sm font-bold sm:col-span-2">Description<textarea required rows={3} value={f.desc} onChange={e => set('desc', e.target.value)} className={inputCls} /></label>
          <label className="text-sm font-bold">Consigne 1<input required value={f.inst1} onChange={e => set('inst1', e.target.value)} className={inputCls} /></label>
          <label className="text-sm font-bold">Consigne 2<input value={f.inst2} onChange={e => set('inst2', e.target.value)} className={inputCls} /></label>
          <label className="text-sm font-bold">Début<input required type="date" value={f.start} onChange={e => set('start', e.target.value)} className={inputCls} /></label>
          <label className="text-sm font-bold">Fin<input required type="date" value={f.end} onChange={e => set('end', e.target.value)} className={inputCls} /></label>
          <label className="text-sm font-bold">Pays (codes ISO)<input required value={f.countries} onChange={e => set('countries', e.target.value)} className={`${inputCls} font-mono`} /></label>
          <label className="text-sm font-bold">Niveau requis<select value={f.level} onChange={e => set('level', e.target.value as UserLevel)} className={inputCls}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select></label>
          <label className="text-sm font-bold">Plateforme (facultatif)<select value={f.platform} onChange={e => set('platform', e.target.value as Form['platform'])} className={inputCls}><option value="">Aucune</option>{['Web', 'YouTube', 'TikTok', 'PlayStore', 'Autre'].map(p => <option key={p}>{p}</option>)}</select></label>
          <label className="text-sm font-bold">Lien https (facultatif)<input type="url" value={f.url} onChange={e => set('url', e.target.value)} placeholder="https://…" className={inputCls} /></label>
          {f.verification !== 'manual' && (
            <label className="text-sm font-bold sm:col-span-2">Code de fin (8 à 40 caractères : lettres, chiffres, tirets){editing ? ' · à ressaisir à chaque modification' : ''}
              <input required value={f.code} onChange={e => set('code', e.target.value)} className={`${inputCls} font-mono`} />
              <span className="mt-1 block text-xs font-normal text-ink/50">Jamais visible par les membres : le serveur le compare à leur saisie.</span></label>
          )}
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={f.premium} onChange={e => set('premium', e.target.checked)} className="h-4 w-4 accent-wax" />Réservée Premium / Business</label>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={f.publish} onChange={e => set('publish', e.target.checked)} className="h-4 w-4 accent-wax" />Publier maintenant (sinon brouillon)</label>
          {msg && <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-[14px] font-semibold text-rose-700 sm:col-span-2">{msg.text}</p>}
          <div className="flex justify-end gap-2.5 sm:col-span-2"><Btn type="button" kind="ghost" onClick={() => setOpen(false)}>Annuler</Btn><Btn type="submit" disabled={busy}>{busy ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer la mission'}</Btn></div>
        </form>
      </Modal>
    </div>
  );
};
