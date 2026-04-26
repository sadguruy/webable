import {
  createElement,
  type CSSProperties,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";

import "./styles.css";

type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "ul"
  | "ol"
  | "li"
  | "label";

export type TextStyleVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "heading"
  | "base"
  | "fineprint"
  | "label"
  | "tagline"
  | "crossed";

export type TextStyleTone =
  | "default"
  | "muted"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type TextStyleAlign = "left" | "center" | "right";

export type TextStyleWeight = "regular" | "medium" | "semibold" | "bold";

export interface TextStyleProps
  extends HTMLAttributes<HTMLElement>,
    Pick<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> {
  as?: TextElement;
  variant?: TextStyleVariant;
  children: ReactNode;
  truncate?: boolean;
  muted?: boolean;
  tone?: TextStyleTone;
  align?: TextStyleAlign;
  weight?: TextStyleWeight;
  clampLines?: number;
  srOnly?: boolean;
}

const variantElementMap: Record<TextStyleVariant, TextElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  heading: "h3",
  base: "p",
  fineprint: "span",
  label: "label",
  tagline: "span",
  crossed: "span",
};

const variantClassMap: Record<TextStyleVariant, string> = {
  h1: "text-style--h1",
  h2: "text-style--h2",
  h3: "text-style--h3",
  h4: "text-style--h4",
  h5: "text-style--h5",
  h6: "text-style--h6",
  heading: "text-style--heading",
  base: "text-style--base",
  fineprint: "text-style--fineprint",
  label: "text-style--label",
  tagline: "text-style--tagline",
  crossed: "text-style--crossed",
};

export function TextStyle({
  as,
  variant = "base",
  children,
  truncate = false,
  muted = false,
  tone = "default",
  align = "left",
  weight,
  clampLines,
  srOnly = false,
  className = "",
  ...props
}: TextStyleProps) {
  const clampStyle: CSSProperties | undefined =
    clampLines && clampLines > 0
      ? {
          display: "-webkit-box",
          WebkitLineClamp: clampLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : undefined;

  const element = as ?? variantElementMap[variant];
  const classes = [
    "text-style",
    variantClassMap[variant],
    truncate ? "text-style--truncate" : "",
    muted ? "text-style--muted" : "",
    srOnly ? "text-style--sr-only" : "",
    `text-style--tone-${muted ? "muted" : tone}`,
    `text-style--align-${align}`,
    weight ? `text-style--weight-${weight}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(
    element,
    {
      className: classes,
      ...props,
      style: {
        ...clampStyle,
        ...(props.style as CSSProperties | undefined),
      },
    },
    children,
  );
}

export default TextStyle;
