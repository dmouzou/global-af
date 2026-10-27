import {Operator} from "../../domain/types";
import {MobileMoneyAdapter} from "./provider.interface";
import {WaveAdapter} from "./wave.adapter";
import {OrangeMoneyAdapter} from "./orange.adapter";
import {MtnMomoAdapter} from "./mtn.adapter";
import {MoovMoneyAdapter} from "./moov.adapter";

const registry: Record<Operator, MobileMoneyAdapter> = {
  wave: new WaveAdapter(),
  orange_money: new OrangeMoneyAdapter(),
  mtn_momo: new MtnMomoAdapter(),
  moov_money: new MoovMoneyAdapter(),
};

export function getPaymentAdapter(operator: Operator): MobileMoneyAdapter {
  const adapter = registry[operator];
  if (!adapter) {
    throw new Error(`Aucun adaptateur de paiement configuré pour ${operator}`);
  }
  return adapter;
}
