import type { Card, CardLevel } from '../game/types';
import { DevCard } from './DevCard';
import styles from './CardRow.module.css';

interface CardRowProps {
  level: CardLevel;
  slots: (Card | null)[];
  deckRemaining: number;
}

const LEVEL_LABEL: Record<CardLevel, string> = { 1: 'I', 2: 'II', 3: 'III' };

export function CardRow({ level, slots, deckRemaining }: CardRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.deckBack} aria-label={`레벨 ${level} 덱, ${deckRemaining}장 남음`}>
        <span className={styles.deckLevel}>{LEVEL_LABEL[level]}</span>
        <span className={styles.deckCount}>{deckRemaining}</span>
      </div>
      {slots.map((card, i) =>
        card ? (
          <DevCard key={card.id} card={card} />
        ) : (
          <div key={`empty-${i}`} className={styles.emptySlot} />
        ),
      )}
    </div>
  );
}
