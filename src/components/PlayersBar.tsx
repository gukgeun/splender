import type { GameState } from '../game/types';
import { PlayerPanel } from './PlayerPanel';
import styles from './PlayersBar.module.css';

interface PlayersBarProps {
  players: GameState['players'];
  currentPlayerIndex: number;
}

export function PlayersBar({ players, currentPlayerIndex }: PlayersBarProps) {
  return (
    <div className={styles.bar}>
      {players.map((player, i) => (
        <PlayerPanel key={player.id} player={player} isActive={i === currentPlayerIndex} />
      ))}
    </div>
  );
}
