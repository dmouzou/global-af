import React, { useEffect } from 'react';
import { LegalDocument } from './LegalDocument';
import { LEGAL_DOCS, LegalDoc } from '../../data/legalTexts';

interface LegalPageProps {
  doc: LegalDoc['id'];
  onNavigate: (view: 'cgu' | 'confidentialite' | 'cookies' | 'mentions' | 'landing') => void;
}

const ORDER: LegalDoc['id'][] = ['cgu', 'confidentialite', 'cookies', 'mentions'];

export const LegalPage: React.FC<LegalPageProps> = ({ doc, onNavigate }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [doc]);
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <nav aria-label="Documents légaux" className="flex flex-wrap items-center gap-2 text-xs">
          <button type="button" onClick={() => onNavigate('landing')} className="text-slate-500 hover:text-slate-900">
            ← Accueil
          </button>
          <span className="text-slate-300">|</span>
          {ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`px-2.5 py-1 rounded-full border ${
                id === doc
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {LEGAL_DOCS[id].title}
            </button>
          ))}
        </nav>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <LegalDocument doc={doc} />
        </div>
      </div>
    </div>
  );
};
