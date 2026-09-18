import { GEM_COLORS } from '../game/constants';
import { TOKEN_STYLE } from '../game/colors';
import type { Player } from '../game/types';
import { TokenChip } from './TokenChip';
import styles from './PlayerPanel.module.css';

interface PlayerPanelProps {
  player: Player;
  isActive: boolean;
}

export function PlayerPanel({ player, isActive }: PlayerPanelProps) {
  const totalTokens = GEM_COLORS.reduce((sum, c) => sum + player.tokens[c], 0) + player.tokens.gold;

  return (
    <div className={`${styles.panel} ${isActive ? styles.active : ''}`}>
      <div className={styles.headerRow}>
        <span className={styles.name}>{player.name}</span>
        <span className={styles.score}>{player.score}점</span>
      </div>

      <div className={styles.row}>
        {GEM_COLORS.map((color) => (
          <TokenChip key={color} color={color} count={player.tokens[color]} size="sm" />
        ))}
        <TokenChip color="gold" count={player.tokens.gold} size="sm" />
        <span className={styles.totalTokens}>{totalTokens}/10</span>
      </div>

      <div className={styles.row}>
        {GEM_COLORS.map((color) => {
          const amount = player.bonuses[color];
          const style = TOKEN_STYLE[color];
          return (
            <span
              key={color}
              className={styles.bonusSquare}
              style={{ background: style.bg, color: style.fg, borderColor: style.border }}
            >
              {amount}
            </span>
          );
        })}
      </div>

      <div className={styles.footer}>
        <span>구매 카드 {player.purchasedCards.length}</span>
        <span>예약 카드 {player.reservedCards.length}/3</span>
        <span>귀족 {player.nobles.length}</span>
      </div>
    </div>
  );
}
