import type { Noble } from '../game/types';
import { NobleTile } from './NobleTile';
import { ModalOverlay } from './ModalOverlay';
import styles from './ChooseNobleModal.module.css';

interface ChooseNobleModalProps {
  nobles: Noble[];
  onChoose: (nobleId: string) => void;
}

export function ChooseNobleModal({ nobles, onChoose }: ChooseNobleModalProps) {
  return (
    <ModalOverlay>
      <div className={styles.content}>
        <p className={styles.title}>귀족을 선택하세요</p>
        <div className={styles.row}>
          {nobles.map((noble) => (
            <button key={noble.id} type="button" className={styles.nobleButton} onClick={() => onChoose(noble.id)}>
              <NobleTile noble={noble} />
            </button>
          ))}
        </div>
      </div>
    </ModalOverlay>
  );
}
