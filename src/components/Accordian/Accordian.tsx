import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import "./styles.css";

type AccordianValue = string | number;

interface AccordianContextValue {
  openValues: AccordianValue[];
  toggleValue: (value: AccordianValue) => void;
  isOpen: (value: AccordianValue) => boolean;
  openIcon: ReactNode;
  closeIcon: ReactNode;
}

const AccordianContext = createContext<AccordianContextValue | null>(null);

function DefaultOpenIcon() {
  return <span aria-hidden="true">-</span>;
}

function DefaultCloseIcon() {
  return <span aria-hidden="true">+</span>;
}

export interface AccordianProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children: ReactNode;
  multiple?: boolean;
  defaultOpenValues?: AccordianValue[];
  openValues?: AccordianValue[];
  onChange?: (openValues: AccordianValue[]) => void;
  openIcon?: ReactNode;
  closeIcon?: ReactNode;
}

export interface AccordianItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value?: AccordianValue;
  disabled?: boolean;
}

interface AccordianItemContextValue {
  value: AccordianValue;
  disabled: boolean;
  triggerId: string;
  panelId: string;
}

const AccordianItemContext = createContext<AccordianItemContextValue | null>(null);

export interface AccordianTitleProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  openIcon?: ReactNode;
  closeIcon?: ReactNode;
}

export interface AccordianPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function useAccordianContext() {
  const context = useContext(AccordianContext);
  if (!context) {
    throw new Error("Accordian components must be used inside <Accordian>.");
  }
  return context;
}

function useAccordianItemContext() {
  const context = useContext(AccordianItemContext);
  if (!context) {
    throw new Error("Accordian item components must be used inside <AccordianItem>.");
  }
  return context;
}

export function Accordian({
  children,
  multiple = false,
  defaultOpenValues = [],
  openValues,
  onChange,
  openIcon = <DefaultOpenIcon />,
  closeIcon = <DefaultCloseIcon />,
  className = "",
  ...props
}: AccordianProps) {
  const isControlled = openValues !== undefined;
  const [internalOpenValues, setInternalOpenValues] = useState<AccordianValue[]>(defaultOpenValues);
  const currentOpenValues = isControlled ? openValues : internalOpenValues;

  const toggleValue = (value: AccordianValue) => {
    const isCurrentlyOpen = currentOpenValues.includes(value);
    const nextValues = isCurrentlyOpen
      ? currentOpenValues.filter((item) => item !== value)
      : multiple
        ? [...currentOpenValues, value]
        : [value];

    if (!isControlled) {
      setInternalOpenValues(nextValues);
    }

    onChange?.(nextValues);
  };

  const contextValue = useMemo<AccordianContextValue>(
    () => ({
      openValues: currentOpenValues,
      toggleValue,
      isOpen: (value) => currentOpenValues.includes(value),
      openIcon,
      closeIcon,
    }),
    [currentOpenValues, openIcon, closeIcon],
  );

  const classes = ["accordian", className].filter(Boolean).join(" ");

  return (
    <AccordianContext.Provider value={contextValue}>
      <div className={classes} {...props}>
        {children}
      </div>
    </AccordianContext.Provider>
  );
}

export function AccordianItem({
  children,
  value,
  disabled = false,
  className = "",
  ...props
}: AccordianItemProps) {
  const generatedId = useId();
  const resolvedValue = value ?? generatedId;
  const triggerId = `accordian-trigger-${String(resolvedValue).replace(/\s+/g, "-")}`;
  const panelId = `accordian-panel-${String(resolvedValue).replace(/\s+/g, "-")}`;

  const itemContextValue = useMemo<AccordianItemContextValue>(
    () => ({
      value: resolvedValue,
      disabled,
      triggerId,
      panelId,
    }),
    [resolvedValue, disabled, triggerId, panelId],
  );

  const classes = ["accordian__item", disabled ? "accordian__item--disabled" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <AccordianItemContext.Provider value={itemContextValue}>
      <div className={classes} {...props}>
        {children}
      </div>
    </AccordianItemContext.Provider>
  );
}

function moveFocusToSibling(current: HTMLButtonElement, direction: "next" | "prev") {
  const triggers = Array.from(
    current.closest(".accordian")?.querySelectorAll<HTMLButtonElement>(".accordian__title") ?? [],
  );
  const index = triggers.indexOf(current);
  if (index < 0) {
    return;
  }

  const targetIndex =
    direction === "next"
      ? (index + 1) % triggers.length
      : (index - 1 + triggers.length) % triggers.length;

  triggers[targetIndex]?.focus();
}

export function AccordianTitle({
  children,
  openIcon,
  closeIcon,
  className = "",
  onKeyDown,
  ...props
}: AccordianTitleProps) {
  const { toggleValue, isOpen, openIcon: parentOpenIcon, closeIcon: parentCloseIcon } = useAccordianContext();
  const { value, disabled, triggerId, panelId } = useAccordianItemContext();
  const expanded = isOpen(value);
  const renderedIcon = expanded ? (openIcon ?? parentOpenIcon) : (closeIcon ?? parentCloseIcon);

  const classes = ["accordian__title", className].filter(Boolean).join(" ");

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocusToSibling(event.currentTarget, "next");
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocusToSibling(event.currentTarget, "prev");
    }
    if (event.key === "Home") {
      event.preventDefault();
      const first = event.currentTarget
        .closest(".accordian")
        ?.querySelector<HTMLButtonElement>(".accordian__title");
      first?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      const all = event.currentTarget
        .closest(".accordian")
        ?.querySelectorAll<HTMLButtonElement>(".accordian__title");
      all?.[all.length - 1]?.focus();
    }

    onKeyDown?.(event);
  };

  return (
    <button
      type="button"
      id={triggerId}
      className={classes}
      aria-expanded={expanded}
      aria-controls={panelId}
      disabled={disabled}
      onClick={() => toggleValue(value)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span className="accordian__title-text">{children}</span>
      <span className="accordian__title-icon" aria-hidden="true">
        {renderedIcon}
      </span>
    </button>
  );
}

export function AccordianPanel({ children, className = "", ...props }: AccordianPanelProps) {
  const { isOpen } = useAccordianContext();
  const { value, triggerId, panelId } = useAccordianItemContext();
  const expanded = isOpen(value);

  const classes = [
    "accordian__panel",
    expanded ? "accordian__panel--open" : "accordian__panel--closed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!expanded}
      className={classes}
      {...props}
    >
      <div className="accordian__panel-inner">{children}</div>
    </div>
  );
}

interface AccordianStatic {
  Item: typeof AccordianItem;
  Title: typeof AccordianTitle;
  Panel: typeof AccordianPanel;
}

const AccordianWithStatics = Accordian as typeof Accordian & AccordianStatic;
AccordianWithStatics.Item = AccordianItem;
AccordianWithStatics.Title = AccordianTitle;
AccordianWithStatics.Panel = AccordianPanel;

export default AccordianWithStatics;
