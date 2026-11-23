import React from 'react';
import { PageTitle, Panel } from '../../dashboard/ui';

const RULES: [string, string][] = [
  ['Parrainage direct, un seul niveau', "10 % du prix du Pass Membre activé par un filleul direct, puis 5 % sur sa première commande réelle. Pas d'auto-parrainage, aucune commission sur des comptes artificiels, commission annulée si la vente est remboursée. Les taux sont lus dans la configuration du serveur et modifiables dans « Paramètres »."],
  ['Un prix, un contenu, avant paiement', "Le Pass d'entrée se rétracte pendant 7 jours (remboursement sous déduction de 3 % de frais). Le VIP Premium n'est pas remboursable : l'accès est immédiat et définitif."],
  ['Honnêteté sur les gains', "Aucun slogan « gagne X par jour », aucune mise en scène d'argent. Les indicateurs réels sont publiés dès qu'ils existent."],
  ['Aucun jeu de hasard', "Ni roue, ni loterie, ni tirage au sort, ni loot box. Toute récompense est connue à l'avance. Les campagnes partenaires contenant du hasard sont refusées."],
  ['Protection des membres', "18 ans minimum, plafond de dépense mensuel réglable par le membre (hausse effective après 24 h), aucune incitation à l'endettement."],
];

export const AdminRules: React.FC = () => (
  <div className="space-y-5">
    <PageTitle title="Règles et éthique" subtitle="Les règles appliquées aujourd'hui par la plateforme. Toute modification est revue au regard de la charte et tracée dans le journal d'audit." />
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      {RULES.map(([t, d]) => <Panel key={t}><h2 className="font-display text-lg font-bold">{t}</h2><p className="mt-2 text-[14px] leading-relaxed text-ink/65">{d}</p></Panel>)}
    </div>
    <Panel className="!bg-sun/20 ring-sun/40"><p className="text-[14px] leading-relaxed"><strong>À savoir :</strong> les taux, plafonds, frais et paramètres par pays se modifient dans « Paramètres » (super administrateur, motif obligatoire, historique conservé). Les mécanismes de commission, d'activation et de retrait doivent faire l'objet d'une validation juridique dans chaque pays avant leur activation commerciale.</p></Panel>
  </div>
);
