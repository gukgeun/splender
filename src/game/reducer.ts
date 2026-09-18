import { createInitialState } from './createInitialState';
import { dealGame } from './setup';
import { MAX_RESERVED_CARDS, MAX_TOKENS_HELD } from './constants';
import { paymentPlan, type PaymentPlan } from './cost';
import { findEligibleNobles } from './nobleRules';
import { isValidTokenSelection } from './tokenRules';
import { totalTokenCount } from './playerUtils';
import type { Card, CardLevel, GameAction, GameState, GemColor, Player } from './types';

function currentPlayer(state: GameState): Player {
  return state.players[state.currentPlayerIndex];
}

function replacePlayer(state: GameState, playerId: string, updater: (p: Player) => Player): GameState {
  return { ...state, players: state.players.map((p) => (p.id === playerId ? updater(p) : p)) };
}

function advanceTurn(state: GameState): GameState {
  return {
    ...state,
    currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
    turnCount: state.turnCount + 1,
    pendingAction: null,
  };
}

/** After a token-granting action, either flag the 10-token overflow for discard or hand the turn off. */
function finishTokenGrantingAction(state: GameState, player: Player): GameState {
  const excess = totalTokenCount(player.tokens) - MAX_TOKENS_HELD;
  const withPlayer = replacePlayer(state, player.id, () => player);
  if (excess > 0) {
    return { ...withPlayer, pendingAction: { type: 'discardTokens', playerId: player.id, excess } };
  }
  return advanceTurn(withPlayer);
}

function findBoardCard(state: GameState, cardId: string): { level: CardLevel; index: number; card: Card } | null {
  for (const level of [1, 2, 3] as CardLevel[]) {
    const index = state.board[level].findIndex((c) => c?.id === cardId);
    if (index !== -1) return { level, index, card: state.board[level][index]! };
  }
  return null;
}

/** Removes a board card and refills the slot from that level's deck (null if the deck is empty). */
function takeFromBoard(state: GameState, level: CardLevel, index: number): GameState {
  const deck = state.decks[level];
  const nextCard = deck[0] ?? null;
  const newRow = [...state.board[level]];
  newRow[index] = nextCard;
  return {
    ...state,
    board: { ...state.board, [level]: newRow },
    decks: { ...state.decks, [level]: nextCard ? deck.slice(1) : deck },
  };
}

function grantCardToPlayer(player: Player, card: Card): Player {
  return {
    ...player,
    purchasedCards: [...player.purchasedCards, card],
    bonuses: { ...player.bonuses, [card.bonus]: player.bonuses[card.bonus] + 1 },
    score: player.score + card.points,
  };
}

function payForCard(player: Player, plan: PaymentPlan): Player {
  const tokens = { ...player.tokens };
  for (const [color, amount] of Object.entries(plan.colorPayment) as [GemColor, number][]) {
    tokens[color] -= amount;
  }
  tokens.gold -= plan.goldPayment;
  return { ...player, tokens };
}

function refundTokensToBank(state: GameState, plan: PaymentPlan): GameState {
  const tokenPool = { ...state.tokenPool };
  for (const [color, amount] of Object.entries(plan.colorPayment) as [GemColor, number][]) {
    tokenPool[color] += amount;
  }
  tokenPool.gold += plan.goldPayment;
  return { ...state, tokenPool };
}

/** After buying a card, auto-award a sole eligible noble, queue a choice among several, or just hand off the turn. */
function resolveNobles(state: GameState, player: Player): GameState {
  const eligible = findEligibleNobles(state.nobles, player.bonuses);

  if (eligible.length === 0) {
    return advanceTurn(replacePlayer(state, player.id, () => player));
  }

  if (eligible.length === 1) {
    const noble = eligible[0];
    const withNoble: Player = { ...player, nobles: [...player.nobles, noble], score: player.score + noble.points };
    const withPlayer = replacePlayer(state, player.id, () => withNoble);
    return advanceTurn({ ...withPlayer, nobles: state.nobles.filter((n) => n.id !== noble.id) });
  }

  const withPlayer = replacePlayer(state, player.id, () => player);
  return {
    ...withPlayer,
    pendingAction: { type: 'chooseNoble', playerId: player.id, eligibleNobleIds: eligible.map((n) => n.id) },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return dealGame(createInitialState(action.playerNames));

    case 'TAKE_TOKENS': {
      if (state.pendingAction) return state;
      if (!isValidTokenSelection(state.tokenPool, action.colors)) return state;

      const player = currentPlayer(state);
      const tokens = { ...player.tokens };
      const tokenPool = { ...state.tokenPool };
      for (const color of action.colors) {
        tokens[color] += 1;
        tokenPool[color] -= 1;
      }
      return finishTokenGrantingAction({ ...state, tokenPool }, { ...player, tokens });
    }

    case 'BUY_CARD': {
      if (state.pendingAction) return state;
      const player = currentPlayer(state);

      let card: Card;
      let afterRemoval: GameState;

      if (action.source === 'board') {
        const found = findBoardCard(state, action.cardId);
        if (!found) return state;
        card = found.card;
        afterRemoval = takeFromBoard(state, found.level, found.index);
      } else {
        const reserved = player.reservedCards.find((c) => c.id === action.cardId);
        if (!reserved) return state;
        card = reserved;
        afterRemoval = state;
      }

      const plan = paymentPlan(card, player);
      if (!plan) return state;

      const paidPlayer = payForCard(player, plan);
      const grantedPlayer = grantCardToPlayer(paidPlayer, card);
      const finalPlayer: Player =
        action.source === 'reserved'
          ? { ...grantedPlayer, reservedCards: grantedPlayer.reservedCards.filter((c) => c.id !== card.id) }
          : grantedPlayer;

      return resolveNobles(refundTokensToBank(afterRemoval, plan), finalPlayer);
    }

    case 'RESERVE_CARD_FROM_BOARD': {
      if (state.pendingAction) return state;
      const player = currentPlayer(state);
      if (player.reservedCards.length >= MAX_RESERVED_CARDS) return state;

      const found = findBoardCard(state, action.cardId);
      if (!found) return state;

      const afterRemoval = takeFromBoard(state, found.level, found.index);
      return finishTokenGrantingAction(
        ...grantReservationAndGold(afterRemoval, player, found.card),
      );
    }

    case 'RESERVE_CARD_FROM_DECK': {
      if (state.pendingAction) return state;
      const player = currentPlayer(state);
      if (player.reservedCards.length >= MAX_RESERVED_CARDS) return state;

      const deck = state.decks[action.level];
      const card = deck[0];
      if (!card) return state;

      const afterDraw: GameState = { ...state, decks: { ...state.decks, [action.level]: deck.slice(1) } };
      return finishTokenGrantingAction(...grantReservationAndGold(afterDraw, player, card));
    }

    case 'DISCARD_TOKEN': {
      if (!state.pendingAction || state.pendingAction.type !== 'discardTokens') return state;
      const pending = state.pendingAction;
      const player = state.players.find((p) => p.id === pending.playerId);
      if (!player || player.tokens[action.color] <= 0) return state;

      const updatedPlayer = {
        ...player,
        tokens: { ...player.tokens, [action.color]: player.tokens[action.color] - 1 },
      };
      const withPlayer = replacePlayer(state, player.id, () => updatedPlayer);
      const tokenPool = { ...state.tokenPool, [action.color]: state.tokenPool[action.color] + 1 };
      const remainingExcess = pending.excess - 1;

      if (remainingExcess <= 0) {
        return advanceTurn({ ...withPlayer, tokenPool });
      }
      return { ...withPlayer, tokenPool, pendingAction: { ...pending, excess: remainingExcess } };
    }

    case 'CHOOSE_NOBLE': {
      if (!state.pendingAction || state.pendingAction.type !== 'chooseNoble') return state;
      const pending = state.pendingAction;
      if (!pending.eligibleNobleIds.includes(action.nobleId)) return state;

      const player = state.players.find((p) => p.id === pending.playerId);
      const noble = state.nobles.find((n) => n.id === action.nobleId);
      if (!player || !noble) return state;

      const updatedPlayer: Player = {
        ...player,
        nobles: [...player.nobles, noble],
        score: player.score + noble.points,
      };
      const withPlayer = replacePlayer(state, player.id, () => updatedPlayer);
      return advanceTurn({ ...withPlayer, nobles: state.nobles.filter((n) => n.id !== noble.id) });
    }

    default:
      return state;
  }
}

/** Shared by both reserve actions: add the card to the player's hand and, if the bank has any, a gold token. */
function grantReservationAndGold(state: GameState, player: Player, card: Card): [GameState, Player] {
  const gainsGold = state.tokenPool.gold > 0;
  const updatedPlayer: Player = {
    ...player,
    reservedCards: [...player.reservedCards, card],
    tokens: gainsGold ? { ...player.tokens, gold: player.tokens.gold + 1 } : player.tokens,
  };
  const nextState: GameState = gainsGold
    ? { ...state, tokenPool: { ...state.tokenPool, gold: state.tokenPool.gold - 1 } }
    : state;
  return [nextState, updatedPlayer];
}
