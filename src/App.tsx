import { GameBoard } from './components/GameBoard';
import { SetupScreen } from './components/SetupScreen';
import { GameProvider, useGameState } from './context/GameContext';

function Game() {
  const state = useGameState();
  return state.phase === 'setup' ? <SetupScreen /> : <GameBoard />;
}

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;
