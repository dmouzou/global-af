import {PaymentProviderId} from "../../domain/payment";
import {PaymentProvider} from "./provider.interface";
import {CinetPayAdapter} from "./cinetpay.adapter";
import {WaveAdapter} from "./wave.adapter";

// Chaque adaptateur lit ses secrets dans l'environnement ; aucun secret par
// défaut n'existe (un secret absent fait refuser les webhooks).
const registry: Record<PaymentProviderId, PaymentProvider> = {
  cinetpay: new CinetPayAdapter(),
  wave: new WaveAdapter(),
};

export const PAYMENT_PROVIDERS = Object.keys(registry) as PaymentProviderId[];

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider {
  const provider = registry[id];
  if (!provider) throw new Error(`Passerelle de paiement inconnue : ${id}`);
  return provider;
}
