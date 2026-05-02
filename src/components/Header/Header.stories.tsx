import type { Meta, StoryObj } from "@storybook/react-vite";

import { Header, type HeaderNavItem } from "./Header";

const navItems: HeaderNavItem[] = [
  { label: "Home", href: "#" },
  {
    label: "Components",
    children: [
      { label: "ActionButton", href: "#" },
      { label: "TextField", href: "#" },
      { label: "SelectFiled", href: "#" },
      { label: "ImageUpload", href: "#" },
    ],
  },
  {
    label: "Documentation",
    children: [
      { label: "Get Started", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Accessibility", href: "#", target: "_blank" },
    ],
  },
  { label: "Pricing", href: "#" },
];

const meta = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    logoSrc: "/webable-logo.png",
    logoAlt: "Webable logo",
    homeHref: "#",
    navItems,
  },
  render: (args) => (
    <div style={{ minHeight: "220px", background: "#f8fafc" }}>
      <Header {...args} />
    </div>
  ),
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CustomBrand: Story = {
  args: {
    brand: (
      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
        <img
          src="/webable-logo.png"
          alt="Webable logo"
          style={{ height: "34px", width: "auto", display: "block" }}
        />
        <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Webable UI</span>
      </div>
    ),
  },
};
