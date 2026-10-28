import {describe, expect, it} from "vitest";
import {createHmac} from "node:crypto";
import {validatePaymentInitiation} from "../src/domain/payment";
import {WaveAdapter} from "../src/services/payments/wave.adapter";
import {MobileMoneyAdapter} from "../src/services/payments/provider.interface";
import {checkRetraction} from "../src/domain/retraction";

describe("Mobile Money Payment Domain & Adapters", () => {
  it("valide les montants et opérateurs autorisés", () => {
    const valid = validatePaymentInitiation(9900, "wave", "+2250700000000");
    expect(valid.amount).toBe(9900);
    expect(valid.operator).toBe("wave");

    expect(() => validatePaymentInitiation(100, "wave", "+2250700000000")).toThrow();
    expect(() => validatePaymentInitiation(9900, "bitcoin", "+2250700000000")).toThrow();
    expect(() => validatePaymentInitiation(9900, "wave", "123")).toThrow();
  });

  it("WaveAdapter : ouvre une session Checkout conforme à la documentation Wave", async () => {
    let captured: {url: string; init: RequestInit} | undefined;
    const fetchImpl = (async (url: string, init: RequestInit) => {
      captured = {url, init};
      return new Response(JSON.stringify({
        id: "cos-18qq25rgr100a",
        wave_launch_url: "https://pay.wave.com/c/cos-18qq25rgr100a",
      }), {status: 200});
    }) as unknown as typeof fetch;
    const adapter: MobileMoneyAdapter = new WaveAdapter({
      apiKey: "wave_ci_prod_test", signingSecret: "wave_sn_AKS_test",
      webhookSecret: "x", appBaseUrl: "https://example.com/",
      fetchImpl, nowSeconds: () => 1700000000,
    });
    const init = await adapter.initiatePayment({
      id: "pmt_001", userId: "usr_1", amount: 9900, currency: "XOF",
      provider: "wave", method: "mobile_money", operator: "wave",
      phone: "+2250700000000", kind: "subscription",
      status: "pending", transactionReference: "TX-1", createdAt: new Date(),
    });

    expect(init.checkoutUrl).toBe("https://pay.wave.com/c/cos-18qq25rgr100a");
    expect(init.providerReference).toBe("cos-18qq25rgr100a");
    expect(captured?.url).toBe("https://api.wave.com/v1/checkout/sessions");
    const body = JSON.parse(String(captured?.init.body));
    expect(body.amount).toBe("9900"); // chaîne, sans décimales
    expect(body.currency).toBe("XOF");
    expect(body.client_reference).toBe("pmt_001");
    expect(body.success_url.startsWith("https://example.com/")).toBe(true);
    expect(body.restrict_payer_mobile).toBe("+2250700000000");
    const headers = captured?.init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer wave_ci_prod_test");
    // Signature de requête : t=<ts>,v1=HMAC(secret, ts + corps)
    const expectedSig = createHmac("sha256", "wave_sn_AKS_test")
      .update(`1700000000${captured?.init.body}`).digest("hex");
    expect(headers["Wave-Signature"]).toBe(`t=1700000000,v1=${expectedSig}`);
  });

  it("WaveAdapter : refuse d'ouvrir un paiement sans clé API", async () => {
    const adapter = new WaveAdapter({apiKey: "", appBaseUrl: "https://example.com"});
    await expect(adapter.initiatePayment({
      id: "pmt_x", userId: "u", amount: 5000, currency: "XOF",
      provider: "wave", method: "mobile_money",
      operator: "wave", phone: "+2250700000000", kind: "subscription", status: "pending",
      transactionReference: "TX", createdAt: new Date(),
    })).rejects.toThrow();
  });

  it("WaveAdapter : webhook signé = HMAC(secret, horodatage + corps brut)", async () => {
    const secret = "wave_sn_WHS_test";
    const now = 1700000000;
    const adapter = new WaveAdapter({webhookSecret: secret, nowSeconds: () => now});
    const body = JSON.stringify({
      id: "EV_QvEZuDSQbLdI", type: "checkout.session.completed",
      data: {
        id: "cos-18qq25rgr100a", amount: "9900", currency: "XOF",
        client_reference: "pmt_001", payment_status: "succeeded",
        checkout_status: "complete",
      },
    });
    const sign = (t: number, b = body, s = secret) =>
      createHmac("sha256", s).update(`${t}${b}`).digest("hex");

    const ok = await adapter.verifyWebhook(body, {
      "wave-signature": `t=${now},v1=${sign(now)}`,
    });
    expect(ok.isValid).toBe(true);
    expect(ok.status).toBe("succeeded");
    expect(ok.paymentId).toBe("pmt_001");
    expect(ok.providerReference).toBe("cos-18qq25rgr100a");
    expect(ok.amountPaid).toBe(9900);

    // rotation de secret : plusieurs v1, un seul valide
    const rotated = await adapter.verifyWebhook(body, {
      "wave-signature": `t=${now},v1=${sign(now, body, "ancien")},v1=${sign(now)}`,
    });
    expect(rotated.isValid).toBe(true);

    // signature sur le corps seul (ancienne implémentation) : refusée
    const bodyOnly = createHmac("sha256", secret).update(body).digest("hex");
    expect((await adapter.verifyWebhook(body, {
      "wave-signature": `t=${now},v1=${bodyOnly}`,
    })).isValid).toBe(false);

    // corps modifié, mauvais secret, en-tête absent ou mal formé
    expect((await adapter.verifyWebhook(body + " ", {
      "wave-signature": `t=${now},v1=${sign(now)}`,
    })).isValid).toBe(false);
    expect((await adapter.verifyWebhook(body, {
      "wave-signature": `t=${now},v1=${sign(now, body, "autre")}`,
    })).isValid).toBe(false);
    expect((await adapter.verifyWebhook(body, {})).isValid).toBe(false);
    expect((await adapter.verifyWebhook(body, {
      "wave-signature": "bad_sig",
    })).isValid).toBe(false);
  });

  it("WaveAdapter : rejette un horodatage de plus de 5 minutes (anti-rejeu)", async () => {
    const secret = "wave_sn_WHS_test";
    const now = 1700000000;
    const adapter = new WaveAdapter({webhookSecret: secret, nowSeconds: () => now});
    const body = JSON.stringify({type: "checkout.session.completed",
      data: {client_reference: "pmt_1", payment_status: "succeeded"}});
    const old = now - 301;
    const sig = createHmac("sha256", secret).update(`${old}${body}`).digest("hex");
    expect((await adapter.verifyWebhook(body, {
      "wave-signature": `t=${old},v1=${sig}`,
    })).isValid).toBe(false);
  });

  it("WaveAdapter : un échec de tentative n'est pas définitif (statut pending)", async () => {
    const secret = "wave_sn_WHS_test";
    const now = 1700000000;
    const adapter = new WaveAdapter({webhookSecret: secret, nowSeconds: () => now});
    const body = JSON.stringify({id: "EV_8", type: "checkout.session.payment_failed",
      data: {id: "cos-1", client_reference: "pmt_1", payment_status: "failed",
        last_payment_error: {code: "insufficient-funds"}}});
    const sig = createHmac("sha256", secret).update(`${now}${body}`).digest("hex");
    const r = await adapter.verifyWebhook(body, {
      "wave-signature": `t=${now},v1=${sig}`,
    });
    expect(r.isValid).toBe(true);
    expect(r.status).toBe("pending");
  });

  it("Rétractation 7 jours : respecte la fenêtre d'éligibilité", () => {
    const now = new Date("2026-10-27T10:00:00Z");
    const config = {retractionDays: 7, retractionMaxConsumption: 0.2};

    // Achat il y a 3 jours -> éligible
    const recent = new Date("2026-10-24T10:00:00Z");
    const v1 = checkRetraction({purchasedAt: recent, now, consumption: 0.05}, config);
    expect(v1.eligible).toBe(true);

    // Achat il y a 8 jours -> expiré
    const expired = new Date("2026-10-18T10:00:00Z");
    const v2 = checkRetraction({purchasedAt: expired, now, consumption: 0.05}, config);
    expect(v2.eligible).toBe(false);
  });
});
