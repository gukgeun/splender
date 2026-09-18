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
          {ranked.map((player, i) => {
            const isWinner = state.winnerIds.includes(player.id);
            return (
              <li key={player.id} className={`${styles.rankRow} ${isWinner ? styles.winnerRow : ''}`}>
                <span className={styles.rank}>
                  {isWinner ? (
                    <svg className={styles.trophyIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M6 3h12v2h2.5a.5.5 0 0 1 .5.5v1c0 2.3-1.68 4.2-3.87 4.55A5.02 5.02 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1a5.02 5.02 0 0 1-4.13-3.85A4.62 4.62 0 0 1 3 6.5v-1a.5.5 0 0 1 .5-.5H6V3Zm0 3.5H4.5c.1 1.2.9 2.2 2 2.6a5.06 5.06 0 0 1-.5-2.1v-.5Zm12 0v.5c0 .74-.17 1.44-.5 2.1a3.5 3.5 0 0 0 2-2.6H18Z"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className={styles.playerName}>{player.name}</span>
                <span className={styles.playerScore}>{player.score}점</span>
                <span className={styles.playerCards}>카드 {player.purchasedCards.length}장</span>
              </li>
            );
          })}
        </ol>

        <button type="button" className={styles.restartButton} onClick={() => dispatch({ type: 'RESET_TO_SETUP' })}>
          새 게임 시작
        </button>
      </div>
    </div>
  );
}
