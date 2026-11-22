import React from 'react';
import { AlertTriangle, ClipboardCheck, FileCheck2, Landmark, ShieldAlert, Users } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { can } from '../../../lib/staff';
import { fcfa, PageTitle, Panel, Pill, Stat } from '../../dashboard/ui';

export const AdminOverview: React.FC<{ onGo: (id: string) => void }> = ({ onGo }) => {
  const { currentUser, adminWithdrawals, adminRefunds, riskAlerts, adminSubmissions, adminMissions, adminUsers, auditLogs } = useApp();
  const role = currentUser?.role;
  const openW = adminWithdrawals.filter(w => ['reserved', 'approved', 'payout_initiated'].includes(w.status));
  const pendingRefunds = adminRefunds.filter(r => r.status === 'pending');
  const openRisks = riskAlerts.filter(r => !r.resolved);

  const cards: React.ReactNode[] = [];
  if (can.finance(role)) {
    cards.push(
      <button key="w" onClick={() => onGo('withdrawals')} className="text-left"><Stat accent="wax" label="Retraits à traiter" value={openW.length} hint={`${fcfa(openW.reduce((s, w) => s + w.amount, 0))} en cours`} /></button>,
      <button key="r" onClick={() => onGo('refunds')} className="text-left"><Stat accent="sun" label="Remboursements à payer" value={pendingRefunds.length} hint={`${fcfa(pendingRefunds.reduce((s, r) => s + r.refundAmount, 0))} à rembourser`} /></button>,
      <button key="k" onClick={() => onGo('risks')} className="text-left"><Stat accent="ink" label="Alertes de risque ouvertes" value={openRisks.length} hint="Aucune alerte n'est générée automatiquement pour l'instant" /></button>,
    );
  }
  if (can.moderation(role)) cards.push(<button key="s" onClick={() => onGo('submissions')} className="text-left"><Stat accent="leaf" label="Preuves à vérifier" value={adminSubmissions.length} hint="Participations en attente de revue" /></button>);
  if (can.content(role)) cards.push(<button key="m" onClick={() => onGo('missions')} className="text-left"><Stat accent="leaf" label="Missions publiées" value={adminMissions.filter(m => m.status === 'published').length} hint={`${adminMissions.filter(m => m.status === 'draft').length} brouillon(s)`} /></button>);
  if (can.support(role)) cards.push(<button key="u" onClick={() => onGo('users')} className="text-left"><Stat accent="ink" label="Membres" value={adminUsers.length} hint={`${adminUsers.filter(u => u.status === 'suspended').length} suspendu(s)`} /></button>);

  return (
    <div className="space-y-6">
      <PageTitle title="Vue d'ensemble" subtitle="Ce qui demande votre attention, selon votre rôle." />
      {cards.length === 0 ? <Panel><p className="text-[15px] text-ink/60">Aucun indicateur n'est associé à votre rôle.</p></Panel> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">{cards}</div>}

      {can.admin(role) && (
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold">Dernières actions sensibles</h2>
            <button onClick={() => onGo('audit')} className="inline-flex min-h-11 items-center text-sm font-bold text-wax-deep hover:underline">Journal complet</button>
          </div>
          {auditLogs.length === 0 ? <p className="mt-3 text-[15px] text-ink/60">Aucune entrée pour le moment.</p> : (
            <ul className="mt-3 divide-y divide-ink/8">
              {auditLogs.slice(0, 5).map(a => (
                <li key={a.id} className="py-3"><div className="flex flex-wrap items-center gap-2"><Pill>{a.action}</Pill><span className="text-[13px] text-ink/50">{a.timestamp} · {a.actorName}</span></div><p className="mt-1 break-words text-[13px] text-ink/65">{a.details}</p></li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <Panel className="!bg-ink !text-white ring-0">
        <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sun" />
          <p className="text-[14px] leading-relaxed text-white/80">Chaque action de cette console est contrôlée côté serveur selon votre rôle, et les actions sensibles sont inscrites dans le journal d'audit. L'interface masque seulement ce que vous ne pouvez pas faire.</p></div>
      </Panel>
      <div className="hidden"><Landmark /><ShieldAlert /><Users /><ClipboardCheck /><FileCheck2 /></div>
    </div>
  );
};
