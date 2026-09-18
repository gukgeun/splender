import { useState } from 'react';
import { useGameDispatch } from '../context/GameContext';
import { MAX_PLAYERS, MIN_PLAYERS } from '../game/constants';
import styles from './SetupScreen.module.css';

const PLAYER_COUNTS = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, i) => MIN_PLAYERS + i,
);

export function SetupScreen() {
  const dispatch = useGameDispatch();
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState<string[]>(
    Array.from({ length: MAX_PLAYERS }, (_, i) => `플레이어 ${i + 1}`),
  );

  function handleCountChange(count: number) {
    setPlayerCount(count);
  }

  function handleNameChange(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function handleStart() {
    const activeNames = names
      .slice(0, playerCount)
      .map((n) => n.trim())
      .map((n, i) => n || `플레이어 ${i + 1}`);
    dispatch({ type: 'START_GAME', playerNames: activeNames });
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>스플렌더</h1>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>인원 수</span>
          <div className={styles.countRow}>
            {PLAYER_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                className={`${styles.countButton} ${playerCount === count ? styles.countButtonActive : ''}`}
                onClick={() => handleCountChange(count)}
              >
                {count}명
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>플레이어 이름</span>
          <div className={styles.nameList}>
            {names.slice(0, playerCount).map((name, i) => (
              <input
                key={i}
                type="text"
                className={styles.nameInput}
                value={name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder={`플레이어 ${i + 1}`}
                maxLength={12}
              />
            ))}
          </div>
        </div>

        <button type="button" className={styles.startButton} onClick={handleStart}>
          게임 시작
        </button>
      </div>
    </div>
  );
}
