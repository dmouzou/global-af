/**
 * Adaptateur Wave (Côte d'Ivoire) — Checkout API.
 * Implémenté d'après la documentation officielle :
 *   https://docs.wave.com/checkout  et  https://docs.wave.com/webhook
 *
 * - Création de session : POST https://api.wave.com/v1/checkout/sessions
 *   (montant en chaîne, XOF sans décimales, success_url / error_url en https,
 *   client_reference = identifiant du paiement) ; redirection du membre vers
 *   `wave_launch_url`.
 * - Webhook : en-tête `Wave-Signature: t=<horodatage>,v1=<hmac>` où le HMAC-SHA256
 *   porte sur `horodatage + corps brut` ; plusieurs `v1=` possibles pendant une
 *   rotation de secret ; horodatage à refuser au-delà de 5 minutes.
 *   Événements : `checkout.session.completed` et
 *   `checkout.session.payment_failed` (plusieurs échecs possibles avant un
 *   succès : un échec n'est donc PAS définitif).
 *
 * Variables d'environnement (jamais dans le code) :
 *   WAVE_API_KEY            clé API Wave Business (Bearer)
 *   WAVE_SIGNING_SECRET     secret de signature des requêtes (optionnel, recommandé)
 *   WAVE_WEBHOOK_SECRET     secret du webhook (obligatoire pour accepter un webhook)
 *   APP_BASE_URL            URL publique du site (success_url / error_url)
 */
import {createHmac, timingSafeEqual} from "node:crypto";
import {PaymentRecord} from "../../domain/payment";
import {DomainError} from "../../domain/errors";
import {MobileMoneyAdapter, PaymentInitiationResult, WebhookVerificationResult}
  from "./provider.interface";

const API_BASE = "https://api.wave.com";
/** Tolérance de l'horodatage de signature (documentation Wave : 5 minutes). */
const MAX_SIGNATURE_AGE_SECONDS = 300;

export interface WaveOptions {
  webhookSecret?: string;
  apiKey?: string;
  signingSecret?: string;
  appBaseUrl?: string;
  /** Injectable pour les tests (par défaut : fetch global). */
  fetchImpl?: typeof fetch;
  /** Horloge injectable pour les tests (secondes Unix). */
  nowSeconds?: () => number;
}

export class WaveAdapter implements MobileMoneyAdapter {
  readonly operator = "wave" as const;
  private readonly webhookSecret: string;
  private readonly apiKey: string;
  private readonly signingSecret: string;
  private readonly appBaseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly nowSeconds: () => number;

  constructor(options: string | WaveOptions = {}) {
    const o: WaveOptions = typeof options === "string" ?
      {webhookSecret: options} : options;
    this.webhookSecret = o.webhookSecret ?? process.env.WAVE_WEBHOOK_SECRET ?? "";
    this.apiKey = o.apiKey ?? process.env.WAVE_API_KEY ?? "";
    this.signingSecret = o.signingSecret ?? process.env.WAVE_SIGNING_SECRET ?? "";
    this.appBaseUrl = (o.appBaseUrl ?? process.env.APP_BASE_URL ?? "")
      .replace(/\/+$/, "");
    this.fetchImpl = o.fetchImpl ?? fetch;
    this.nowSeconds = o.nowSeconds ?? (() => Math.floor(Date.now() / 1000));
  }

  async initiatePayment(payment: PaymentRecord): Promise<PaymentInitiationResult> {
    if (!this.apiKey || !this.appBaseUrl.startsWith("https://")) {
      throw new DomainError("provider_not_configured",
        "Le paiement Wave n'est pas encore configuré.");
    }
    const body = JSON.stringify({
      // XOF : montant entier, transmis en chaîne.
      amount: String(Math.trunc(payment.amount)),
      currency: "XOF",
      client_reference: payment.id,
      success_url: `${this.appBaseUrl}/?payment=success&ref=${encodeURIComponent(payment.id)}`,
      error_url: `${this.appBaseUrl}/?payment=error&ref=${encodeURIComponent(payment.id)}`,
      // Protection contre les arnaques : seul le numéro du membre peut payer.
      restrict_payer_mobile: payment.phone,
    });
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
    if (this.signingSecret) {
      const ts = this.nowSeconds();
      const sig = createHmac("sha256", this.signingSecret)
        .update(`${ts}${body}`).digest("hex");
      headers["Wave-Signature"] = `t=${ts},v1=${sig}`;
    }
    const res = await this.fetchImpl(`${API_BASE}/v1/checkout/sessions`, {
      method: "POST", headers, body,
    });
    if (!res.ok) {
      // Le détail reste dans les journaux serveur, pas dans le message au membre.
      console.error("Wave checkout refusé", res.status, await res.text());
      throw new DomainError("provider_error",
        "Wave n'a pas pu ouvrir le paiement. Réessayez dans un instant.");
    }
    const session = await res.json() as {id?: string; wave_launch_url?: string};
    if (!session.id || !session.wave_launch_url) {
      throw new DomainError("provider_error", "Réponse Wave invalide.");
    }
    return {
      paymentId: payment.id,
      providerReference: session.id,
      checkoutUrl: session.wave_launch_url,
      instructions: "Confirmez le paiement dans l'application Wave.",
      status: "pending",
    };
  }

  async verifyWebhook(
    rawBody: string | Buffer,
    headers: Record<string, string | string[] | undefined>
  ): Promise<WebhookVerificationResult> {
    const invalid = (raw: unknown = null): WebhookVerificationResult =>
      ({isValid: false, status: "failed", rawPayload: raw});
    if (!this.webhookSecret) return invalid(); // jamais de secret par défaut

    const rawString = typeof rawBody === "string" ?
      rawBody : rawBody.toString("utf8");
    const header = headers["wave-signature"] ?? headers["Wave-Signature"];
    const sigHeader = Array.isArray(header) ? header[0] : header;
    if (!sigHeader) return invalid();

    // t=<horodatage>,v1=<signature>[,v1=<signature>]
    let timestamp = "";
    const signatures: string[] = [];
    for (const part of sigHeader.split(",")) {
      const [key, value] = part.split("=");
      if (key?.trim() === "t") timestamp = (value ?? "").trim();
      if (key?.trim() === "v1" && value) signatures.push(value.trim());
    }
    const ts = Number(timestamp);
    if (!Number.isInteger(ts) || signatures.length === 0) return invalid();
    // Anti-rejeu : horodatage trop ancien (ou trop dans le futur).
    const age = this.nowSeconds() - ts;
    if (age > MAX_SIGNATURE_AGE_SECONDS || age < -30) return invalid();

    const expected = createHmac("sha256", this.webhookSecret)
      .update(`${timestamp}${rawString}`).digest();
    const matches = signatures.some((s) => {
      if (!/^[0-9a-fA-F]+$/.test(s)) return false;
      const buf = Buffer.from(s, "hex");
      return buf.length === expected.length && timingSafeEqual(buf, expected);
    });
    if (!matches) return invalid();

    let event: {
      id?: string; type?: string;
      data?: {
        id?: string; client_reference?: string; amount?: string;
        currency?: string; payment_status?: string;
      };
    };
    try {
      event = JSON.parse(rawString);
    } catch {
      return invalid(rawString);
    }
    const data = event.data ?? {};
    const base = {
      isValid: true,
      paymentId: data.client_reference,
      providerReference: data.id,
      amountPaid: data.amount !== undefined ? Number(data.amount) : undefined,
      currency: data.currency,
      rawPayload: event,
    };
    if (event.type === "checkout.session.completed" &&
      data.payment_status === "succeeded") {
      return {...base, status: "succeeded"};
    }
    // Un échec n'est pas définitif (plusieurs tentatives possibles dans la
    // session) et les autres événements ne concernent pas ce paiement.
    return {...base, status: "pending"};
  }
}
