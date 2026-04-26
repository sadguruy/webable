import { useId, type ChangeEvent, type FocusEvent, type InputHTMLAttributes } from "react";

import "../TextStyle/styles.css";
import "./styles.css";

type SupportedInputType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "color";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "onBlur"> {
  type?: SupportedInputType;
  label?: string;
  helperText?: string;
  invalid?: boolean;
  invalidText?: string;
  required?: boolean;
  fullWidth?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
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

export function TextField({
  id,
  type = "text",
  label,
  helperText,
  invalid = false,
  invalidText,
  required = false,
  disabled = false,
  fullWidth = true,
  className = "",
  onChange,
  onBlur,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `textfield-${generatedId}`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const invalidId = invalid && invalidText ? `${fieldId}-error` : undefined;
  const describedBy = [helperId, invalidId].filter(Boolean).join(" ") || undefined;

  const classes = [
    "text-field",
    fullWidth ? "text-field--full" : "",
    invalid ? "text-field--invalid" : "",
    disabled ? "text-field--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label ? (
        <div className="text-field__header">
          <label className="text-field__label text-style text-style--label" htmlFor={fieldId}>
            {label}
            {required ? <span className="text-field__required" aria-hidden="true"> *</span> : null}
          </label>

          {helperText ? (
            <div id={helperId} className="text-field__helper text-style text-style--fineprint">
              {helperText}
            </div>
          ) : null}
        </div>
      ) : null}

      <input
        id={fieldId}
        className="text-field__input"
        type={type}
        required={required}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />

      {invalid && invalidText ? (
        <div
          id={invalidId}
          className="text-field__error text-style text-style--fineprint"
          role="alert"
        >
          <span className="text-field__error-icon">
            <ErrorIcon />
          </span>
          {invalidText}
        </div>
      ) : null}
    </div>
  );
}

export default TextField;
