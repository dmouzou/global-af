import React, { useEffect, useState } from 'react';
import { Check, Copy, RefreshCw, Share2, ShieldCheck, Users } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Btn, EmptyState, fcfa, PageTitle, Panel, Pill, Stat } from '../ui';

const STATUS = {
  credited: { label: 'Créditée', tone: 'leaf' as const },
  pending_retraction: { label: 'En attente (délai de rétractation)', tone: 'sun' as const },
  cancelled_retraction: { label: 'Annulée (rétractation du filleul)', tone: 'mist' as const },
};

export const TeamTab: React.FC = () => {
  const { currentUser, affiliation, refreshAffiliation, selectedCountry } = useApp();
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  useEffect(() => {
    if (currentUser) refreshAffiliation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  if (!currentUser) return null;
  const link = `${window.location.origin}/?ref=${currentUser.referralCode}`;
  const stats = affiliation.stats;

  const copy = (what: 'code' | 'link') => {
    navigator.clipboard.writeText(what === 'code' ? currentUser.referralCode : link);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  };
  const share = async () => {
    const text = `Rejoignez AH GLOBAL avec mon lien de parrainage : ${link}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'AH GLOBAL', text, url: link }); } catch { /* annulé */ }
    } else { copy('link'); }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Équipe et affiliation" subtitle="Parrainage direct. Vos commissions sont calculées par le serveur et détaillées une par une ci-dessous." />

      <Panel className="!bg-leaf/10 ring-leaf/25">
        <p className="flex gap-3 text-[14px] leading-relaxed text-leaf-deep">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <span><strong>Règles en vigueur :</strong> 10 % sur le Pass Membre activé par vos filleuls directs, puis 5 % sur leur première commande réelle (abonnement, formation…). Pas d'auto-parrainage, pas de commission sur des comptes artificiels. Aucun gain n'est garanti.</span>
        </p>
      </Panel>

      <Panel>
        <h2 className="font-display text-xl font-extrabold">Vos identifiants de parrainage</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
          <div className="rounded-2xl bg-mist p-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-ink/45">Code unique</p>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <span className="min-w-0 flex-1 truncate font-mono text-lg font-bold">{currentUser.referralCode}</span>
              <Btn kind="ghost" onClick={() => copy('code')}>{copied === 'code' ? <><Check className="h-4 w-4" />Copié</> : <><Copy className="h-4 w-4" />Copier</>}</Btn>
            </div>
          </div>
          <div className="rounded-2xl bg-mist p-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-ink/45">Lien à partager</p>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <span className="min-w-0 flex-1 truncate font-mono text-[13px]">{link}</span>
              <Btn onClick={share}><Share2 className="h-4 w-4" />Partager</Btn>
            </div>
          </div>
        </div>
        {copied && <p role="status" className="mt-3 text-[13px] font-semibold text-leaf-deep">Copié dans le presse-papiers.</p>}
        <p className="mt-4 text-[13px] leading-relaxed text-ink/55">Quand vous partagez votre lien, restez factuel : pas de « gagne X par jour », pas de mise en scène d'argent. C'est une règle de la charte, avec sanctions.</p>
      </Panel>

      {affiliation.error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-rose-50 p-4 text-[14px] text-rose-800 ring-1 ring-rose-200">
          Les statistiques du réseau sont momentanément indisponibles.
          <Btn kind="ink" onClick={() => refreshAffiliation()}><RefreshCw className="h-4 w-4" />Réessayer</Btn>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat accent="wax" label="Filleuls directs" value={stats ? `${stats.level1.count} filleul${stats.level1.count > 1 ? 's' : ''}` : affiliation.loading ? '…' : '—'}
          hint={stats ? `${stats.level1.activeCount} actif${stats.level1.activeCount > 1 ? 's' : ''}` : undefined} />
        <Stat accent="leaf" label="Commissions créditées" value={fcfa(affiliation.commissions.filter(c => c.status === 'credited').reduce((s, c) => s + c.amount, 0), selectedCountry.currency)}
          hint={`Réserve de sécurité : ${stats?.retractionDays ?? 7} jours`} />
      </div>

      <Panel>
        <h2 className="font-display text-xl font-extrabold">Vos commissions</h2>
        {affiliation.commissions.length === 0 ? (
          <div className="mt-4"><EmptyState title="Aucune commission pour le moment" text="Elles apparaissent ici lorsqu'un de vos filleuls effectue un achat éligible." mood="happy" prop="phone" /></div>
        ) : (
          <ul className="mt-4 divide-y divide-ink/8">
            {affiliation.commissions.map(c => {
              const st = STATUS[c.status as keyof typeof STATUS] ?? { label: c.status, tone: 'mist' as const };
              return (
                <li key={c.id} className="flex items-start justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-bold"><Users className="h-4 w-4 text-ink/40" />Niveau {c.level}</p>
                    <p className="mt-0.5 text-[13px] text-ink/50">Enregistrée le {c.date}{c.status === 'pending_retraction' && c.matureAt ? ` · créditée à partir du ${c.matureAt}` : ''}</p>
                    <div className="mt-1.5"><Pill tone={st.tone}>{st.label}</Pill></div>
                  </div>
                  <p className="shrink-0 font-display text-lg font-extrabold tabular-nums text-leaf-deep">+{fcfa(c.amount, selectedCountry.currency)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
};
