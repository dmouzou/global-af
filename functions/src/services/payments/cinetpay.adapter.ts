/**
 * Adaptateur CinetPay — passerelle couvrant Mobile Money (Wave, Orange Money,
 * MTN MoMo, Moov Money) et cartes bancaires (Visa).
 * Implémenté d'après la documentation officielle : https://docs.cinetpay.com
 *
 * Fonctionnement (guichet hébergé : aucune donnée de carte ne transite par
 * nos serveurs) :
 *  1. POST https://api-checkout.cinetpay.com/v2/payment → `payment_url`.
 *  2. Le membre paie sur le guichet CinetPay (choix de l'opérateur ou carte).
 *  3. CinetPay appelle notre `notify_url` (POST, formulaire) avec l'en-tête
 *     `x-token` = HMAC-SHA256(clé secrète, concaténation de 16 champs).
 *  4. La notification ne contient PAS le statut : on interroge toujours
 *     POST /v2/payment/check pour obtenir les vraies valeurs (statut, montant).
 *
 * Variables d'environnement (jamais dans le code) :
 *   CINETPAY_API_KEY, CINETPAY_SITE_ID, CINETPAY_SECRET_KEY, APP_BASE_URL
 */
import {createHmac, timingSafeEqual} from "node:crypto";
import {PaymentRecord, validateCheckoutAmount} from "../../domain/payment";
import {DomainError} from "../../domain/errors";
import {
  PaymentInitiationContext, PaymentInitiationResult, PaymentProvider,
  WebhookVerificationResult,
} from "./provider.interface";

const API_BASE = "https://api-checkout.cinetpay.com/v2";

export interface CinetPayOptions {
  apiKey?: string;
  siteId?: string;
  secretKey?: string;
  /** Injectable pour les tests (par défaut : fetch global). */
  fetchImpl?: typeof fetch;
}

/**
 * Champs du corps de la notification, dans l'ordre exigé par CinetPay pour
 * construire le jeton HMAC (champ absent = chaîne vide).
 */
export const CINETPAY_HMAC_FIELDS = [
  "cpm_site_id", "cpm_trans_id", "cpm_trans_date", "cpm_amount",
  "cpm_currency", "signature", "payment_method", "cel_phone_num",
  "cpm_phone_prefixe", "cpm_language", "cpm_version", "cpm_payment_config",
  "cpm_page_action", "cpm_custom", "cpm_designation", "cpm_error_message",
] as const;

/**
 * Calcule le jeton HMAC attendu pour une notification CinetPay.
 * @param {Record<string,string>} fields Champs reçus dans le corps.
 * @param {string} secretKey Clé secrète du compte marchand.
 * @return {string} Jeton hexadécimal.
 */
export function cinetpayToken(fields: Record<string, string>,
  secretKey: string): string {
  const data = CINETPAY_HMAC_FIELDS.map((f) => fields[f] ?? "").join("");
  return createHmac("sha256", secretKey).update(data).digest("hex");
}

/**
 * Lit le corps d'une notification (formulaire ou JSON) en dictionnaire.
 * @param {string} raw Corps brut.
 * @return {Record<string,string>} Champs en chaînes.
 */
function parseBody(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const json = JSON.parse(trimmed) as Record<string, unknown>;
      for (const [k, v] of Object.entries(json)) {
        out[k] = v === null || v === undefined ? "" : String(v);
      }
      return out;
    } catch {
      return out;
    }
  }
  for (const [k, v] of new URLSearchParams(trimmed)) out[k] = v;
  return out;
}

export class CinetPayAdapter implements PaymentProvider {
  readonly id = "cinetpay" as const;
  private readonly apiKey: string;
  private readonly siteId: string;
  private readonly secretKey: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: CinetPayOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.CINETPAY_API_KEY ?? "";
    this.siteId = options.siteId ?? process.env.CINETPAY_SITE_ID ?? "";
    this.secretKey = options.secretKey ?? process.env.CINETPAY_SECRET_KEY ?? "";
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async initiatePayment(payment: PaymentRecord,
    context?: PaymentInitiationContext): Promise<PaymentInitiationResult> {
    if (!this.apiKey || !this.siteId || !context) {
      throw new DomainError("provider_not_configured",
        "Le paiement en ligne n'est pas encore configuré.");
    }
    validateCheckoutAmount(payment.amount);
    const card = payment.method === "card";
    const c = context.customer;
    if (card) {
      // Obligatoire pour le guichet carte (documentation CinetPay).
      if (!c || !c.address || !c.city || !c.zipCode || !c.email ||
        !c.phone || !c.firstName || !c.lastName || !c.country) {
        throw new DomainError("billing_required",
          "Adresse, ville et code postal sont requis pour payer par carte.");
      }
    }
    const body: Record<string, unknown> = {
      apikey: this.apiKey,
      site_id: this.siteId,
      transaction_id: payment.id,
      amount: payment.amount,
      currency: "XOF",
      description: context.description,
      notify_url: context.notifyUrl,
      return_url: context.returnUrl,
      channels: card ? "CREDIT_CARD" : "MOBILE_MONEY",
      lang: "fr",
      metadata: payment.plan ?? payment.kind,
    };
    if (card && c) {
      Object.assign(body, {
        customer_id: payment.userId.slice(0, 40),
        customer_name: c.lastName,
        customer_surname: c.firstName,
        customer_phone_number: c.phone,
        customer_email: c.email,
        customer_address: c.address,
        customer_city: c.city,
        customer_country: c.country.toUpperCase().slice(0, 2),
        customer_zip_code: String(c.zipCode).slice(0, 5),
      });
    }
    const res = await this.fetchImpl(`${API_BASE}/payment`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({})) as {
      code?: string; message?: string; description?: string;
      data?: {payment_token?: string; payment_url?: string};
    };
    if (!res.ok || String(json.code) !== "201" || !json.data?.payment_url) {
      // Détail uniquement dans les journaux serveur (pas de clé dans le message).
      console.error("CinetPay initialisation refusée", res.status, json.code,
        json.message, json.description);
      throw new DomainError("provider_error",
        "Le paiement n'a pas pu être ouvert. Réessayez dans un instant.");
    }
    return {
      paymentId: payment.id,
      providerReference: json.data.payment_token,
      checkoutUrl: json.data.payment_url,
      instructions: "Terminez le paiement sur la page sécurisée CinetPay.",
      status: "pending",
    };
  }

  /** Interroge l'API de vérification : seule source fiable du statut. */
  private async checkTransaction(transactionId: string): Promise<{
    code: string;
    data?: {
      amount?: string; currency?: string; status?: string;
      payment_method?: string; operator_id?: string | null;
    };
  } | null> {
    const res = await this.fetchImpl(`${API_BASE}/payment/check`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        apikey: this.apiKey, site_id: this.siteId,
        transaction_id: transactionId,
      }),
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null) as {
      code?: string | number; data?: Record<string, string>;
    } | null;
    if (!json) return null;
    return {code: String(json.code), data: json.data};
  }

  async verifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookVerificationResult> {
    const invalid = (raw: unknown = null): WebhookVerificationResult =>
      ({isValid: false, status: "failed", rawPayload: raw});
    // Jamais de secret par défaut : sans configuration, tout est refusé.
    if (!this.secretKey || !this.apiKey || !this.siteId) return invalid();

    const raw = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
    const header = headers["x-token"] ?? headers["X-Token"];
    const received = (Array.isArray(header) ? header[0] : header)?.trim();
    if (!received || !/^[0-9a-fA-F]+$/.test(received)) return invalid();

    const fields = parseBody(raw);
    if (fields.cpm_site_id !== this.siteId || !fields.cpm_trans_id) {
      return invalid();
    }
    const expected = Buffer.from(cinetpayToken(fields, this.secretKey), "hex");
    const got = Buffer.from(received, "hex");
    if (got.length !== expected.length || !timingSafeEqual(got, expected)) {
      return invalid();
    }

    // La notification ne porte pas le statut : on le demande à CinetPay.
    const check = await this.checkTransaction(fields.cpm_trans_id);
    const base = {
      isValid: true,
      paymentId: fields.cpm_trans_id,
      rawPayload: {notification: fields, check},
    };
    if (!check) {
      // Vérification indisponible : on ne conclut rien (CinetPay renotifie).
      return {...base, status: "pending"};
    }
    const data = check.data ?? {};
    const common = {
      ...base,
      providerReference: data.operator_id || undefined,
      amountPaid: data.amount !== undefined ? Number(data.amount) : undefined,
      currency: data.currency,
      paidWith: data.payment_method,
    };
    if (check.code === "00" && data.status === "ACCEPTED") {
      return {...common, status: "succeeded"};
    }
    if (data.status === "REFUSED") return {...common, status: "failed"};
    return {...common, status: "pending"}; // en attente du client, etc.
  }
}
