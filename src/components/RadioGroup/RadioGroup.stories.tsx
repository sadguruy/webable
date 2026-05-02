import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RadioGroup, { type RadioGroupOption } from "./RadioGroup";

const options: RadioGroupOption[] = [
	{ value: "basic", label: "Basic", description: "For small usage" },
	{ value: "pro", label: "Pro", description: "For professionals" },
	{ value: "enterprise", label: "Enterprise", description: "For teams" },
];

const meta: Meta<typeof RadioGroup> = {
	title: "Components/RadioGroup",
	component: RadioGroup,
	tags: ["autodocs"],
	args: {
		title: "Choose a plan",
		smallDescription: "Select one of the available plans.",
		longDescription:
			"You can upgrade or downgrade your plan at any time from your account settings.",
		options,
		selectedValue: "basic",
		invalid: false,
		invalidText: "",
		required: false,
		disabled: false,
		fullWidth: true,
	},
	argTypes: {
		variant: {
			control: "radio",
			options: ["comfortable", "compact"],
		},
		selectedValue: {
			control: "radio",
			options: options.map((o) => o.value),
		},
	},
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

/**
 * Helper render function to keep the component controlled in the canvas.
 */
const renderControlled =
	(variant: "comfortable" | "compact"): Story["render"] =>
	(args) => {
		const [selectedValue, setSelectedValue] = useState(args.selectedValue);

		return (
			<RadioGroup
				{...args}
				variant={variant}
				selectedValue={selectedValue}
				onChange={(value) => setSelectedValue(value)}
			/>
		);
	};

export const Comfortable: Story = {
	args: {
		variant: "comfortable",
	},
	render: renderControlled("comfortable"),
};

export const Compact: Story = {
	args: {
		variant: "compact",
		smallDescription: "More condensed layout for dense UIs.",
		longDescription: "",
	},
	render: renderControlled("compact"),
};
