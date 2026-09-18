import { GEM_COLORS } from '../game/constants';
import { TOKEN_STYLE } from '../game/colors';
import type { Noble } from '../game/types';
import styles from './NobleTile.module.css';

// Keyed by noble id (e.g. "N01") so a tile silently falls back to the plain
// gold tile if that noble's portrait hasn't been added yet.
const nobleImages = import.meta.glob<string>('../assets/nobles/*.jpg', { eager: true, import: 'default' });

function noblePortrait(nobleId: string): string | undefined {
  return nobleImages[`../assets/nobles/${nobleId}.jpg`];
}

interface NobleTileProps {
  noble: Noble;
}

export function NobleTile({ noble }: NobleTileProps) {
  const requirements = GEM_COLORS.map((color) => [color, noble.requirement[color] ?? 0] as const).filter(
    ([, amount]) => amount > 0,
  );
  const portrait = noblePortrait(noble.id);

  return (
    <div className={styles.tile}>
      {portrait && <img className={styles.portrait} src={portrait} alt="" />}
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
