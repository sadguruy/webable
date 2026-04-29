import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { Children, cloneElement, isValidElement } from "react";

import "./styles.css";

export type ActionListsElementType = "button" | "link";
export type ActionListsVariant = "comfortable" | "normal";

interface ActionListsBaseProps {
	title: string;
	helperText?: string;
	elementType?: ActionListsElementType;
	variant?: ActionListsVariant;
	icon?: ReactNode;
	iconSrc?: string;
	iconAlt?: string;
	spritePath?: string;
	spriteIconId?: string;
	disabled?: boolean;
	className?: string;
}

export interface ActionListsButtonProps
	extends
		ActionListsBaseProps,
		Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "title"> {
	elementType?: "button";
	type?: "button" | "submit" | "reset";
}

export interface ActionListsLinkProps
	extends
		ActionListsBaseProps,
		Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "title"> {
	elementType: "link";
	href: string;
	target?: "_self" | "_blank" | "_parent" | "_top";
}

export type ActionListsProps = ActionListsButtonProps | ActionListsLinkProps;

export interface ActionListsGroupProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: ActionListsVariant;
}

function ChevronRightIcon() {
	return (
		<svg
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			aria-hidden="true"
		>
			<path d="m8 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function renderLeadingIcon({
	icon,
	iconSrc,
	iconAlt = "",
	spritePath,
	spriteIconId,
}: Pick<
	ActionListsBaseProps,
	"icon" | "iconSrc" | "iconAlt" | "spritePath" | "spriteIconId"
>) {
	if (icon) {
		return icon;
	}

	if (spritePath && spriteIconId) {
		return (
			<svg
				className="action-lists__sprite"
				aria-hidden={iconAlt ? undefined : true}
			>
				<use href={`${spritePath}#${spriteIconId}`} />
			</svg>
		);
	}

	if (iconSrc) {
		return (
			<img
				className="action-lists__icon-image"
				src={iconSrc}
				alt={iconAlt}
				aria-hidden={iconAlt ? undefined : true}
			/>
		);
	}

	return null;
}

export function ActionLists({
	title,
	helperText,
	elementType = "button",
	variant = "normal",
	icon,
	iconSrc,
	iconAlt = "",
	spritePath,
	spriteIconId,
	disabled = false,
	className = "",
	...props
}: ActionListsProps) {
	const classes = [
		"action-lists",
		`action-lists--${variant}`,
		disabled ? "action-lists--disabled" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const leadingIcon = renderLeadingIcon({
		icon,
		iconSrc,
		iconAlt,
		spritePath,
		spriteIconId,
	});

	const content = (
		<>
			<span className="action-lists__left">
				{leadingIcon ? (
					<span
						className="action-lists__icon"
						aria-hidden={iconAlt ? undefined : true}
					>
						{leadingIcon}
					</span>
				) : null}
				<span className="action-lists__text">
					<span className="action-lists__title">{title}</span>
					{helperText ? (
						<span className="action-lists__helper">{helperText}</span>
					) : null}
				</span>
			</span>

			<span className="action-lists__right" aria-hidden="true">
				<ChevronRightIcon />
			</span>
		</>
	);

	if (elementType === "link") {
		const {
			href,
			target = "_self",
			rel,
			onClick,
			...anchorProps
		} = props as ActionListsLinkProps;

		const resolvedRel =
			target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

		const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
			// Prevent navigation when disabled or when no href is provided
			if (disabled || !href) {
				event.preventDefault();
				if (disabled) return;
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
				role={href ? undefined : "button"}
				tabIndex={
					disabled
						? -1
						: href
							? anchorProps.tabIndex
							: (anchorProps.tabIndex ?? 0)
				}
				onClick={handleLinkClick}
				{...anchorProps}
			>
				{content}
			</a>
		);
	}

	const { type = "button", ...buttonProps } = props as ActionListsButtonProps;

	return (
		<button
			className={classes}
			type={type}
			disabled={disabled}
			{...buttonProps}
		>
			{content}
		</button>
	);
}

export function ActionListsGroup({
	children,
	variant = "normal",
	className = "",
	...props
}: ActionListsGroupProps) {
	const classes = [
		"action-lists-group",
		`action-lists-group--${variant}`,
		className,
	]
		.filter(Boolean)
		.join(" ");

	const enhancedChildren = Children.map(children, (child) => {
		if (!isValidElement(child)) {
			return child;
		}

		return cloneElement(child as ReactElement<ActionListsProps>, {
			variant,
		});
	});

	return (
		<div className={classes} {...props}>
			{enhancedChildren}
		</div>
	);
}

export default ActionLists;
