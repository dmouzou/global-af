import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  FolderDown, 
  Smartphone, 
  Lightbulb, 
  FileText, 
  ArrowRight,
  Loader2
} from 'lucide-react';

interface ToolsPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { vcfResources, runAITool } = useApp();
  const [productName, setProductName] = useState('Ensemble de robes en pagne baoulé');
  const [price, setPrice] = useState('18 000 FCFA');
  const [tone, setTone] = useState<'impact' | 'nouchi' | 'story' | 'promo'>('impact');
  const [platform, setPlatform] = useState<'whatsapp' | 'facebook'>('whatsapp');
  const [city, setCity] = useState('Abidjan');
  const [generatedPost, setGeneratedPost] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSource, setAiSource] = useState<string>('gemini_ai');

  const handleGenerateCopy = async () => {
    const prod = productName.trim() || 'votre produit';
    const pr = price.trim();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: prod,
          price: pr,
          city: city.trim() || 'Abidjan',
          tone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setGeneratedPost(data.text);
          setAiSource(data.source || 'gemini_ai');
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend /api/generate-copy not reachable, falling back to context AI runner:', e);
    }

    try {
      const contextPrompt = `Produit : "${prod}", Prix : "${pr || 'Sur demande'}", Ville : "${city}", Style : ${tone}`;
      const res = await runAITool('copywriter', contextPrompt, tone);
      setGeneratedPost(res);
      setAiSource('gemini_context');
    } catch (err) {
      console.error('AI generator fallback error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Suite d'Outils Numériques</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Outils Numériques & IA pour Créateurs & Commerçants
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Booster vos ventes locales sur WhatsApp Business, optimisez vos accroches publicitaires et accédez aux bases de prospection B2B qualifiées en Côte d'Ivoire.
          </p>
        </div>

        {/* Live Interactive Copywriting Assistant */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-orange-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  <span>Assistant IA Gemini & West Africa</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  En ligne
                </span>
              </div>

              {/* 3D Mascot Greeting */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <img 
                  src="/images/mascot-ai-tools.jpg" 
                  alt="Babi l'Éléphant Mascotte IA" 
                  className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-md border border-orange-500/40"
                />
                <div className="text-xs text-slate-300 leading-snug">
                  <div className="font-bold text-white text-[13px] flex items-center gap-1.5">
                    <span>Babi l'Éléphant</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/30 text-orange-300 font-semibold">Mascotte Officielle</span>
                  </div>
                  « Donnez-moi votre produit et je vous génère une accroche qui cartonne sur WhatsApp et Facebook avec les codes de vente locaux ! »
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Générateur d'Accroches WhatsApp & Réseaux Sociaux
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connecté au modèle <strong className="text-orange-300">Google Gemini Flash</strong> spécialement instruit sur les habitudes de consommation, le vocabulaire nouchi et les paiements Mobile Money en Côte d'Ivoire.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Votre produit ou service :</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="ex. Chaussures en cuir fait main, Formation Canva..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Prix (optionnel) :</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="ex. 15 000 FCFA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Ville / Marché :</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Abidjan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Style / Ton de rédaction :</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTone('impact')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-left transition-all ${
                        tone === 'impact' 
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-2xs' 
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚡ Impact & Vente Directe
                    </button>
                    <button
                      type="button"
                      onClick={() => setTone('nouchi')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-left transition-all ${
                        tone === 'nouchi' 
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-2xs' 
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      🔥 Vibe Ivoirienne / Nouchi
                    </button>
                    <button
                      type="button"
                      onClick={() => setTone('promo')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-left transition-all ${
                        tone === 'promo' 
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-2xs' 
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      🚨 Urgence & Vente Flash
                    </button>
                    <button
                      type="button"
                      onClick={() => setTone('story')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-left transition-all ${
                        tone === 'story' 
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-2xs' 
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      ✨ Storytelling Émotion
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateCopy}
                disabled={isGenerating || !productName.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Création du texte personnalisé...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Générer le texte publicitaire</span>
                  </>
                )}
              </button>
            </div>

            {/* Output Card */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                <span className="font-bold text-orange-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Résultat Optimisé pour Conversion Mobile</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    {aiSource === 'gemini_ai' ? '✨ Gemini Flash' : '⚡ Smart Model CI'}
                  </span>
                </span>
                {generatedPost && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(generatedPost)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Tester sur WhatsApp</span>
                    </a>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-black/40 p-4 rounded-xl min-h-[190px] text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5">
                {generatedPost || (
                  <span className="text-slate-400 italic font-sans flex items-center justify-center h-36 text-center">
                    Entrez votre produit à gauche et cliquez sur « Générer le texte publicitaire » pour obtenir instantanément votre texte convertissant avec tarifs et Mobile Money.
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* VCF B2B Contact Directories Section */}
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Répertoires de Contacts Professionnels VCF
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Des carnets d'adresses qualifiés d'entreprises, grossistes et artisans par secteur en Côte d'Ivoire. Téléchargeables en 1 clic pour votre prospection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vcfResources.map((res) => (
              <div
                key={res.id}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {res.sector}
                    </span>
                    <span className="text-xs font-notable text-slate-700 font-bold">
                      {res.entriesCount} contacts
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Format universel .VCF
                  </span>
                  <button
                    onClick={() => onGoToDashboard()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                  >
                    <FolderDown className="w-3.5 h-3.5" />
                    <span>Accéder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
          >
            <span>Débloquer tous les outils IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
