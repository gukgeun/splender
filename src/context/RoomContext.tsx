import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { initializeGameState } from '../firebase/gameSync';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  setRoomStatus,
  subscribeToRoom,
  type Room,
  type RoomPlayer,
} from '../firebase/rooms';
import { useAuth } from './AuthContext';

interface RoomState {
  code: string | null;
  room: Room | null;
  players: RoomPlayer[];
  error: string | null;
  busy: boolean;
}

interface RoomContextValue extends RoomState {
  create: (name: string) => Promise<void>;
  join: (code: string, name: string) => Promise<void>;
  leave: () => Promise<void>;
  start: () => Promise<void>;
}

const RoomContext = createContext<RoomContextValue | null>(null);

const initialState: RoomState = { code: null, room: null, players: [], error: null, busy: false };

export function RoomProvider({ children }: { children: ReactNode }) {
  const { uid } = useAuth();
  const [state, setState] = useState<RoomState>(initialState);

  useEffect(() => {
    if (!state.code) return;
    return subscribeToRoom(state.code, (room, players) => {
      setState((prev) => ({ ...prev, room, players }));
    });
  }, [state.code]);

  const create = useCallback(
    async (name: string) => {
      if (!uid) return;
      setState((prev) => ({ ...prev, busy: true, error: null }));
      try {
        const code = await createRoom(uid, name);
        setState((prev) => ({ ...prev, code, busy: false }));
      } catch (err) {
        setState((prev) => ({ ...prev, busy: false, error: err instanceof Error ? err.message : String(err) }));
      }
    },
    [uid],
  );

  const join = useCallback(
    async (code: string, name: string) => {
      if (!uid) return;
      const normalized = code.trim().toUpperCase();
      setState((prev) => ({ ...prev, busy: true, error: null }));
      try {
        await joinRoom(normalized, uid, name);
        setState((prev) => ({ ...prev, code: normalized, busy: false }));
      } catch (err) {
        setState((prev) => ({ ...prev, busy: false, error: err instanceof Error ? err.message : String(err) }));
      }
    },
    [uid],
  );

  const leave = useCallback(async () => {
    if (!uid || !state.code) return;
    await leaveRoom(state.code, uid);
    setState(initialState);
  }, [uid, state.code]);

  const start = useCallback(async () => {
    if (!state.code) return;
    await initializeGameState(
      state.code,
      state.players.map((p) => p.name),
    );
    await setRoomStatus(state.code, 'playing');
  }, [state.code, state.players]);

  const value = useMemo<RoomContextValue>(
    () => ({ ...state, create, join, leave, start }),
    [state, create, join, leave, start],
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom(): RoomContextValue {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom must be used within a RoomProvider');
  return ctx;
}
