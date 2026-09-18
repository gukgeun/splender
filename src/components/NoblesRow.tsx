import type { Noble } from '../game/types';
import { NobleTile } from './NobleTile';
import styles from './NoblesRow.module.css';

interface NoblesRowProps {
  nobles: Noble[];
}

export function NoblesRow({ nobles }: NoblesRowProps) {
  return (
    <div className={styles.row}>
      {nobles.map((noble) => (
        <NobleTile key={noble.id} noble={noble} />
      ))}
    </div>
  );
}
