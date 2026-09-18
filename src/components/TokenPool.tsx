import { useEffect, useState } from 'react';
import { useGameDispatch } from '../context/GameContext';
import { GEM_COLORS } from '../game/constants';
import { canAddColorToSelection, isValidTokenSelection } from '../game/tokenRules';
import type { GameState, GemColor } from '../game/types';
import { TokenChip } from './TokenChip';
import styles from './TokenPool.module.css';

interface TokenPoolProps {
  tokenPool: GameState['tokenPool'];
  disabled: boolean;
  /** Selection resets whenever the turn advances. */
  turnCount: number;
}

export function TokenPool({ tokenPool, disabled, turnCount }: TokenPoolProps) {
  const dispatch = useGameDispatch();
  const [tray, setTray] = useState<GemColor[]>([]);

  useEffect(() => {
    setTray([]);
  }, [turnCount]);

  function handleBankTap(color: GemColor) {
    if (disabled || !canAddColorToSelection(tokenPool, tray, color)) return;
    setTray((prev) => [...prev, color]);
  }

  function handleTrayTap(index: number) {
    setTray((prev) => prev.filter((_, i) => i !== index));
  }

  function handleConfirm() {
    if (!isValidTokenSelection(tokenPool, tray)) return;
    dispatch({ type: 'TAKE_TOKENS', colors: tray });
    setTray([]);
  }

  const canConfirm = !disabled && tray.length > 0 && isValidTokenSelection(tokenPool, tray);

  return (
    <div className={styles.wrap}>
      <div className={styles.pool}>
        {GEM_COLORS.map((color) => (
          <TokenChip
            key={color}
            color={color}
            count={tokenPool[color]}
            size="lg"
            onClick={() => handleBankTap(color)}
            disabled={disabled || !canAddColorToSelection(tokenPool, tray, color)}
          />
        ))}
        <TokenChip color="gold" count={tokenPool.gold} size="lg" />
      </div>

      {tray.length > 0 && (
        <div className={styles.tray}>
          <span className={styles.trayLabel}>선택한 토큰</span>
          <div className={styles.trayChips}>
            {tray.map((color, i) => (
              <TokenChip key={`${color}-${i}`} color={color} count={1} size="sm" onClick={() => handleTrayTap(i)} />
            ))}
          </div>
          <div className={styles.trayActions}>
            <button type="button" className={styles.confirmButton} onClick={handleConfirm} disabled={!canConfirm}>
              가져오기
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => setTray([])}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
