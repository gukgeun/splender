import { ModalOverlay } from './ModalOverlay';
import { TokenChip } from './TokenChip';
import styles from './HowToPlayModal.module.css';

interface HowToPlayModalProps {
  onClose: () => void;
}

/** Rules explained at an elementary-school reading level, for the "게임 방법" lobby button. */
export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>게임 방법</h2>

        <section className={styles.step}>
          <h3 className={styles.stepTitle}>1. 목표</h3>
          <p>
            제일 먼저 <strong>15점</strong>을 모으면 이겨요! 카드를 사면 점수를 받을 수 있어요.
          </p>
        </section>

        <section className={styles.step}>
          <h3 className={styles.stepTitle}>2. 보석 가져오기</h3>
          <div className={styles.tokenRow}>
            <TokenChip color="emerald" count={1} size="sm" />
            <TokenChip color="sapphire" count={1} size="sm" />
            <TokenChip color="ruby" count={1} size="sm" />
          </div>
          <p>
            내 차례에 <strong>다른 색 보석 3개</strong>를 가져오거나, <strong>같은 색 보석 2개</strong>를 가져올 수
            있어요. 같은 색 2개는 그 색 보석이 통에 4개보다 많이 남아있을 때만 가져올 수 있어요.
          </p>
        </section>

        <section className={styles.step}>
          <h3 className={styles.stepTitle}>3. 카드 사기</h3>
          <p>가지고 있는 보석으로 카드를 살 수 있어요. 카드를 사면 좋은 일이 두 가지 생겨요.</p>
          <ul className={styles.list}>
            <li>카드에 적힌 만큼 점수를 받아요</li>
            <li>그 카드와 같은 색 보석 1개를 앞으로 계속 공짜로 깎아줘요</li>
          </ul>
        </section>

        <section className={styles.step}>
          <h3 className={styles.stepTitle}>4. 카드 찜하기</h3>
          <div className={styles.tokenRow}>
            <TokenChip color="gold" count={1} size="sm" />
          </div>
          <p>
            아직 살 보석이 부족해도 마음에 드는 카드를 미리 <strong>찜</strong>해둘 수 있어요 (최대 3장까지). 찜하면
            아무 색으로나 쓸 수 있는 <strong>황금 보석 1개</strong>를 공짜로 받아요.
          </p>
        </section>

        <section className={styles.step}>
          <h3 className={styles.stepTitle}>5. 귀족 손님</h3>
          <p>
            카드로 받은 보너스를 충분히 모으면, 귀족 손님이 저절로 찾아와서 <strong>추가 점수 3점</strong>을 줘요!
          </p>
        </section>

        <section className={styles.step}>
          <h3 className={styles.stepTitle}>6. 게임이 끝나요</h3>
          <p>
            누군가 15점이 넘으면, 그 라운드가 끝날 때까지 모두 한 번씩 더 하고 게임이 끝나요.{' '}
            <strong>점수가 제일 높은 사람이 우승!</strong> 점수가 같으면 카드를 더 적게 산 사람이 이겨요.
          </p>
        </section>

        <p className={styles.tip}>
          알아두면 좋아요: 보석은 한 번에 최대 10개까지만 가지고 있을 수 있어요. 넘으면 몇 개를 다시 통에
          돌려줘야 해요.
        </p>

        <button type="button" className={styles.closeButton} onClick={onClose}>
          알겠어요!
        </button>
      </div>
    </ModalOverlay>
  );
}
