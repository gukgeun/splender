import { GEM_COLORS } from '../game/constants';
import type { Player, TokenColor } from '../game/types';
import { TokenChip } from './TokenChip';
import { ModalOverlay } from './ModalOverlay';
import styles from './DiscardTokensModal.module.css';

interface DiscardTokensModalProps {
  player: Player;
  excess: number;
  onDiscard: (color: TokenColor) => void;
}

const ALL_TOKEN_COLORS: TokenColor[] = [...GEM_COLORS, 'gold'];

export function DiscardTokensModal({ player, excess, onDiscard }: DiscardTokensModalProps) {
  return (
    <ModalOverlay>
      <div className={styles.content}>
        <p className={styles.title}>{player.name}, 토큰이 10개를 초과했습니다</p>
        <p className={styles.subtitle}>{excess}개를 버려주세요 — 버릴 토큰을 탭하세요</p>
        <div className={styles.row}>
          {ALL_TOKEN_COLORS.filter((color) => player.tokens[color] > 0).map((color) => (
            <TokenChip
              key={color}
              color={color}
              count={player.tokens[color]}
              size="lg"
              onClick={() => onDiscard(color)}
            />
          ))}
        </div>
      </div>
    </ModalOverlay>
  );
}
