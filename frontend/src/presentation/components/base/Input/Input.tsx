import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        {...rest}
      />
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}
