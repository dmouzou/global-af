import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Check, Copy, FolderDown, Loader2, Sparkles } from 'lucide-react';
import { BabiVector } from '../brand/BabiVector';
import { IlluTools, ScarfRibbon } from '../brand/Illustrations';
import { CtaBand, Eyebrow, GhostButton, PageHero, PrimaryButton } from '../ui/kit';

interface ToolsPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

type Tone = 'impact' | 'nouchi' | 'story' | 'promo';
const TONES: { id: Tone; label: string }[] = [
  { id: 'impact', label: 'Direct' },
  { id: 'nouchi', label: 'Nouchi' },
  { id: 'promo', label: 'Promotion' },
  { id: 'story', label: 'Storytelling' },
];
const TONE_MAP: Record<Tone, string> = {
  impact: 'direct',
  nouchi: 'familier ivoirien (nouchi)',
  story: 'storytelling',
  promo: 'promotionnel',
};

const field = 'mt-1.5 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-wax';

export const ToolsPage: React.FC<ToolsPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { vcfResources, runAITool, currentUser } = useApp();
  const [productName, setProductName] = useState('Ensemble de robes en pagne baoulé');
  const [price, setPrice] = useState('18 000 FCFA');
  const [tone, setTone] = useState<Tone>('impact');
  const [platform, setPlatform] = useState<'whatsapp' | 'facebook'>('whatsapp');
  const [city, setCity] = useState('Abidjan');
  const [generatedPost, setGeneratedPost] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSource, setAiSource] = useState<'template' | 'gemini'>('template');
  const [notice, setNotice] = useState<string | null>(null);

  // Trame locale (sans IA) : uniquement ce que le visiteur a saisi ; les crochets [ ]
  // indiquent ce qu'il doit compléter avec des faits réels (aucune garantie ni rareté inventée).
  const buildTemplate = (prod: string, pr: string, town: string) =>
    `${prod} — ${town}\n\n` +
    `[Décrivez précisément le produit ou le service : caractéristiques, conditions.]\n\n` +
    `💰 Prix : ${pr || '[à préciser]'}\n` +
    `🚚 Livraison : [précisez vos conditions et délais réels]\n` +
    `💳 Paiement : [précisez les moyens que vous acceptez réellement]\n\n` +
    `📲 Contact : [votre numéro WhatsApp ou e-mail]`;

  const handleGenerateCopy = async () => {
    const prod = productName.trim() || 'votre produit';
    const pr = price.trim();
    const town = city.trim() || 'Abidjan';
    setIsGenerating(true);
    setNotice(null);

    // Génération par l'IA (serveur → Gemini) : réservée aux membres connectés avec un Pass actif.
    if (currentUser && currentUser.isActivated) {
      const contextPrompt = `Produit : "${prod}", Prix : "${pr || 'à préciser'}", Ville : "${town}", Canal : ${platform}`;
      const res = await runAITool('copywriter', contextPrompt, TONE_MAP[tone]);
      if (res.success) {
        setGeneratedPost(res.text);
        setAiSource('gemini');
      } else {
        setGeneratedPost('');
        setNotice(res.text);
      }
      setIsGenerating(false);
      return;
    }

    setGeneratedPost(buildTemplate(prod, pr, town));
    setAiSource('template');
    setNotice(currentUser
      ? "Activez un Pass pour générer ce texte avec l'IA : voici une trame à compléter."
      : "Créez un compte et activez un Pass pour générer ce texte avec l'IA : voici une trame à compléter.");
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const start = () => (currentUser ? onGoToDashboard() : onOpenAuth('signup'));

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow="Outils numériques"
        title="Des outils IA pour vendre plus clairement, sans promesses en l'air."
        subtitle="Rédigez une annonce WhatsApp ou Facebook, trouvez des idées marketing, résumez un texte. Les textes générés vous aident à écrire : relisez-les et n'affirmez que des faits réels."
        actions={
          <>
            <PrimaryButton onClick={() => document.getElementById('generateur')?.scrollIntoView({ behavior: 'smooth' })}>Essayer le générateur <ArrowRight className="h-5 w-5" /></PrimaryButton>
            <GhostButton onClick={start}>{currentUser ? 'Mon espace' : 'Créer mon compte'}</GhostButton>
          </>
        }
        illustration={<IlluTools className="w-full" title="Illustration : une bulle de texte et une puce IA" />}
      />

      <section id="generateur" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-[2rem] bg-white p-7 ring-1 ring-ink/10 lg:col-span-5">
            <Eyebrow>Générateur d'annonces</Eyebrow>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
              Avec un <strong>Pass actif</strong>, le texte est généré par Google Gemini. Sans Pass, vous obtenez une trame à compléter avec vos vrais éléments.
            </p>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-bold">Produit ou service
                <input value={productName} onChange={e => setProductName(e.target.value)} className={field} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-bold">Prix
                  <input value={price} onChange={e => setPrice(e.target.value)} className={field} />
                </label>
                <label className="block text-sm font-bold">Ville
                  <input value={city} onChange={e => setCity(e.target.value)} className={field} />
                </label>
              </div>
              <div>
                <p className="text-sm font-bold">Canal</p>
                <div className="mt-1.5 inline-flex rounded-full bg-mist p-1">
                  {(['whatsapp', 'facebook'] as const).map(p => (
                    <button key={p} onClick={() => setPlatform(p)} aria-pressed={platform === p}
                      className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize transition ${platform === p ? 'bg-ink text-white' : 'text-ink/65'}`}>{p === 'whatsapp' ? 'WhatsApp' : 'Facebook'}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">Ton</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)} aria-pressed={tone === t.id}
                      className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${tone === t.id ? 'bg-wax text-white' : 'bg-mist text-ink/70 hover:text-ink'}`}>{t.label}</button>
                  ))}
                </div>
              </div>
              <PrimaryButton onClick={handleGenerateCopy} disabled={isGenerating} className="w-full justify-center">
                {isGenerating ? <><Loader2 className="h-5 w-5 animate-spin" />Génération…</> : <><Sparkles className="h-5 w-5" />Générer le texte</>}
              </PrimaryButton>
            </div>
          </div>

          <div className="flex flex-col rounded-[2rem] bg-ink p-7 text-white lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sun">
                {generatedPost ? (aiSource === 'gemini' ? 'Texte généré par l’IA' : 'Trame à compléter') : 'Votre texte'}
              </span>
              <button onClick={handleCopy} disabled={!generatedPost} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold hover:bg-white/20 disabled:opacity-40">
                {copied ? <><Check className="h-4 w-4" />Copié</> : <><Copy className="h-4 w-4" />Copier</>}
              </button>
            </div>
            {notice && <p role="status" className="mt-4 rounded-2xl bg-sun/15 p-3.5 text-[14px] leading-relaxed text-sun">{notice}</p>}
            <div className="mt-4 min-h-[260px] flex-1 whitespace-pre-wrap rounded-2xl bg-black/30 p-5 text-[15px] leading-relaxed text-white/90">
              {generatedPost || (
                <div className="grid h-full place-items-center text-center text-white/55">
                  <div>
                    <BabiVector mood="think" size={96} className="mx-auto" />
                    <p className="mt-2">Renseignez votre produit, puis lancez la génération.</p>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-3 text-[13px] text-white/50">Relisez toujours le texte : n'y indiquez que des prix, délais et garanties réels.</p>
          </div>
        </div>
      </section>

      <section className="bg-mist py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Répertoires VCF</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Des carnets d'adresses professionnels, bientôt disponibles.</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            Le téléchargement n'est pas encore ouvert : l'origine et les droits d'usage de chaque contact doivent être documentés et validés avant toute publication.
          </p>
          {vcfResources.length === 0 ? (
            <p className="mt-8 text-[15px] text-ink/55">Le catalogue sera publié à l'ouverture du service.</p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {vcfResources.map(res => (
                <article key={res.id} className="flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-ink/10">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-leaf-deep">{res.sector}</span>
                      <span className="text-xs font-semibold text-ink/45">Bientôt</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold leading-snug">{res.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-ink/65">{res.description}</p>
                  </div>
                  <p className="mt-5 flex items-center gap-2 border-t border-ink/10 pt-4 text-[13px] font-semibold text-ink/50"><FolderDown className="h-4 w-4" />Format .VCF</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Débloquez les outils IA avec votre Pass."
        text="Le compte est gratuit. Le contenu et le prix du Pass sont affichés avant paiement, avec 7 jours pour vous rétracter."
        cta={currentUser ? 'Aller à mon espace' : 'Créer mon compte gratuit'}
        onClick={start}
      />
      <ScarfRibbon />
    </div>
  );
};
