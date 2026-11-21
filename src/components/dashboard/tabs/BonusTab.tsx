import React from 'react';
import { Award, Gift } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PageTitle, Panel, Pill } from '../ui';

export const BonusTab: React.FC = () => {
  const { currentUser } = useApp();
  if (!currentUser) return null;
  return (
    <div>
      <PageTitle title="Bonus et fidélité" subtitle="Un bonus n'est crédité que si une règle publiée le prévoit, et jamais au hasard." />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-wax/12 text-wax-deep"><Gift className="h-6 w-6" /></span>
          <h2 className="mt-4 font-display text-xl font-extrabold">Bonus en vigueur</h2>
          <p className="mt-1 font-display text-3xl font-extrabold text-ink/40">Aucun pour l'instant</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/65">Tout bonus crédité apparaît dans l'historique de votre portefeuille, avec sa référence.</p>
        </Panel>
        <Panel>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf/12 text-leaf-deep"><Award className="h-6 w-6" /></span>
          <div className="mt-4 flex items-center gap-2"><h2 className="font-display text-xl font-extrabold">Réussite à l'Académie</h2><Pill tone="sun">Bientôt</Pill></div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/65">Les points et attestations récompenseront la réussite d'un quiz. Leur délivrance se fera côté serveur, avec une règle connue à l'avance.</p>
          <p className="mt-3 text-[14px] font-bold text-ink/70">Progression actuelle : {currentUser.points} points</p>
        </Panel>
      </div>
    </div>
  );
};
