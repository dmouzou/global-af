import React from 'react';
import { CheckCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Btn, EmptyState, PageTitle, Pill, Tone } from '../ui';

const KIND: Record<string, { label: string; tone: Tone }> = {
  commission: { label: 'Affiliation', tone: 'leaf' }, reward: { label: 'Récompense', tone: 'leaf' }, system: { label: 'Information', tone: 'mist' },
  withdrawal: { label: 'Retrait', tone: 'wax' }, mission: { label: 'Mission', tone: 'sun' }, security: { label: 'Sécurité', tone: 'rose' },
};

export const NotificationsTab: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead } = useApp();
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div>
      <PageTitle title="Notifications" subtitle="Vos missions, commissions et retraits, au fil de l'eau."
        action={unread > 0 ? <Btn kind="ghost" onClick={markAllNotificationsRead}><CheckCheck className="h-4 w-4" />Tout marquer comme lu ({unread})</Btn> : undefined} />
      {notifications.length === 0 ? (
        <EmptyState title="Aucune notification pour le moment" text="Une mission validée, une commission créditée ou un retrait payé apparaîtra ici." mood="happy" />
      ) : (
        <ul className="space-y-2.5">
          {notifications.map(n => {
            const k = KIND[n.type] ?? KIND.system;
            return (
              <li key={n.id}>
                <button onClick={() => markNotificationAsRead(n.id)} className={`flex w-full items-start gap-3 rounded-3xl p-4 text-left ring-1 transition ${n.read ? 'bg-white ring-ink/8' : 'bg-wax/8 ring-wax/30'}`}>
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? 'bg-ink/15' : 'bg-wax'}`} aria-label={n.read ? 'Lue' : 'Non lue'} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2"><span className="font-bold">{n.title}</span><Pill tone={k.tone}>{k.label}</Pill></span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-ink/65">{n.message}</span>
                    <span className="mt-1.5 block text-[12px] text-ink/45">{n.timestamp}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
