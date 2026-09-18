import type { Card, CardLevel } from '../game/types';
import { DevCard } from './DevCard';
import styles from './CardRow.module.css';

interface CardRowProps {
  level: CardLevel;
  slots: (Card | null)[];
  deckRemaining: number;
  disabled: boolean;
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
  onCardClick,
  onDeckClick,
  isCardAffordable,
}: CardRowProps) {
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.deckBack}
        onClick={() => onDeckClick(level)}
        disabled={disabled || deckRemaining === 0}
        aria-label={`레벨 ${level} 덱, ${deckRemaining}장 남음`}
      >
        <span className={styles.deckLevel}>{LEVEL_LABEL[level]}</span>
        <span className={styles.deckCount}>{deckRemaining}</span>
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
