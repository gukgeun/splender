import type { TokenColor } from '../game/types';
import { TOKEN_STYLE } from '../game/colors';
import styles from './TokenChip.module.css';

interface TokenChipProps {
  color: TokenColor;
  count: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Renders as a <button> when onClick is given (bank pool, once turn logic
 * lands), otherwise a plain <div> (player panels — display only).
 */
export function TokenChip({ color, count, size = 'md', onClick, disabled }: TokenChipProps) {
  const style = TOKEN_STYLE[color];
  const className = `${styles.chip} ${styles[size]} ${onClick ? styles.interactive : ''}`;
  const chipStyle = { background: style.bg, color: style.fg, borderColor: style.border };
  const label = `${style.label} ${count}개`;

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        style={chipStyle}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
      >
        <span className={styles.count}>{count}</span>
      </button>
    );
  }

  return (
    <div className={className} style={chipStyle} aria-label={label}>
      <span className={styles.count}>{count}</span>
    </div>
  );
}
