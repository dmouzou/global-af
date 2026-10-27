import {setGlobalOptions} from "firebase-functions";

// Région alignée sur la base Firestore (multi-région eur3) ; limite de
// conteneurs pour maîtriser les coûts.
setGlobalOptions({maxInstances: 10, region: "europe-west1"});

export {registerUser} from "./handlers/register";
export {requestWithdrawal, adminProcessWithdrawal} from "./handlers/withdrawals";
export {adminSetUserRole} from "./handlers/admin";
export {
  initiateMobileMoneyPayment,
  paymentWebhook,
  requestPaymentRetraction,
  validateMaturedCommissions,
} from "./handlers/payments";

