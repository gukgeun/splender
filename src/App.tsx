import { createInitialState } from './game/createInitialState';

// Temporary placeholder screen — proves the state shape compiles and
// instantiates correctly. Replaced by the actual board UI in the next step.
const demoState = createInitialState(['Player 1', 'Player 2', 'Player 3']);

function App() {
  return (
    <main style={{ color: '#fff', padding: 24, fontFamily: 'monospace' }}>
      <h1>Splendor — state scaffold</h1>
      <p>players: {demoState.players.map((p) => p.name).join(', ')}</p>
      <p>token pool: {JSON.stringify(demoState.tokenPool)}</p>
      <p>phase: {demoState.phase}</p>
    </main>
  );
}

export default App;
