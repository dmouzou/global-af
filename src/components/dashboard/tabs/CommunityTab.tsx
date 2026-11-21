import React from 'react';
import { Flag, MessageSquare, ThumbsUp } from 'lucide-react';
import { EmptyState, PageTitle, Panel } from '../ui';

export const CommunityTab: React.FC = () => (
  <div>
    <PageTitle title="Communauté" subtitle="Un espace pour échanger des astuces et des retours d'expérience." />
    <EmptyState mood="wave" title="La communauté ouvre bientôt." text="Rien n'est enregistré pour le moment : nous n'affichons ni faux messages ni faux membres. Elle ouvrira avec des règles claires et une modération." />
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      {[
        { icon: MessageSquare, t: 'Publications', d: 'Conseils, questions et témoignages, classés par catégorie.' },
        { icon: ThumbsUp, t: 'Réactions', d: 'Des réactions simples, sans classement de popularité.' },
        { icon: Flag, t: 'Signalements', d: 'Chaque membre peut signaler ; la modération traite et sanctionne.' },
      ].map(({ icon: Icon, t, d }) => (
        <Panel key={t}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-ink/60"><Icon className="h-5 w-5" /></span>
          <h2 className="mt-3 font-display text-lg font-bold">{t}</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-ink/60">{d}</p>
        </Panel>
      ))}
    </div>
  </div>
);
