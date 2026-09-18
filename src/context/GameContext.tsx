import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import { createSetupState } from '../game/createInitialState';
import { gameReducer } from '../game/reducer';
import type { GameAction, GameState } from '../game/types';
import { dispatchGameAction, subscribeToGameState } from '../firebase/gameSync';
import { setRoomStatus } from '../firebase/rooms';

const GameStateContext = createContext<GameState | null>(null);
const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createSetupState);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>{children}</GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

/**
 * Same contexts as GameProvider, but every dispatch goes through a Firestore
 * transaction instead of a local reducer — every device in the room reads back
 * the same authoritative state. `myPlayerId` is this device's seat (`p1`, `p2`, ...),
 * used to flip the room back to the lobby after a restart.
 */
export function OnlineGameProvider({
  code,
  myPlayerId,
  children,
}: {
  code: string;
  myPlayerId: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => subscribeToGameState(code, setState), [code]);

  const dispatch = useCallback<Dispatch<GameAction>>(
    (action) => {
      dispatchGameAction(code, action, myPlayerId)
        .then(() => {
          if (action.type === 'RESET_TO_SETUP') return setRoomStatus(code, 'waiting');
        })
        .catch((err: unknown) => {
          console.error('게임 액션을 반영하지 못했습니다:', err);
        });
    },
    [code, myPlayerId],
  );

  if (!state) return null;

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>{children}</GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState(): GameState {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within a GameProvider');
  return ctx;
}

export function useGameDispatch(): Dispatch<GameAction> {
  const ctx = useContext(GameDispatchContext);
  if (!ctx) throw new Error('useGameDispatch must be used within a GameProvider');
  return ctx;
}
