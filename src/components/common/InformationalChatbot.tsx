import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, RotateCcw, Copy, Check, ThumbsUp, ThumbsDown, 
  HelpCircle, ShieldCheck, ArrowRight, MessageSquare, X, Maximize2, Minimize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
  links?: { label: string; view: string }[];
}

// Built-in verified high-performance knowledge engine for instant local responses
const KNOWLEDGE_BASE: { keywords: string[]; title: string; answer: string; suggestions?: string[]; links?: { label: string; view: string }[] }[] = [
  {
    keywords: ['retrait', 'retirer', 'solde', 'seuil', 'virement', 'argent', 'gain'],
    title: 'Retraits & Paiements Mobile Money',
    answer: `Les retraits de gains sur GLOBAL-AF s'effectuent simplement et rapidement :

• **Seuil minimal de retrait :** dès **2 000 FCFA** de solde disponible.
• **Opérateurs supportés :** 
  - **Wave Côte d'Ivoire** (frais de transfert de 1,5%)
  - **Orange Money CI** (validation sécurisée par USSD ou app)
  - **MTN MoMo CI** (transfert direct sur votre numéro)
  - **Moov Africa Money**
• **Délai d'exécution :** les retraits sont contrôlés par notre grand livre comptable et exécutés selon les délais interopérateurs habituels.
• **Aucun frais masqué :** le solde affiché correspond exactement à ce qui vous est versé.`,
    suggestions: [
      "Quels opérateurs Mobile Money sont acceptés ?",
      "Comment réaliser des micro-jobs ?",
      "Règles de rémunération des parrains"
    ],
    links: [
      { label: "Accéder à mon Wallet", view: "dashboard" }
    ]
  },
  {
    keywords: ['parrain', 'parrainage', 'affiliation', 'commission', 'filleul', 'niveaux', 'niveau 1', 'niveau 2', 'remuneration parrain'],
    title: 'Règles de Rémunération des Parrains',
    answer: `Le programme d'affiliation de GLOBAL-AF est 100% transparent et éthique :

• **Niveau 1 (Parrainage Direct) :** vous touchez **10% de commission nette** sur chaque vente réelle de packs ou formations effectuée par vos filleuls directs.
  *Exemple : Un filleul souscrit un Pack Premium à 9 900 FCFA → Vous recevez 990 FCFA crédités après validation de la période légale de rétractation (7 jours).*
• **Niveau 2 (Parrainage Indirect) :** vous touchez **5% de commission nette** sur les achats réalisés par les filleuls de votre niveau 1.
• **Zéro commission sur l'inscription :** aucune commission n'est versée sur le simple recrutement d'un utilisateur. L'inscription est gratuite.
• **Plafonnement strict à 2 niveaux maximum :** aucun niveau 3 pour interdire tout montage pyramidal.
• **Condition :** les commissions proviennent exclusivement de produits tangibles et utiles (formations, outils IA, répertoires qualifiés).`,
    suggestions: [
      "Comment retirer mes commissions ?",
      "Quel est le délai de rétractation ?",
      "Combien coûte le Pack Premium ?"
    ],
    links: [
      { label: "Voir la page Affiliation", view: "affiliation" },
      { label: "Mon lien de parrainage", view: "dashboard" }
    ]
  },
  {
    keywords: ['micro-job', 'microjob', 'mission', 'tâche', 'remunere', 'sondage', 'test'],
    title: 'Micro-jobs & Missions Rémunérées',
    answer: `Les micro-jobs sur GLOBAL-AF sont des tâches digitales réelles commandées par des entreprises partenaires :

• **Types de missions :**
  - **Sondages & Enquêtes consommateurs** (ex : 400 à 1 200 FCFA)
  - **Tests d'applications mobiles ivoiriennes** (ex : 800 à 2 500 FCFA)
  - **Sensibilisation & visionnage de tutoriels** (ex : 300 à 600 FCFA)
  - **Revue de contenu et contrôle qualité**
• **Rémunération déterministe :** chaque mission a un tarif fixe connu d'avance. Dès que votre preuve de complétion est validée, les fonds s'ajoutent à votre Wallet.
• **Zéro jeu de hasard :** aucun tirage au sort, chaque travail validé est intégralement payé.`,
    suggestions: [
      "Comment retirer mes gains de micro-jobs ?",
      "Le palier gratuit donne-t-il accès aux micro-jobs ?",
      "Quel est le revenu médian des membres ?"
    ],
    links: [
      { label: "Explorer le catalogue des missions", view: "missions" }
    ]
  },
  {
    keywords: ['retractation', 'remboursement', '7j', '7 jours', '14', 'garantie', 'annuler'],
    title: 'Délai Légal de Rétractation de 7 Jours',
    answer: `GLOBAL-AF applique une politique de garantie et de rétractation stricte de **7 jours** :

• **Durée :** vous disposez de **7 jours calendaires** à compter de la souscription d'une option payante (Pack Premium ou Pack Business).
• **Modalité :** la demande s'effectue en **1 clic** depuis vos paramètres dans l'Espace Personnel, sans formulaire complexe.
• **Remboursement Mobile Money :** le montant intégral souscrit (9 900 FCFA ou 25 000 FCFA) est reversé directement sur votre compte Mobile Money d'origine (Wave, Orange Money, MTN MoMo ou Moov) selon les délais bancaires et opérateurs (1 à 3 jours ouvrés).
• **Zéro pénalité ni frais cachés.**`,
    suggestions: [
      "Quels sont les tarifs des packs ?",
      "Comment contacter le support ?",
      "L'accès gratuit est-il sans engagement ?"
    ],
    links: [
      { label: "Consulter la charte de transparence", view: "transparence" }
    ]
  },
  {
    keywords: ['gratuit', 'inscription', 'sans achat', 'prix', 'cout', 'abonnement', 'tarif', 'packs', 'premium'],
    title: 'Formules d\'Accès & Tarifs en Francs CFA (XOF)',
    answer: `GLOBAL-AF propose un palier gratuit pérenne et des options d'accélération :

• **Membre Gratuit (0 FCFA pour toujours) :**
  - Accès direct aux micro-jobs standard
  - Modules d'initiation de l'Académie
  - Retraits Mobile Money dès 2 000 FCFA
  - Lien d'affiliation éthique 2 niveaux
  - **Aucune obligation d'achat pour retirer vos gains**

• **Membre Premium (9 900 FCFA - Rétractation 7 jours) :**
  - Missions prioritaires à rémunération majorée
  - Outils IA illimités (Assistant rédactionnel, devis)
  - Téléchargement des répertoires de contacts VCF
  - Certifications complètes de l'Académie

• **Pack Business (25 000 FCFA) :**
  - Pour diffuser des campagnes et micro-jobs d'entreprises.`,
    suggestions: [
      "Comment s'applique le délai de 7 jours de rétractation ?",
      "Règles de rémunération des parrains",
      "Quels opérateurs Mobile Money sont acceptés ?"
    ],
    links: [
      { label: "Voir tous les tarifs", view: "landing" }
    ]
  },
  {
    keywords: ['wave', 'orange', 'mtn', 'moov', 'operateur', 'momo'],
    title: 'Opérateurs Mobile Money Partenaires',
    answer: `GLOBAL-AF est nativement interconnecté avec les 4 grands réseaux de paiement en Côte d'Ivoire :

1. **Wave Côte d'Ivoire :** frais de transfert de 1,5% conformes aux barèmes, retraits sécurisés.
2. **Orange Money CI :** validation sécurisée par code USSD ou notification d'application Orange.
3. **MTN MoMo CI :** intégration directe pour dépôt et retrait sécurisé sur tout numéro MTN.
4. **Moov Africa Money :** couverture nationale Moov Money.

Tous les paiements s'effectuent en Francs CFA (XOF) en conformité avec la réglementation financière de l'UEMOA.`,
    suggestions: [
      "Quel est le seuil de retrait ?",
      "Comment fonctionne le parrainage ?",
      "Comment démarrer les micro-jobs ?"
    ]
  },
  {
    keywords: ['formation', 'academie', 'cours', 'certif', 'whatsapp', 'vcf', 'apprendre'],
    title: 'Digital Academy & Certifications',
    answer: `La Digital Academy GLOBAL-AF propose des cursus pratiques axés sur les compétences rémunératrices en Afrique de l'Ouest :

• **Vendre avec WhatsApp & Wave en Côte d'Ivoire**
• **Copywriting & Intelligence Artificielle pour le marché local**
• **E-commerce rentable sans stock & prospection locale**
• **Gestion et valorisation de fichiers prospects VCF**

Chaque cours comprend des vidéos pas-à-pas, des quiz de validation et donne droit à une attestation certifiée avec bonus de points.`,
    suggestions: [
      "Accéder aux cours de l'Académie",
      "Combien gagne un membre ?",
      "Quels sont les micro-jobs disponibles ?"
    ],
    links: [
      { label: "Découvrir la Digital Academy", view: "academy" }
    ]
  }
];

interface InformationalChatbotProps {
  mode?: 'embedded' | 'floating';
  onNavigateView?: (view: string) => void;
  onCloseFloating?: () => void;
}

export const InformationalChatbot: React.FC<InformationalChatbotProps> = ({
  mode = 'embedded',
  onNavigateView,
  onCloseFloating
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: "Bonjour ! Je suis le **Chatbot Informationnel officiel de GLOBAL-AF**.\n\nJe réponds immédiatement à toutes vos questions sur les **micro-jobs rémunérés**, les **retraits Mobile Money** (Wave, Orange, MTN, Moov), les **règles de rémunération des parrains** (15% au niveau 1, 5% au niveau 2) et le **délai de rétractation de 7 jours**.\n\nComment puis-je vous renseigner aujourd'hui ?",
      time: 'À l\'instant',
      suggestions: [
        "Comment retirer mes gains Mobile Money ?",
        "Quelles sont les règles de rémunération des parrains ?",
        "Comment réaliser des micro-jobs rémunérés ?",
        "Quel est le délai légal de rétractation ?",
        "L'accès gratuit est-il sans achat obligatoire ?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, positive: boolean) => {
    setLikedMap(prev => ({ ...prev, [id]: positive }));
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'bot',
        text: "La discussion a été réinitialisée. N'hésitez pas à poser une nouvelle question sur GLOBAL-AF !",
        time: 'À l\'instant',
        suggestions: [
          "Comment retirer mes gains Mobile Money ?",
          "Règles de rémunération des parrains",
          "Comment réaliser des micro-jobs ?",
          "Délai de rétractation de 7 jours"
        ]
      }
    ]);
  };

  // Find high precision local answer
  const findLocalAnswer = (query: string) => {
    const qNorm = query.toLowerCase();
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => qNorm.includes(k))) {
        return item;
      }
    }
    return null;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    try {
      // First try backend chat API for fresh Gemini response
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          messages: [...messages, userMsg].map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.text
          }))
        })
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (data.answer) {
          const botMsg: ChatMessage = {
            id: `b-${Date.now()}`,
            role: 'bot',
            text: data.answer,
            time: currentTime,
            suggestions: [
              "Règles de rémunération des parrains",
              "Retrait Wave & Orange dès 2 000 FCFA",
              "Délai de rétractation de 7 jours"
            ]
          };
          setMessages(prev => [...prev, botMsg]);
          setIsLoading(false);
          return;
        }
      }
      throw new Error('API fallback');
    } catch {
      // High-performance intelligent local engine fallback
      const matched = findLocalAnswer(text);
      let replyText = "";
      let links: { label: string; view: string }[] | undefined = undefined;
      let suggestions: string[] = [
        "Comment retirer mes gains Mobile Money ?",
        "Quelles sont les règles de rémunération des parrains ?",
        "Quel est le délai légal de rétractation ?"
      ];

      if (matched) {
        replyText = matched.answer;
        links = matched.links;
        if (matched.suggestions) suggestions = matched.suggestions;
      } else {
        replyText = `GLOBAL-AF est la plateforme d'opportunités numériques éthique en Côte d'Ivoire.\n\n• **Micro-jobs réels :** missions rémunérées (sondages, tests d'applis, revues) avec paiement fixe déterministe.\n• **Retraits sécurisés :** dès 2 000 FCFA sur Wave, Orange Money, MTN MoMo et Moov Africa (frais de 1,5%).\n• **Règles des parrains :** 10% au niveau 1 et 5% au niveau 2 sur ventes réelles, zéro commission sur simple inscription.\n• **Garantie :** droit légal de rétractation de 7 jours avec remboursement intégral Mobile Money.`;
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: replyText,
        time: currentTime,
        suggestions,
        links
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl overflow-hidden ${mode === 'floating' ? 'h-[620px] w-full max-w-lg' : 'w-full'}`}>
      
      {/* Chatbot Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                Chatbot Informationnel GLOBAL-AF
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold hidden sm:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                En direct
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Conseiller officiel · Micro-jobs, Mobile Money, Parrainage & Éthique
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetChat}
            title="Effacer la conversation"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {mode === 'floating' && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              title="Fermer le chatbot"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[460px] sm:max-h-[500px] text-xs sm:text-sm bg-gradient-to-b from-slate-900/60 to-slate-950/80">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-tr-xs shadow-md'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Format basic bold and bullets */}
                <div className="space-y-1.5">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split('\n').map((line, lIdx) => (
                        <span key={lIdx} className="block">
                          {line.startsWith('• ') ? (
                            <span className="flex items-start gap-1.5 pl-1">
                              <span className="text-orange-400 font-bold shrink-0">•</span>
                              <span>{renderFormattedText(line.slice(2))}</span>
                            </span>
                          ) : (
                            renderFormattedText(line)
                          )}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                {/* Optional clickable links */}
                {msg.links && msg.links.length > 0 && onNavigateView && (
                  <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-2">
                    {msg.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateView(link.view)}
                        className="px-2.5 py-1 rounded-md bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[11px] font-semibold flex items-center gap-1 border border-orange-500/30 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bot Message Meta (Timestamp, copy, feedback) */}
              {msg.role === 'bot' && (
                <div className="flex items-center gap-3 px-1 text-[10px] text-slate-400">
                  <span>{msg.time}</span>
                  <span>·</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleFeedback(msg.id, true)}
                      className={`hover:text-emerald-400 transition-colors ${likedMap[msg.id] === true ? 'text-emerald-400' : ''}`}
                      title="Utile"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, false)}
                      className={`hover:text-rose-400 transition-colors ${likedMap[msg.id] === false ? 'text-rose-400' : ''}`}
                      title="Non pertinent"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Suggestions chips below bot message */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 hover:border-orange-500/50 text-slate-300 hover:text-white rounded-lg border border-slate-700/80 text-[11px] transition-all text-left shadow-2xs active:scale-95"
                    >
                      💬 {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tl-xs flex items-center gap-1.5 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span className="text-[11px] text-slate-300">Le Chatbot analyse votre demande...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question (ex. Retrait Wave, parrainage, 7j de rétractation...)"
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 text-xs sm:text-sm"
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Informations vérifiées selon la charte éthique GLOBAL-AF</span>
          </div>
          <span>Retraits dès 2 000 FCFA</span>
        </div>
      </div>

    </div>
  );
};

// Helper to highlight **bold** text in responses
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

// Floating Chatbot Trigger Button & Drawer Widget
export const FloatingChatbotWidget: React.FC<{
  onNavigateView?: (view: string) => void;
}> = ({ onNavigateView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-2xl border-2 border-white/20 font-bold text-xs sm:text-sm"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-orange-500 animate-pulse" />
          </div>
          <span>Chatbot Info</span>
        </motion.button>
      </div>

      {/* Floating Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] max-w-[480px] shadow-2xl"
          >
            <InformationalChatbot
              mode="floating"
              onNavigateView={(view) => {
                if (onNavigateView) onNavigateView(view);
                setIsOpen(false);
              }}
              onCloseFloating={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
