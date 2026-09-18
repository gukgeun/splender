import { GEM_COLORS } from '../game/constants';
import type { GameState } from '../game/types';
import { TokenChip } from './TokenChip';
import styles from './TokenPool.module.css';

interface TokenPoolProps {
  tokenPool: GameState['tokenPool'];
}

export function TokenPool({ tokenPool }: TokenPoolProps) {
  return (
    <div className={styles.pool}>
      {GEM_COLORS.map((color) => (
        <TokenChip key={color} color={color} count={tokenPool[color]} size="lg" />
      ))}
      <TokenChip color="gold" count={tokenPool.gold} size="lg" />
    </div>
  );
}
