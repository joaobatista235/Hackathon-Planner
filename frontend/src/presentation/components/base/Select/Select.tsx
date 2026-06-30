import type { SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, id, className = '', ...rest }: SelectProps) {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={selectId} className="field__label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`field__select ${error ? 'field__select--error' : ''}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}
