import { GameBoard } from './components/GameBoard';
import { GameOverScreen } from './components/GameOverScreen';
import { SetupScreen } from './components/SetupScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGameState } from './context/GameContext';

function Game() {
  const state = useGameState();
  if (state.phase === 'setup') return <SetupScreen />;
  if (state.phase === 'gameOver') return <GameOverScreen />;
  return <GameBoard />;
}

// Temporary — proves anonymous auth is wired up. Replaced by the lobby UI in the next step.
function AuthDebugBadge({ uid }: { uid: string }) {
  return (
    <div style={{ position: 'fixed', bottom: 8, right: 8, fontSize: 11, color: '#767d8c', zIndex: 100 }}>
      uid: {uid.slice(0, 8)}…
    </div>
  );
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
    <GameProvider>
      <Game />
      <AuthDebugBadge uid={uid} />
    </GameProvider>
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
