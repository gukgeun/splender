import type { Card, GameState } from '../game/types';
import { PlayerPanel } from './PlayerPanel';
import styles from './PlayersBar.module.css';

interface PlayersBarProps {
  players: GameState['players'];
  currentPlayerIndex: number;
  onReservedCardClick?: (card: Card) => void;
}

export function PlayersBar({ players, currentPlayerIndex, onReservedCardClick }: PlayersBarProps) {
  return (
    <div className={styles.bar}>
      {players.map((player, i) => (
        <PlayerPanel
          key={player.id}
          player={player}
          isActive={i === currentPlayerIndex}
          onReservedCardClick={onReservedCardClick}
        />
      ))}
    </div>
  );
}
