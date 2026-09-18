import type { TokenColor } from '../game/types';
import { GEM_TOKEN_GRADIENT, TOKEN_STYLE } from '../game/colors';
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
 * Glass-bead look: a radial gradient (bright core → dark rim) for body/depth, plus a soft
 * blurred highlight and a small crisp glint for the "glossy" specular hit. Gradient/glint
 * ids are shared per color (not per instance) since every token of a color renders identically —
 * that's a safe id reuse, not a collision, and avoids redefining the same <defs> everywhere.
 */
function GemFace({ color }: { color: TokenColor }) {
  const gradient = GEM_TOKEN_GRADIENT[color];
  const rimColor = TOKEN_STYLE[color].border;
  const gradientId = `token-gem-${color}`;
  const glintId = `token-glint-${color}`;

  return (
    <svg className={styles.gem} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={gradientId} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={gradient.highlight} />
          <stop offset="55%" stopColor={gradient.mid} />
          <stop offset="100%" stopColor={gradient.edge} />
        </radialGradient>
        <radialGradient id={glintId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${gradientId})`} stroke={rimColor} strokeWidth="4" />
      <ellipse cx="37" cy="30" rx="19" ry="11" fill={`url(#${glintId})`} transform="rotate(-25 37 30)" />
      <circle cx="31" cy="23" r="3.5" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

/**
 * Renders as a <button> when onClick is given (bank pool, once turn logic
 * lands), otherwise a plain <div> (player panels — display only).
 */
export function TokenChip({ color, count, size = 'md', onClick, disabled, selectedCount = 0 }: TokenChipProps) {
  const style = TOKEN_STYLE[color];
  const className = `${styles.chip} ${styles[size]} ${onClick ? styles.interactive : ''} ${selectedCount > 0 ? styles.selected : ''}`;
  const label = `${style.label} ${count}개${selectedCount > 0 ? `, ${selectedCount}개 선택됨` : ''}`;
  const badge = selectedCount > 0 ? <span className={styles.selectedBadge}>{selectedCount}</span> : null;

  const inner = (
    <>
      <GemFace color={color} />
      <span className={styles.count} style={{ color: style.fg }}>
        {count}
      </span>
      {badge}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} disabled={disabled} aria-label={label}>
        {inner}
      </button>
    );
  }

  return (
    <div className={className} aria-label={label}>
      {inner}
    </div>
  );
}
