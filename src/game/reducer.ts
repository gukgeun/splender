import { createInitialState } from './createInitialState';
import { dealGame } from './setup';
import type { GameAction, GameState } from './types';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return dealGame(createInitialState(action.playerNames));

    // Turn logic (token taking, buying, reserving, discard, noble choice) is
    // implemented in the next step. Until then these are accepted but no-ops.
    case 'TAKE_TOKENS':
    case 'BUY_CARD':
    case 'RESERVE_CARD':
    case 'DISCARD_TOKEN':
    case 'CHOOSE_NOBLE':
      return state;

    default:
      return state;
  }
}
