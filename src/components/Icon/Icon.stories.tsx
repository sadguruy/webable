import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, type IconName } from "./Icon";

const meta = {
	title: "Components/Icon",
	component: Icon,
	tags: ["autodocs"],
	args: {
		name: "github" as IconName,
		size: "md",
		variant: "default",
		title: "GitHub",
	},
	parameters: {
		controls: {
			expanded: true,
		},
	},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic playground for a single icon.
 * Use the controls to switch `name`, `size`, and `variant`.
 */
export const Playground: Story = {};

/**
 * Icon gallery to visually inspect multiple icons at once.
 */
const icons: IconName[] = [
	"bluesky",
	"discord",
	"github",
	"x",
	"documentation",
	"social",
	"check",
	"close",
	"info",
	"warning",
	"error",
	"success",
	"menu",
	"table",
	"grid",
	"list",
	"tabs",
	"accordion",
	"search",
	"filter",
	"bell",
	"badge",
	"file",
	"code",
	"clipboard",
	"copy",
	"link",
	"download",
	"upload",
	"cloud",
	"spinner",
	"user",
	"users",
	"home",
	"mail",
	"alert",
	"check",
	"attention-outline",
	"attention-filled",
	"ai",
	"ai-chat",
	"api",
	"event",
	"event-add",
	"event-delete",
	"event-update",
	"attachment",
	"back-to-top",
	"arrow-right",
	"arrow-left",
	"arrow-up",
	"arrow-down",
	"caret-up",
	"caret-down",
	"caret-left",
	"caret-right",
	"calendar",
	"clear",
	"clock",
	"code",
	"data",
	"storage",
	"drag",
	"drop",
	"error",
	"file",
	"help",
	"file-jpg",
	"file-png",
	"file-svg",
	"file-pdf",
	"locked",
	"medical",
	"minus",
	"phone",
	"call",
	"mobile",
	"tablet",
	"pc",
	"print",
	"push",
	"pull",
	"camera",
	"selfie",
	"document",
	"scan",
	"share",
	"shop",
	"sort",
	"address",
	"switch",
	"toggle",
	"id",
	"tick",
	"wifi",
	"tower",
	"settings",
	"care",
];

export const Gallery: Story = {
	args: {
		size: "md",
		variant: "muted",
	},
	render: (args) => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
				gap: "1.25rem",
				padding: "1.5rem",
				background: "#f8fafc",
			}}
		>
			{icons.map((name) => (
				<div
					key={name}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "0.5rem",
						padding: "0.75rem",
						borderRadius: "0.75rem",
						background: "#ffffff",
						boxShadow:
							"0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.08)",
					}}
				>
					<Icon name={name} size={args.size} variant={args.variant} />
					<span
						style={{
							fontSize: "0.75rem",
							color: "#64748b",
							wordBreak: "break-all",
							textAlign: "center",
						}}
					>
						{name}
					</span>
				</div>
			))}
		</div>
	),
};

/**
 * Variant showcase for the same icon.
 */
export const Variants: Story = {
	args: {
		name: "info",
	},
	render: (args) => (
		<div
			style={{
				display: "flex",
				gap: "1.5rem",
				alignItems: "center",
				padding: "1.5rem",
				background: "#f9fafb",
			}}
		>
			<div style={{ textAlign: "center" }}>
				<Icon {...args} size="sm" variant="muted" />
				<div
					style={{
						fontSize: "0.75rem",
						color: "#64748b",
						marginTop: "0.25rem",
					}}
				>
					sm / muted
				</div>
			</div>
			<div style={{ textAlign: "center" }}>
				<Icon {...args} size="md" variant="primary" />
				<div
					style={{
						fontSize: "0.75rem",
						color: "#64748b",
						marginTop: "0.25rem",
					}}
				>
					md / primary
				</div>
			</div>
			<div style={{ textAlign: "center" }}>
				<Icon {...args} size="lg" variant="danger" />
				<div
					style={{
						fontSize: "0.75rem",
						color: "#64748b",
						marginTop: "0.25rem",
					}}
				>
					lg / danger
				</div>
			</div>
		</div>
	),
};
