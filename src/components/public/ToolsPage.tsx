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
  const { vcfResources } = useApp();
  const [productName, setProductName] = useState('Savon artisanal naturel au beurre de karité');
  const [generatedPost, setGeneratedPost] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCopy = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPost(
        `✨ DÉCOUVREZ L'ÉCLAT NATUREL AVEC LE KARITÉ PUR D'ABIDJAN ! ✨\n\n` +
        `Fatigué(e) des agressions du soleil et des produits chimiques ? Offrez à votre peau le meilleur du terroir ivoirien.\n\n` +
        `🌿 100% Naturel & Fait main\n` +
        `💧 Hydratation profonde pour toute la famille\n` +
        `📦 Livraison express partout à Abidjan (Cocody, Yopougon, Plateau, Marcory)\n` +
        `💳 Paiement sécurisé à la livraison via Wave ou Orange Money !\n\n` +
        `📲 Commandez maintenant en cliquant sur le lien WhatsApp ci-dessous !`
      );
      setIsGenerating(false);
    }, 600);
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
            <span>Suite d'Outils Professionnels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Outils Numériques & IA pour Créateurs & Commerçants
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Booster vos ventes locales sur WhatsApp Business, optimisez vos accroches publicitaires et accédez aux bases de prospection B2B qualifiées en Côte d'Ivoire.
          </p>
        </div>

        {/* Live Interactive Copywriting Assistant */}
        <div className="bg-gradient-to-br from-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-orange-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Démo Interactive Gratuite
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Générateur d'Accroches WhatsApp & Facebook
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Entrez la description de votre produit ou service. L'outil génère instantanément un texte publicitaire prêt à être publié, optimisé pour les habitudes d'achat à Abidjan.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Votre produit ou service :</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. Robes africaines modernes en pagne tissé..."
                />
              </div>

              <button
                onClick={handleGenerateCopy}
                disabled={isGenerating || !productName.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Création du texte...</span>
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
                  <span>Résultat Optimisé pour le Marché Ivoirien</span>
                </span>
                {generatedPost && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-white/10 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                )}
              </div>

              <div className="bg-black/30 p-4 rounded-xl min-h-[160px] text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                {generatedPost || (
                  <span className="text-slate-400 italic font-sans">
                    Cliquez sur "Générer le texte publicitaire" pour voir un exemple de message convertissant avec intégration du Mobile Money.
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
