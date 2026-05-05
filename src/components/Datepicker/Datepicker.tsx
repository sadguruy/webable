import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import "./styles.css";

export type DatepickerMode = "popup" | "inline";

export interface DatepickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "value"> {
  mode?: DatepickerMode;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  onFocusedDateChange?: (date: Date) => void;
  onVisibleMonthChange?: (monthDate: Date) => void;
  onOpenChange?: (open: boolean) => void;
  label?: ReactNode;
  helperText?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  invalidText?: ReactNode;
  minDate?: Date;
  maxDate?: Date;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  yearStart?: number;
  yearEnd?: number;
}

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function normalizeDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  if (!a || !b) {
    return false;
  }
  return normalizeDate(a).getTime() === normalizeDate(b).getTime();
}

function isInRange(date: Date, minDate?: Date, maxDate?: Date) {
  const current = normalizeDate(date).getTime();
  const min = minDate ? normalizeDate(minDate).getTime() : -Infinity;
  const max = maxDate ? normalizeDate(maxDate).getTime() : Infinity;
  return current >= min && current <= max;
}

function formatDateForInput(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildCalendarDays(monthDate: Date, firstDayOfWeek: number): CalendarDay[] {
  const monthStart = getMonthStart(monthDate);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const startOffset = (monthStart.getDay() - firstDayOfWeek + 7) % 7;
  const totalDays = monthEnd.getDate();

  const days: CalendarDay[] = [];

  for (let i = 0; i < startOffset; i += 1) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), i - startOffset + 1);
    days.push({ date, inCurrentMonth: false });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    days.push({
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
      inCurrentMonth: true,
    });
  }

  while (days.length % 7 !== 0) {
    const nextDayIndex = days.length - (startOffset + totalDays) + 1;
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, nextDayIndex);
    days.push({ date, inCurrentMonth: false });
  }

  return days;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {direction === "left" ? (
        <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="4.5" width="13" height="12" rx="2" />
      <path d="M6.5 2.8v2.4M13.5 2.8v2.4M3.5 8h13" strokeLinecap="round" />
    </svg>
  );
}

export function Datepicker({
  mode = "popup",
  value,
  defaultValue = null,
  onChange,
  onFocusedDateChange,
  onVisibleMonthChange,
  onOpenChange,
  label,
  helperText,
  placeholder = "Select date",
  disabled = false,
  required = false,
  invalid = false,
  invalidText,
  minDate,
  maxDate,
  firstDayOfWeek = 0,
  yearStart,
  yearEnd,
  className = "",
  ...props
}: DatepickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const selectedDate = isControlled ? value : internalValue;
  const [open, setOpen] = useState(mode === "inline");
  const initialView = selectedDate ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(getMonthStart(initialView));
  const [focusedDate, setFocusedDate] = useState<Date>(selectedDate ?? new Date());
  const rootRef = useRef<HTMLDivElement | null>(null);

  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const weekdays = useMemo(() => {
    return [...WEEKDAY_LABELS.slice(firstDayOfWeek), ...WEEKDAY_LABELS.slice(0, firstDayOfWeek)];
  }, [firstDayOfWeek]);

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, monthIndex) => ({
        value: monthIndex,
        label: new Intl.DateTimeFormat("en-US", { month: "long" }).format(
          new Date(2024, monthIndex, 1),
        ),
      })),
    [],
  );

  const computedYearStart = yearStart ?? (minDate ? minDate.getFullYear() : new Date().getFullYear() - 50);
  const computedYearEnd = yearEnd ?? (maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 20);
  const years = useMemo(() => {
    const start = Math.min(computedYearStart, computedYearEnd);
    const end = Math.max(computedYearStart, computedYearEnd);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [computedYearStart, computedYearEnd]);

  const days = useMemo(
    () => buildCalendarDays(visibleMonth, firstDayOfWeek),
    [visibleMonth, firstDayOfWeek],
  );

  useEffect(() => {
    if (mode === "inline") {
      setOpen(true);
      return;
    }

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", onDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [mode, open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const key = normalizeDate(selectedDate ?? focusedDate).toISOString();
    const ref = dayRefs.current.get(key);
    ref?.focus();
  }, [open, selectedDate, focusedDate]);

  const setOpenState = (next: boolean) => {
    if (mode === "inline") {
      return;
    }
    setOpen(next);
    onOpenChange?.(next);
  };

  const setSelectedDate = (date: Date) => {
    if (!isControlled) {
      setInternalValue(date);
    }
    onChange?.(date);
    setFocusedDate(date);
    onFocusedDateChange?.(date);
    if (mode === "popup") {
      setOpenState(false);
    }
  };

  const moveMonth = (delta: number) => {
    const next = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + delta, 1);
    setVisibleMonth(next);
    onVisibleMonthChange?.(next);
  };

  const moveFocusByDays = (delta: number) => {
    const next = new Date(focusedDate);
    next.setDate(next.getDate() + delta);
    setFocusedDate(next);
    onFocusedDateChange?.(next);

    if (next.getMonth() !== visibleMonth.getMonth() || next.getFullYear() !== visibleMonth.getFullYear()) {
      const nextMonth = new Date(next.getFullYear(), next.getMonth(), 1);
      setVisibleMonth(nextMonth);
      onVisibleMonthChange?.(nextMonth);
    }
  };

  const onDayKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocusByDays(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocusByDays(-1);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocusByDays(7);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocusByDays(-7);
    }
    if (event.key === "PageDown") {
      event.preventDefault();
      moveMonth(1);
    }
    if (event.key === "PageUp") {
      event.preventDefault();
      moveMonth(-1);
    }
    if (event.key === "Escape" && mode === "popup") {
      event.preventDefault();
      setOpenState(false);
    }
  };

  const today = new Date();

  const classes = [
    "datepicker",
    mode === "inline" ? "datepicker--inline" : "datepicker--popup",
    invalid ? "datepicker--invalid" : "",
    disabled ? "datepicker--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} ref={rootRef} {...props}>
      {label ? (
        <label className="datepicker__label">
          {label}
          {required ? <span className="datepicker__required"> *</span> : null}
        </label>
      ) : null}

      {helperText ? <div className="datepicker__helper">{helperText}</div> : null}

      {mode === "popup" ? (
        <button
          type="button"
          className="datepicker__trigger"
          disabled={disabled}
          onClick={() => setOpenState(!open)}
        >
          <span className={selectedDate ? "datepicker__value" : "datepicker__placeholder"}>
            {selectedDate ? formatDateForInput(selectedDate) : placeholder}
          </span>
          <span className="datepicker__trigger-icon">
            <CalendarIcon />
          </span>
        </button>
      ) : null}

      {(mode === "inline" || open) && (
        <div className="datepicker__panel" role="dialog" aria-label="Calendar">
          <div className="datepicker__toolbar">
            <button
              type="button"
              className="datepicker__nav-btn"
              onClick={() => moveMonth(-1)}
              disabled={disabled}
              aria-label="Previous month"
            >
              <Chevron direction="left" />
            </button>
            <div className="datepicker__month-controls">
              <label className="datepicker__sr-only" htmlFor="datepicker-month-select">
                Choose month
              </label>
              <select
                id="datepicker-month-select"
                className="datepicker__select"
                value={visibleMonth.getMonth()}
                disabled={disabled}
                onChange={(event) => {
                  const next = new Date(
                    visibleMonth.getFullYear(),
                    Number(event.target.value),
                    1,
                  );
                  setVisibleMonth(next);
                  onVisibleMonthChange?.(next);
                }}
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <label className="datepicker__sr-only" htmlFor="datepicker-year-select">
                Choose year
              </label>
              <select
                id="datepicker-year-select"
                className="datepicker__select"
                value={visibleMonth.getFullYear()}
                disabled={disabled}
                onChange={(event) => {
                  const next = new Date(
                    Number(event.target.value),
                    visibleMonth.getMonth(),
                    1,
                  );
                  setVisibleMonth(next);
                  onVisibleMonthChange?.(next);
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="datepicker__nav-btn"
              onClick={() => moveMonth(1)}
              disabled={disabled}
              aria-label="Next month"
            >
              <Chevron direction="right" />
            </button>
          </div>

          <div className="datepicker__weekdays">
            {weekdays.map((day) => (
              <span key={day} className="datepicker__weekday">
                {day}
              </span>
            ))}
          </div>

          <div className="datepicker__grid" role="grid">
            {days.map(({ date, inCurrentMonth }) => {
              const key = normalizeDate(date).toISOString();
              const selected = isSameDay(date, selectedDate);
              const focused = isSameDay(date, focusedDate);
              const isToday = isSameDay(date, today);
              const inRange = isInRange(date, minDate, maxDate);

              const dayClasses = [
                "datepicker__day",
                inCurrentMonth ? "" : "is-muted",
                selected ? "is-selected" : "",
                focused ? "is-focused-date" : "",
                isToday ? "is-today" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={key}
                  ref={(node) => {
                    if (node) dayRefs.current.set(key, node);
                    else dayRefs.current.delete(key);
                  }}
                  type="button"
                  className={dayClasses}
                  onClick={() => {
                    if (inRange && !disabled) setSelectedDate(date);
                  }}
                  onFocus={() => {
                    setFocusedDate(date);
                    onFocusedDateChange?.(date);
                  }}
                  onKeyDown={onDayKeyDown}
                  tabIndex={selected || focused ? 0 : -1}
                  disabled={disabled || !inRange}
                  aria-selected={selected}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {invalid && invalidText ? <div className="datepicker__error">{invalidText}</div> : null}
    </div>
  );
}

export default Datepicker;
