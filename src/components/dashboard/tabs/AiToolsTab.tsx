import React, { useState } from 'react';
import { Award, BookOpen, Briefcase, Check, Copy, Loader2, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { BabiVector } from '../../brand/BabiVector';
import { Btn, Gate, inputCls, PageTitle, Panel } from '../ui';

type Tool = 'copywriter' | 'marketing_ideas' | 'summarizer' | 'prompts';
const TOOLS = [
  { id: 'copywriter' as Tool, icon: Sparkles, label: 'Assistant rédactionnel', sub: 'WhatsApp, Facebook', prompt: 'Décrivez le produit ou service à promouvoir (ex. paniers vivriers à Cocody)' },
  { id: 'marketing_ideas' as Tool, icon: Briefcase, label: 'Idées marketing', sub: 'Plan d’action terrain', prompt: 'Secteur d’activité ou projet d’entreprise' },
  { id: 'summarizer' as Tool, icon: BookOpen, label: 'Résumeur', sub: 'Contrats et textes', prompt: 'Collez le texte long à synthétiser' },
  { id: 'prompts' as Tool, icon: Award, label: 'Générateur de prompts', sub: 'Requêtes expertes', prompt: 'Sujet pour lequel créer des prompts optimisés' },
];

export const AiToolsTab: React.FC<{ onActivate: (plan: 'standard' | 'premium') => void }> = ({ onActivate }) => {
  const { currentUser, runAITool, isAILoading } = useApp();
  const [tool, setTool] = useState<Tool>('copywriter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  if (!currentUser) return null;

  if (!currentUser.isActivated) {
    return (
      <div>
        <PageTitle title="Outils IA" subtitle="Rédaction, idées marketing, résumés et prompts." />
        <Gate pill="Pass requis" title="Les outils IA demandent un Pass actif." text="Générez des annonces WhatsApp et Facebook, des plans marketing et des résumés. Le prix et le contenu sont affichés avant paiement." prop="phone">
          <Btn onClick={() => onActivate('standard')}><Zap className="h-4 w-4" />Activer le Pass (3 000 FCFA)</Btn>
          <Btn kind="ghost" onClick={() => onActivate('premium')}>Voir le VIP Premium</Btn>
        </Gate>
      </div>
    );
  }

  const current = TOOLS.find(t => t.id === tool)!;
  const run = async () => {
    if (!input.trim()) return;
    setError(null);
    const res = await runAITool(tool, input);
    if (res.success) { setOutput(res.text); setRemaining(res.remaining ?? null); } else { setOutput(''); setError(res.text); }
  };
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <PageTitle title="Outils IA" subtitle="Des textes pour vous aider à écrire. Relisez toujours : l'IA peut se tromper." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TOOLS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTool(t.id)} aria-pressed={tool === t.id} className={`rounded-3xl p-4 text-left ring-1 transition ${tool === t.id ? 'bg-wax text-white ring-wax' : 'bg-white ring-ink/10 hover:ring-ink/30'}`}>
              <Icon className="h-5 w-5" />
              <p className="mt-2 text-[15px] font-bold leading-tight">{t.label}</p>
              <p className={`text-[12px] ${tool === t.id ? 'text-white/80' : 'text-ink/50'}`}>{t.sub}</p>
            </button>
          );
        })}
      </div>

      <Panel className="mt-5">
        <label className="block text-sm font-bold">{current.prompt}
          <textarea rows={4} value={input} onChange={e => setInput(e.target.value)} className={inputCls} placeholder="Écrivez vos instructions détaillées…" />
        </label>
        <Btn onClick={run} disabled={isAILoading || !input.trim()} className="mt-4 w-full sm:w-auto">
          {isAILoading ? <><Loader2 className="h-4 w-4 animate-spin" />Génération…</> : <><Sparkles className="h-4 w-4" />Générer avec l'IA</>}
        </Btn>
        {remaining !== null && !error && <p className="mt-3 text-[13px] text-ink/55">Il vous reste {remaining} essai{remaining > 1 ? 's' : ''} aujourd'hui pour cet outil. N'y ajoutez que des informations réelles et vérifiées.</p>}
        {error && <p role="alert" className="mt-3 rounded-2xl bg-rose-50 p-3 text-[14px] font-semibold text-rose-700">{error}</p>}
      </Panel>

      <Panel className="mt-5 !bg-ink !text-white ring-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sun">Résultat</span>
          <button onClick={copy} disabled={!output} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/10 px-4 text-sm font-bold hover:bg-white/20 disabled:opacity-40">
            {copied ? <><Check className="h-4 w-4" />Copié</> : <><Copy className="h-4 w-4" />Copier</>}
          </button>
        </div>
        <div className="mt-3 min-h-40 whitespace-pre-wrap rounded-2xl bg-black/30 p-4 text-[15px] leading-relaxed text-white/90">
          {output || <div className="grid h-40 place-items-center text-center text-white/55"><div><BabiVector mood="think" size={84} className="mx-auto" /><p className="mt-1">Le texte généré apparaîtra ici.</p></div></div>}
        </div>
      </Panel>
    </div>
  );
};
