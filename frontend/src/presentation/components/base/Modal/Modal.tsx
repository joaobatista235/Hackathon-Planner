import { useEffect, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`modal modal--${size}`}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

// Convenience footer
export function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  loading = false,
  danger = false,
}: {
  onCancel: () => void;
  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="modal-actions">
      <Button variant="ghost" onClick={onCancel} type="button">{cancelLabel}</Button>
      <Button
        variant={danger ? 'danger' : 'primary'}
        onClick={onConfirm}
        type={onConfirm ? 'button' : 'submit'}
        loading={loading}
      >
        {confirmLabel}
      </Button>
    </div>
  );
}
