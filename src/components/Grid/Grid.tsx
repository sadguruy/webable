import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import "./styles.css";

export type GridContainer = "fixed" | "fluid";
export type GridGap = "none" | "sm" | "md" | "lg";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  container?: GridContainer;
  gap?: GridGap;
}

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

function clampSpan(value: number | undefined) {
  if (!value) {
    return 12;
  }

  return Math.min(12, Math.max(1, value));
}

export function Grid({
  children,
  container = "fluid",
  gap = "md",
  className = "",
  ...props
}: GridProps) {
  const classes = [
    "webable-grid",
    `webable-grid--${container}`,
    `webable-grid--gap-${gap}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <div className="webable-grid__row">{children}</div>
    </div>
  );
}

export function Column({
  children,
  xs = 12,
  sm,
  md,
  lg,
  className = "",
  style,
  ...props
}: ColumnProps) {
  const columnStyle = {
    "--webable-col-xs": clampSpan(xs),
    "--webable-col-sm": clampSpan(sm ?? xs),
    "--webable-col-md": clampSpan(md ?? sm ?? xs),
    "--webable-col-lg": clampSpan(lg ?? md ?? sm ?? xs),
    ...style,
  } as CSSProperties;

  const classes = ["webable-column", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={columnStyle} {...props}>
      {children}
    </div>
  );
}

export default Grid;
