import * as React from "react";
import "./styles.css";

type IconSize = "sm" | "md" | "lg";
type IconVariant = "default" | "muted" | "primary" | "danger" | "success";

export type IconName =
	| "bluesky"
	| "discord"
	| "github"
	| "x"
	| "documentation"
	| "social"
	| "check"
	| "close"
	| "info"
	| "warning"
	| "error"
	| "success"
	| "menu"
	| "table"
	| "grid"
	| "list"
	| "tabs"
	| "accordion"
	| "search"
	| "filter"
	| "bell"
	| "badge"
	| "file"
	| "code"
	| "clipboard"
	| "copy"
	| "link"
	| "download"
	| "upload"
	| "cloud"
	| "spinner"
	| "user"
	| "users"
	| "home"
	| "mail"
	| "alert"
	| "check"
	| "attention-outline"
	| "attention-filled"
	| "ai"
	| "ai-chat"
	| "api"
	| "event"
	| "event-add"
	| "event-delete"
	| "event-update"
	| "attachment"
	| "back-to-top"
	| "arrow-right"
	| "arrow-left"
	| "arrow-up"
	| "arrow-down"
	| "caret-up"
	| "caret-down"
	| "caret-left"
	| "caret-right"
	| "calendar"
	| "clear"
	| "clock"
	| "code"
	| "data"
	| "storage"
	| "drag"
	| "drop"
	| "error"
	| "file"
	| "help"
	| "file-jpg"
	| "file-png"
	| "file-svg"
	| "file-pdf"
	| "locked"
	| "medical"
	| "minus"
	| "phone"
	| "call"
	| "mobile"
	| "tablet"
	| "pc"
	| "print"
	| "push"
	| "pull"
	| "camera"
	| "selfie"
	| "document"
	| "scan"
	| "share"
	| "shop"
	| "sort"
	| "address"
	| "switch"
	| "toggle"
	| "id"
	| "tick"
	| "wifi"
	| "tower"
	| "settings"
	| "care";
// add more as you define symbols

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
	name: IconName;
	/**
	 * Visual size preset; also supports passing explicit width/height.
	 */
	size?: IconSize;
	/**
	 * Visual color variant; maps to CSS (muted, primary, danger, etc.)
	 */
	variant?: IconVariant;
	/**
	 * Accessible title for screen readers.
	 */
	title?: string;
	/**
	 * Additional className applied to the root wrapper.
	 */
	className?: string;
}

/**
 * Icon component that renders a symbol from webableIcons.svg.
 */
export const Icon: React.FC<IconProps> = ({
	name,
	size = "md",
	variant = "default",
	title,
	className,
	...rest
}) => {
	const rootClasses = [
		"webable-icon",
		`webable-icon--${size}`,
		variant !== "default" ? `webable-icon--${variant}` : null,
		className,
	]
		.filter(Boolean)
		.join(" ");

	const ariaHidden = title ? undefined : true;
	const ariaLabelledBy = title ? `${name}-title` : undefined;

	return (
		<span className={rootClasses}>
			<svg
				className="webable-icon__svg"
				aria-hidden={ariaHidden}
				aria-labelledby={ariaLabelledBy}
				role={title ? "img" : "presentation"}
				{...rest}
			>
				{title && <title id={`${name}-title`}>{title}</title>}
				<use href={`/webableIcons.svg#${name}`} />
			</svg>
		</span>
	);
};

export default Icon;
