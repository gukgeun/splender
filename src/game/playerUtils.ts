import { GEM_COLORS } from './constants';
import type { Player } from './types';

export function totalTokenCount(tokens: Player['tokens']): number {
  return GEM_COLORS.reduce((sum, c) => sum + tokens[c], 0) + tokens.gold;
}
