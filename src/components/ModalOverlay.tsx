import type { ReactNode } from 'react';
import styles from './ModalOverlay.module.css';

interface ModalOverlayProps {
  children: ReactNode;
  /** Omit to make the overlay non-dismissible (e.g. a forced discard). */
  onClose?: () => void;
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
