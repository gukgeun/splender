/**
 * Splendor game state — pure data types, no React/UI concerns.
 * Kept framework-agnostic so the same reducer/types can later run
 * server-side for online multiplayer without modification.
 */

/** The 5 purchasable gem colors (also the bonus colors printed on cards). */
export type GemColor = 'emerald' | 'sapphire' | 'ruby' | 'diamond' | 'onyx';

/** Gem colors plus gold (the wildcard token). */
export type TokenColor = GemColor | 'gold';

export type CardLevel = 1 | 2 | 3;

export interface Card {
  id: string;
  level: CardLevel;
  bonus: GemColor;
  points: number;
  /** Cost is always in the 5 gem colors — never gold. Omitted color = 0 cost. */
  cost: Partial<Record<GemColor, number>>;
}

export interface Noble {
  id: string;
  points: 3;
  /** Bonus-card requirement, e.g. { emerald: 3, sapphire: 3 }. */
  requirement: Partial<Record<GemColor, number>>;
}

export interface Player {
  id: string;
  name: string;
  tokens: Record<TokenColor, number>;
  /** Derived from purchasedCards, cached for cheap cost-discount lookups. */
  bonuses: Record<GemColor, number>;
  purchasedCards: Card[];
  reservedCards: Card[];
  nobles: Noble[];
  /** Derived from purchasedCards + nobles, cached for display/win checks. */
  score: number;
}

/** Face-up display slots on the board, per level. Always length 4; null = empty slot (deck exhausted). */
export type BoardRow = (Card | null)[];

export interface Board {
  1: BoardRow;
  2: BoardRow;
  3: BoardRow;
}

/**
 * A turn that isn't finished yet because it needs an extra decision:
 * - discardTokens: player took tokens and is now over the 10-token limit
 * - chooseNoble: purchase made the player eligible for 2+ nobles at once
 * The active player cannot start a new top-level action until this resolves.
 */
export type PendingAction =
  | { type: 'discardTokens'; playerId: string; excess: number }
  | { type: 'chooseNoble'; playerId: string; eligibleNobleIds: string[] };

export type GamePhase =
  | 'setup' // player count / names being configured, board not dealt yet
  | 'playing'
  | 'finalRound' // someone hit 15+ points; playing out the rest of the round
  | 'gameOver';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  tokenPool: Record<TokenColor, number>;
  /** Face-down draw piles, index 0 = top of deck. Only length matters for UI (contents are hidden). */
  decks: Record<CardLevel, Card[]>;
  board: Board;
  /** Noble tiles currently available to be claimed. */
  nobles: Noble[];
  pendingAction: PendingAction | null;
  /** Player index that first reached 15+ points; set once, triggers the final round. */
  finalRoundTriggeredBy: number | null;
  /** Winning player id(s) once phase is 'gameOver' — more than one means a full tie (score AND card count). */
  winnerIds: string[];
  turnCount: number;
}

/** Actions dispatched by the active player. The reducer validates legality and applies them. */
export type GameAction =
  | { type: 'START_GAME'; playerNames: string[] }
  | { type: 'RESET_TO_SETUP' }
  | { type: 'TAKE_TOKENS'; colors: GemColor[] } // 3 distinct colors, or [color, color] for same-color-2
  | { type: 'BUY_CARD'; cardId: string; source: 'board' | 'reserved' }
  | { type: 'RESERVE_CARD_FROM_BOARD'; cardId: string }
  // Reserving the top of a deck is a blind pick — the client can't know the card's
  // id ahead of time, so it names the deck by level instead.
  | { type: 'RESERVE_CARD_FROM_DECK'; level: CardLevel }
  | { type: 'DISCARD_TOKEN'; color: TokenColor }
  | { type: 'CHOOSE_NOBLE'; nobleId: string };
