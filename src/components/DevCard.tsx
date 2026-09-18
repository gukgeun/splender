import { GEM_COLORS } from '../game/constants';
import { TOKEN_STYLE } from '../game/colors';
import type { Card } from '../game/types';
import styles from './DevCard.module.css';

interface DevCardProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  /** Smaller rendering used for reserved-card previews in a player panel. */
  size?: 'normal' | 'compact';
  /** Dims the card when the current player can't afford it. Purely visual. */
  affordable?: boolean;
}

export function DevCard({ card, onClick, disabled, size = 'normal', affordable = true }: DevCardProps) {
  const bonusStyle = TOKEN_STYLE[card.bonus];
  const costEntries = GEM_COLORS.map((color) => [color, card.cost[color] ?? 0] as const).filter(
    ([, amount]) => amount > 0,
  );

  return (
    <button
      type="button"
      className={`${styles.card} ${size === 'compact' ? styles.compact : ''} ${!affordable ? styles.unaffordable : ''}`}
      style={{ borderTopColor: bonusStyle.bg }}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.header}>
        <span className={styles.points}>{card.points > 0 ? card.points : ''}</span>
        <span
          className={styles.bonusIcon}
          style={{ background: bonusStyle.bg, color: bonusStyle.fg, borderColor: bonusStyle.border }}
        />
      </div>

      <div className={styles.costList}>
        {costEntries.map(([color, amount]) => {
          const style = TOKEN_STYLE[color];
          return (
            <span
              key={color}
              className={styles.costPip}
              style={{ background: style.bg, color: style.fg, borderColor: style.border }}
            >
              {amount}
            </span>
          );
        })}
      </div>
    </button>
  );
}
