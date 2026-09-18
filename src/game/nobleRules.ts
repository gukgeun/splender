import { GEM_COLORS } from './constants';
import type { Noble, Player } from './types';

export function isNobleEligible(noble: Noble, bonuses: Player['bonuses']): boolean {
  return GEM_COLORS.every((color) => bonuses[color] >= (noble.requirement[color] ?? 0));
}

export function findEligibleNobles(nobles: Noble[], bonuses: Player['bonuses']): Noble[] {
  return nobles.filter((noble) => isNobleEligible(noble, bonuses));
}
