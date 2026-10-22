import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  const { selectedCountry, currentUser } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'verify' | 'onboarding'>(initialMode);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState<CountryCode>('CI');
  const [referralCode, setReferralCode] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Email verification simulation
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  // Onboarding step
  const [onboardingStep, setOnboardingStep] = useState(1);

  // CGU Viewer Modal state
  const [showCguModal, setShowCguModal] = useState(false);

  if (!isOpen) return null;

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdult) {
      alert("Vous devez avoir au moins 18 ans pour créer un compte conformément à la section 5 et 39.");
      return;
    }
    if (!termsAccepted) {
      alert("Veuillez accepter les conditions d'utilisation et la charte éthique.");
      return;
    }
    // Simulate email verification code
    setVerificationSent(true);
    setMode('verify');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful code
    setMode('onboarding');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
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
          
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={(e) => { e.preventDefault(); onComplete(); onClose(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse E-mail</label>
                <input 
                  type="email" 
                  defaultValue={currentUser.email} 
                  required
                  placeholder="nom@example.ci"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                <input 
                  type="password" 
                  defaultValue="demo1234" 
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors shadow-xs"
                >
                  Se connecter à mon espace
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
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required
                    checked={isAdult}
                    onChange={(e) => setIsAdult(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span className="text-slate-600 text-[11px] leading-tight">
                    <strong className="text-slate-900">Vous certifiez que votre âge est de 18 ans ou plus</strong> et que vous disposez de la pleine capacité juridique pour ouvrir cet espace.
                  </span>
                </label>

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
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all shadow-xs"
                >
                  Créer mon Espace Personnel
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

          {/* VERIFY EMAIL SIMULATION */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Vérification de l'adresse e-mail</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Un code de confirmation a été simulé et envoyé à votre adresse e-mail (Section 5 : aucune vérification SMS requise).
                </p>
              </div>
              <div>
                <input 
                  type="text"
                  maxLength={6}
                  placeholder="Code : 123456"
                  defaultValue="784910"
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-48 mx-auto text-center tracking-widest text-base font-mono py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                Confirmer l'e-mail & Démarrer l'Onboarding
              </button>
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
                  <p>Votre e-mail est vérifié. La plateforme limite la création abusive de multi-comptes et protège l'intégrité de vos récompenses.</p>
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
                  <p>Vous pouvez immédiatement participer à l'étude d'usage du Mobile Money en Côte d'Ivoire pour recevoir 600 FCFA crédités sur votre ledger.</p>
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
                    Conditions Générales d'Utilisation (CGU) & Charte Éthique
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
              
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <strong>Préambule d'engagement :</strong> GLOBAL-AF est une plateforme d'opportunités numériques, de micro-jobs vérifiés, de formations professionnelles et d'outils digitaux. Elle opère sous le strict respect du droit ivoirien et de la charte éthique et zéro hasard.
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-orange-600 mb-1">
                  Article 1 — Capacité Juridique et Âge Requis (18 ans ou plus)
                </h4>
                <p>
                  L'inscription, l'accès aux micro-missions rémunérées et la perception de fonds par Mobile Money sont strictement réservés aux personnes physiques âgées d'au moins <strong>18 ans révolus</strong> et bénéficiant de la pleine capacité juridique d'exercer et de contracter. L'inscription de mineurs est formellement prohibée. Tout compte créé par un mineur sera immédiatement clôturé sans préavis.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-orange-600 mb-1">
                  Article 2 — Modèle Économique Réel & Absence de Gains Faciles
                </h4>
                <p>
                  Toutes les rémunérations versées sur GLOBAL-AF sont corrélées à l'exécution de tâches effectives (sondages, tests fonctionnels, revues) ou à des commissions sur ventes réelles de services et formations numériques. La plateforme ne garantit aucun revenu passif ou gain minimum sans effort. Les revenus constatés varient selon les compétences et l'assiduité du membre.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-orange-600 mb-1">
                  Article 3 — Interdiction Absolue des Jeux de Hasard et Loteries
                </h4>
                <p>
                  GLOBAL-AF proscrit expressément tout mécanisme assimilé à un jeu d'argent ou de hasard (roues tournantes, tombolas, coffres-surprises aléatoires, loteries). Tous les systèmes de points et de récompenses reposent sur des critères 100% déterministes et auditables.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-orange-600 mb-1">
                  Article 4 — Droit de Rétractation de 7 Jours
                </h4>
                <p>
                  Tout membre souscrivant une option payante (Activation de Pack ou Formation certifiante) dispose d'un délai légal de rétractation de <strong>7 jours calendaires</strong> à compter de sa souscription. La demande s'effectue en 1 clic depuis l'Espace Personnel et donne lieu à un remboursement intégral sans pénalité via le compte Mobile Money d'origine (Wave, Orange Money, MTN MoMo ou Moov Money).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-orange-600 mb-1">
                  Article 5 — Protection des Données Personnelles (ARTCI) & Traçabilité
                </h4>
                <p>
                  En conformité avec les directives de l'ARTCI (Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire), vos données nominatives et vos numéros de portefeuille Mobile Money sont chiffrés et exclusivement utilisés pour l'exécution des ordres de virement et la communication de service.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-orange-600 mb-1">
                  Article 6 — Lutte Anti-Fraude & Règle du Compte Unique
                </h4>
                <p>
                  Chaque utilisateur ne peut détenir qu'un seul compte personnel. Les pratiques de parrainage croisé frauduleux, d'auto-parrainage ou d'automatisation abusive (bots) entraînent le gel immédiat du solde litigieux et la transmission du dossier aux services de vérification.
                </p>
              </div>

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
                    setIsAdult(true);
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
