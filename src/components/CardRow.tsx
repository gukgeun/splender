import type { Card, CardLevel } from '../game/types';
import { DevCard } from './DevCard';
import styles from './CardRow.module.css';

interface CardRowProps {
  level: CardLevel;
  slots: (Card | null)[];
  deckRemaining: number;
  disabled: boolean;
  /** True when the current player already has 3 reserved cards — deck-blind-reserve isn't available. */
  reserveFull: boolean;
  onCardClick: (card: Card) => void;
  onDeckClick: (level: CardLevel) => void;
  isCardAffordable: (card: Card) => boolean;
}

const LEVEL_LABEL: Record<CardLevel, string> = { 1: 'I', 2: 'II', 3: 'III' };

export function CardRow({
  level,
  slots,
  deckRemaining,
  disabled,
  reserveFull,
  onCardClick,
  onDeckClick,
  isCardAffordable,
}: CardRowProps) {
  const deckDisabled = disabled || deckRemaining === 0 || reserveFull;
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={`${styles.deckBack} ${styles[`deckLevel${level}` as const]}`}
        onClick={() => onDeckClick(level)}
        disabled={deckDisabled}
        aria-label={
          reserveFull && deckRemaining > 0
            ? `레벨 ${level} 덱 — 예약 카드가 이미 3장이라 더 예약할 수 없습니다`
            : `레벨 ${level} 덱, ${deckRemaining}장 남음`
        }
      >
        <span className={styles.deckEmblem}>{LEVEL_LABEL[level]}</span>
        <span className={styles.deckCount}>{deckRemaining}장</span>
      </button>
      {slots.map((card, i) =>
        card ? (
          <DevCard
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            disabled={disabled}
            affordable={isCardAffordable(card)}
          />
        ) : (
          <div key={`empty-${i}`} className={styles.emptySlot} />
        ),
      )}
    </div>
  );
}
