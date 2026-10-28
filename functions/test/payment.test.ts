import {describe, expect, it} from "vitest";
import {createHmac} from "node:crypto";
import {validatePaymentInitiation} from "../src/domain/payment";
import {WaveAdapter} from "../src/services/payments/wave.adapter";
import {MobileMoneyAdapter} from "../src/services/payments/provider.interface";
import {OrangeMoneyAdapter} from "../src/services/payments/orange.adapter";
import {MtnMomoAdapter} from "../src/services/payments/mtn.adapter";
import {MoovMoneyAdapter} from "../src/services/payments/moov.adapter";
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

  it("WaveAdapter : génère une session et vérifie la signature HMAC", async () => {
    const secret = "test_wave_secret";
    // Typé par l'interface : l'URL de rappel fait partie du contrat commun.
    const adapter: MobileMoneyAdapter = new WaveAdapter(secret);

    const init = await adapter.initiatePayment(
      {
        id: "pmt_001",
        userId: "usr_1",
        amount: 9900,
        currency: "XOF",
        operator: "wave",
        phone: "+2250700000000",
        kind: "subscription",
        status: "pending",
        transactionReference: "TX-1",
        createdAt: new Date(),
      },
      "https://example.com/callback"
    );

    expect(init.checkoutUrl).toContain("pmt_001");
    expect(init.status).toBe("pending");

    const payload = JSON.stringify({
      client_reference: "pmt_001",
      id: "wave_tx_123",
      checkout_status: "complete",
      amount: 9900,
    });
    const validSig = createHmac("sha256", secret).update(payload).digest("hex");

    const verified = await adapter.verifyWebhook(payload, {
      "wave-signature": `t=1700000000,v1=${validSig}`,
    });
    expect(verified.isValid).toBe(true);
    expect(verified.status).toBe("succeeded");
    expect(verified.paymentId).toBe("pmt_001");

    const badVerified = await adapter.verifyWebhook(payload, {
      "wave-signature": "bad_sig",
    });
    expect(badVerified.isValid).toBe(false);
  });

  it("OrangeMoneyAdapter : vérifie la signature webhook", async () => {
    const secret = "test_orange_secret";
    const adapter = new OrangeMoneyAdapter(secret);

    const payload = JSON.stringify({
      order_id: "pmt_002",
      txnid: "om_tx_999",
      status: "SUCCESS",
      amount: 25000,
    });
    const validSig = createHmac("sha256", secret).update(payload).digest("hex");

    const verified = await adapter.verifyWebhook(payload, {
      "x-orange-signature": validSig,
    });
    expect(verified.isValid).toBe(true);
    expect(verified.status).toBe("succeeded");
    expect(verified.paymentId).toBe("pmt_002");
  });

  it("MTN et Moov : vérification des callbacks signés", async () => {
    const mtnAdapter = new MtnMomoAdapter("test_mtn_secret");
    const mtnPayload = JSON.stringify({
      externalId: "pmt_003",
      financialTransactionId: "mtn_tx_888",
      status: "SUCCESSFUL",
      amount: 9900,
    });
    const mtnSig = createHmac("sha256", "test_mtn_secret").update(mtnPayload).digest("hex");
    const mtnVerif = await mtnAdapter.verifyWebhook(mtnPayload, {"x-momo-signature": mtnSig});
    expect(mtnVerif.isValid).toBe(true);
    expect(mtnVerif.status).toBe("succeeded");

    const moovAdapter = new MoovMoneyAdapter("test_moov_secret");
    const moovPayload = JSON.stringify({
      reference: "pmt_004",
      transId: "moov_tx_777",
      status: "0",
      amount: 9900,
    });
    const moovSig = createHmac("sha256", "test_moov_secret").update(moovPayload).digest("hex");
    const moovVerif = await moovAdapter.verifyWebhook(moovPayload, {"x-moov-signature": moovSig});
    expect(moovVerif.isValid).toBe(true);
    expect(moovVerif.status).toBe("succeeded");
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
