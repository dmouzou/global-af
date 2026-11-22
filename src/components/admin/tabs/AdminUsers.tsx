import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AdminUser, UserRole } from '../../../types';
import { can, ROLE_LABEL, ROLE_RANK, STAFF_ROLES } from '../../../lib/staff';
import { Btn, EmptyState, inputCls, Modal, PageTitle, Panel, Pill } from '../../dashboard/ui';
import { ActionDialog } from '../ActionDialog';

type Filter = 'all' | 'active' | 'suspended' | 'staff';
const ALL_ROLES = Object.keys(ROLE_LABEL) as UserRole[];

export const AdminUsers: React.FC = () => {
  const { currentUser, adminUsers, setUserStatusAdmin, setUserRoleAdmin } = useApp();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [statusFor, setStatusFor] = useState<{ u: AdminUser; to: 'active' | 'suspended' } | null>(null);
  const [roleFor, setRoleFor] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('member');
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  if (!currentUser) return null;

  const s = q.trim().toLowerCase();
  const list = adminUsers
    .filter(u => (filter === 'all' ? true : filter === 'active' ? u.status === 'active' : filter === 'suspended' ? u.status === 'suspended' : STAFF_ROLES.includes(u.role)))
    .filter(u => !s || `${u.firstName} ${u.lastName} ${u.email} ${u.phone} ${u.memberNumber ?? ''}`.toLowerCase().includes(s))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const mayAct = (u: AdminUser) => can.support(currentUser.role) && u.id !== currentUser.id && ROLE_RANK[currentUser.role] > ROLE_RANK[u.role];

  return (
    <div className="space-y-5">
      <PageTitle title="Membres" subtitle={`${adminUsers.length} compte(s) chargé(s). Une suspension bloque la connexion ; le motif est obligatoire et journalisé.`} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="block flex-1"><span className="sr-only">Rechercher un membre</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Nom, e-mail, téléphone ou n° de membre" className={inputCls} /></label>
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Filtre">
          {([['all', 'Tous'], ['active', 'Actifs'], ['suspended', 'Suspendus'], ['staff', 'Équipe']] as [Filter, string][]).map(([id, label]) => (
            <button key={id} role="tab" aria-selected={filter === id} onClick={() => setFilter(id)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${filter === id ? 'bg-ink text-white' : 'bg-white text-ink/70 ring-1 ring-ink/10'}`}>{label}</button>
          ))}
        </div>
      </div>
      {flash && <p role="status" className={`rounded-2xl p-3.5 text-[14px] font-semibold ${flash.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{flash.text}</p>}

      {list.length === 0 ? <EmptyState title="Aucun membre" text="Modifiez la recherche ou le filtre." /> : (
        <ul className="space-y-3">
          {list.map(u => (
            <li key={u.id}><Panel className="!p-4 sm:!p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold">{u.firstName} {u.lastName}{u.id === currentUser.id && <span className="ml-2 text-xs font-semibold text-ink/45">(vous)</span>}</p>
                  <p className="break-all text-[13px] text-ink/55">{u.email} · {u.phone}</p>
                  <p className="text-[12px] text-ink/45">{u.memberNumber || 'Sans n° de membre'} · {u.country} · inscrit le {u.createdAt || '—'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Pill tone={u.status === 'active' ? 'leaf' : 'rose'}>{u.status === 'active' ? 'Actif' : u.status === 'suspended' ? 'Suspendu' : u.status}</Pill>
                  <Pill>{ROLE_LABEL[u.role] ?? u.role}</Pill>
                  <Pill tone={u.isActivated ? 'sun' : 'mist'}>{u.isActivated ? (u.plan === 'premium' ? 'Premium' : 'Pass actif') : 'Gratuit'}</Pill>
                </div>
              </div>
              {u.status === 'suspended' && u.statusReason && <p className="mt-2 text-[13px] text-rose-700">Motif de suspension : {u.statusReason}</p>}
              {(mayAct(u) || (can.superAdmin(currentUser.role) && u.id !== currentUser.id)) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {mayAct(u) && (u.status === 'suspended'
                    ? <Btn onClick={() => setStatusFor({ u, to: 'active' })}>Réactiver</Btn>
                    : <Btn kind="ghost" className="!text-rose-700" onClick={() => setStatusFor({ u, to: 'suspended' })}>Suspendre</Btn>)}
                  {can.superAdmin(currentUser.role) && u.id !== currentUser.id && <Btn kind="ghost" onClick={() => { setRoleFor(u); setNewRole(u.role); }}>Changer le rôle</Btn>}
                </div>
              )}
            </Panel></li>
          ))}
        </ul>
      )}

      <ActionDialog open={!!statusFor} onClose={() => setStatusFor(null)} danger={statusFor?.to === 'suspended'}
        title={statusFor?.to === 'suspended' ? 'Suspendre ce compte' : 'Réactiver ce compte'}
        description={statusFor ? `${statusFor.u.firstName} ${statusFor.u.lastName}. ${statusFor.to === 'suspended' ? 'Le membre ne pourra plus se connecter. Ses soldes sont conservés.' : 'Le membre pourra de nouveau se connecter.'}` : ''}
        fieldLabel="Motif (obligatoire, journalisé)" minLength={5} confirmLabel={statusFor?.to === 'suspended' ? 'Suspendre' : 'Réactiver'}
        onConfirm={async v => { const r = await setUserStatusAdmin(statusFor!.u.id, statusFor!.to, v); setFlash({ ok: r.success, text: r.message }); return r.success ? null : r.message; }} />

      <Modal open={!!roleFor} onClose={() => setRoleFor(null)} title="Changer le rôle" subtitle={roleFor ? `${roleFor.firstName} ${roleFor.lastName}` : ''}>
        <div className="space-y-4">
          <label className="block text-sm font-bold">Nouveau rôle<select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className={inputCls}>{ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></label>
          <p className="rounded-2xl bg-sun/20 p-3.5 text-[13px] leading-relaxed">Droit critique, réservé au super administrateur et journalisé. La personne doit se reconnecter pour que ses nouveaux droits s'appliquent.</p>
          <div className="flex justify-end gap-2.5"><Btn kind="ghost" onClick={() => setRoleFor(null)}>Annuler</Btn>
            <Btn disabled={!roleFor || newRole === roleFor.role} onClick={async () => { const r = await setUserRoleAdmin(roleFor!.id, newRole); setFlash({ ok: r.success, text: r.message }); setRoleFor(null); }}>Confirmer</Btn></div>
        </div>
      </Modal>
    </div>
  );
};
