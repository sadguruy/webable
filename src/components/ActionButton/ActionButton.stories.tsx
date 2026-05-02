import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ActionButton } from "./index";

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 4v12M4 10h12" strokeLinecap="round" />
    </svg>
  );
}

const meta = {
  title: "Components/ActionButton",
  component: ActionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Continue",
    variant: "primary",
    width: "auto",
    size: "medium",
    shape: "bordered",
    outlined: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary", "warning", "error", "danger"],
    },
    width: {
      control: "inline-radio",
      options: ["auto", "full"],
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
    shape: {
      control: "inline-radio",
      options: ["rounded", "bordered", "square"],
    },
    outlined: {
      control: "boolean",
    },
    iconPosition: {
      control: "inline-radio",
      options: ["left", "right"],
    },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
        gap: "1rem",
        width: "min(420px, calc(100vw - 2rem))",
      }}
    >
      <ActionButton label="Default" variant="default" />
      <ActionButton label="Primary" variant="primary" />
      <ActionButton label="Secondary" variant="secondary" />
      <ActionButton label="Warning" variant="warning" />
      <ActionButton label="Error" variant="error" />
      <ActionButton label="Danger" variant="danger" />
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    label: "Add item",
    icon: <PlusIcon />,
    variant: "primary",
  },
};

export const WithIconUrl: Story = {
  args: {
    label: "Brand action",
    iconSrc: "/webable-logo.png",
    iconAlt: "Webable",
    variant: "secondary",
  },
};

export const IconRight: Story = {
  args: {
    label: "Next step",
    icon: <PlusIcon />,
    iconPosition: "right",
    variant: "secondary",
  },
};

export const ExternalLink: Story = {
  args: {
    elementType: "link",
    href: "https://example.com",
    target: "_blank",
    label: "Open docs",
    variant: "primary",
    iconPosition: "right",
    icon: <PlusIcon />,
  },
};

export const OutlinedSquare: Story = {
  args: {
    label: "Delete",
    variant: "danger",
    outlined: true,
    shape: "square",
  },
};

export const RoundedPill: Story = {
  args: {
    label: "Pill action",
    variant: "primary",
    shape: "rounded",
  },
};

export const BorderedDefault: Story = {
  args: {
    label: "Soft corners",
    variant: "default",
    shape: "bordered",
  },
};

export const FullWidth: Story = {
  args: {
    label: "Create account",
    width: "full",
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <ActionButton {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Disabled action",
    disabled: true,
    variant: "default",
  },
};
