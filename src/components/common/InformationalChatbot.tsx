import { fmtPct, usePublicRates } from '../../lib/useRates';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, RotateCcw, Copy, Check, ThumbsUp, ThumbsDown, 
  HelpCircle, ShieldCheck, ArrowRight, MessageSquare, X, Maximize2, Minimize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BabiVector } from '../brand/BabiVector';
import { ScarfRibbon, WaxPattern } from '../brand/Illustrations';

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
    answer: `Voici comment fonctionnent les retraits sur AH GLOBAL :

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
    answer: `Le programme de parrainage d’AH GLOBAL est simple, direct et transparent (1 niveau) :

• **{{passPct}} % sur le Pass Membre :** dès que votre filleul direct active son compte avec le Pass Membre, vous recevez {{passPct}} % du prix du Pass sur votre solde.
• **{{firstSalePct}} % sur sa 1ère commande :** sur la première vente réelle de votre filleul sur l'application (abonnement VIP, formation payante, consultation ou prestation).
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
• **Parrainage :** si le Pass est remboursé, la commission du parrain est annulée.
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
• **Carte bancaire Visa :** les données de votre carte sont saisies uniquement sur la page sécurisée, jamais sur AH GLOBAL ; une adresse de facturation vous est demandée.
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
  const rates = usePublicRates();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: "Akwaba ! Moi c'est **Babi**, votre assistant officiel sur AH GLOBAL 🐘.\n\nJe suis là pour vous orienter sur le fonctionnement de la plateforme, les **micro-jobs**, les **retraits Mobile Money**, les **outils IA**, l'**Académie** ou le **parrainage**.\n\nPosez-moi votre question ou cliquez sur une suggestion ci-dessous !",
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
        // Les taux viennent de la configuration en direct, pas d'un texte figé.
        const fill = (t: string) => t.replace(/\{\{(passPct|firstSalePct)\}\}/g, (_m, k: 'passPct' | 'firstSalePct') => fmtPct(rates[k]));
        return { ...item, answer: fill(item.answer) };
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
    <div className={`flex flex-col overflow-hidden bg-white ${mode === 'floating' ? 'h-full w-full' : 'mx-auto h-[640px] w-full max-w-3xl rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(15,42,30,0.45)] ring-1 ring-ink/10'}`}>
      <ScarfRibbon thin />

      {/* En-tête */}
      <div className="relative shrink-0 overflow-hidden bg-ink px-4 py-3.5 text-white sm:px-5" style={{ paddingTop: mode === 'floating' ? 'max(0.875rem, env(safe-area-inset-top, 0px))' : undefined }}>
        <WaxPattern tone="dark" className="pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white">
              <BabiVector mood={isLoading ? 'think' : 'wave'} size={38} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-leaf ring-2 ring-ink" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-extrabold leading-tight">Babi</h2>
              <p className="truncate text-[13px] text-white/65">Assistant d’information</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            <button onClick={handleResetChat} aria-label="Effacer la conversation" title="Effacer la conversation" className="grid h-11 w-11 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"><RotateCcw className="h-[18px] w-[18px]" /></button>
            {mode === 'floating' && onCloseFloating && (
              <button onClick={onCloseFloating} aria-label="Fermer l’assistant" title="Fermer" className="grid h-11 w-11 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
            )}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div role="log" aria-live="polite" aria-label="Conversation avec Babi" className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-mist px-3.5 py-5 sm:px-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white ring-1 ring-ink/10"><BabiVector mood="happy" size={28} /></span>
            )}
            <div className="min-w-0 max-w-[88%] space-y-2 sm:max-w-[80%]">
              <div className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${msg.role === 'user' ? 'rounded-tr-md bg-wax font-medium text-white' : 'rounded-tl-md bg-white text-ink ring-1 ring-ink/10'}`}>
                <div className="space-y-2">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split('\n').map((line, lIdx) => (
                        <span key={lIdx} className="block">
                          {line.startsWith('• ') ? (
                            <span className="flex items-start gap-2 pl-0.5">
                              <span className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${msg.role === 'user' ? 'bg-white' : 'bg-wax'}`} aria-hidden="true" />
                              <span className="min-w-0">{renderFormattedText(line.slice(2))}</span>
                            </span>
                          ) : (
                            renderFormattedText(line)
                          )}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                {msg.links && msg.links.length > 0 && onNavigateView && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-ink/10 pt-3">
                    {msg.links.map((link, lIdx) => (
                      <button key={lIdx} type="button" onClick={() => onNavigateView(link.view)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-bold text-white hover:bg-ink-soft">
                        {link.label}<ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'bot' && (
                <div className="flex items-center gap-1 px-1 text-[12px] text-ink/45">
                  <span className="mr-1">{msg.time}</span>
                  <button onClick={() => handleCopy(msg.id, msg.text)} aria-label="Copier la réponse" className="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 hover:bg-white hover:text-ink">
                    {copiedId === msg.id ? <><Check className="h-3.5 w-3.5 text-leaf" /><span className="font-semibold text-leaf-deep">Copié</span></> : <><Copy className="h-3.5 w-3.5" /><span>Copier</span></>}
                  </button>
                  <button onClick={() => handleFeedback(msg.id, true)} aria-label="Réponse utile" aria-pressed={likedMap[msg.id] === true} className={`grid h-9 w-9 place-items-center rounded-full hover:bg-white ${likedMap[msg.id] === true ? 'text-leaf' : 'hover:text-ink'}`}><ThumbsUp className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleFeedback(msg.id, false)} aria-label="Réponse non pertinente" aria-pressed={likedMap[msg.id] === false} className={`grid h-9 w-9 place-items-center rounded-full hover:bg-white ${likedMap[msg.id] === false ? 'text-rose-600' : 'hover:text-ink'}`}><ThumbsDown className="h-3.5 w-3.5" /></button>
                </div>
              )}

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggestions.map((sug, sIdx) => (
                    <button key={sIdx} type="button" onClick={() => handleSendMessage(sug)} disabled={isLoading} className="min-h-10 rounded-full bg-white px-4 py-2 text-left text-[13px] font-semibold text-ink ring-1 ring-ink/15 transition hover:bg-wax/8 hover:ring-wax disabled:opacity-50">
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5" role="status">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white ring-1 ring-ink/10"><BabiVector mood="think" size={28} /></span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[13px] text-ink/60 ring-1 ring-ink/10">
              <span className="flex gap-1" aria-hidden="true">{[0, 150, 300].map(d => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-wax" style={{ animationDelay: `${d}ms` }} />)}</span>
              Babi prépare votre réponse…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Saisie */}
      <div className="shrink-0 border-t border-ink/10 bg-white px-3.5 pt-3 sm:px-5" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
          <label className="min-w-0 flex-1"><span className="sr-only">Votre question</span>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Posez votre question…" enterKeyHint="send" autoComplete="off"
              className="w-full rounded-full border border-ink/15 bg-mist px-5 py-3 text-base text-ink outline-none placeholder:text-ink/40 focus:border-wax focus:bg-white" />
          </label>
          <button type="submit" disabled={!input.trim() || isLoading} aria-label="Envoyer" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-wax text-white shadow-[0_10px_20px_-10px_rgba(255,119,0,0.8)] transition hover:bg-wax-deep disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-5 w-5" /></button>
        </form>
        <p className="mt-2 flex items-center gap-1.5 px-1 text-[12px] leading-snug text-ink/50"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-leaf" />Informations générales : vérifiez les conditions avant tout paiement.</p>
      </div>
    </div>
  );
};

// Met en gras les passages **ainsi** dans les réponses.
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => (part.startsWith('**') && part.endsWith('**')
        ? <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>
        : part))}
    </>
  );
}

// Bouton flottant + fenêtre : plein écran sur téléphone, fenêtre ancrée en bas à droite sur ordinateur.
export const FloatingChatbotWidget: React.FC<{
  onNavigateView?: (view: string) => void;
}> = ({ onNavigateView }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    const mobile = window.matchMedia('(max-width: 639px)').matches;
    const prev = document.body.style.overflow;
    if (mobile) document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <>
      <div className="chatbot-fab fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <motion.button
          aria-label="Discuter avec Babi"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(o => !o)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2.5 rounded-full border-2 border-white/25 bg-ink py-2 pl-2 pr-2 text-sm font-bold text-white shadow-[0_18px_40px_-14px_rgba(15,42,30,0.7)] hover:bg-ink-soft sm:pr-5"
        >
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white">
            <BabiVector mood="wave" size={32} />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-leaf ring-2 ring-ink" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">Discuter avec Babi</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Assistant Babi"
            className="fixed inset-0 z-[60] overflow-hidden bg-white shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(680px,calc(100dvh-8rem))] sm:w-[420px] sm:rounded-[2rem] sm:ring-1 sm:ring-ink/10"
          >
            <InformationalChatbot
              mode="floating"
              onNavigateView={(view) => { if (onNavigateView) onNavigateView(view); setIsOpen(false); }}
              onCloseFloating={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
