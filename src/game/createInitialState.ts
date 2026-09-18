import {
  GEM_COLORS,
  GEM_TOKEN_COUNT_BY_PLAYER_COUNT,
  GOLD_TOKEN_COUNT,
} from './constants';
import type { GameState, Player, TokenColor } from './types';

function emptyTokenRecord(): Record<TokenColor, number> {
  return { emerald: 0, sapphire: 0, ruby: 0, diamond: 0, onyx: 0, gold: 0 };
}

function createPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    tokens: emptyTokenRecord(),
    bonuses: { emerald: 0, sapphire: 0, ruby: 0, diamond: 0, onyx: 0 },
    purchasedCards: [],
    reservedCards: [],
    nobles: [],
    score: 0,
  };
}

/** Empty placeholder state shown while the setup screen collects player names. */
export function createSetupState(): GameState {
  return {
    phase: 'setup',
    players: [],
    currentPlayerIndex: 0,
    tokenPool: emptyTokenRecord(),
    decks: { 1: [], 2: [], 3: [] },
    board: { 1: [null, null, null, null], 2: [null, null, null, null], 3: [null, null, null, null] },
    nobles: [],
    pendingAction: null,
    finalRoundTriggeredBy: null,
    winnerIds: [],
    turnCount: 0,
  };
}

/**
 * Builds a fresh game shell for the given players: token pool filled,
 * players created, but board/decks/nobles left empty — dealGame() (in
 * setup.ts) fills those in with shuffled cards and nobles.
 */
export function createInitialState(playerNames: string[]): GameState {
  const count = playerNames.length;
  const gemCount = GEM_TOKEN_COUNT_BY_PLAYER_COUNT[count];

  const tokenPool: Record<TokenColor, number> = {
    ...Object.fromEntries(GEM_COLORS.map((c) => [c, gemCount])),
    gold: GOLD_TOKEN_COUNT,
  } as Record<TokenColor, number>;

  return {
    phase: 'setup',
    players: playerNames.map((name, i) => createPlayer(`p${i + 1}`, name)),
    currentPlayerIndex: 0,
    tokenPool,
    decks: { 1: [], 2: [], 3: [] },
    board: { 1: [null, null, null, null], 2: [null, null, null, null], 3: [null, null, null, null] },
    nobles: [],
    pendingAction: null,
    finalRoundTriggeredBy: null,
    winnerIds: [],
    turnCount: 0,
  };
}
