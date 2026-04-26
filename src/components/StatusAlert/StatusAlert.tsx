import { useEffect, useId, useState, type ReactNode } from "react";

import "./styles.css";

export type StatusAlertTone = "success" | "error" | "warning" | "info";
export type StatusAlertPositionMode = "static" | "absolute" | "fixed";
export type StatusAlertPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface StatusAlertProps {
  title?: string;
  message: ReactNode;
  tone?: StatusAlertTone;
  position?: StatusAlertPositionMode;
  placement?: StatusAlertPlacement;
  offset?: number;
  autoCloseSeconds?: number;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="m6.8 10.2 2.1 2.1 4.3-4.7" strokeLinecap="round" strokeLinejoin="round" />
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

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M10 3.8 16 15H4l6-11.2Z" strokeLinejoin="round" />
      <path d="M10 7.5v3.7" strokeLinecap="round" />
      <path d="M10 13.2h.01" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 9.1v4" strokeLinecap="round" />
      <path d="M10 6.5h.01" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m6 6 8 8M14 6l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function getToneIcon(tone: StatusAlertTone) {
  switch (tone) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    case "warning":
      return <WarningIcon />;
    case "info":
    default:
      return <InfoIcon />;
  }
}

export function StatusAlert({
  title,
  message,
  tone = "info",
  position = "static",
  placement = "top-right",
  offset = 16,
  autoCloseSeconds,
  closable = true,
  onClose,
  className = "",
}: StatusAlertProps) {
  const [visible, setVisible] = useState(true);
  const messageId = useId();

  useEffect(() => {
    if (!autoCloseSeconds || autoCloseSeconds <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, autoCloseSeconds * 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoCloseSeconds, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  const classes = [
    "status-alert",
    `status-alert--${tone}`,
    `status-alert--position-${position}`,
    position !== "static" ? `status-alert--placement-${placement}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role={tone === "error" || tone === "warning" ? "alert" : "status"}
      aria-live={tone === "error" || tone === "warning" ? "assertive" : "polite"}
      aria-atomic="true"
      aria-describedby={messageId}
      style={
        position === "static"
          ? undefined
          : {
              ["--status-alert-offset" as string]: `${offset}px`,
            }
      }
    >
      <div className="status-alert__icon">{getToneIcon(tone)}</div>

      <div className="status-alert__content">
        {title ? <div className="status-alert__title">{title}</div> : null}
        <div id={messageId} className="status-alert__message">
          {message}
        </div>
      </div>

      {closable ? (
        <button
          type="button"
          className="status-alert__close"
          onClick={handleClose}
          aria-label="Close alert"
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}

export default StatusAlert;
