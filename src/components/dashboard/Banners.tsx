import React from 'react';
import { AlertCircle, CalendarClock, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POLICY } from '../../lib/policy';
import { usePublicRates } from '../../lib/useRates';
import { BabiVector } from '../brand/BabiVector';
import { Btn } from './ui';

const formatDay = (d: Date) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

/** Rappels en tête de l'espace : e-mail à confirmer, échéance d'abonnement, Pass à activer. */
export const Banners: React.FC<{ onActivate: () => void; onRenew: () => void; showActivation?: boolean }> = ({ onActivate, onRenew, showActivation = true }) => {
  const { currentUser, refreshEmailVerification, resendEmailVerification } = useApp();
  const rates = usePublicRates();
  if (!currentUser) return null;

  const subExpiry = currentUser.subscriptionExpiresAt ? new Date(currentUser.subscriptionExpiresAt) : null;
  const subDaysLeft = subExpiry ? Math.ceil((subExpiry.getTime() - Date.now()) / 86400000) : null;
  const hasSubscription = currentUser.subscriptionPlan === 'premium' || currentUser.subscriptionPlan === 'business';

  return (
    <div className="mb-6 space-y-3 empty:hidden">
      {!currentUser.isEmailVerified && (
        <div role="status" className="flex flex-col gap-3 rounded-3xl bg-amber-50 p-4 ring-1 ring-amber-300 md:flex-row md:items-center md:justify-between">
          <p className="flex gap-3 text-[14px] leading-relaxed text-amber-950">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span><strong>Confirmez votre adresse e-mail ({currentUser.email}).</strong> Tant qu'elle n'est pas confirmée, les paiements et les retraits sont bloqués. Cliquez sur le lien reçu par e-mail, puis sur « J'ai confirmé ».</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <Btn kind="ink" onClick={async () => { const ok = await refreshEmailVerification(); if (!ok) alert("Adresse non encore confirmée. Cliquez sur le lien reçu par e-mail, puis réessayez."); }}>J'ai confirmé</Btn>
            <Btn kind="ghost" onClick={async () => { const r = await resendEmailVerification(); alert(r.message); }}>Renvoyer l'e-mail</Btn>
          </div>
        </div>
      )}

      {hasSubscription && subExpiry && subDaysLeft !== null && subDaysLeft <= POLICY.reminderDays && (
        <div role="status" className="flex flex-col gap-3 rounded-3xl bg-amber-50 p-4 ring-1 ring-amber-300 md:flex-row md:items-center md:justify-between">
          <p className="flex gap-3 text-[14px] leading-relaxed text-amber-950">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0" />
            <span><strong>Votre abonnement expire le {formatDay(subExpiry)}.</strong> Il n'est pas renouvelé automatiquement : renouvelez-le avant cette date pour ne perdre aucun jour d'accès.</span>
          </p>
          <Btn kind="ink" onClick={onRenew} className="shrink-0">Renouveler</Btn>
        </div>
      )}

      {showActivation && !currentUser.isActivated && (
        <div className="relative overflow-hidden rounded-3xl bg-ink p-5 text-white sm:p-6">
          <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr_auto]">
            <BabiVector mood="happy" prop="coin" size={92} className="hidden sm:block" />
            <div>
              <span className="inline-flex rounded-full bg-sun px-2.5 py-1 text-xs font-bold text-ink">Activation requise</span>
              <h2 className="mt-2 font-display text-xl font-extrabold">Votre compte découverte est gratuit.</h2>
              <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-white/75">
                Le Pass (3 000 FCFA, rétractation de {rates.retractionDays} jours) débloque la participation aux missions rémunérées, les formations et les retraits. Aucun gain n'est garanti.
              </p>
            </div>
            <Btn onClick={onActivate} className="justify-self-start sm:justify-self-end"><Zap className="h-4 w-4" />Activer mon Pass</Btn>
          </div>
        </div>
      )}
    </div>
  );
};
