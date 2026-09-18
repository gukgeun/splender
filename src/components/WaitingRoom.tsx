import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import { MAX_PLAYERS, MIN_PLAYERS } from '../game/constants';
import styles from './WaitingRoom.module.css';

export function WaitingRoom() {
  const { uid } = useAuth();
  const { code, room, players, leave, start, busy } = useRoom();

  const isHost = room?.hostUid === uid;
  const canStart = players.length >= MIN_PLAYERS;

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>대기실</h1>

        <div className={styles.codeBlock}>
          <span className={styles.codeLabel}>친구에게 알려줄 방 코드</span>
          <span className={styles.code}>{code}</span>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>
            참가자 ({players.length}/{MAX_PLAYERS})
          </span>
          <ul className={styles.playerList}>
            {players.map((p) => (
              <li key={p.uid} className={styles.playerItem}>
                <span>{p.name}</span>
                {p.isHost && <span className={styles.hostBadge}>방장</span>}
              </li>
            ))}
          </ul>
        </div>

        {isHost ? (
          <button type="button" className={styles.startButton} onClick={start} disabled={!canStart || busy}>
            {canStart ? '게임 시작' : `${MIN_PLAYERS}명 이상 필요`}
          </button>
        ) : (
          <p className={styles.waitingHint}>방장이 게임을 시작하길 기다리는 중...</p>
        )}

        <button type="button" className={styles.leaveButton} onClick={leave}>
          나가기
        </button>
      </div>
    </div>
  );
}
