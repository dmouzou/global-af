import React, { useEffect } from 'react';
import { LegalDocument } from './LegalDocument';
import { LEGAL_DOCS, LegalDoc } from '../../data/legalTexts';
import { ScarfRibbon } from '../brand/Illustrations';

interface LegalPageProps {
  doc: LegalDoc['id'];
  onNavigate: (view: 'cgu' | 'confidentialite' | 'cookies' | 'mentions' | 'landing') => void;
}

const ORDER: LegalDoc['id'][] = ['cgu', 'confidentialite', 'cookies', 'mentions'];

export const LegalPage: React.FC<LegalPageProps> = ({ doc, onNavigate }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [doc]);
  return (
    <div className="bg-mist text-ink">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Documents légaux" className="flex flex-wrap items-center gap-2 text-sm">
          <button type="button" onClick={() => onNavigate('landing')} className="rounded-full px-3 py-1.5 font-semibold text-ink/60 hover:bg-white hover:text-ink">
            ← Accueil
          </button>
          {ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={id === doc ? 'page' : undefined}
              className={`rounded-full px-3.5 py-1.5 font-bold transition ${
                id === doc ? 'bg-ink text-white' : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink'
              }`}
            >
              {LEGAL_DOCS[id].title}
            </button>
          ))}
        </nav>
        <div className="rounded-[2rem] bg-white p-6 ring-1 ring-ink/10 sm:p-10">
          <LegalDocument doc={doc} />
        </div>
      </div>
      <ScarfRibbon />
    </div>
  );
};
