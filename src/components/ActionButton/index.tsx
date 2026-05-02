import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

import "./styles.css";

export type ActionButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "warning"
  | "error"
  | "danger";

export type ActionButtonWidth = "auto" | "full";
export type ActionButtonSize = "small" | "medium" | "large";
export type ActionButtonShape = "rounded" | "bordered" | "square";

interface ActionButtonBaseProps {
  label?: string;
  variant?: ActionButtonVariant;
  width?: ActionButtonWidth;
  size?: ActionButtonSize;
  shape?: ActionButtonShape;
  outlined?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconSrc?: string;
  iconAlt?: string;
  iconPosition?: "left" | "right";
}

export interface ActionButtonButtonProps
  extends ActionButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  elementType?: "button";
  type?: "button" | "submit" | "reset";
}

export interface ActionButtonLinkProps
  extends ActionButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> {
  elementType: "link";
  href: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
}

export type ActionButtonProps =
  | ActionButtonButtonProps
  | ActionButtonLinkProps;

export function ActionButton({
  label,
  variant = "default",
  width = "auto",
  size = "medium",
  shape = "bordered",
  outlined = false,
  icon,
  iconSrc,
  iconAlt = "",
  iconPosition = "left",
  className = "",
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  const classes = [
    "action-button",
    `action-button--${variant}`,
    `action-button--${size}`,
    `action-button--${shape}`,
    outlined ? "action-button--outlined" : "",
    width === "full" ? "action-button--full" : "",
    icon || iconSrc ? "action-button--with-icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = children ?? label;
  const renderedIcon = iconSrc ? (
    <img
      className="action-button__icon-image"
      src={iconSrc}
      alt={iconAlt}
      aria-hidden={iconAlt ? undefined : true}
    />
  ) : (
    icon
  );

  const iconMarkup = renderedIcon ? (
    <span className="action-button__icon" aria-hidden={iconAlt ? undefined : true}>
      {renderedIcon}
    </span>
  ) : null;

  if (props.elementType === "link") {
    const {
      elementType,
      href,
      target = "_self",
      rel,
      onClick,
      ...anchorProps
    } = props;

    const resolvedRel =
      target === "_blank"
        ? rel ?? "noopener noreferrer"
        : rel;

    const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
    };

    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        target={target}
        rel={resolvedRel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchorProps.tabIndex}
        onClick={handleLinkClick}
        {...anchorProps}
      >
        {iconMarkup && iconPosition === "left" ? iconMarkup : null}
        <span className="action-button__label">{content}</span>
        {iconMarkup && iconPosition === "right" ? iconMarkup : null}
      </a>
    );
  }

  const { elementType, type = "button", ...buttonProps } = props;

  return (
    <button
      className={classes}
      disabled={disabled}
      type={type}
      {...buttonProps}
    >
      {iconMarkup && iconPosition === "left" ? iconMarkup : null}
      <span className="action-button__label">{content}</span>
      {iconMarkup && iconPosition === "right" ? iconMarkup : null}
    </button>
  );
}

export default ActionButton;
