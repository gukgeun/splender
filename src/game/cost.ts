import { GEM_COLORS } from './constants';
import type { Card, GemColor, Player } from './types';

/** Card cost after subtracting the player's owned bonus cards, per color. Omitted/0 = free. */
export function effectiveCost(card: Card, bonuses: Player['bonuses']): Partial<Record<GemColor, number>> {
  const result: Partial<Record<GemColor, number>> = {};
  for (const color of GEM_COLORS) {
    const discounted = Math.max(0, (card.cost[color] ?? 0) - bonuses[color]);
    if (discounted > 0) result[color] = discounted;
  }
  return result;
}

export interface PaymentPlan {
  /** Colored tokens spent, by color. */
  colorPayment: Partial<Record<GemColor, number>>;
  /** Gold tokens spent to cover any shortfall. */
  goldPayment: number;
}

/**
 * The (only sensible) way to pay for a card: spend matching-color tokens first,
 * gold only for the remainder. Returns null if the player can't afford it even
 * using all their gold.
 */
export function paymentPlan(card: Card, player: Player): PaymentPlan | null {
  const cost = effectiveCost(card, player.bonuses);
  const colorPayment: Partial<Record<GemColor, number>> = {};
  let goldNeeded = 0;

  for (const color of GEM_COLORS) {
    const need = cost[color] ?? 0;
    if (need === 0) continue;
    const fromColor = Math.min(player.tokens[color], need);
    if (fromColor > 0) colorPayment[color] = fromColor;
    goldNeeded += need - fromColor;
  }

  if (goldNeeded > player.tokens.gold) return null;
  return { colorPayment, goldPayment: goldNeeded };
}

export function canAfford(card: Card, player: Player): boolean {
  return paymentPlan(card, player) !== null;
}
