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

export interface InitiatePaymentInput {
  operator: 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money';
  amount: number;
  kind: 'pack_subscription' | 'course_purchase' | 'service_pack' | 'advertising_campaign';
  plan?: 'starter' | 'premium' | 'business';
  phone?: string;
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

export const initiateMobileMoneyPaymentCallable = httpsCallable<InitiatePaymentInput, InitiatePaymentOutput>(
  functions,
  'initiateMobileMoneyPayment'
);

export interface RetractionInput {
  paymentId: string;
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
  action: 'approve' | 'pay' | 'reject' | 'fail';
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


