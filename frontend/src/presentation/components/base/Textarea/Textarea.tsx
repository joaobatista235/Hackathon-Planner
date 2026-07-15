import type { TextareaHTMLAttributes } from 'react';
import './Textarea.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`field__textarea ${error ? 'field__textarea--error' : ''}`}
        {...props}
      />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
