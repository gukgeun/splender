import { useState } from 'react';
import { useRoom } from '../context/RoomContext';
import styles from './LobbyScreen.module.css';

type Mode = 'create' | 'join';

export function LobbyScreen() {
  const { create, join, error, busy } = useRoom();
  const [mode, setMode] = useState<Mode>('create');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  function handleSubmit() {
    const trimmedName = name.trim() || '플레이어';
    if (mode === 'create') {
      create(trimmedName);
    } else {
      join(code, trimmedName);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>스플렌더</h1>

        <div className={styles.tabRow}>
          <button
            type="button"
            className={`${styles.tabButton} ${mode === 'create' ? styles.tabButtonActive : ''}`}
            onClick={() => setMode('create')}
          >
            방 만들기
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${mode === 'join' ? styles.tabButtonActive : ''}`}
            onClick={() => setMode('join')}
          >
            코드로 참가
          </button>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>내 이름</span>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="플레이어"
            maxLength={12}
          />
        </div>

        {mode === 'join' && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>방 코드</span>
            <input
              type="text"
              className={`${styles.input} ${styles.codeInput}`}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              autoCapitalize="characters"
            />
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={busy || (mode === 'join' && code.trim().length === 0)}
        >
          {busy ? '처리 중...' : mode === 'create' ? '방 만들기' : '참가하기'}
        </button>
      </div>
    </div>
  );
}
