import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageSquare, X, Mail, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Général' | 'Paiements' | 'Missions' | 'Éthique';
}

const PREDEFINED_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Général',
    question: "Comment s'inscrire et commencer sur GLOBAL-AF ?",
    answer: "L'inscription est rapide et sans engagement. Il vous suffit d'indiquer votre numéro Mobile Money et votre e-mail. Dès l'ouverture de votre Espace Personnel, vous avez un accès direct aux micro-jobs qualifiés, aux modules d'initiation et à votre lien d'affiliation."
  },
  {
    id: 'faq-2',
    category: 'Paiements',
    question: "Quels sont les opérateurs de paiement Mobile Money supportés ?",
    answer: "Les retraits se font vers un compte Wave, Orange Money, MTN MoMo ou Moov Money, sur le numéro indiqué à l'inscription. Le montant minimum, les frais et le montant net sont affichés avant validation ; chaque demande est contrôlée avant paiement, sans délai garanti."
  },
  {
    id: 'faq-3',
    category: 'Missions',
    question: "Faut-il payer pour participer aux missions et retirer ses gains ?",
    answer: "Oui. L'inscription est gratuite, mais les missions rémunérées, les formations et les retraits exigent un Pass actif : le Pass d'entrée (non remboursable, reconnu avant paiement) ou un abonnement (Premium, Business). Le prix et le contenu sont affichés avant tout paiement. Un Pass ne garantit aucun gain : ne payez jamais dans l'espoir d'un revenu, ni en vous endettant."
  },
  {
    id: 'faq-4',
    category: 'Éthique',
    question: "Quelles sont les règles de rémunération des parrains ?",
    answer: "Le programme d'affiliation repose uniquement sur des ventes réelles, sur 2 niveaux maximum (parrainage direct et indirect) ; les taux en vigueur sont affichés dans l'espace membre. Le simple recrutement de membres ne rapporte rien, ni l'activation seule. Aucun gain n'est garanti."
  },
  {
    id: 'faq-5',
    category: 'Paiements',
    question: "Quel est le délai de validation et de versement des retraits ?",
    answer: "Les retraits Mobile Money sont vérifiés par notre grand livre comptable et notre journal d'audit. Les virements vers Wave, Orange Money, MTN MoMo et Moov Africa sont exécutés selon les contrôles de sécurité et les délais interopérateurs habituels."
  },
  {
    id: 'faq-6',
    category: 'Éthique',
    question: "Comment fonctionne la rétractation de 7 jours ?",
    answer: "Les abonnements (Premium, Business) peuvent être rétractés pendant 7 jours à compter du paiement, depuis vos paramètres. Le remboursement est traité par notre équipe vers votre moyen de paiement, sous déduction des frais de transaction (3 %) ; le délai dépend de l'opérateur ou de la banque. Le Pass d'entrée n'est pas remboursable."
  }
];

export const FAQGemini: React.FC<{ onNavigateView?: (view: string) => void }> = ({ onNavigateView }) => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const toggleFAQ = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const categories = ['Tous', 'Général', 'Paiements', 'Missions', 'Éthique'];

  const filteredFAQs = activeCategory === 'Tous'
    ? PREDEFINED_FAQS
    : PREDEFINED_FAQS.filter(faq => faq.category === activeCategory);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Foire Aux Questions & Assistance</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tout comprendre en toute transparence
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Retrouvez les réponses claires sur le fonctionnement des micro-jobs, les retraits Mobile Money et nos engagements éthiques.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all hover:border-slate-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {faq.category}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Live Support Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Une question spécifique non abordée ?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Notre équipe d'assistance basée à Abidjan est disponible 7j/7 pour vous accompagner par WhatsApp, email ou ticket.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="px-5 py-2.5 bg-white hover:bg-orange-50 text-slate-900 font-bold text-xs rounded-xl transition-all shrink-0 shadow-sm hover:scale-105 active:scale-95"
          >
            Accéder au support membre
          </button>
        </div>

        {/* Interactive Support Modal */}
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md liquid-glass-card bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h3 className="text-base font-bold text-slate-900">Centre d'Assistance & Support</h3>
                </div>
                <button
                  onClick={() => setIsSupportModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Agent Badge with Photo */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60">
                <img
                  src="/images/support-agent.jpg"
                  alt="Awa N'Guessan"
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shadow-xs"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Awa N'Guessan</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">En ligne</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Service client & médiation Côte d'Ivoire</p>
                  <p className="text-[10px] text-orange-700 font-medium">Réponse moyenne sous 15 minutes</p>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="space-y-2.5">
                <a
                  href="https://wa.me/2250700000000?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20GLOBAL-AF"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors text-emerald-950 font-semibold text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900">Assistance WhatsApp Directe</div>
                      <div className="text-[11px] text-emerald-700">Réponses automatiques (assistant)</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="mailto:contact@global-af.ci?subject=Demande%20d'assistance%20GLOBAL-AF"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-slate-800 font-semibold text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-bold text-slate-900">Email Officiel Support</div>
                      <div className="text-[11px] text-slate-500">contact@global-af.ci</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {onNavigateView && (
                  <button
                    onClick={() => {
                      setIsSupportModalOpen(false);
                      onNavigateView('dashboard');
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                  >
                    <span>Ouvrir un ticket dans l'Espace Personnel</span>
                  </button>
                )}
              </div>

              <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Support par tickets : ouverture prochaine</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
