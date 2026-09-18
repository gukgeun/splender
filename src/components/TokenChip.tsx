import type { TokenColor } from '../game/types';
import { TOKEN_STYLE } from '../game/colors';
import styles from './TokenChip.module.css';

interface TokenChipProps {
  color: TokenColor;
  count: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  /** How many of this color are already in the take-tokens tray — shows a badge + highlight ring. */
  selectedCount?: number;
}

/**
 * Renders as a <button> when onClick is given (bank pool, once turn logic
 * lands), otherwise a plain <div> (player panels — display only).
 */
export function TokenChip({ color, count, size = 'md', onClick, disabled, selectedCount = 0 }: TokenChipProps) {
  const style = TOKEN_STYLE[color];
  const className = `${styles.chip} ${styles[size]} ${onClick ? styles.interactive : ''} ${selectedCount > 0 ? styles.selected : ''}`;
  const chipStyle = { background: style.bg, color: style.fg, borderColor: style.border };
  const label = `${style.label} ${count}개${selectedCount > 0 ? `, ${selectedCount}개 선택됨` : ''}`;
  const badge = selectedCount > 0 ? <span className={styles.selectedBadge}>{selectedCount}</span> : null;

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
        {badge}
      </button>
    );
  }

  return (
    <div className={className} style={chipStyle} aria-label={label}>
      <span className={styles.count}>{count}</span>
      {badge}
    </div>
  );
}
