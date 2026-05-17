import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import "./styles.css";

export type ModelDialogSize = "xs" | "sm" | "md" | "lg";
export type ModelDialogVariant = "alert" | "success" | "error" | "warning";

interface ModelDialogContextValue {
  close: () => void;
  variant: ModelDialogVariant;
}

const ModelDialogContext = createContext<ModelDialogContextValue | null>(null);

export interface ModelDialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "title"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModelDialogSize;
  variant?: ModelDialogVariant;
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  showFooter?: boolean;
  children: ReactNode;
}

export interface ModelDialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModelDialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface ModelDialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModelDialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m6 6 8 8M14 6l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.2v4.6" strokeLinecap="round" />
      <path d="M10 13.6h.01" strokeLinecap="round" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="m6.8 10.3 2.1 2 4.2-4.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="m7.5 7.5 5 5M12.5 7.5l-5 5" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M10 3.8 16 15H4L10 3.8Z" strokeLinejoin="round" />
      <path d="M10 7.6v3.8" strokeLinecap="round" />
      <path d="M10 13.3h.01" strokeLinecap="round" />
    </svg>
  );
}

function VariantIcon({ variant }: { variant: ModelDialogVariant }) {
  if (variant === "success") return <SuccessIcon />;
  if (variant === "error") return <ErrorIcon />;
  if (variant === "warning") return <WarningIcon />;
  return <AlertIcon />;
}

function useModelDialogContext() {
  const context = useContext(ModelDialogContext);
  if (!context) {
    throw new Error("ModelDialog subcomponents must be used inside <ModelDialog>.");
  }
  return context;
}

export function ModelDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  size = "md",
  variant = "alert",
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  showFooter = true,
  children,
  className = "",
  ...props
}: ModelDialogProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const close = () => {
    if (!isControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!isOpen || !closeOnEsc) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeOnEsc]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const contextValue = useMemo<ModelDialogContextValue>(
    () => ({
      close,
      variant,
    }),
    [variant],
  );

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <ModelDialogContext.Provider value={contextValue}>
      <div className="model-dialog-root" role="presentation">
        <div
          className="model-dialog__backdrop"
          onClick={() => {
            if (closeOnBackdropClick) {
              close();
            }
          }}
        />

        <section
          role="dialog"
          aria-modal="true"
          className={`model-dialog model-dialog--${size} model-dialog--${variant} ${className}`}
          {...props}
        >
          <div className="model-dialog__topline" />

          <div className="model-dialog__header-shell">
            <span className="model-dialog__variant-icon" aria-hidden="true">
              <VariantIcon variant={variant} />
            </span>
            {showCloseButton ? (
              <button
                type="button"
                className="model-dialog__close"
                aria-label="Close dialog"
                onClick={close}
              >
                <CloseIcon />
              </button>
            ) : null}
          </div>

          {children}

          {!showFooter ? (
            <style>{".model-dialog__footer{display:none}"}</style>
          ) : null}
        </section>
      </div>
    </ModelDialogContext.Provider>,
    document.body,
  );
}

export function ModelDialogHeader({
  children,
  className = "",
  ...props
}: ModelDialogHeaderProps) {
  const classes = ["model-dialog__header", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function ModelDialogTitle({
  children,
  className = "",
  ...props
}: ModelDialogTitleProps) {
  const classes = ["model-dialog__title", className].filter(Boolean).join(" ");
  return (
    <h2 className={classes} {...props}>
      {children}
    </h2>
  );
}

export function ModelDialogBody({
  children,
  className = "",
  ...props
}: ModelDialogBodyProps) {
  const classes = ["model-dialog__body", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function ModelDialogFooter({
  children,
  className = "",
  ...props
}: ModelDialogFooterProps) {
  const classes = ["model-dialog__footer", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function ModelDialogCloseButton({
  children = "Close",
  className = "",
  ...props
}: HTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  const { close, variant } = useModelDialogContext();
  const classes = [
    "model-dialog__action",
    "model-dialog__action--secondary",
    `model-dialog__action--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} onClick={close} {...props}>
      {children}
    </button>
  );
}

export function ModelDialogPrimaryButton({
  children = "Confirm",
  className = "",
  ...props
}: HTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  const { variant } = useModelDialogContext();
  const classes = [
    "model-dialog__action",
    "model-dialog__action--primary",
    `model-dialog__action--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

interface ModelDialogStatic {
  Header: typeof ModelDialogHeader;
  Title: typeof ModelDialogTitle;
  Body: typeof ModelDialogBody;
  Footer: typeof ModelDialogFooter;
  CloseButton: typeof ModelDialogCloseButton;
  PrimaryButton: typeof ModelDialogPrimaryButton;
}

const ModelDialogWithStatics = ModelDialog as typeof ModelDialog & ModelDialogStatic;
ModelDialogWithStatics.Header = ModelDialogHeader;
ModelDialogWithStatics.Title = ModelDialogTitle;
ModelDialogWithStatics.Body = ModelDialogBody;
ModelDialogWithStatics.Footer = ModelDialogFooter;
ModelDialogWithStatics.CloseButton = ModelDialogCloseButton;
ModelDialogWithStatics.PrimaryButton = ModelDialogPrimaryButton;

export default ModelDialogWithStatics;
