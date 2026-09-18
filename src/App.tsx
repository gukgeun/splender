import { GameBoard } from './components/GameBoard';
import { GameOverScreen } from './components/GameOverScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { WaitingRoom } from './components/WaitingRoom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnlineGameProvider, useGameState } from './context/GameContext';
import { RoomProvider, useRoom } from './context/RoomContext';

// The room's player list (ordered by join time) seeded the game as p1, p2, ... in that
// same order, so a device's seat is just its own position in that same live list.
function OnlineGame({ code, myPlayerId }: { code: string; myPlayerId: string }) {
  return (
    <OnlineGameProvider code={code} myPlayerId={myPlayerId}>
      <OnlineGameBody myPlayerId={myPlayerId} />
    </OnlineGameProvider>
  );
}

function OnlineGameBody({ myPlayerId }: { myPlayerId: string }) {
  const state = useGameState();

  // Briefly true right after a restart, before the room flips back to the waiting-room screen.
  if (state.phase === 'setup') return null;
  if (state.phase === 'gameOver') return <GameOverScreen />;
  return <GameBoard myPlayerId={myPlayerId} />;
}

function RoomGate() {
  const { uid } = useAuth();
  const { code, room, players } = useRoom();

  if (!code) return <LobbyScreen />;
  if (!room || room.status === 'waiting') return <WaitingRoom />;

  const myPlayerId = `p${players.findIndex((p) => p.uid === uid) + 1}`;

  return <OnlineGame code={code} myPlayerId={myPlayerId} />;
}

function AuthGate() {
  const { uid, loading, error } = useAuth();

  if (loading) {
    return (
      <main style={{ color: '#fff', padding: 24, fontFamily: 'system-ui' }}>
        <p>연결 중...</p>
      </main>
    );
  }

  if (error || !uid) {
    return (
      <main style={{ color: '#fff', padding: 24, fontFamily: 'system-ui' }}>
        <p>인증 오류: {error ?? '알 수 없는 오류'}</p>
      </main>
    );
  }

  return (
    <RoomProvider>
      <RoomGate />
    </RoomProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
