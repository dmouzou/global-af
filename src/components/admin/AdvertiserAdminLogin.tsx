import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldAlert } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { STAFF_ROLES } from '../../lib/staff';
import { BrandLogo } from '../common/BrandLogo';
import { WaxPattern } from '../brand/Illustrations';
import { Btn, inputCls } from '../dashboard/ui';

interface AdvertiserAdminLoginProps {
  onLoginSuccess: (advertiserData: { email: string; companyName: string; role: 'admin' | 'advertiser' }) => void;
  onReturnToPublicSite?: () => void;
}

export const AdvertiserAdminLogin: React.FC<AdvertiserAdminLoginProps> = ({ onLoginSuccess, onReturnToPublicSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError('Renseignez votre adresse e-mail et votre mot de passe.'); return; }
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Le rôle de référence est le claim signé posé par le serveur (celui que les règles et les fonctions vérifient).
      const token = await cred.user.getIdTokenResult(true);
      const role = token.claims.role as string | undefined;
      if (!role || !STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number])) {
        await auth.signOut();
        setError("Accès refusé : ce compte n'appartient pas au personnel de la console.");
        return;
      }
      onLoginSuccess({ email: cred.user.email || email.trim(), companyName: 'AH GLOBAL', role: 'admin' });
    } catch (err: any) {
      setError(err.code === 'auth/invalid-credential' ? 'Identifiants incorrects.' : err.code === 'auth/user-disabled' ? 'Ce compte est suspendu.' : (err.message || 'Connexion impossible.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink p-4">
      <WaxPattern tone="dark" className="pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-md">
        <button type="button" onClick={onReturnToPublicSite} className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"><ArrowLeft className="h-4 w-4" />Retour au site public</button>
        <div className="rounded-[2rem] bg-white p-7 shadow-2xl sm:p-9">
          <BrandLogo size="md" showSubtitle={false} />
          <h1 className="mt-6 font-display text-2xl font-extrabold">Console d'administration</h1>
          <p className="mt-1 text-[15px] text-ink/60">Réservée au personnel d'AH GLOBAL. Chaque action est contrôlée et journalisée.</p>
          {error && <p role="alert" className="mt-5 flex gap-2.5 rounded-2xl bg-rose-50 p-3.5 text-[14px] font-semibold text-rose-700"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-sm font-bold">Adresse e-mail professionnelle
              <div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-ink/40" /><input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className={`${inputCls} pl-11`} /></div>
            </label>
            <label className="block text-sm font-bold">Mot de passe
              <div className="relative"><Lock className="pointer-events-none absolute left-4 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-ink/40" /><input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={`${inputCls} pl-11`} /></div>
            </label>
            <Btn type="submit" disabled={busy} className="w-full py-3.5 text-base">{busy ? 'Connexion…' : 'Se connecter'}</Btn>
          </form>
        </div>
      </div>
    </div>
  );
};
