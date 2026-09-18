import { MIN_STACK_FOR_SAME_COLOR_TAKE } from './constants';
import type { GameState, GemColor } from './types';

/**
 * Whether `colors` is a legal TAKE_TOKENS payload: 1-3 mutually distinct
 * colors each with stock, or exactly 2 of the same color when that color's
 * stock is >= 4 (so at least 2 remain in the bank after taking).
 *
 * Taking fewer than 3 distinct colors is allowed even when more are
 * available — a deliberate simplification of the "must take 3 if possible"
 * house rule some editions enforce, for simpler touch UX.
 */
export function isValidTokenSelection(tokenPool: GameState['tokenPool'], colors: GemColor[]): boolean {
  if (colors.length === 2 && colors[0] === colors[1]) {
    return tokenPool[colors[0]] >= MIN_STACK_FOR_SAME_COLOR_TAKE;
  }
  if (colors.length < 1 || colors.length > 3) return false;
  if (new Set(colors).size !== colors.length) return false;
  return colors.every((c) => tokenPool[c] >= 1);
}

/** Whether tapping `color` next (given the tokens already in the selection tray) is a legal move. */
export function canAddColorToSelection(
  tokenPool: GameState['tokenPool'],
  tray: GemColor[],
  color: GemColor,
): boolean {
  if (tray.length >= 3) return false;
  if (tray.length === 2 && tray[0] === tray[1]) return false; // locked in as a same-color-2 pick

  if (tray.includes(color)) {
    // A second token of a color already in the tray: only valid as the same-color-2 pick.
    return tray.length === 1 && tokenPool[color] >= MIN_STACK_FOR_SAME_COLOR_TAKE;
  }

  return tokenPool[color] >= 1;
}
