import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

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
    answer: "Nous intégrons nativement Wave Côte d'Ivoire (1% de frais fixes), Orange Money, MTN MoMo et Moov Africa Côte d'Ivoire. Les demandes de retrait sont déclenchées directement vers votre numéro dès que votre solde disponible atteint 2 000 FCFA."
  },
  {
    id: 'faq-3',
    category: 'Missions',
    question: "Y a-t-il une obligation de payer un abonnement pour retirer ses gains ?",
    answer: "Non, absolument aucune. L'accès standard est gratuit et permet d'effectuer des micro-jobs et de retirer l'intégralité de vos gains sans obligation d'achat. Les options payantes (Packs Premium ou Business) sont des outils avancés d'accélération et de formation, et ne constituent en aucun cas une condition de retrait."
  },
  {
    id: 'faq-4',
    category: 'Éthique',
    question: "Quelles sont les règles de rémunération des parrains ?",
    answer: "Sur GLOBAL-AF, le programme d'affiliation repose uniquement sur des ventes réelles : 15% de commission nette au Niveau 1 (parrainage direct) et 5% de commission nette au Niveau 2 (parrainage indirect). Le simple recrutement d'autres membres ne rapporte strictement rien. Aucun système de parrainage infini ni de gain passif fictif."
  },
  {
    id: 'faq-5',
    category: 'Paiements',
    question: "Quel est le délai de validation et de versement des retraits ?",
    answer: "Les retraits Mobile Money sont vérifiés automatiquement par notre journal d'audit immuable. Les virements vers Wave, Orange Money, MTN MoMo et Moov Africa sont généralement exécutés en quelques minutes à quelques heures ouvrées."
  },
  {
    id: 'faq-6',
    category: 'Éthique',
    question: "Comment fonctionne le droit légal de rétractation de 7 jours ?",
    answer: "Si vous souscrivez un forfait payant (Pack Premium ou Pack Business), vous bénéficiez d'un délai légal et garanti de 7 jours calendaires pour changer d'avis. Un simple clic dans vos paramètres déclenche un remboursement intégral sans pénalité sur votre compte Mobile Money d'origine."
  }
];

export const FAQGemini: React.FC<{ onNavigateView?: (view: string) => void }> = ({ onNavigateView }) => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  const toggleFAQ = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = activeCategory === 'Tous'
    ? PREDEFINED_FAQS
    : PREDEFINED_FAQS.filter(f => f.category === activeCategory);

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white via-orange-50/20 to-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Assistance & Foire Aux Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tout ce que vous devez savoir sur GLOBAL-AF
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Consultez les réponses officielles ci-dessous ou échangez en direct avec notre conseiller virtuel via la bulle en bas à droite.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {['Tous', 'Général', 'Paiements', 'Missions', 'Éthique'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Predefined FAQ Accordion with Fluid Motion Animation */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-orange-300 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="text-slate-400 shrink-0"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
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
                Utilisez le Chatbot ci-dessus pour une réponse instantanée ou ouvrez un ticket d'assistance depuis votre Espace Personnel.
              </p>
            </div>
          </div>
          {onNavigateView && (
            <button
              onClick={() => onNavigateView('dashboard')}
              className="px-5 py-2.5 bg-white hover:bg-orange-50 text-slate-900 font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Accéder au support membre
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
