import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { POLICY } from './policy';

/**
 * Règles commerciales annoncées au public, lues en direct dans la configuration
 * serveur (config/platform, lecture publique) : une modification faite dans la
 * console se voit tout de suite sur le site. Les valeurs de POLICY ne servent
 * que de repli tant que la lecture n'a pas abouti.
 */
export interface PublicRates {
  passPct: number;
  firstSalePct: number;
  capPct: number;
  refundFeePct: number;
  retractionDays: number;
  subscriptionDays: number;
  loaded: boolean;
}

const FALLBACK: PublicRates = {
  passPct: 10, firstSalePct: 5, capPct: 10, refundFeePct: POLICY.refundFeePercent,
  retractionDays: POLICY.retractionDays, subscriptionDays: POLICY.subscriptionDays, loaded: false,
};

let current: PublicRates = FALLBACK;
const subscribers = new Set<(r: PublicRates) => void>();
let started = false;

function start() {
  if (started) return;
  started = true;
  onSnapshot(
    doc(db, 'config', 'platform'),
    (snap) => {
      const d = snap.data() as any;
      if (!d?.affiliation) return;
      current = {
        passPct: d.affiliation.level1Bps / 100,
        firstSalePct: d.affiliation.level2Bps / 100,
        capPct: d.affiliation.maxTotalBps / 100,
        refundFeePct: d.refundFeeBps / 100,
        retractionDays: d.retractionDays,
        subscriptionDays: d.subscriptionDays,
        loaded: true,
      };
      subscribers.forEach((fn) => fn(current));
    },
    () => { /* repli silencieux : l'affichage garde les valeurs de POLICY */ }
  );
}

export function usePublicRates(): PublicRates {
  const [r, setR] = useState(current);
  useEffect(() => {
    start();
    subscribers.add(setR);
    setR(current);
    return () => { subscribers.delete(setR); };
  }, []);
  return r;
}

/** 10 → « 10 », 7.5 → « 7,5 ». */
export const fmtPct = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));
