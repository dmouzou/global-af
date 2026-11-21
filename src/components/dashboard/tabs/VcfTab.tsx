import React, { useState } from 'react';
import { Download, FolderDown, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Btn, EmptyState, Gate, PageTitle, Panel, Pill } from '../ui';

export const VcfTab: React.FC<{ onActivate: (plan: 'standard' | 'premium') => void }> = ({ onActivate }) => {
  const { currentUser, vcfResources, downloadVCFResource } = useApp();
  const [msg, setMsg] = useState<string | null>(null);
  if (!currentUser) return null;
  const isVip = currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business';

  if (!isVip) {
    return (
      <div>
        <PageTitle title="Répertoires VCF" subtitle="Des carnets de contacts professionnels par secteur." />
        <Gate pill="VIP Premium" title="Les répertoires VCF sont réservés au VIP Premium." text="Le téléchargement n'est pas encore ouvert : les droits d'usage des données sont en cours de validation. L'abonnement Premium est de 9 900 FCFA pour 30 jours, non remboursable car l'accès est immédiat." prop="book">
          <Btn onClick={() => onActivate('premium')}><Zap className="h-4 w-4" />Voir l'abonnement Premium</Btn>
        </Gate>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Répertoires VCF" subtitle="Chaque consultation et chaque téléchargement sont enregistrés. Les droits d'usage des données sont en cours de validation." />
      {msg && <p role="status" className="mb-4 rounded-2xl bg-sun/25 p-3.5 text-[14px] font-semibold">{msg}</p>}
      {vcfResources.length === 0 ? (
        <EmptyState title="Aucun répertoire publié pour le moment" text="Les carnets seront publiés une fois l'origine et les droits d'usage de chaque contact documentés et validés." mood="think" prop="book" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
          {vcfResources.map(r => (
            <Panel key={r.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2"><Pill tone="leaf">{r.sector}</Pill><span className="text-[13px] font-semibold text-ink/50">{r.entriesCount} contacts</span></div>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{r.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{r.description}</p>
                <p className="mt-3 flex items-center gap-2 text-[12px] text-ink/45"><FolderDown className="h-4 w-4" />Format {r.fileFormat} · mis à jour {r.verifiedDate}</p>
              </div>
              <Btn kind="ink" className="mt-4 w-full" onClick={() => setMsg(downloadVCFResource(r.id).message)}><Download className="h-4 w-4" />Télécharger</Btn>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
};
