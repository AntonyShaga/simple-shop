import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@tanstack/react-router';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({ children, onClose }: ModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!containerRef.current) {
    containerRef.current = document.createElement('div');
  }

  useLayoutEffect(() => {
    const modalRoot = document.getElementById('modal');
    if (!modalRoot) return;

    modalRoot.appendChild(containerRef.current!);

    return () => {
      modalRoot.removeChild(containerRef.current!);
    };
  }, []);

  return createPortal(
    <div className="modal-content">
      <div className="mobile-menu-header">
        <Link to="/" onClick={onClose}>
          <img src="/padre_gino.svg" alt="Padre Gino’s" />
        </Link>

        <button className="modal-close" aria-label="Close menu" onClick={onClose}>
          ×
        </button>
      </div>
      {children}
    </div>,
    containerRef.current,
  );
}
