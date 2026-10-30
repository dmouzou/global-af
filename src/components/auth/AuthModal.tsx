import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LegalDocument } from '../public/LegalDocument';
import { X, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { CountryCode } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'onboarding';
  onComplete: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signup', onComplete }) => {
  const { login, signup, resendEmailVerification, refreshEmailVerification } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'verify' | 'onboarding'>(initialMode);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState<CountryCode>('CI');
  // Code parrain : prérempli depuis le lien de parrainage (?ref=CODE).
  const [referralCode, setReferralCode] = useState(() => {
    const ref = new URLSearchParams(window.location.search).get('ref') || '';
    return /^[A-Za-z0-9_-]{3,40}$/.test(ref) ? ref : '';
  });
  const [birthDate, setBirthDate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [verifyInfo, setVerifyInfo] = useState<string | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);

  // Onboarding step
  const [onboardingStep, setOnboardingStep] = useState(1);

  // CGU Viewer Modal state
  const [showCguModal, setShowCguModal] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        onComplete();
        onClose();
      } else {
        setAuthError(res.error || 'Erreur lors de la connexion.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Erreur lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
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
      setAuthError("Vous devez avoir au moins 18 ans pour créer un compte (sections 5 et 39).");
      return;
    }
    if (!termsAccepted) {
      setAuthError("Veuillez accepter les conditions d'utilisation et la charte éthique.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await signup({
        email,
        password,
        firstName,
        lastName,
        country: 'CI',
        phone,
        birthDate,
        acceptedTerms: true,
        referralCode: referralCode || undefined
      });
      if (res.success) {
        setMode('verify');
      } else {
        setAuthError(res.error || 'Erreur lors de la création du compte.');
      }
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
      if (await refreshEmailVerification()) {
        setMode('onboarding');
      } else {
        setVerifyInfo("Adresse non encore confirmée. Cliquez sur le lien reçu par e-mail, puis réessayez.");
      }
    } catch {
      setVerifyInfo('Vérification impossible pour le moment. Réessayez.');
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleResendVerification = async () => {
    setVerifyBusy(true);
    const res = await resendEmailVerification();
    setVerifyInfo(res.message);
    setVerifyBusy(false);
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 6) {
      setOnboardingStep(prev => prev + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg liquid-glass-card shadow-2xl border border-white/60 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showSubtitle={false} />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {mode === 'login' && 'Connexion à votre Espace Personnel'}
                {mode === 'signup' && 'Créer votre Espace Personnel'}
                {mode === 'verify' && 'Vérification par E-mail'}
                {mode === 'onboarding' && `Parcours d'accueil (${onboardingStep}/6)`}
              </h3>
              <p className="text-[11px] text-slate-500">GLOBAL-AF · Côte d'Ivoire</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <span className="font-bold">Attention :</span>
              <span>{authError}</span>
            </div>
          )}
          
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nom@example.ci"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Connexion en cours...' : 'Se connecter à mon espace'}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 text-center pt-1 leading-relaxed">
                En vous connectant, vous certifiez être âgé de 18 ans ou plus et approuver les{' '}
                <button 
                  type="button" 
                  onClick={() => setShowCguModal(true)} 
                  className="text-orange-600 underline font-semibold hover:text-orange-700"
                >
                  CGU et la Charte Éthique
                </button>.
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs text-orange-600 hover:underline font-semibold"
                >
                  Pas encore de compte ? S'inscrire gratuitement
                </button>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ex. Kouamé"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ex. Diallo"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pays de résidence</label>
                  <div className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-slate-50 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center h-2.5 w-3.5 rounded-2xs overflow-hidden border border-slate-200">
                      <span className="w-1/3 h-full bg-[#FF7700]"></span>
                      <span className="w-1/3 h-full bg-white"></span>
                      <span className="w-1/3 h-full bg-[#009E49]"></span>
                    </span>
                    <span>Côte d'Ivoire (+225)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">N° Téléphone (Mobile Money)</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="07 48 92 11 05"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse E-mail</label>
                <input 
                  type="email" 
                  required 
                  placeholder="votre.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Code parrain (optionnel)</label>
                  <input 
                    type="text" 
                    placeholder="ex. GAF-CI-1002"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Certification & CGU Approval */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    required
                    autoComplete="bday"
                    max={new Date().toISOString().slice(0, 10)}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Âge minimum : 18 ans, vérifié à l'inscription. Vous disposez de la pleine capacité juridique pour ouvrir cet espace.</p>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span className="text-slate-600 text-[11px] leading-tight">
                    <strong className="text-slate-900">Vous approuvez sans réserve les CGU</strong> et la Charte Éthique de GLOBAL-AF.{' '}
                    <button 
                      type="button" 
                      onClick={() => setShowCguModal(true)} 
                      className="text-orange-600 underline font-bold hover:text-orange-700"
                    >
                      Lire les CGU & Charte
                    </button>
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Création en cours...' : 'Créer mon Espace Personnel'}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Déjà membre ? Se connecter
                </button>
              </div>
            </form>
          )}

          {/* VERIFICATION DE L'E-MAIL (lien envoyé par e-mail, section 5) */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Confirmez votre adresse e-mail</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Nous avons envoyé un lien de confirmation à <strong className="text-slate-800">{email}</strong>. Cliquez dessus, puis revenez ici. Pensez à vérifier vos courriers indésirables. Aucune vérification par SMS n'est requise.
                </p>
              </div>
              {verifyInfo && (
                <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-2">{verifyInfo}</p>
              )}
              <button
                type="submit"
                disabled={verifyBusy}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
              >
                J'ai confirmé mon e-mail
              </button>
              <div className="flex items-center justify-center gap-4 text-xs">
                <button type="button" disabled={verifyBusy} onClick={handleResendVerification} className="text-orange-600 hover:underline font-semibold disabled:opacity-60">
                  Renvoyer l'e-mail
                </button>
                <button type="button" onClick={() => setMode('onboarding')} className="text-slate-500 hover:text-slate-800">
                  Plus tard
                </button>
              </div>
            </form>
          )}

          {/* 6-STEP ONBOARDING WALKTHROUGH (Section 5) */}
          {mode === 'onboarding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-2">
                <span>Étape {onboardingStep} sur 6</span>
                <span className="font-semibold text-emerald-600">
                  {onboardingStep === 1 && '1. Profil Créé'}
                  {onboardingStep === 2 && '2. Vérification E-mail'}
                  {onboardingStep === 3 && '3. Fonctionnement'}
                  {onboardingStep === 4 && '4. Découverte Dashboard'}
                  {onboardingStep === 5 && '5. Première Activité'}
                  {onboardingStep === 6 && '6. Affiliation Éthique'}
                </span>
              </div>

              {onboardingStep === 1 && (
                <div className="space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Votre profil est prêt !</h4>
                  <p>Votre identifiant GLOBAL-AF est associé à votre numéro Mobile Money pour garantir des transferts et retraits sécurisés.</p>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div><strong>Pays :</strong> Côte d'Ivoire (XOF - FCFA)</div>
                    <div><strong>Statut initial :</strong> Membre Standard Gratuit</div>
                    <div><strong>Niveau :</strong> Starter (progression déterministe)</div>
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Vérification de sécurité validée</h4>
                  <p>La confirmation de votre e-mail est requise pour les paiements et les retraits. La plateforme limite la création abusive de multi-comptes et protège l'intégrité de vos récompenses.</p>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Comment fonctionne la rémunération ?</h4>
                  <p>Sur GLOBAL-AF, vous gagnez des récompenses en réalisant des tâches réelles :</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Sondages et avis d'usage sur les outils digitaux</li>
                    <li>Tests d'applications locales partenaires</li>
                    <li>Validation de quiz de connaissances dans l'Académie</li>
                  </ul>
                  <p className="text-[11px] text-amber-700 font-semibold">Toutes les récompenses sont garanties et prévisibles : aucun jeu de hasard, aucune tombola.</p>
                </div>
              )}

              {onboardingStep === 4 && (
                <div className="space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Découverte de votre Dashboard</h4>
                  <p>Votre tableau de bord réunit :</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <strong>Mon Wallet :</strong> Solde disponible, retraits Mobile Money en 1 clic
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <strong>Mes Activités :</strong> Catalogue des micro-jobs rémunérés
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === 5 && (
                <div className="space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Votre première activité disponible</h4>
                  <p>Consultez le catalogue des missions : chaque mission indique à l'avance sa récompense et ses conditions. Aucun gain n'est garanti.</p>
                </div>
              )}

              {onboardingStep === 6 && (
                <div className="space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Système d'Affiliation Éthique</h4>
                  <p>Vous disposez d'un code de parrainage exclusif. Règle absolue de notre charte éthique :</p>
                  <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                    Les commissions ne rémunèrent <strong>JAMAIS</strong> le simple recrutement, mais uniquement des ventes réelles (formations et abonnements utiles), limitées à 2 niveaux maximum.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {onboardingStep > 1 ? (
                  <button
                    onClick={() => setOnboardingStep(prev => prev - 1)}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                  </button>
                ) : <div />}

                <button
                  onClick={handleOnboardingNext}
                  className="flex items-center gap-1.5 py-2 px-4 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  <span>{onboardingStep === 6 ? 'Accéder au Dashboard' : 'Suivant'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CGU & Legal Charter Modal Overlay */}
      {showCguModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Conditions générales d'utilisation
                  </h3>
                  <p className="text-[11px] text-slate-500">Cadre juridique GLOBAL-AF · République de Côte d'Ivoire & UEMOA</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowCguModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
              <LegalDocument doc="cgu" compact />
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Document opposable à tout utilisateur de GLOBAL-AF
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCguModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTermsAccepted(true);
                    setShowCguModal(false);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-xs"
                >
                  J'approuve les CGU & la Charte
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
