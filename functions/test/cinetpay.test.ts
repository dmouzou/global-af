import {describe, expect, it} from "vitest";
import {
  CinetPayAdapter, cinetpayToken, CINETPAY_HMAC_FIELDS,
} from "../src/services/payments/cinetpay.adapter";
import {PaymentRecord, validateCheckoutAmount, paymentMethodLabel}
  from "../src/domain/payment";

const KEYS = {apiKey: "APIKEY", siteId: "12345", secretKey: "SECRET"};

const record = (over: Partial<PaymentRecord> = {}): PaymentRecord => ({
  id: "GAF123ABC", userId: "usr_1", amount: 9900, currency: "XOF",
  provider: "cinetpay", method: "mobile_money", kind: "activation",
  plan: "premium", status: "initiated", transactionReference: "GAF123ABC",
  createdAt: new Date(), ...over,
});

const ctx = {
  notifyUrl: "https://example.com/cinetpayWebhook",
  returnUrl: "https://example.com/?payment=return",
  description: "GLOBAL-AF - Pack",
};

/** Corps de notification CinetPay (formulaire) + son en-tête x-token. */
function notification(fields: Record<string, string>, secret = KEYS.secretKey) {
  const full: Record<string, string> = {
    cpm_site_id: "12345", cpm_trans_id: "GAF123ABC",
    cpm_trans_date: "2026-10-29 10:00:00", cpm_amount: "9900",
    cpm_currency: "XOF", signature: "sig", payment_method: "OM",
    cel_phone_num: "0700000000", cpm_phone_prefixe: "225",
    cpm_language: "fr", cpm_version: "V4", cpm_payment_config: "SINGLE",
    cpm_page_action: "PAYMENT", cpm_custom: "premium",
    cpm_designation: "GLOBAL-AF", cpm_error_message: "SUCCES", ...fields,
  };
  const body = new URLSearchParams(full).toString();
  return {body, headers: {"x-token": cinetpayToken(full, secret)}};
}

const okFetch = (check: unknown, status = 200) =>
  (async () => new Response(JSON.stringify(check), {status})) as unknown as typeof fetch;

describe("CinetPay — initiation du paiement", () => {
  it("Mobile Money : requête conforme à la documentation", async () => {
    let captured: {url: string; body: Record<string, unknown>} | undefined;
    const fetchImpl = (async (url: string, init: RequestInit) => {
      captured = {url, body: JSON.parse(String(init.body))};
      return new Response(JSON.stringify({
        code: "201", message: "CREATED",
        data: {payment_token: "tok123",
          payment_url: "https://checkout.cinetpay.com/payment/tok123"},
      }), {status: 200});
    }) as unknown as typeof fetch;
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl});
    const r = await adapter.initiatePayment(record(), ctx);

    expect(r.checkoutUrl).toBe("https://checkout.cinetpay.com/payment/tok123");
    expect(r.providerReference).toBe("tok123");
    expect(captured?.url).toBe("https://api-checkout.cinetpay.com/v2/payment");
    const b = captured!.body;
    expect(b.apikey).toBe("APIKEY");
    expect(b.site_id).toBe("12345");
    expect(b.transaction_id).toBe("GAF123ABC");
    expect(b.amount).toBe(9900); // entier, multiple de 5
    expect(b.currency).toBe("XOF");
    expect(b.channels).toBe("MOBILE_MONEY");
    expect(b.notify_url).toBe(ctx.notifyUrl);
    expect(b.return_url).toBe(ctx.returnUrl);
    expect(b.customer_address).toBeUndefined(); // inutile hors carte
  });

  it("Carte Visa : canal CREDIT_CARD avec les informations client obligatoires", async () => {
    let body: Record<string, unknown> = {};
    const fetchImpl = (async (_u: string, init: RequestInit) => {
      body = JSON.parse(String(init.body));
      return new Response(JSON.stringify({code: "201",
        data: {payment_token: "t", payment_url: "https://checkout.cinetpay.com/payment/t"}}));
    }) as unknown as typeof fetch;
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl});
    await adapter.initiatePayment(record({method: "card"}), {
      ...ctx,
      customer: {firstName: "Awa", lastName: "Koné", email: "awa@example.ci",
        phone: "+2250700000000", country: "ci", address: "Rue 12",
        city: "Abidjan", zipCode: "00225"},
    });
    expect(body.channels).toBe("CREDIT_CARD");
    expect(body.customer_surname).toBe("Awa"); // prénom = surname (doc CinetPay)
    expect(body.customer_name).toBe("Koné");
    expect(body.customer_country).toBe("CI");
    expect(body.customer_address).toBe("Rue 12");
    expect(body.customer_zip_code).toBe("00225");
  });

  it("Carte : refuse si l'adresse de facturation est incomplète", async () => {
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl: okFetch({})});
    await expect(adapter.initiatePayment(record({method: "card"}), {
      ...ctx,
      customer: {firstName: "A", lastName: "B", email: "a@b.ci",
        phone: "0700000000", country: "CI"},
    })).rejects.toThrow();
  });

  it("refuse un montant non multiple de 5 ou sans clés configurées", async () => {
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl: okFetch({})});
    await expect(adapter.initiatePayment(record({amount: 9901}), ctx)).rejects.toThrow();
    const unconfigured = new CinetPayAdapter({apiKey: "", siteId: "", secretKey: ""});
    await expect(unconfigured.initiatePayment(record(), ctx)).rejects.toThrow();
    expect(() => validateCheckoutAmount(9900)).not.toThrow();
    expect(() => validateCheckoutAmount(50)).toThrow();
  });

  it("n'expose pas le détail d'une erreur de la passerelle au membre", async () => {
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl:
      okFetch({code: "ERR", message: "INVALID_APIKEY secret-details"}, 400)});
    await expect(adapter.initiatePayment(record(), ctx))
      .rejects.toThrow(/n'a pas pu être ouvert/);
  });
});

describe("CinetPay — notification (webhook)", () => {
  const accepted = {code: "00", message: "SUCCES", data: {
    amount: "9900", currency: "XOF", status: "ACCEPTED", payment_method: "OM",
    operator_id: "MP220915.2257.A76307"}};

  it("le jeton HMAC suit l'ordre des 16 champs de la documentation", () => {
    expect(CINETPAY_HMAC_FIELDS.length).toBe(16);
    expect(CINETPAY_HMAC_FIELDS[0]).toBe("cpm_site_id");
    expect(CINETPAY_HMAC_FIELDS[15]).toBe("cpm_error_message");
  });

  it("jeton valide + vérification ACCEPTED => paiement confirmé", async () => {
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl: okFetch(accepted)});
    const n = notification({});
    const r = await adapter.verifyWebhook(n.body, n.headers);
    expect(r.isValid).toBe(true);
    expect(r.status).toBe("succeeded");
    expect(r.paymentId).toBe("GAF123ABC");
    expect(r.amountPaid).toBe(9900);
    expect(r.paidWith).toBe("OM");
    expect(r.providerReference).toBe("MP220915.2257.A76307");
  });

  it("le statut vient de l'API de vérification, pas de la notification", async () => {
    // La notification prétend « SUCCES » mais CinetPay répond REFUSED.
    const refused = {code: "627", message: "TRANSACTION_CANCEL",
      data: {amount: "9900", currency: "XOF", status: "REFUSED", payment_method: "MOMO"}};
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl: okFetch(refused)});
    const n = notification({cpm_error_message: "SUCCES"});
    expect((await adapter.verifyWebhook(n.body, n.headers)).status).toBe("failed");
  });

  it("jeton forgé, absent, mauvais secret ou autre site => refusé", async () => {
    const adapter = new CinetPayAdapter({...KEYS, fetchImpl: okFetch(accepted)});
    const n = notification({});
    expect((await adapter.verifyWebhook(n.body, {})).isValid).toBe(false);
    expect((await adapter.verifyWebhook(n.body, {"x-token": "00"})).isValid).toBe(false);
    const wrong = notification({}, "AUTRE_SECRET");
    expect((await adapter.verifyWebhook(wrong.body, wrong.headers)).isValid).toBe(false);
    const other = notification({cpm_site_id: "99999"});
    expect((await adapter.verifyWebhook(other.body, other.headers)).isValid).toBe(false);
    // corps modifié après signature (ex. montant)
    const tampered = n.body.replace("cpm_amount=9900", "cpm_amount=100");
    expect((await adapter.verifyWebhook(tampered, n.headers)).isValid).toBe(false);
  });

  it("vérification indisponible ou statut en attente => aucun changement d'état", async () => {
    const n = notification({});
    const down = new CinetPayAdapter({...KEYS, fetchImpl: okFetch({}, 500)});
    expect((await down.verifyWebhook(n.body, n.headers)).status).toBe("pending");
    const waiting = new CinetPayAdapter({...KEYS, fetchImpl: okFetch(
      {code: "662", message: "WAITING_CUSTOMER_PAYMENT",
        data: {amount: "9900", currency: "XOF", status: "PENDING"}})});
    expect((await waiting.verifyWebhook(n.body, n.headers)).status).toBe("pending");
  });

  it("libellés des moyens de paiement", () => {
    expect(paymentMethodLabel("OM", "mobile_money")).toBe("Orange Money");
    expect(paymentMethodLabel("MOMO", "mobile_money")).toBe("MTN MoMo");
    expect(paymentMethodLabel("FLOOZ", "mobile_money")).toBe("Moov Money");
    expect(paymentMethodLabel("WAVECI", "mobile_money")).toBe("Wave");
    expect(paymentMethodLabel("VISA", "card")).toBe("carte bancaire");
    expect(paymentMethodLabel(null, "mobile_money")).toBe("Mobile Money");
  });
});
