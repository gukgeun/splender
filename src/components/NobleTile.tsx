import { GEM_COLORS } from '../game/constants';
import { TOKEN_STYLE } from '../game/colors';
import type { Noble } from '../game/types';
import styles from './NobleTile.module.css';

interface NobleTileProps {
  noble: Noble;
}

export function NobleTile({ noble }: NobleTileProps) {
  const requirements = GEM_COLORS.map((color) => [color, noble.requirement[color] ?? 0] as const).filter(
    ([, amount]) => amount > 0,
  );

  return (
    <div className={styles.tile}>
      <span className={styles.points}>{noble.points}</span>
      <div className={styles.requirements}>
        {requirements.map(([color, amount]) => {
          const style = TOKEN_STYLE[color];
          return (
            <span
              key={color}
              className={styles.pip}
              style={{ background: style.bg, color: style.fg, borderColor: style.border }}
            >
              {amount}
            </span>
          );
        })}
      </div>
    </div>
  );
}
