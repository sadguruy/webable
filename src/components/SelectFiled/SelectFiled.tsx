import { useId, type ChangeEvent, type ReactNode, type SelectHTMLAttributes } from "react";

import "../TextStyle/styles.css";
import "./styles.css";

export interface SelectFiledOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectFiledProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  helperText?: string;
  invalid?: boolean;
  invalidText?: string;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  options?: SelectFiledOption[];
  children?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.2v4.6" strokeLinecap="round" />
      <path d="M10 13.6h.01" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m5.5 7.5 4.5 5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SelectFiled({
  id,
  label,
  helperText,
  invalid = false,
  invalidText,
  required = false,
  disabled = false,
  fullWidth = true,
  className = "",
  placeholder,
  options,
  children,
  onChange,
  ...props
}: SelectFiledProps) {
  const generatedId = useId();
  const fieldId = id ?? `select-filed-${generatedId}`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const invalidId = invalid && invalidText ? `${fieldId}-error` : undefined;
  const describedBy = [helperId, invalidId].filter(Boolean).join(" ") || undefined;

  const classes = [
    "select-filed",
    fullWidth ? "select-filed--full" : "",
    invalid ? "select-filed--invalid" : "",
    disabled ? "select-filed--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label ? (
        <div className="select-filed__header">
          <label className="select-filed__label text-style text-style--label" htmlFor={fieldId}>
            {label}
            {required ? <span className="select-filed__required" aria-hidden="true"> *</span> : null}
          </label>

          {helperText ? (
            <div id={helperId} className="select-filed__helper text-style text-style--fineprint">
              {helperText}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="select-filed__control">
        <select
          id={fieldId}
          className="select-filed__select"
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={onChange}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          ) : null}

          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            : children}
        </select>

        <span className="select-filed__chevron">
          <ChevronIcon />
        </span>
      </div>

      {invalid && invalidText ? (
        <div
          id={invalidId}
          className="select-filed__error text-style text-style--fineprint"
          role="alert"
        >
          <span className="select-filed__error-icon">
            <ErrorIcon />
          </span>
          {invalidText}
        </div>
      ) : null}
    </div>
  );
}

export default SelectFiled;
