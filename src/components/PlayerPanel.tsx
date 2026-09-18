import { GEM_COLORS } from '../game/constants';
import { TOKEN_STYLE } from '../game/colors';
import { totalTokenCount } from '../game/playerUtils';
import type { Card, Player } from '../game/types';
import { DevCard } from './DevCard';
import { TokenChip } from './TokenChip';
import styles from './PlayerPanel.module.css';

interface PlayerPanelProps {
  player: Player;
  isActive: boolean;
  onReservedCardClick?: (card: Card) => void;
}

export function PlayerPanel({ player, isActive, onReservedCardClick }: PlayerPanelProps) {
  const totalTokens = totalTokenCount(player.tokens);

  return (
    <div className={`${styles.panel} ${isActive ? styles.active : ''}`}>
      <div className={styles.headerRow}>
        <span className={styles.nameGroup}>
          <span className={styles.name}>{player.name}</span>
          {isActive && <span className={styles.turnBadge}>▶ 차례</span>}
        </span>
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

      {player.reservedCards.length > 0 && (
        <div className={styles.row}>
          {player.reservedCards.map((card) => (
            <DevCard
              key={card.id}
              card={card}
              size="compact"
              onClick={isActive && onReservedCardClick ? () => onReservedCardClick(card) : undefined}
            />
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <span>구매 카드 {player.purchasedCards.length}</span>
        <span>예약 카드 {player.reservedCards.length}/3</span>
        <span>귀족 {player.nobles.length}</span>
      </div>
    </div>
  );
}
