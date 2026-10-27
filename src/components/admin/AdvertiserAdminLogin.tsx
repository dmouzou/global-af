import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldAlert, CheckCircle2, ArrowLeft, Building2, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe administrateur.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userDocRef = doc(db, 'users', cred.user.uid);
      const userSnap = await getDoc(userDocRef);

      const role = userSnap.exists() ? userSnap.data().role : null;
      if (role !== 'admin' && role !== 'super_admin' && role !== 'financial_manager') {
        setError("Accès refusé. Ce compte ne possède pas de privilèges administratifs (Section 25).");
        setIsLoading(false);
        return;
      }

      const sessionData = {
        email: cred.user.email || email.trim(),
        companyName: 'GLOBAL-AF Direction Générale',
        role: 'admin' as const
      };

      onLoginSuccess(sessionData);
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Identifiants administrateur incorrects.'
        : (err.message || 'Erreur lors de la connexion administrative.');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
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
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au site public</span>
        </a>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Portail d'Administration</span>
        </div>
      </div>

      {/* Card Container with Apple Liquid Glass Dark */}
      <div className="w-full max-w-md liquid-glass-dark rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl liquid-glass-btn mb-2">
            <BrandLogo size="md" showSubtitle={false} variant="white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
            Console d'Administration
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Accès sécurisé réservé aux administrateurs certifiés et auditeurs financiers
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Adresse email professionnelle
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@global-af.ci"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Mot de passe sécurisé
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500/20"
              />
              <span>Mémoriser ma session</span>
            </label>

            <span className="text-[11px] text-slate-500 font-mono">
              Firebase Auth / TLS 1.3
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
                <span>Authentification en cours...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Se connecter à la console</span>
              </>
            )}
          </button>
        </form>

        {/* Notice for administration */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-400">
            Conformité Section 25 : les accès de niveau administrateur sont vérifiés par règles de sécurité Firebase et audités.
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
