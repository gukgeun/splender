import type { GemColor } from './types';

export const GEM_COLORS: GemColor[] = ['emerald', 'sapphire', 'ruby', 'diamond', 'onyx'];

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

/** Starting gem-token count per color, by player count. Gold is fixed at 5 regardless. */
export const GEM_TOKEN_COUNT_BY_PLAYER_COUNT: Record<number, number> = {
  2: 4,
  3: 5,
  4: 7,
};

export const GOLD_TOKEN_COUNT = 5;

/** Number of noble tiles drawn, by player count (always players + 1). */
export const NOBLE_COUNT_BY_PLAYER_COUNT: Record<number, number> = {
  2: 3,
  3: 4,
  4: 5,
};

export const CARDS_PER_ROW = 4;
export const MAX_RESERVED_CARDS = 3;
export const MAX_TOKENS_HELD = 10;
export const WINNING_SCORE = 15;

/** Minimum tokens of a color that must remain in the pool to take 2-of-same-color. */
export const MIN_STACK_FOR_SAME_COLOR_TAKE = 4;
