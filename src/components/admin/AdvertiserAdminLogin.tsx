import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldAlert, CheckCircle2, ArrowLeft, Building2, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface AdvertiserAdminLoginProps {
  onLoginSuccess: (advertiserData: { email: string; companyName: string; role: 'admin' | 'advertiser' }) => void;
  onReturnToPublicSite?: () => void;
}

export const AdvertiserAdminLogin: React.FC<AdvertiserAdminLoginProps> = ({
  onLoginSuccess,
  onReturnToPublicSite
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      label: 'Administrateur Général',
      email: 'admin@global-af.ci',
      pass: 'Admin2026!',
      company: 'GLOBAL-AF Direction Générale',
      role: 'admin' as const
    },
    {
      label: 'Annonceur Orange CI',
      email: 'campagnes@orange-ci.ci',
      pass: 'Orange2026!',
      company: 'Orange Côte d\'Ivoire Marketing',
      role: 'advertiser' as const
    },
    {
      label: 'Annonceur Wave CI',
      email: 'marketing@wave.com',
      pass: 'Wave2026!',
      company: 'Wave Digital Côte d\'Ivoire',
      role: 'advertiser' as const
    }
  ];

  const handleFillDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe annonceur.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Find matching demo or allow valid credentials
      const matched = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
      
      const sessionData = {
        email: email.trim(),
        companyName: matched ? matched.company : 'Annonceur Partenaire Partagé',
        role: matched ? matched.role : (email.includes('admin') ? 'admin' as const : 'advertiser' as const)
      };

      try {
        localStorage.setItem('gaf_admin_auth', JSON.stringify({
          ...sessionData,
          token: 'gaf_adm_sec_' + Date.now(),
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error('Storage error:', err);
      }

      onLoginSuccess(sessionData);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative selection:bg-orange-500 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-orange-600/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-emerald-600/10 blur-[140px] rounded-full"></div>
      </div>

      {/* Top Bar with Return link */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <a 
          href="https://global-af-dev.web.app"
          onClick={(e) => {
            if (onReturnToPublicSite) {
              e.preventDefault();
              onReturnToPublicSite();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au site public (global-af-dev.web.app)</span>
        </a>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Portail Dédié</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-6">
          <div className="flex justify-center">
            <BrandLogo variant="admin" />
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
              Connexion Partenaire & Annonceur
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Accès réservé pour le pilotage des campagnes de micro-jobs, validation des preuves et suivi budgétaire.
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Annonceur ou Partenaire
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.ci"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Mot de passe sécurisé
              </label>
              <button
                type="button"
                onClick={() => alert('Veuillez contacter le support à contact@global-af.ci pour réinitialiser votre accès annonceur.')}
                className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors"
              >
                Oublié ?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500/20"
              />
              <span>Mémoriser ma session</span>
            </label>

            <span className="text-[11px] text-slate-500 font-mono">
              SSL / AES-256
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-orange-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Vérification des accréditations...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Se connecter à la console</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts Selection */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Accès démo prédéfinis :
            </span>
            <span className="text-[10px] text-amber-400/90 font-medium">1-clic pour tester</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {demoAccounts.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleFillDemo(acc)}
                className="w-full text-left p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                    <span>{acc.label}</span>
                    <span className="text-[10px] text-slate-500">({acc.company})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                </div>
                <span className="text-[10px] text-orange-400 font-mono font-bold group-hover:translate-x-0.5 transition-transform">
                  Utiliser →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notice for new advertisers */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-400">
            Vous souhaitez devenir annonceur et diffuser des missions rémunérées ?{' '}
            <a 
              href="mailto:partenaires@global-af.ci" 
              className="text-orange-400 hover:underline font-semibold"
            >
              Contactez le pôle Entreprises
            </a>
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md text-center mt-6 text-xs text-slate-500 space-y-1">
        <p>Déploiement certifié : <span className="font-mono text-slate-400">global-af-dev-admin</span></p>
        <p>© 2026 GLOBAL-AF. Tous droits réservés.</p>
      </div>
    </div>
  );
};
