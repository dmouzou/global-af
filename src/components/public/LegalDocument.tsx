import React from 'react';
import { LEGAL_DOCS, LegalDoc } from '../../data/legalTexts';
import { LEGAL_ENTITY, LEGAL_REVIEWED, LEGAL_VERSION_DATE } from '../../data/legalEntity';
import { POLICY } from '../../lib/policy';

const FIELD_LABELS: Record<string, string> = {
  name: 'raison sociale', legalForm: 'forme juridique', capital: 'capital', rccm: 'RCCM',
  address: 'adresse', email: 'e-mail', phone: 'téléphone', director: 'directeur de la publication',
  dpoEmail: 'e-mail du correspondant données personnelles', artciRef: 'référence ARTCI',
  dataLocation: "lieu d'hébergement", jurisdiction: 'juridiction compétente',
  retentionAccount: 'durée de conservation', retentionAccounting: 'durée de conservation',
  retentionLogs: 'durée de conservation',
};

const POLICY_VALUES: Record<string, string> = {
  retractionDays: String(POLICY.retractionDays),
  refundFeePercent: String(POLICY.refundFeePercent),
  minAge: String(POLICY.minAge),
  subscriptionDays: String(POLICY.subscriptionDays),
};

/** Remplace {{champ}} et met **gras** ; un champ non renseigné est signalé. */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\{\{\w+\}\})/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{renderInline(part.slice(2, -2))}</strong>;
    const m = part.match(/^\{\{(\w+)\}\}$/);
    if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
    const key = m[1];
    const value = POLICY_VALUES[key] ?? LEGAL_ENTITY[key];
    if (value) return <React.Fragment key={i}>{value}</React.Fragment>;
    return (
      <mark key={i} className="bg-amber-100 text-amber-900 px-1 rounded" title="À renseigner dans src/data/legalEntity.ts">
        [à renseigner : {FIELD_LABELS[key] ?? key}]
      </mark>
    );
  });
}

interface LegalDocumentProps {
  doc: LegalDoc['id'];
  /** Variante compacte (fenêtre d'inscription) : sans titre ni bandeau. */
  compact?: boolean;
}

export const LegalDocument: React.FC<LegalDocumentProps> = ({ doc, compact = false }) => {
  const d = LEGAL_DOCS[doc];
  return (
    <article className="space-y-5 text-[15px] leading-relaxed text-ink/80">
      {!compact && (
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{d.title}</h1>
          <p className="text-sm text-ink/50">Version du {LEGAL_VERSION_DATE}</p>
        </header>
      )}
      {!LEGAL_REVIEWED && (
        <div role="note" className="rounded-2xl border border-sun/60 bg-sun/15 p-4 text-sm text-ink">
          <strong>Version provisoire.</strong> Ce texte est en cours de validation juridique ; les mentions signalées
          « à renseigner » seront complétées avant sa version définitive.
        </div>
      )}
      <p>{renderInline(d.intro)}</p>
      {d.sections.map((s) => (
        <section key={s.title} className="space-y-2">
          <h2 className="font-display text-xl font-bold text-ink">{s.title}</h2>
          {s.paragraphs?.map((p, i) => <p key={i}>{renderInline(p)}</p>)}
          {s.list && (
            <ul className="list-disc pl-5 space-y-1.5">
              {s.list.map((li, i) => <li key={i}>{renderInline(li)}</li>)}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
};
