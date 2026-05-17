import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
	title: "Components/Tabs",
	component: Tabs,
	tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof Tabs> = {
	args: {
		tabs: [
			{ id: "one", label: "Profile", content: "Profile content" },
			{ id: "two", label: "Settings", content: "Settings content" },
			{ id: "three", label: "Billing", content: "Billing content" },
		],
	},
};

export const Vertical: StoryObj<typeof Tabs> = {
	args: {
		orientation: "vertical",
		tabs: [
			{ id: "a", label: "Tab A", content: "A content" },
			{ id: "b", label: "Tab B", content: "B content" },
		],
	},
};
``;
