import React from 'react';
import { useApp } from '../../../context/AppContext';
import { EmptyState, PageTitle, Panel, Pill, Tone } from '../../dashboard/ui';

const TYPE: Record<string, string> = { multi_account_suspected: 'Multi-comptes suspecté', rapid_withdrawal_pattern: 'Retraits rapprochés', self_referral_attempt: 'Auto-parrainage', submission_automation: 'Automatisation des preuves' };
const SEV: Record<string, Tone> = { low: 'mist', medium: 'sun', high: 'rose' };

export const AdminRisks: React.FC = () => {
  const { riskAlerts } = useApp();
  return (
    <div className="space-y-5">
      <PageTitle title="Risques et fraude" subtitle="Alertes de comportement à risque (multi-comptes, retraits rapprochés, auto-parrainage)." />
      {riskAlerts.length === 0 ? (
        <EmptyState title="Aucune alerte enregistrée" text="Le système n'en génère pas encore automatiquement : les contrôles actuels (doublons de numéro et d'e-mail, limitation de débit, une participation par mission, plafonds de dépense) bloquent sans créer d'alerte. La détection automatique d'alertes reste à construire." mood="think" prop="shield" />
      ) : (
        <ul className="space-y-3">
          {riskAlerts.map(a => (
            <li key={a.id}><Panel>
              <div className="flex flex-wrap items-center gap-2"><Pill tone={SEV[a.severity] ?? 'mist'}>{a.severity}</Pill><Pill>{TYPE[a.type] ?? a.type}</Pill>{a.resolved && <Pill tone="leaf">Résolue</Pill>}</div>
              <p className="mt-2 text-[14px] text-ink/70">{a.details}</p>
              <p className="mt-1 text-[12px] text-ink/45">{a.timestamp} · membre …{a.userId.slice(-6)}</p>
            </Panel></li>
          ))}
        </ul>
      )}
    </div>
  );
};
