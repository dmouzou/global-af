import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, RotateCcw, Copy, Check, ThumbsUp, ThumbsDown, 
  HelpCircle, ShieldCheck, ArrowRight, MessageSquare, X, Maximize2, Minimize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BabiVector } from '../brand/BabiVector';

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
    keywords: ['retrait', 'retirer', 'solde', 'seuil', 'virement', 'argent', 'gain', 'gagne'],
    title: 'Retraits',
    answer: `Voici comment fonctionnent les retraits sur GLOBAL-AF :

• **Où :** depuis la rubrique « Retraits » de votre espace personnel, vers un compte Mobile Money (Wave, Orange Money, MTN MoMo ou Moov Money).
• **Numéro :** le versement se fait sur le numéro Mobile Money indiqué à votre inscription.
• **Montant minimum et frais :** ils sont affichés dans la fenêtre de retrait **avant** que vous validiez, avec le montant net que vous recevrez.
• **Contrôle :** chaque demande est contrôlée avant paiement ; le montant demandé est mis de côté sur votre solde pendant ce temps. Le délai dépend de ce contrôle et de l'opérateur : il n'est pas garanti.
• **Prérequis :** un **Pass actif** (Pass d'entrée ou abonnement) et une adresse e-mail confirmée.

Aucun gain n'est garanti : le solde dépend uniquement des récompenses et commissions effectivement validées.`,
    suggestions: [
      "Quel est le délai de rétractation ?",
      "Comment fonctionne le parrainage ?",
      "Quels moyens de paiement sont acceptés ?"
    ],
    links: [
      { label: "Accéder à mon espace", view: "dashboard" }
    ]
  },
  {
    keywords: ['parrain', 'parrainage', 'affiliation', 'commission', 'filleul', 'bonus', 'inviter'],
    title: 'Parrainage',
    answer: `Le programme de parrainage de GLOBAL-AF est simple, direct et transparent (1 niveau) :

• **10 % sur le Pass Membre :** dès que votre filleul direct active son compte avec le Pass Membre, vous recevez 10 % du prix du Pass sur votre solde.
• **5 % sur sa 1ère commande :** sur la première vente réelle de votre filleul sur l'application (abonnement VIP, formation payante, consultation ou prestation).
• **1 seul niveau :** les commissions sont calculées uniquement sur vos filleuls directs.
• **Suivi :** votre lien d'affiliation et l'historique de vos commissions sont disponibles en temps réel dans votre espace personnel.
• **Retraits :** vos gains validés sont retirables directement vers votre compte Wave, Orange Money, MTN MoMo ou Moov Money dès le seuil atteint.

Aucun gain n'est garanti.`,
    suggestions: [
      "Comment retirer mes commissions ?",
      "Quel est le prix du Pass Membre ?"
    ],
    links: [
      { label: "Voir la page Affiliation", view: "affiliation" },
      { label: "Mon lien de parrainage", view: "dashboard" }
    ]
  },
  {
    keywords: ['micro-job', 'microjob', 'mission', 'tâche', 'tache', 'remunere', 'sondage', 'test'],
    title: 'Micro-jobs et missions',
    answer: `Les missions sont des tâches numériques (sondages, tests, revues de contenu) :

• **Récompense connue à l'avance :** chaque mission indique sa récompense et ses conditions avant que vous commenciez. Il n'y a aucun tirage au sort.
• **Validation :** la récompense est versée si votre preuve est validée.
• **Disponibilité :** l'envoi de preuves et le versement des récompenses **ne sont pas encore ouverts**. Le catalogue présenté est une démonstration de ce qui sera proposé.

Aucun gain n'est garanti.`,
    suggestions: [
      "Comment retirer mes gains ?",
      "Quels sont les packs et tarifs ?"
    ],
    links: [
      { label: "Voir le catalogue des missions", view: "missions" }
    ]
  },
  {
    keywords: ['retractation', 'rétractation', 'remboursement', '7j', '7 jours', 'garantie', 'annuler'],
    title: 'Délai de rétractation',
    answer: `Le **droit de rétractation de 7 jours** s'applique au **Pass d'entrée** (Standard) :

• **Demande :** depuis la rubrique « Paramètres » de votre espace. Vos accès aux missions, formations et retraits sont retirés.
• **Parrainage :** le Pass d'entrée ne génère aucune commission pour le parrain.
• **Remboursement :** il est traité par notre équipe vers votre moyen de paiement, **sous déduction des frais de transaction (3 %)**.
• **Abonnements (VIP Premium) :** non remboursables car l'accès aux fichiers et répertoires VCF téléchargeables est immédiat.`,
    suggestions: [
      "Quels moyens de paiement sont acceptés ?",
      "Comment contacter le support ?"
    ],
    links: [
      { label: "Consulter la charte de transparence", view: "transparence" }
    ]
  },
  {
    keywords: ['gratuit', 'inscription', 'sans achat', 'prix', 'cout', 'coût', 'abonnement', 'tarif', 'packs', 'premium', 'standard', 'business'],
    title: 'Offres et tarifs',
    answer: `L'inscription est **gratuite**. Pour participer aux missions rémunérées, suivre les formations et demander un retrait, un **Pass actif** est nécessaire :

• **Pass d'entrée (Standard) :** rétractation de 7 jours, remboursement sous déduction des frais de transaction (3 %).
• **Abonnements (Premium, Business) :** 30 jours par paiement, renouvelables à la main (aucun prélèvement automatique) ; non remboursables, reconnu avant paiement.
• **Contenu et prix :** chaque offre décrit précisément ce qu'elle contient, son prix et ses éventuels frais **avant** le paiement, sur la page de paiement elle-même.
• **Pas d'endettement :** ne souscrivez jamais une offre en vous endettant. Vous pouvez fixer un plafond de dépense mensuel dans « Paramètres ».
• **Gains :** acheter une offre ne garantit aucun gain.

Les conditions d'accès détaillées de chaque rubrique sont indiquées dans votre espace.`,
    suggestions: [
      "Quels moyens de paiement sont acceptés ?",
      "Quel est le délai de rétractation ?"
    ],
    links: [
      { label: "Voir la page d'accueil", view: "landing" }
    ]
  },
  {
    keywords: ['wave', 'orange', 'mtn', 'moov', 'operateur', 'opérateur', 'momo', 'visa', 'carte', 'paiement', 'payer', 'cinetpay'],
    title: 'Moyens de paiement',
    answer: `Les paiements d'offres se font sur une **page sécurisée de notre partenaire CinetPay** :

• **Mobile Money :** Wave, Orange Money, MTN MoMo, Moov Money ; vous choisissez votre opérateur sur cette page.
• **Carte bancaire Visa :** les données de votre carte sont saisies uniquement sur la page sécurisée, jamais sur GLOBAL-AF ; une adresse de facturation vous est demandée.
• **Devise :** Franc CFA (XOF).
• **Activation :** votre offre est activée après la confirmation du paiement, pas avant.

Les **retraits** de gains se font vers un compte Mobile Money (voir « retraits »).`,
    suggestions: [
      "Comment fonctionne un retrait ?",
      "Quel est le délai de rétractation ?"
    ]
  },
  {
    keywords: ['formation', 'academie', 'académie', 'cours', 'certif', 'whatsapp', 'vcf', 'apprendre'],
    title: 'Digital Academy',
    answer: `La Digital Academy propose des cours pratiques (vidéos, documents, quiz) sur la vente avec WhatsApp, la rédaction, l'intelligence artificielle ou l'e-commerce.

• **Quiz :** vous obtenez votre score à la fin d'un quiz.
• **Points et certificats :** leur délivrance **n'est pas encore ouverte** ; aucun point ni certificat n'est enregistré pour le moment.
• **Fichiers VCF :** le téléchargement n'est pas encore disponible (les droits d'usage des données sont en cours de validation).

Les cours ne promettent aucun revenu.`,
    suggestions: [
      "Quels sont les packs et tarifs ?",
      "Comment contacter le support ?"
    ],
    links: [
      { label: "Découvrir la Digital Academy", view: "academy" }
    ]
  },
  {
    keywords: ['support', 'contact', 'aide', 'ticket', 'probleme', 'problème'],
    title: 'Support',
    answer: `Le **support par tickets n'est pas encore ouvert** dans l'espace membre : un message envoyé depuis cette rubrique ne serait pas enregistré.

• Pour la **rétractation du Pass d'entrée** : rubrique « Paramètres » de votre espace (l'abonnement VIP Premium n'est pas remboursable).
• Pour un **paiement débité sans activation** : conservez la référence affichée sur la page de retour du paiement.

Ce chatbot est un assistant automatique : il informe mais ne remplace ni un conseil juridique, ni un conseil financier.`,
    suggestions: [
      "Quel est le délai de rétractation ?",
      "Comment fonctionne un retrait ?"
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
      text: "Akwaba ! Moi c'est **Babi**, votre assistant officiel sur GLOBAL-AF 🐘.\n\nJe suis là pour vous orienter sur le fonctionnement de la plateforme, les **micro-jobs**, les **retraits Mobile Money**, les **outils IA**, l'**Académie** ou le **parrainage**.\n\nPosez-moi votre question ou cliquez sur une suggestion ci-dessous !",
      time: 'À l\'instant',
      suggestions: [
        "Comment retirer mes gains Mobile Money ?",
        "Comment fonctionne le parrainage ?",
        "Combien coûtent le Pass Membre et le VIP ?",
        "Comment fonctionnent les outils IA ?",
        "Quel est le délai de rétractation du Pass ?"
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
        text: "La discussion a été réinitialisée ! Je suis **Babi**, posez-moi votre question ou choisissez une suggestion ci-dessous 🐘.",
        time: 'À l\'instant',
        suggestions: [
          "Comment retirer mes gains Mobile Money ?",
          "Comment fonctionne le parrainage ?",
          "Combien coûtent le Pass Membre et le VIP ?",
          "Rétractation du Pass d'entrée"
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
              "Comment fonctionne le parrainage ?",
              "Comment fonctionne un retrait ?",
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
        replyText = `Je n'ai pas de réponse précise à cette question. Voici ce que je peux expliquer :\n\n• **Retraits** : contrôlés avant paiement, frais et montant net affichés avant validation ; Pass actif requis.\n• **Parrainage** : commissions uniquement sur ventes réelles, 2 niveaux maximum.\n• **Paiements** : Mobile Money ou carte Visa sur une page sécurisée.\n• **Rétractation** : 7 jours pour le Pass d'entrée (frais de transaction retenus) ; abonnements VIP Premium non remboursables (fichiers VCF).\n\nAucun gain n'est garanti.`;
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
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-400/20 border border-orange-500/30 flex items-center justify-center shadow-md shadow-orange-500/10">
              <BabiVector mood="wave" size={32} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                Babi
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold hidden sm:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Assistant officiel
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Mascotte & Assistant GLOBAL-AF · Informations en direct
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
              <div className="w-7 h-7 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <BabiVector mood="happy" size={22} />
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
            <div className="w-7 h-7 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <BabiVector mood="think" size={22} />
            </div>
            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tl-xs flex items-center gap-1.5 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span className="text-[11px] text-slate-300">Babi prépare votre réponse...</span>
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
            <span>Informations générales : vérifiez les conditions avant tout paiement</span>
          </div>
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
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <motion.button
          aria-label="Discuter avec Babi"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-ink hover:bg-ink-soft text-white rounded-full shadow-2xl border-2 border-white/20 font-bold text-xs sm:text-sm"
        >
          <div className="relative shrink-0">
            <BabiVector mood="wave" size={26} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-ink animate-pulse" />
          </div>
          <span className="hidden sm:inline">Discuter avec Babi</span>
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
