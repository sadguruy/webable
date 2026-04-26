import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Full name",
    type: "text",
    placeholder: "Enter your name",
    helperText: "Use your real name for profile and billing records.",
    fullWidth: true,
    invalid: false,
    disabled: false,
    required: false,
    onChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "number",
        "password",
        "search",
        "tel",
        "url",
        "date",
        "time",
        "datetime-local",
        "month",
        "week",
        "color",
      ],
    },
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <TextField {...args} />
    </div>
  ),
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EmailField: Story = {
  args: {
    label: "Email address",
    type: "email",
    placeholder: "name@company.com",
    helperText: "We will use this for account updates and login recovery.",
    autoComplete: "email",
  },
};

export const NumberField: Story = {
  args: {
    label: "Team size",
    type: "number",
    placeholder: "25",
    helperText: "Used for workspace setup recommendations.",
    min: 1,
  },
};

export const InvalidState: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Create a strong password",
    invalid: true,
    invalidText: "Password must include at least 8 characters and one special symbol.",
    helperText: "Use a secure password for your account.",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Workspace ID",
    placeholder: "Generated automatically",
    disabled: true,
    value: "wb-001024",
    helperText: "This value cannot be changed after creation.",
  },
};

export const RequiredField: Story = {
  args: {
    label: "Project name",
    required: true,
    placeholder: "Webable UI System",
  },
};
