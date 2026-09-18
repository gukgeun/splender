import { ALL_CARDS } from './cardData';
import { ALL_NOBLES } from './nobleData';
import { CARDS_PER_ROW, NOBLE_COUNT_BY_PLAYER_COUNT } from './constants';
import type { Card, CardLevel, GameState } from './types';

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles each level's deck, deals the 4 face-up board slots per level,
 * and draws (players + 1) nobles. Pure — returns a new state.
 */
export function dealGame(state: GameState): GameState {
  const levels: CardLevel[] = [1, 2, 3];
  const decks = {} as Record<CardLevel, Card[]>;
  const board = { 1: [], 2: [], 3: [] } as GameState['board'];

  for (const level of levels) {
    const shuffled = shuffle(ALL_CARDS.filter((c) => c.level === level));
    board[level] = shuffled.slice(0, CARDS_PER_ROW);
    decks[level] = shuffled.slice(CARDS_PER_ROW);
  }

  const nobleCount = NOBLE_COUNT_BY_PLAYER_COUNT[state.players.length];
  const nobles = shuffle(ALL_NOBLES).slice(0, nobleCount);

  return { ...state, decks, board, nobles, phase: 'playing' };
}
