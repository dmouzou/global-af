import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useApp } from '../../context/AppContext';

type PaymentView = { status: string; amount?: number; failureReason?: string } | null;

/**
 * Page de retour du paiement : la passerelle redirige le membre vers
 * /?payment=return&pid=<identifiant>. L'état affiché est celui enregistré
 * par le serveur après confirmation (jamais celui de l'URL, qui ne prouve rien).
 */
export const PaymentReturnBanner: React.FC = () => {
  const { currentUser } = useApp();
  const params = new URLSearchParams(window.location.search);
  const isReturn = params.get('payment') === 'return';
  const rawPid = params.get('pid') || '';
  const pid = /^[A-Za-z0-9]{6,60}$/.test(rawPid) ? rawPid : '';
  const [dismissed, setDismissed] = useState(false);
  const [payment, setPayment] = useState<PaymentView>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isReturn || !pid || !currentUser) return;
    return onSnapshot(
      doc(db, 'payments', pid),
      (snap) => {
        setNotFound(!snap.exists());
        setPayment(snap.exists() ? (snap.data() as PaymentView) : null);
      },
      () => setNotFound(true)
    );
  }, [isReturn, pid, currentUser?.id]);

  if (!isReturn || !pid || dismissed || !currentUser) return null;

  const close = () => {
    setDismissed(true);
    window.history.replaceState({}, '', window.location.pathname);
  };

  let tone = 'bg-slate-50 border-slate-200 text-slate-800';
  let message = 'Vérification de votre paiement…';
  if (notFound) {
    message = 'Paiement introuvable pour ce compte. Si vous avez été débité, contactez le support en indiquant la référence ' + pid + '.';
  } else if (payment?.status === 'succeeded') {
    tone = 'bg-emerald-50 border-emerald-200 text-emerald-900';
    message = 'Paiement confirmé. Votre offre est activée. Vous disposez de 7 jours pour vous rétracter depuis Paramètres.';
  } else if (payment?.status === 'pending' || payment?.status === 'initiated') {
    tone = 'bg-amber-50 border-amber-200 text-amber-900';
    message = "Paiement en cours de confirmation par l'opérateur. Cela peut prendre quelques minutes : cette page se met à jour automatiquement. Ne payez pas une seconde fois.";
  } else if (payment?.status === 'failed') {
    tone = 'bg-red-50 border-red-200 text-red-900';
    message = "Le paiement n'a pas abouti et aucune offre n'a été activée. Si vous avez été débité, la confirmation peut encore arriver : cette page se met à jour. En cas de doute, contactez le support avec la référence " + pid + '.';
  } else if (payment?.status === 'refund_pending' || payment?.status === 'refunded') {
    message = 'Ce paiement a fait l\'objet d\'une rétractation et d\'un remboursement.';
  }

  return (
    <div role="status" className={`mx-auto max-w-5xl mt-4 px-4 py-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${tone}`}>
      <div className="leading-relaxed">
        <strong>Paiement GLOBAL-AF</strong> — {message}
        <span className="block text-[10px] opacity-70 mt-0.5">Référence : {pid}</span>
      </div>
      <button type="button" onClick={close} className="shrink-0 font-semibold underline">Fermer</button>
    </div>
  );
};
