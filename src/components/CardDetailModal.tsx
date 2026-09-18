import { GEM_COLORS } from '../game/constants';
import { TOKEN_STYLE } from '../game/colors';
import { effectiveCost } from '../game/cost';
import type { Card, Player } from '../game/types';
import { DevCard } from './DevCard';
import { ModalOverlay } from './ModalOverlay';
import styles from './CardDetailModal.module.css';

interface CardDetailModalProps {
  card: Card;
  player: Player;
  canBuy: boolean;
  canReserve: boolean;
  onBuy: () => void;
  onReserve: () => void;
  onClose: () => void;
}

export function CardDetailModal({ card, player, canBuy, canReserve, onBuy, onReserve, onClose }: CardDetailModalProps) {
  const cost = effectiveCost(card, player.bonuses);
  const costEntries = GEM_COLORS.map((c) => [c, cost[c] ?? 0] as const).filter(([, amount]) => amount > 0);

  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.cardPreview}>
          <DevCard card={card} />
        </div>

        <div className={styles.costBlock}>
          <span className={styles.costLabel}>실제 비용 (보유 카드 보너스 적용)</span>
          <div className={styles.costRow}>
            {costEntries.length === 0 ? (
              <span className={styles.free}>무료</span>
            ) : (
              costEntries.map(([color, amount]) => {
                const style = TOKEN_STYLE[color];
                const have = player.tokens[color];
                const short = have < amount;
                return (
                  <span
                    key={color}
                    className={`${styles.costPip} ${short ? styles.short : ''}`}
                    style={{ background: style.bg, color: style.fg, borderColor: style.border }}
                  >
                    {amount}
                    {short && <span className={styles.haveNote}> (보유 {have})</span>}
                  </span>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.buyButton} onClick={onBuy} disabled={!canBuy}>
            구매하기
          </button>
          {canReserve && (
            <button type="button" className={styles.reserveButton} onClick={onReserve}>
              예약하기
            </button>
          )}
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
