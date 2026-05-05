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

export type DrawerPlacement = "right" | "left";

interface DrawerContextValue {
  close: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "title"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: string | number;
  placement?: DrawerPlacement;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  title?: ReactNode;
  children: ReactNode;
}

export interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m6 6 8 8M14 6l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer subcomponents must be used within <Drawer>.");
  }
  return context;
}

export function Drawer({
  open,
  defaultOpen = false,
  onOpenChange,
  width = 420,
  placement = "right",
  closeOnEsc = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  title,
  children,
  className = "",
  ...props
}: DrawerProps) {
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      close,
    }),
    [],
  );

  if (!isOpen) {
    return null;
  }

  const drawerWidth = typeof width === "number" ? `${width}px` : width;

  return createPortal(
    <DrawerContext.Provider value={contextValue}>
      <div className="drawer-root" role="presentation">
        <div
          className="drawer-overlay"
          onClick={() => {
            if (closeOnOverlayClick) {
              close();
            }
          }}
        />

        <aside
          className={`drawer drawer--${placement} ${className}`}
          role="dialog"
          aria-modal="true"
          style={{ width: drawerWidth }}
          {...props}
        >
          <div className="drawer__header">
            {title ? <DrawerTitle>{title}</DrawerTitle> : <span />}
            {showCloseButton ? (
              <button
                type="button"
                className="drawer__close"
                aria-label="Close drawer"
                onClick={close}
              >
                <CloseIcon />
              </button>
            ) : null}
          </div>

          {children}
        </aside>
      </div>
    </DrawerContext.Provider>,
    document.body,
  );
}

export function DrawerTitle({ children, className = "", ...props }: DrawerTitleProps) {
  const classes = ["drawer__title", className].filter(Boolean).join(" ");
  return (
    <h2 className={classes} {...props}>
      {children}
    </h2>
  );
}

export function DrawerBody({ children, className = "", ...props }: DrawerBodyProps) {
  const classes = ["drawer__body", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function DrawerFooter({ children, className = "", ...props }: DrawerFooterProps) {
  const classes = ["drawer__footer", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function DrawerCloseButton({
  children = "Close",
  className = "",
  ...props
}: HTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  const { close } = useDrawerContext();
  const classes = ["drawer__close-action", className].filter(Boolean).join(" ");
  return (
    <button
      type="button"
      className={classes}
      onClick={close}
      {...props}
    >
      {children}
    </button>
  );
}

interface DrawerStatic {
  Title: typeof DrawerTitle;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
  CloseButton: typeof DrawerCloseButton;
}

const DrawerWithStatics = Drawer as typeof Drawer & DrawerStatic;
DrawerWithStatics.Title = DrawerTitle;
DrawerWithStatics.Body = DrawerBody;
DrawerWithStatics.Footer = DrawerFooter;
DrawerWithStatics.CloseButton = DrawerCloseButton;

export default DrawerWithStatics;
