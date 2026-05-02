import type { CSSProperties, HTMLAttributes } from "react";

import "./styles.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerTone = "subtle" | "default" | "strong";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  tone?: DividerTone;
  thickness?: number;
  length?: string | number;
}

export function Divider({
  orientation = "horizontal",
  tone = "default",
  thickness = 1,
  length,
  className = "",
  style,
  ...props
}: DividerProps) {
  const classes = [
    "webable-divider",
    `webable-divider--${orientation}`,
    `webable-divider--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const dividerStyle = {
    "--webable-divider-thickness": `${thickness}px`,
    "--webable-divider-length": typeof length === "number" ? `${length}px` : length ?? "100%",
    ...style,
  } as CSSProperties;

  return (
    <div
      className={classes}
      role="separator"
      aria-orientation={orientation}
      style={dividerStyle}
      {...props}
    />
  );
}

export default Divider;
