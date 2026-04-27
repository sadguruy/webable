import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import CheckboxGroup, { Checkbox, type CheckboxOption } from "./CheckboxGroup";

const multiOptions: CheckboxOption[] = [
	{ value: "email", label: "Email", description: "Receive updates by email." },
	{ value: "sms", label: "SMS", description: "Receive SMS notifications." },
	{
		value: "push",
		label: "Push",
		description: "Receive push notifications in the app.",
	},
];

const meta: Meta<typeof CheckboxGroup> = {
	title: "Components/Checkbox",
	component: CheckboxGroup,
	tags: ["autodocs"],
	args: {
		title: "Notification channels",
		smallDescription: "Choose one or more channels.",
		longDescription:
			"You can change these preferences at any time in your profile settings.",
		options: multiOptions,
		selectedValues: ["email"],
		variant: "comfortable",
		invalid: false,
		invalidText: "",
		disabled: false,
		fullWidth: true,
	},
};
export default meta;

type GroupStory = StoryObj<typeof CheckboxGroup>;

/**
 * Helper render for a controlled multi-select group.
 */
const renderControlledGroup =
	(variant: "comfortable" | "compact"): GroupStory["render"] =>
	(args) => {
		const [selectedValues, setSelectedValues] = useState(
			args.selectedValues ?? [],
		);

		return (
			<CheckboxGroup
				{...args}
				variant={variant}
				selectedValues={selectedValues}
				onChange={setSelectedValues}
			/>
		);
	};

export const MultipleComfortable: GroupStory = {
	args: {
		variant: "comfortable",
	},
	render: renderControlledGroup("comfortable"),
};

export const MultipleComfortableError: GroupStory = {
	args: {
		variant: "comfortable",
		invalid: true,
		invalidText: "Select at least one notification channel.",
		selectedValues: [],
	},
	render: renderControlledGroup("comfortable"),
};

export const MultipleCompact: GroupStory = {
	args: {
		title: "Compact notification channels",
		smallDescription: "Denser layout for settings pages.",
		longDescription: "",
		variant: "compact",
	},
	render: renderControlledGroup("compact"),
};

/* --------- Single checkbox stories (using <Checkbox />) --------- */

type SingleMeta = Meta<typeof Checkbox>;
type SingleStory = StoryObj<typeof Checkbox>;

export const SingleCheckboxComfortable: SingleStory = {
	name: "Single / Comfortable",
	render: () => {
		const [checked, setChecked] = useState(false);

		return (
			<Checkbox
				label="I agree to the terms and conditions"
				description="You must accept the terms and conditions to continue."
				checked={checked}
				onChange={setChecked}
				variant="comfortable"
			/>
		);
	},
};

export const SingleCheckboxComfortableError: SingleStory = {
	name: "Single / Comfortable / Error",
	render: () => {
		const [checked, setChecked] = useState(false);

		return (
			<Checkbox
				label="I agree to the terms and conditions"
				description="You must accept the terms and conditions to continue."
				checked={checked}
				onChange={setChecked}
				variant="comfortable"
				invalid={!checked}
				invalidText={
					!checked ? "You must accept the terms and conditions." : ""
				}
			/>
		);
	},
};

export const SingleCheckboxCompact: SingleStory = {
	name: "Single / Compact",
	render: () => {
		const [checked, setChecked] = useState(true);

		return (
			<Checkbox
				label="Remember this device"
				checked={checked}
				onChange={setChecked}
				variant="compact"
			/>
		);
	},
};
