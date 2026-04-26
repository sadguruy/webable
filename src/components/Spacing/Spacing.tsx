import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import "./styles.css";

export type SpacingMode = "padding" | "margin";
export type SpacingAs = "div" | "section" | "article" | "aside" | "span";
export type SpacingStep =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

export interface SpacingProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: SpacingAs;
  mode?: SpacingMode;
  all?: SpacingStep;
  x?: SpacingStep;
  y?: SpacingStep;
  top?: SpacingStep;
  right?: SpacingStep;
  bottom?: SpacingStep;
  left?: SpacingStep;
  mobileScale?: number;
}

function resolveStep(primary: SpacingStep | undefined, fallback: SpacingStep | undefined) {
  return primary ?? fallback ?? 0;
}

export function Spacing({
  children,
  as: Component = "div",
  mode = "padding",
  all,
  x,
  y,
  top,
  right,
  bottom,
  left,
  mobileScale = 0.5,
  className = "",
  style,
  ...props
}: SpacingProps) {
  const classes = [
    "webable-spacing",
    `webable-spacing--${mode}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spacingStyle = {
    "--webable-space-top": resolveStep(top, y ?? all),
    "--webable-space-right": resolveStep(right, x ?? all),
    "--webable-space-bottom": resolveStep(bottom, y ?? all),
    "--webable-space-left": resolveStep(left, x ?? all),
    "--webable-space-mobile-scale": mobileScale,
    ...style,
  } as CSSProperties;

  return (
    <Component className={classes} style={spacingStyle} {...props}>
      {children}
    </Component>
  );
}

export default Spacing;
