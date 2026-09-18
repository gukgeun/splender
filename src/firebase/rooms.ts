import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';
import { MAX_PLAYERS } from '../game/constants';

export interface Room {
  hostUid: string;
  status: 'waiting' | 'playing';
}

export interface RoomPlayer {
  uid: string;
  name: string;
  isHost: boolean;
}

// Excludes 0/O and 1/I so a code is never ambiguous when read aloud or handwritten.
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_CODE_LENGTH = 4;

function randomRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function roomRef(code: string) {
  return doc(db, 'rooms', code);
}

function playerRef(code: string, uid: string) {
  return doc(db, 'rooms', code, 'players', uid);
}

function playersCollection(code: string) {
  return collection(db, 'rooms', code, 'players');
}

/** Creates a new waiting room under a fresh random code, retrying on the rare collision. */
export async function createRoom(hostUid: string, hostName: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomRoomCode();
    const existing = await getDoc(roomRef(code));
    if (existing.exists()) continue;

    await setDoc(roomRef(code), { hostUid, status: 'waiting' });
    await setDoc(playerRef(code, hostUid), {
      name: hostName,
      isHost: true,
      joinedAt: serverTimestamp(),
    });
    return code;
  }
  throw new Error('방 코드를 생성하지 못했습니다. 다시 시도해주세요.');
}

/** Joins an existing waiting room. Rejoining with the same uid just refreshes the name. */
export async function joinRoom(code: string, uid: string, name: string): Promise<void> {
  const roomSnap = await getDoc(roomRef(code));
  if (!roomSnap.exists()) throw new Error('존재하지 않는 방 코드입니다.');
  if (roomSnap.data().status !== 'waiting') throw new Error('이미 시작된 게임입니다.');

  const playersSnap = await getDocs(playersCollection(code));
  const alreadyJoined = playersSnap.docs.some((d) => d.id === uid);
  if (!alreadyJoined && playersSnap.size >= MAX_PLAYERS) {
    throw new Error('방 인원이 가득 찼습니다.');
  }

  // Preserve the original joinedAt on rejoin — join order fixes each player's in-game
  // seat once the game starts, so it must not shuffle on a reconnect.
  await setDoc(
    playerRef(code, uid),
    { name, isHost: false, ...(alreadyJoined ? {} : { joinedAt: serverTimestamp() }) },
    { merge: true },
  );
}

export async function leaveRoom(code: string, uid: string): Promise<void> {
  await deleteDoc(playerRef(code, uid));
}

export async function setRoomStatus(code: string, status: Room['status']): Promise<void> {
  await updateDoc(roomRef(code), { status });
}

/** Live room + player-list updates, ordered by join time (host joins first). */
export function subscribeToRoom(
  code: string,
  onChange: (room: Room | null, players: RoomPlayer[]) => void,
): () => void {
  let room: Room | null = null;
  let players: RoomPlayer[] = [];

  const unsubRoom = onSnapshot(roomRef(code), (snap) => {
    const data = snap.data();
    room = data ? { hostUid: data.hostUid as string, status: data.status as Room['status'] } : null;
    onChange(room, players);
  });

  const unsubPlayers = onSnapshot(query(playersCollection(code), orderBy('joinedAt', 'asc')), (snap) => {
    players = snap.docs.map((d) => {
      const data = d.data();
      return { uid: d.id, name: data.name as string, isHost: data.isHost as boolean };
    });
    onChange(room, players);
  });

  return () => {
    unsubRoom();
    unsubPlayers();
  };
}
