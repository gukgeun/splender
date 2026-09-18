import { doc, onSnapshot, runTransaction, setDoc } from 'firebase/firestore';
import { db } from './config';
import { createSetupState } from '../game/createInitialState';
import { gameReducer } from '../game/reducer';
import type { GameAction, GameState } from '../game/types';

// Actions a player may only take on their own turn. RESET_TO_SETUP and START_GAME
// are deliberately excluded — restarting isn't a turn action.
const TURN_RESTRICTED_ACTIONS: GameAction['type'][] = [
  'TAKE_TOKENS',
  'BUY_CARD',
  'RESERVE_CARD_FROM_BOARD',
  'RESERVE_CARD_FROM_DECK',
  'DISCARD_TOKEN',
  'CHOOSE_NOBLE',
];

function gameStateRef(code: string) {
  return doc(db, 'rooms', code, 'game', 'state');
}

/** Host-only: deals the board and writes the initial game state once, when starting the game. */
export async function initializeGameState(code: string, playerNames: string[]): Promise<void> {
  const initial = gameReducer(createSetupState(), { type: 'START_GAME', playerNames });
  await setDoc(gameStateRef(code), initial);
}

export function subscribeToGameState(code: string, onChange: (state: GameState | null) => void): () => void {
  return onSnapshot(gameStateRef(code), (snap) => {
    onChange((snap.data() as GameState | undefined) ?? null);
  });
}

/**
 * Applies an action against the latest state inside a transaction, so two clients
 * writing at once can never clobber each other. Rejects turn-restricted actions
 * from anyone but the current player.
 */
export async function dispatchGameAction(code: string, action: GameAction, actingPlayerId: string): Promise<void> {
  const ref = gameStateRef(code);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('게임 상태를 찾을 수 없습니다.');
    const current = snap.data() as GameState;

    if (TURN_RESTRICTED_ACTIONS.includes(action.type) && current.players[current.currentPlayerIndex]?.id !== actingPlayerId) {
      throw new Error('내 차례가 아닙니다.');
    }

    tx.set(ref, gameReducer(current, action));
  });
}
