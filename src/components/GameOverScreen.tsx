import { useGameDispatch, useGameState } from '../context/GameContext';
import styles from './GameOverScreen.module.css';

export function GameOverScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const ranked = [...state.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.purchasedCards.length - b.purchasedCards.length;
  });

  const isTie = state.winnerIds.length > 1;

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>{isTie ? '공동 우승!' : '게임 종료'}</h1>
        <p className={styles.subtitle}>
          {isTie
            ? ranked
                .filter((p) => state.winnerIds.includes(p.id))
                .map((p) => p.name)
                .join(', ') + ' 공동 우승'
            : `${state.players.find((p) => p.id === state.winnerIds[0])?.name} 승리!`}
        </p>

        <ol className={styles.rankList}>
          {ranked.map((player, i) => (
            <li
              key={player.id}
              className={`${styles.rankRow} ${state.winnerIds.includes(player.id) ? styles.winnerRow : ''}`}
            >
              <span className={styles.rank}>{i + 1}</span>
              <span className={styles.playerName}>{player.name}</span>
              <span className={styles.playerScore}>{player.score}점</span>
              <span className={styles.playerCards}>카드 {player.purchasedCards.length}장</span>
            </li>
          ))}
        </ol>

        <button type="button" className={styles.restartButton} onClick={() => dispatch({ type: 'RESET_TO_SETUP' })}>
          새 게임 시작
        </button>
      </div>
    </div>
  );
}
