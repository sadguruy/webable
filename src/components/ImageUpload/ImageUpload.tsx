import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

import "../TextStyle/styles.css";
import "./styles.css";

export interface ImageUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  label?: string;
  helperText?: string;
  invalid?: boolean;
  invalidText?: string;
  required?: boolean;
  fullWidth?: boolean;
  buttonText?: string;
  previewAlt?: string;
  previewUrl?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>, file: File | null) => void;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M10 13V4.8" strokeLinecap="round" />
      <path d="m6.8 8 3.2-3.2L13.2 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 14.5v.7A1.8 1.8 0 0 0 6.3 17h7.4a1.8 1.8 0 0 0 1.8-1.8v-.7" strokeLinecap="round" />
    </svg>
  );
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

export function ImageUpload({
  id,
  label,
  helperText,
  invalid = false,
  invalidText,
  required = false,
  disabled = false,
  fullWidth = true,
  className = "",
  buttonText = "Upload image",
  previewAlt = "Uploaded preview",
  previewUrl,
  accept = "image/*",
  onChange,
  ...props
}: ImageUploadProps) {
  const generatedId = useId();
  const inputId = id ?? `image-upload-${generatedId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const invalidId = invalid && invalidText ? `${inputId}-error` : undefined;
  const describedBy = [helperId, invalidId].filter(Boolean).join(" ") || undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const resolvedPreviewUrl = localPreviewUrl ?? previewUrl ?? null;

  const classes = [
    "image-upload",
    fullWidth ? "image-upload--full" : "",
    invalid ? "image-upload--invalid" : "",
    disabled ? "image-upload--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFileName(file?.name ?? "");

    setLocalPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });

    onChange?.(event, file);
  };

  const triggerBrowse = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={classes}>
      {label ? (
        <div className="image-upload__header">
          <label className="image-upload__label text-style text-style--label" htmlFor={inputId}>
            {label}
            {required ? <span className="image-upload__required" aria-hidden="true"> *</span> : null}
          </label>

          {helperText ? (
            <div id={helperId} className="image-upload__helper text-style text-style--fineprint">
              {helperText}
            </div>
          ) : null}
        </div>
      ) : null}

      <input
        {...props}
        id={inputId}
        ref={inputRef}
        className="image-upload__input"
        type="file"
        accept={accept}
        disabled={disabled}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={handleChange}
      />

      <div className="image-upload__panel">
        <button
          type="button"
          className="image-upload__button"
          onClick={triggerBrowse}
          disabled={disabled}
          aria-controls={inputId}
        >
          <span className="image-upload__button-icon">
            <UploadIcon />
          </span>
          <span>{buttonText}</span>
        </button>

        <div className="image-upload__meta">
          <span className="image-upload__file-name text-style text-style--fineprint">
            {selectedFileName || "No file selected"}
          </span>
        </div>
      </div>

      {resolvedPreviewUrl ? (
        <div className="image-upload__preview">
          <img src={resolvedPreviewUrl} alt={previewAlt} className="image-upload__preview-image" />
        </div>
      ) : null}

      {invalid && invalidText ? (
        <div
          id={invalidId}
          className="image-upload__error text-style text-style--fineprint"
          role="alert"
        >
          <span className="image-upload__error-icon">
            <ErrorIcon />
          </span>
          {invalidText}
        </div>
      ) : null}
    </div>
  );
}

export default ImageUpload;
