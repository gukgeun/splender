import { GameBoard } from './components/GameBoard';
import { GameOverScreen } from './components/GameOverScreen';
import { SetupScreen } from './components/SetupScreen';
import { GameProvider, useGameState } from './context/GameContext';

function Game() {
  const state = useGameState();
  if (state.phase === 'setup') return <SetupScreen />;
  if (state.phase === 'gameOver') return <GameOverScreen />;
  return <GameBoard />;
}

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;
