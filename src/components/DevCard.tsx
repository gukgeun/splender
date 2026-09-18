import { GEM_COLORS } from '../game/constants';
import { TOKEN_STYLE } from '../game/colors';
import type { Card } from '../game/types';
import styles from './DevCard.module.css';

// Keyed by card id (e.g. "L1-01") so a card silently falls back to the plain
// color-coded face if that card's art hasn't been added yet.
const cardImagesPng = import.meta.glob<string>('../assets/cards/*.png', { eager: true, import: 'default' });
const cardImagesJpg = import.meta.glob<string>('../assets/cards/*.jpg', { eager: true, import: 'default' });
const cardImages: Record<string, string> = { ...cardImagesPng, ...cardImagesJpg };

function cardArt(cardId: string): string | undefined {
  return cardImages[`../assets/cards/${cardId}.png`] ?? cardImages[`../assets/cards/${cardId}.jpg`];
}

interface DevCardProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  /** 'compact' for reserved-card previews in a player panel, 'large' for the detail modal preview. */
  size?: 'normal' | 'compact' | 'large';
  /** Dims the card when the current player can't afford it. Purely visual. */
  affordable?: boolean;
}

export function DevCard({ card, onClick, disabled, size = 'normal', affordable = true }: DevCardProps) {
  const bonusStyle = TOKEN_STYLE[card.bonus];
  const art = cardArt(card.id);
  const costEntries = GEM_COLORS.map((color) => [color, card.cost[color] ?? 0] as const).filter(
    ([, amount]) => amount > 0,
  );

  return (
    <button
      type="button"
      className={`${styles.card} ${size !== 'normal' ? styles[size] : ''} ${!affordable ? styles.unaffordable : ''}`}
      style={{ borderTopColor: bonusStyle.bg }}
      onClick={onClick}
      disabled={disabled}
    >
      {art && <img className={styles.art} src={art} alt="" />}

      <div className={styles.header}>
        {card.points > 0 ? <span className={styles.points}>{card.points}</span> : <span />}
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
