import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { SelectField } from "./SelectField";

const sampleOptions = [
	{ label: "Design", value: "design" },
	{ label: "Engineering", value: "engineering" },
	{ label: "Marketing", value: "marketing" },
	{ label: "Operations", value: "operations" },
];

const meta = {
	title: "Components/SelectField",
	component: SelectField,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		label: "Department",
		helperText: "Choose the team this workspace belongs to.",
		placeholder: "Select a department",
		fullWidth: true,
		invalid: false,
		disabled: false,
		required: false,
		options: sampleOptions,
		onChange: fn(),
		value: "",
	},
	render: (args) => (
		<div style={{ width: "320px" }}>
			<SelectField {...args} />
		</div>
	),
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = {
	args: {
		label: "Country",
		placeholder: "Select your country",
		required: true,
		helperText: "This helps localize formats and defaults.",
		options: [
			{ label: "India", value: "in" },
			{ label: "United States", value: "us" },
			{ label: "Germany", value: "de" },
		],
	},
};

export const DefaultValue: Story = {
	args: { defaultValue: "engineering" },
	render: (args) => {
		const [value, setValue] = useState(args.defaultValue ?? "");

		return (
			<div style={{ width: 320 }}>
				<SelectField
					{...args}
					defaultValue={args.defaultValue}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					value={value}
				/>

				<div style={{ marginTop: 8, fontSize: 13 }}>
					Selected: {value || "(none)"}
				</div>
			</div>
		);
	},
};

export const InvalidState: Story = {
	args: {
		label: "Plan",
		invalid: true,
		invalidText: "Please select a subscription plan before continuing.",
		helperText: "Required for billing and feature access.",
		options: [
			{ label: "Starter", value: "starter" },
			{ label: "Growth", value: "growth" },
			{ label: "Enterprise", value: "enterprise" },
		],
	},
};

export const Disabled: Story = {
	args: {
		label: "Region",
		value: "apac",
		disabled: true,
		helperText: "This setting is managed by your organization admin.",
		options: [
			{ label: "APAC", value: "apac" },
			{ label: "EMEA", value: "emea" },
			{ label: "North America", value: "na" },
		],
	},
};

export const WithCustomOptions: Story = {
	render: () => (
		<div style={{ width: "320px" }}>
			<SelectField
				label="Language"
				helperText="Choose the primary language for this project."
				defaultValue=""
			>
				<option value="" disabled>
					Select a language
				</option>
				<option value="en">English</option>
				<option value="fr">French</option>
				<option value="es">Spanish</option>
			</SelectField>
		</div>
	),
};
