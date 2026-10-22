import {DomainError} from "./errors";
import {assertPositiveInt} from "./money";
import {Balances, Posting} from "./types";

export const EMPTY_BALANCES: Balances = {available: 0, pending: 0, reserved: 0};

/**
 * Applique un mouvement à des soldes et retourne de NOUVEAUX soldes.
 * Refuse tout mouvement qui rendrait un compartiment négatif.
 * @param {Balances} balances Soldes courants.
 * @param {Posting} posting Mouvement à appliquer.
 * @return {Balances} Nouveaux soldes (les entrées ne sont pas modifiées).
 */
export function applyPosting(balances: Balances, posting: Posting): Balances {
  assertPositiveInt(posting.amount);
  if (posting.from === posting.to) {
    throw new DomainError("invalid_posting",
      "Un mouvement doit changer de compartiment.");
  }
  const next: Balances = {...balances};
  if (posting.from !== "external") {
    if (next[posting.from] < posting.amount) {
      throw new DomainError("insufficient_funds",
        "Solde insuffisant dans le compartiment source.");
    }
    next[posting.from] -= posting.amount;
  }
  if (posting.to !== "external") {
    next[posting.to] += posting.amount;
  }
  return next;
}

/**
 * Rejoue une suite de mouvements depuis zéro. Sert à recalculer et vérifier
 * un wallet à partir du ledger (cohérence, section 31).
 * @param {Posting[]} postings Mouvements dans l'ordre.
 * @return {Balances} Soldes résultants.
 */
export function replay(postings: Posting[]): Balances {
  return postings.reduce(applyPosting, {...EMPTY_BALANCES});
}

/**
 * Mouvement inverse, pour une correction par contrepartie (section 29 :
 * on n'écrase jamais l'historique).
 * @param {Posting} posting Mouvement à annuler.
 * @return {Posting} Mouvement inverse.
 */
export function reversePosting(posting: Posting): Posting {
  return {from: posting.to, to: posting.from, amount: posting.amount};
}
