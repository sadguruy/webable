import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ActionLists, ActionListsGroup } from "./ActionLists";

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" />
      <path
        d="M10 2.8v1.4M10 15.8v1.4M4.9 4.9l1 1M14.1 14.1l1 1M2.8 10h1.4M15.8 10h1.4M4.9 15.1l1-1M14.1 5.9l1-1"
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/ActionLists",
  component: ActionLists,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Account settings",
    helperText: "Manage your profile, security, and workspace preferences.",
    elementType: "button",
    onClick: fn(),
  },
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["button", "link"],
    },
  },
  render: (args) => (
    <div style={{ width: "min(540px, 100%)" }}>
      <ActionLists {...args} />
    </div>
  ),
} satisfies Meta<typeof ActionLists>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithReactIcon: Story = {
  args: {
    title: "Workspace settings",
    helperText: "Review naming, region, permissions, and workspace rules.",
    icon: <GearIcon />,
  },
};

export const WithImageIcon: Story = {
  args: {
    title: "Brand assets",
    helperText: "Update your logo, cover image, and public brand settings.",
    iconSrc: "/webable-logo.png",
    iconAlt: "Webable",
  },
};

export const WithSpriteIcon: Story = {
  args: {
    title: "Documentation",
    helperText: "Open guides, references, and integration examples.",
    spritePath: "/icons.svg",
    spriteIconId: "documentation-icon",
  },
};

export const AsLink: Story = {
  args: {
    elementType: "link",
    href: "https://example.com",
    target: "_blank",
    title: "Billing portal",
    helperText: "View invoices, subscriptions, and payment methods.",
    icon: <GearIcon />,
  },
};

export const ComfortableGroup: Story = {
  render: () => (
    <div style={{ width: "min(540px, 100%)" }}>
      <ActionListsGroup variant="comfortable">
        <ActionLists
          title="Profile"
          helperText="Edit your public and private account details."
          icon={<GearIcon />}
        />
        <ActionLists
          title="Notifications"
          helperText="Manage email, push, and in-app notification preferences."
          spritePath="/icons.svg"
          spriteIconId="documentation-icon"
        />
        <ActionLists
          title="Billing"
          helperText="Review invoices, plans, and payment methods."
          elementType="link"
          href="https://example.com"
          target="_blank"
          iconSrc="/webable-logo.png"
          iconAlt="Webable"
        />
      </ActionListsGroup>
    </div>
  ),
};

export const NormalGroup: Story = {
  render: () => (
    <div style={{ width: "min(540px, 100%)", background: "#ffffff" }}>
      <ActionListsGroup variant="normal">
        <ActionLists
          title="Security"
          helperText="Passwords, devices, and sign-in activity."
          icon={<GearIcon />}
        />
        <ActionLists
          title="Connected apps"
          helperText="Review tools and third-party integrations."
          icon={<GearIcon />}
        />
        <ActionLists
          title="Help center"
          helperText="Documentation, guides, and support resources."
          elementType="link"
          href="https://example.com"
          target="_blank"
          icon={<GearIcon />}
        />
      </ActionListsGroup>
    </div>
  ),
};
