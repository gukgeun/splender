import type { CardLevel } from '../game/types';
import { ModalOverlay } from './ModalOverlay';
import styles from './CardDetailModal.module.css';

interface DeckReserveConfirmProps {
  level: CardLevel;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeckReserveConfirm({ level, onConfirm, onClose }: DeckReserveConfirmProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <p className={styles.deckMessage}>
          레벨 {level} 덱 맨 위 카드를 예약할까요?
          <br />
          (카드 내용은 예약한 사람만 확인할 수 있어요)
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.buyButton} onClick={onConfirm}>
            예약하기
          </button>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
