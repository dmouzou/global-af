import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ROLE_LABEL } from '../../../lib/staff';
import { EmptyState, inputCls, PageTitle, Panel, Pill } from '../../dashboard/ui';

export const AdminAudit: React.FC = () => {
  const { auditLogs } = useApp();
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const list = s ? auditLogs.filter(a => `${a.action} ${a.actorName} ${a.details} ${a.complianceRule ?? ''}`.toLowerCase().includes(s)) : auditLogs;
  return (
    <div className="space-y-5">
      <PageTitle title="Journal d'audit" subtitle="Toutes les actions sensibles, de la plus récente à la plus ancienne. Il ne peut ni être modifié ni être effacé." />
      <label className="block max-w-md"><span className="sr-only">Filtrer le journal</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Filtrer : retrait, mission, suspension…" className={inputCls} /></label>
      {list.length === 0 ? <EmptyState title={auditLogs.length ? 'Aucun résultat' : 'Journal vide'} text={auditLogs.length ? 'Essayez un autre mot.' : "Les actions sensibles s'inscriront ici."} /> : (
        <ul className="space-y-2.5">
          {list.map(a => (
            <li key={a.id}><Panel className="!p-4">
              <div className="flex flex-wrap items-center gap-2"><Pill tone="ink">{a.action}</Pill>{a.complianceRule && <Pill>{a.complianceRule}</Pill>}<span className="text-[12px] text-ink/45">{a.timestamp}</span></div>
              <p className="mt-1.5 text-[13px] font-semibold text-ink/75">{a.actorName} · {ROLE_LABEL[a.actorRole] ?? a.actorRole}</p>
              {a.details && <p className="mt-0.5 break-words text-[13px] text-ink/60">{a.details}</p>}
            </Panel></li>
          ))}
        </ul>
      )}
    </div>
  );
};
