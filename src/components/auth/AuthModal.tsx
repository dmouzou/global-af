import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LegalDocument } from '../public/LegalDocument';
import { ArrowLeft, ArrowRight, BookOpen, Briefcase, Check, Eye, EyeOff, Mail, ShieldCheck, Smartphone, Users, X } from 'lucide-react';
import { CountryCode } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { BabiMood, BabiProp, BabiVector } from '../brand/BabiVector';
import { ScarfRibbon, WaxPattern } from '../brand/Illustrations';
import { fmtPct, usePublicRates } from '../../lib/useRates';
import { Btn, inputCls } from '../dashboard/ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'onboarding';
  onComplete: () => void;
}

type Mode = 'login' | 'signup' | 'forgot' | 'verify' | 'onboarding';

const ASIDE: Record<Mode, { title: string; text: string; mood: BabiMood; prop: BabiProp }> = {
  signup: { title: 'Créez votre compte gratuit.', text: 'Quelques minutes suffisent. Vous décidez ensuite, en connaissance de cause, de ce que vous activez.', mood: 'wave', prop: 'none' },
  login: { title: 'Content de vous revoir.', text: 'Retrouvez votre portefeuille, vos missions et votre Académie.', mood: 'happy', prop: 'phone' },
  forgot: { title: 'Pas de panique.', text: 'Nous vous envoyons un lien pour choisir un nouveau mot de passe.', mood: 'think', prop: 'shield' },
  verify: { title: 'Plus qu’une confirmation.', text: 'Votre adresse e-mail protège les paiements et les retraits de votre compte.', mood: 'happy', prop: 'phone' },
  onboarding: { title: 'Bienvenue à bord.', text: 'Six points rapides pour bien démarrer.', mood: 'cheer', prop: 'coin' },
};

const POINTS = [
  { icon: ShieldCheck, t: 'Aucun gain garanti', d: 'Pas de promesse, pas de hasard.' },
  { icon: Check, t: 'Prix affichés avant paiement', d: 'Avec un délai de rétractation sur le Pass.' },
  { icon: Mail, t: 'Vos données restent à vous', d: 'Elles servent à gérer votre compte.' },
];

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block text-sm font-bold text-ink">{label}{children}{hint && <span className="mt-1 block text-xs font-normal text-ink/50">{hint}</span>}</label>
);

const PasswordInput: React.FC<{ value: string; onChange: (v: string) => void; autoComplete: string; autoFocus?: boolean }> = ({ value, onChange, autoComplete, autoFocus }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} required minLength={8} value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete} autoFocus={autoFocus} className={`${inputCls} pr-12`} />
      <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} className="absolute right-1.5 top-1/2 mt-0.5 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-ink/45 hover:bg-mist hover:text-ink">
        {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signup', onComplete }) => {
  const { login, signup, requestPasswordReset, resendEmailVerification, refreshEmailVerification } = useApp();
  const rates = usePublicRates();
  const [mode, setMode] = useState<Mode>(initialMode);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country] = useState<CountryCode>('CI');
  // Code parrain : prérempli depuis le lien de parrainage (?ref=CODE).
  const [referralCode, setReferralCode] = useState(() => {
    const ref = new URLSearchParams(window.location.search).get('ref') || '';
    return /^[A-Za-z0-9_-]{3,40}$/.test(ref) ? ref : '';
  });
  const [showReferral, setShowReferral] = useState(() => referralCode !== '');
  const [birthDate, setBirthDate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [verifyInfo, setVerifyInfo] = useState<{ ok: boolean; text: string } | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [forgotInfo, setForgotInfo] = useState<{ ok: boolean; text: string } | null>(null);

  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showCguModal, setShowCguModal] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Réouverture : repartir proprement ; verrouiller le défilement de la page ; Échap ferme.
  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode); setAuthError(null); setSignupStep(1);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !showCguModal) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMode]);
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [mode, signupStep, onboardingStep]);

  if (!isOpen) return null;

  const switchMode = (m: Mode) => { setAuthError(null); setForgotInfo(null); setSignupStep(1); setMode(m); };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) { onComplete(); onClose(); } else { setAuthError(res.error || 'Erreur lors de la connexion.'); }
    } catch (err: any) {
      setAuthError(err.message || 'Erreur lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await requestPasswordReset(email);
    setForgotInfo({ ok: res.success, text: res.message });
    setIsSubmitting(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    // Contrôle de confort ; le serveur vérifie l'âge de façon définitive.
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
    if (!birthDate || Number.isNaN(birth.getTime()) || age < 18) {
      setAuthError('Vous devez avoir au moins 18 ans pour créer un compte.');
      return;
    }
    if (!termsAccepted) {
      setAuthError("Veuillez accepter les conditions d'utilisation et la charte éthique.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await signup({ email, password, firstName, lastName, country: 'CI', phone, birthDate, acceptedTerms: true, referralCode: referralCode || undefined });
      if (res.success) { setMode('verify'); } else { setAuthError(res.error || 'Erreur lors de la création du compte.'); }
    } catch (err: any) {
      setAuthError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyBusy(true);
    setVerifyInfo(null);
    try {
      if (await refreshEmailVerification()) { setEmailVerified(true); setMode('onboarding'); }
      else { setVerifyInfo({ ok: false, text: 'Adresse non encore confirmée. Cliquez sur le lien reçu par e-mail, puis réessayez.' }); }
    } catch {
      setVerifyInfo({ ok: false, text: 'Vérification impossible pour le moment. Réessayez.' });
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleResendVerification = async () => {
    setVerifyBusy(true);
    const res = await resendEmailVerification();
    setVerifyInfo({ ok: true, text: res.message });
    setVerifyBusy(false);
  };

  const finish = () => { onComplete(); onClose(); };
  const aside = ASIDE[mode];

  const STEPS = [
    { icon: Check, t: 'Votre compte est créé', d: 'Vous démarrez avec un compte gratuit : vous pouvez explorer votre espace, le catalogue des missions et celui de l’Académie.' },
    { icon: ShieldCheck, t: emailVerified ? 'Adresse e-mail confirmée' : 'Adresse e-mail à confirmer', d: emailVerified ? 'Votre e-mail est confirmé : les paiements et les retraits sont possibles dès que votre Pass est actif.' : 'Un lien de confirmation vous a été envoyé. Tant que l’adresse n’est pas confirmée, les paiements et les retraits restent bloqués : vous pourrez la confirmer depuis votre espace.' },
    { icon: Briefcase, t: 'Des missions à récompense connue', d: 'Sondages, tests d’applications, quiz partenaires : la récompense est indiquée avant de commencer et n’est jamais tirée au sort. Un Pass actif est nécessaire pour participer.' },
    { icon: Smartphone, t: 'Des retraits vers Mobile Money', d: 'Wave, Orange Money, MTN MoMo ou Moov Money. Chaque demande est contrôlée avant paiement ; le minimum, les frais et le net reçu sont affichés avant validation.' },
    { icon: BookOpen, t: 'L’Académie et les outils IA', d: 'Des formations en modules et des outils pour rédiger vos annonces, avec le Pass. Aucun gain n’est garanti, et ne payez jamais en vous endettant.' },
    { icon: Users, t: 'Parrainage direct, un seul niveau', d: `${fmtPct(rates.passPct)} % du prix du Pass Membre activé par votre filleul, puis ${fmtPct(rates.firstSalePct)} % sur sa première commande réelle. Pas d’auto-parrainage, aucune commission sur des comptes artificiels.` },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-stretch bg-ink/70 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label="Accès à votre compte">
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden bg-white sm:max-h-[min(92vh,780px)] sm:rounded-[2rem] md:flex-row">
        {/* Panneau de marque (ordinateur) */}
        <aside className="relative hidden w-[38%] shrink-0 flex-col justify-between overflow-hidden bg-ink p-8 text-white md:flex">
          <WaxPattern tone="dark" className="pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative"><BrandLogo size="md" variant="white" showSubtitle={false} /></div>
          <div className="relative">
            <BabiVector mood={aside.mood} prop={aside.prop} size={150} className="-ml-2" />
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight">{aside.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-white/70">{aside.text}</p>
          </div>
          <ul className="relative space-y-3">
            {POINTS.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-3"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-sun"><Icon className="h-4 w-4" /></span><span className="text-[13px] leading-snug"><strong className="block text-white">{t}</strong><span className="text-white/60">{d}</span></span></li>
            ))}
          </ul>
        </aside>

        {/* Zone de saisie */}
        <div className="flex min-h-0 flex-1 flex-col">
          <ScarfRibbon thin />
          <div className="flex items-center justify-between gap-3 px-5 pt-4 sm:px-8 md:justify-end" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}>
            <span className="md:hidden"><BrandLogo size="sm" showSubtitle={false} /></span>
            <button onClick={onClose} aria-label="Fermer" className="grid h-11 w-11 place-items-center rounded-full text-ink/55 hover:bg-mist hover:text-ink"><X className="h-5 w-5" /></button>
          </div>

          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 sm:px-8" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}>
            {authError && <p role="alert" className="mb-4 flex gap-2.5 rounded-2xl bg-rose-50 p-3.5 text-[14px] font-semibold text-rose-700"><X className="mt-0.5 h-4 w-4 shrink-0" />{authError}</p>}

            {/* ── Connexion ── */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div><h1 className="font-display text-3xl font-extrabold leading-tight">Connexion</h1><p className="mt-1 text-[15px] text-ink/60">Accédez à votre espace personnel.</p></div>
                <Field label="Adresse e-mail"><input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" inputMode="email" className={inputCls} /></Field>
                <div>
                  <Field label="Mot de passe"><PasswordInput value={password} onChange={setPassword} autoComplete="current-password" /></Field>
                  <button type="button" onClick={() => switchMode('forgot')} className="mt-1 inline-flex min-h-11 items-center text-sm font-bold text-wax-deep hover:underline">Mot de passe oublié ?</button>
                </div>
                <Btn type="submit" disabled={isSubmitting} className="w-full py-3.5 text-base">{isSubmitting ? 'Connexion…' : 'Se connecter'}</Btn>
                <p className="text-center text-[15px] text-ink/60">Pas encore de compte ? <button type="button" onClick={() => switchMode('signup')} className="min-h-11 font-bold text-wax-deep hover:underline">Créer un compte gratuit</button></p>
              </form>
            )}

            {/* ── Mot de passe oublié ── */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div><h1 className="font-display text-3xl font-extrabold leading-tight">Mot de passe oublié</h1><p className="mt-1 text-[15px] text-ink/60">Saisissez l'adresse e-mail de votre compte : nous vous envoyons un lien pour en choisir un nouveau.</p></div>
                <Field label="Adresse e-mail"><input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" inputMode="email" className={inputCls} /></Field>
                {forgotInfo && <p role={forgotInfo.ok ? 'status' : 'alert'} className={`rounded-2xl p-3.5 text-[14px] font-semibold ${forgotInfo.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{forgotInfo.text}</p>}
                <Btn type="submit" disabled={isSubmitting} className="w-full py-3.5 text-base">{isSubmitting ? 'Envoi…' : 'Envoyer le lien'}</Btn>
                <button type="button" onClick={() => switchMode('login')} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-ink/70 hover:text-ink"><ArrowLeft className="h-4 w-4" />Retour à la connexion</button>
              </form>
            )}

            {/* ── Inscription, étape 1 : identité et contact ── */}
            {mode === 'signup' && signupStep === 1 && (
              <form onSubmit={e => { e.preventDefault(); setAuthError(null); setSignupStep(2); }} className="space-y-5">
                <div><p className="text-[13px] font-bold uppercase tracking-[0.14em] text-leaf">Étape 1 sur 2</p>
                  <div className="mt-2 flex gap-1.5" aria-hidden="true"><span className="h-1.5 flex-1 rounded-full bg-wax" /><span className="h-1.5 flex-1 rounded-full bg-ink/10" /></div>
                  <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">Vous et vos coordonnées</h1></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Prénom"><input required autoFocus value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" className={inputCls} /></Field>
                  <Field label="Nom"><input required value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" className={inputCls} /></Field>
                </div>
                <Field label="Numéro Mobile Money" hint="Utilisé pour vos retraits. Il ne pourra plus être modifié en ligne.">
                  <div className="mt-1.5 flex">
                    <span className="grid shrink-0 place-items-center rounded-l-2xl border border-r-0 border-ink/15 bg-mist px-3.5 text-sm font-bold text-ink/65">CI +225</span>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel-national" inputMode="tel" placeholder="07 00 00 00 00" className="w-full min-w-0 rounded-r-2xl border border-ink/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-wax" />
                  </div>
                </Field>
                <Field label="Adresse e-mail" hint="Un lien de confirmation vous sera envoyé."><input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email" className={inputCls} /></Field>
                <Btn type="submit" className="w-full py-3.5 text-base">Continuer <ArrowRight className="h-5 w-5" /></Btn>
                <p className="text-center text-[15px] text-ink/60">Déjà membre ? <button type="button" onClick={() => switchMode('login')} className="min-h-11 font-bold text-wax-deep hover:underline">Se connecter</button></p>
              </form>
            )}

            {/* ── Inscription, étape 2 : sécurité et conditions ── */}
            {mode === 'signup' && signupStep === 2 && (
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div><p className="text-[13px] font-bold uppercase tracking-[0.14em] text-leaf">Étape 2 sur 2</p>
                  <div className="mt-2 flex gap-1.5" aria-hidden="true"><span className="h-1.5 flex-1 rounded-full bg-wax" /><span className="h-1.5 flex-1 rounded-full bg-wax" /></div>
                  <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">Sécurité et conditions</h1></div>
                <Field label="Mot de passe" hint="8 caractères minimum."><PasswordInput value={password} onChange={setPassword} autoComplete="new-password" autoFocus /></Field>
                <Field label="Date de naissance" hint="Vous devez avoir 18 ans révolus. L'âge est vérifié à l'inscription."><input type="date" required value={birthDate} onChange={e => setBirthDate(e.target.value)} autoComplete="bday" max={new Date().toISOString().slice(0, 10)} className={inputCls} /></Field>
                {showReferral ? (
                  <Field label="Code de parrainage (facultatif)"><input value={referralCode} onChange={e => setReferralCode(e.target.value.trim())} autoCapitalize="characters" className={`${inputCls} font-mono`} /></Field>
                ) : (
                  <button type="button" onClick={() => setShowReferral(true)} className="inline-flex min-h-11 items-center text-sm font-bold text-wax-deep hover:underline">J'ai un code de parrainage</button>
                )}
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-mist p-4 text-[14px] leading-relaxed">
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-wax" />
                  <span>J'ai lu et j'accepte les <button type="button" onClick={() => setShowCguModal(true)} className="font-bold text-wax-deep underline">conditions d'utilisation et la charte éthique</button>. Je comprends qu'aucun gain n'est garanti.</span>
                </label>
                <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                  <Btn type="button" kind="ghost" onClick={() => setSignupStep(1)} className="py-3.5"><ArrowLeft className="h-4 w-4" />Retour</Btn>
                  <Btn type="submit" disabled={isSubmitting} className="py-3.5 text-base">{isSubmitting ? 'Création…' : 'Créer mon compte gratuit'}</Btn>
                </div>
              </form>
            )}

            {/* ── Vérification de l'e-mail ── */}
            {mode === 'verify' && (
              <form onSubmit={handleVerifySubmit} className="space-y-5">
                <div className="md:hidden"><BabiVector mood="happy" prop="phone" size={110} className="mx-auto" /></div>
                <div><h1 className="font-display text-3xl font-extrabold leading-tight">Confirmez votre e-mail</h1>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/65">Nous avons envoyé un lien à <strong className="break-all">{email}</strong>. Ouvrez-le, puis revenez ici.</p></div>
                <ol className="space-y-2.5 text-[14px] text-ink/75">
                  {['Ouvrez le message d’AH GLOBAL dans votre boîte e-mail.', 'Cliquez sur le lien de confirmation.', 'Revenez ici et appuyez sur « J’ai confirmé ».'].map((t, i) => (
                    <li key={t} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>{t}</li>
                  ))}
                </ol>
                <p className="rounded-2xl bg-sun/20 p-3.5 text-[13px] leading-relaxed">Vous ne le voyez pas ? Regardez dans les courriers indésirables.</p>
                {verifyInfo && <p role={verifyInfo.ok ? 'status' : 'alert'} className={`rounded-2xl p-3.5 text-[14px] font-semibold ${verifyInfo.ok ? 'bg-leaf/10 text-leaf-deep' : 'bg-rose-50 text-rose-700'}`}>{verifyInfo.text}</p>}
                <Btn type="submit" disabled={verifyBusy} className="w-full py-3.5 text-base">{verifyBusy ? 'Vérification…' : 'J’ai confirmé mon e-mail'}</Btn>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Btn type="button" kind="ghost" onClick={handleResendVerification} disabled={verifyBusy}>Renvoyer l'e-mail</Btn>
                  <Btn type="button" kind="ghost" onClick={() => setMode('onboarding')}>Plus tard</Btn>
                </div>
              </form>
            )}

            {/* ── Accueil en six points ── */}
            {mode === 'onboarding' && (() => {
              const s = STEPS[onboardingStep - 1];
              const Icon = s.icon;
              return (
                <div className="space-y-6">
                  <div><p className="text-[13px] font-bold uppercase tracking-[0.14em] text-leaf">Point {onboardingStep} sur 6</p>
                    <div className="mt-2 flex gap-1.5" aria-hidden="true">{STEPS.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < onboardingStep ? 'bg-wax' : 'bg-ink/10'}`} />)}</div></div>
                  <div className="rounded-[2rem] bg-mist p-6 sm:p-8">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-wax text-white"><Icon className="h-7 w-7" /></span>
                    <h1 className="mt-5 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{s.t}</h1>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{s.d}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                    <Btn kind="ghost" disabled={onboardingStep === 1} onClick={() => setOnboardingStep(p => p - 1)} className="py-3.5"><ArrowLeft className="h-4 w-4" />Précédent</Btn>
                    {onboardingStep < 6
                      ? <Btn onClick={() => setOnboardingStep(p => p + 1)} className="py-3.5 text-base">Suivant <ArrowRight className="h-5 w-5" /></Btn>
                      : <Btn onClick={finish} className="py-3.5 text-base">Découvrir mon espace</Btn>}
                  </div>
                  {onboardingStep < 6 && <button type="button" onClick={finish} className="mx-auto block min-h-11 text-sm font-bold text-ink/55 hover:text-ink">Passer l'introduction</button>}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Conditions d'utilisation ── */}
      {showCguModal && (
        <div className="absolute inset-0 z-10 flex items-stretch bg-ink/70 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label="Conditions d'utilisation et charte éthique" onMouseDown={() => setShowCguModal(false)}>
          <div onMouseDown={e => e.stopPropagation()} className="flex w-full max-w-2xl flex-col overflow-hidden bg-white sm:max-h-[88vh] sm:rounded-[2rem]">
            <ScarfRibbon thin />
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-3.5 sm:px-7">
              <div><h2 className="font-display text-lg font-extrabold">Conditions et charte éthique</h2><p className="text-xs text-ink/50">Côte d'Ivoire</p></div>
              <button onClick={() => setShowCguModal(false)} aria-label="Fermer" className="grid h-11 w-11 place-items-center rounded-full text-ink/55 hover:bg-mist"><X className="h-5 w-5" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7"><LegalDocument doc="cgu" compact /></div>
            <div className="flex flex-col-reverse gap-2.5 border-t border-ink/10 p-4 sm:flex-row sm:justify-end sm:px-7" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}>
              <Btn kind="ghost" onClick={() => setShowCguModal(false)}>Fermer</Btn>
              <Btn onClick={() => { setTermsAccepted(true); setShowCguModal(false); }}>J'accepte les conditions</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
