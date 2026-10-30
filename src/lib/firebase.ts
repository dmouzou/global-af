import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Official web app config for global-af-dev
const firebaseConfig = {
  apiKey: "AIzaSyBgXJpYU5_VlwmaO9F8htIyeXAsfwqn_Ik",
  authDomain: "global-af-dev.firebaseapp.com",
  projectId: "global-af-dev",
  storageBucket: "global-af-dev.firebasestorage.app",
  messagingSenderId: "499733900624",
  appId: "1:499733900624:web:ec8e7eb0e38c9383695055",
  measurementId: "G-JWHGT62RP1"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "global-af-database");
export const functions = getFunctions(app, "europe-west1");

// Typed callable Cloud Functions
export interface RegisterUserInput {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  birthDate: string;
  acceptedTerms: boolean;
  referralCode?: string;
}

export interface RegisterUserOutput {
  uid: string;
  email: string;
  referralCode: string;
}

export interface RequestWithdrawalInput {
  amount: number;
  operator: 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money';
  requestId: string;
}

export interface RequestWithdrawalOutput {
  withdrawalId: string;
  status: string;
  duplicate?: boolean;
}

export const registerUserCallable = httpsCallable<RegisterUserInput, RegisterUserOutput>(
  functions,
  'registerUser'
);

export const requestWithdrawalCallable = httpsCallable<RequestWithdrawalInput, RequestWithdrawalOutput>(
  functions,
  'requestWithdrawal'
);

export type PaymentMethod = 'mobile_money' | 'card';

export interface InitiatePaymentInput {
  /** Mobile Money (Wave, Orange, MTN, Moov) ou carte bancaire Visa : choisi ici, l'opérateur l'est sur la page sécurisée. */
  method: PaymentMethod;
  /** Identifiant du produit du catalogue serveur : le prix est fixé côté serveur. */
  productId: string;
  /** Obligatoire pour la carte (exigé par la passerelle). */
  billing?: { address: string; city: string; zipCode: string };
  /** Obligatoire pour l'abonnement VIP Premium : le membre reconnaît qu'il n'est pas remboursable (fichiers VCF). */
  acceptedNoRefund?: boolean;
}

export interface InitiatePaymentOutput {
  paymentId: string;
  providerReference?: string;
  checkoutUrl?: string;
  instructions?: string;
  status: 'pending' | 'succeeded';
  amount: number;
  currency: string;
}

export const initiateOnlinePaymentCallable = httpsCallable<InitiatePaymentInput, InitiatePaymentOutput>(
  functions,
  'initiateOnlinePayment'
);

export interface RetractionInput {
  /** Facultatif : sans identifiant, le dernier paiement confirmé rétractable est utilisé. */
  paymentId?: string;
  reason?: string;
}

export interface RetractionOutput {
  success: boolean;
  message: string;
  refundAmount: number;
}

export const requestPaymentRetractionCallable = httpsCallable<RetractionInput, RetractionOutput>(
  functions,
  'requestPaymentRetraction'
);

export interface AdminProcessWithdrawalInput {
  withdrawalId: string;
  action: 'approve' | 'reject' | 'mark_payout_initiated' | 'confirm_paid' | 'mark_failed' | 'reconcile';
  reason?: string;
  providerReference?: string;
}

export const adminProcessWithdrawalCallable = httpsCallable<AdminProcessWithdrawalInput, { withdrawalId: string; status: string }>(
  functions,
  'adminProcessWithdrawal'
);

export interface AdminSetUserRoleInput {
  uid: string;
  role: string;
}

export const adminSetUserRoleCallable = httpsCallable<AdminSetUserRoleInput, { uid: string; role: string }>(
  functions,
  'adminSetUserRole'
);



export interface UpdateMyProfileInput {
  firstName?: string;
  lastName?: string;
  city?: string;
  bio?: string;
  defaultPayoutOperator?: 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money';
}

export const updateMyProfileCallable = httpsCallable<UpdateMyProfileInput, { updated: string[] }>(
  functions,
  'updateMyProfile'
);

export const setSpendingLimitCallable = httpsCallable<
  { limit: number },
  { spendingLimitMonthly: number; pendingSpendingLimit: { amount: number; effectiveAtMs: number } | null }
>(functions, 'setSpendingLimit');

export const adminProcessRefundCallable = httpsCallable<
  { refundId: string; providerReference: string },
  { refundId: string; status: string }
>(functions, 'adminProcessRefund');

export interface AffiliationStats {
  level1: { count: number; activeCount: number };
  level2: { count: number; activeCount: number };
  rates: { level1Bps: number; level2Bps: number };
  retractionDays: number;
  truncated: boolean;
}

export const getMyAffiliationCallable = httpsCallable<Record<string, never>, AffiliationStats>(
  functions,
  'getMyAffiliation'
);
