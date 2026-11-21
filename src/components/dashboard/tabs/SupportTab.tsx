import React, { useState } from 'react';
import { LifeBuoy, Send } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Btn, inputCls, PageTitle, Panel } from '../ui';

const CONTACT = 'contact@ahglobal.com';
const CATEGORIES = ['Paiement Mobile Money', 'Validation de mission', 'Retrait', 'Rétractation / remboursement', 'Compte et profil', 'Pause ou clôture du compte'];

export const SupportTab: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useApp();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  if (!currentUser) return null;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    const body = [message.trim(), '', '—', `Membre : ${currentUser.firstName} ${currentUser.lastName}`, `N° de membre : ${currentUser.memberNumber || '—'}`, `E-mail du compte : ${currentUser.email}`, `Catégorie : ${category}`].join('\n');
    window.location.href = `mailto:${CONTACT}?subject=${encodeURIComponent(`[${category}] ${subject.trim()}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Support" subtitle="Le support par tickets n'est pas encore ouvert. En attendant, écrivez-nous : votre message part depuis votre messagerie." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <form onSubmit={send} className="space-y-4">
            <label className="block text-sm font-bold">Catégorie
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            </label>
            <label className="block text-sm font-bold">Sujet
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="ex. Retrait Wave en attente" className={inputCls} />
            </label>
            <label className="block text-sm font-bold">Votre message
              <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Expliquez votre situation, avec la référence de l'opération concernée." className={inputCls} />
            </label>
            <Btn type="submit" disabled={!subject.trim() || !message.trim()} className="w-full sm:w-auto"><Send className="h-4 w-4" />Préparer mon e-mail à {CONTACT}</Btn>
            <p className="text-[12px] text-ink/50">Rien n'est enregistré sur cette page : le message est envoyé depuis votre application e-mail.</p>
          </form>
        </Panel>
        <div className="space-y-4 lg:col-span-2">
          <Panel>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-leaf/12 text-leaf-deep"><LifeBuoy className="h-5 w-5" /></span>
            <h2 className="mt-3 font-display text-lg font-bold">Réponses rapides</h2>
            <ul className="mt-2 space-y-2.5 text-[14px] leading-relaxed text-ink/70">
              <li><strong>Rétractation du Pass :</strong> 7 jours, depuis les Paramètres.</li>
              <li><strong>Retrait en attente :</strong> chaque demande est contrôlée avant paiement ; suivez les étapes dans « Retraits ».</li>
              <li><strong>Pause ou clôture :</strong> écrivez-nous en choisissant la catégorie correspondante.</li>
            </ul>
            <Btn kind="ghost" className="mt-4" onClick={() => onNavigate('settings')}>Ouvrir les paramètres</Btn>
          </Panel>
        </div>
      </div>
    </div>
  );
};
