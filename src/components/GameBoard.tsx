import { useGameState } from '../context/GameContext';
import { CardRow } from './CardRow';
import { NoblesRow } from './NoblesRow';
import { PlayersBar } from './PlayersBar';
import { TokenPool } from './TokenPool';
import styles from './GameBoard.module.css';

export function GameBoard() {
  const state = useGameState();

  return (
    <div className={styles.layout}>
      <div className={styles.boardArea}>
        <NoblesRow nobles={state.nobles} />
        <CardRow level={3} slots={state.board[3]} deckRemaining={state.decks[3].length} />
        <CardRow level={2} slots={state.board[2]} deckRemaining={state.decks[2].length} />
        <CardRow level={1} slots={state.board[1]} deckRemaining={state.decks[1].length} />
        <TokenPool tokenPool={state.tokenPool} />
      </div>

      <div className={styles.playersArea}>
        <PlayersBar players={state.players} currentPlayerIndex={state.currentPlayerIndex} />
      </div>
    </div>
  );
}
