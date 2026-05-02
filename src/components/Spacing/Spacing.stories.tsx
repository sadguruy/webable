import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spacing } from "./Spacing";

function DemoBox({ label }: { label: string }) {
  return (
    <div
      style={{
        borderRadius: "12px",
        border: "1px solid #dbe7ee",
        background: "#f8fafc",
        padding: "1rem",
        color: "#14213d",
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

const meta = {
  title: "Components/Spacing",
  component: Spacing,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    mode: "padding",
    all: 8,
    mobileScale: 0.5,
    children: <DemoBox label="Spacing wrapper content" />,
  },
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["padding", "margin"],
    },
  },
} satisfies Meta<typeof Spacing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const UniformPadding: Story = {
  args: {
    all: 12,
    children: <DemoBox label="12 steps = 3rem desktop, 1.5rem mobile" />,
  },
};

export const MixedSides: Story = {
  args: {
    top: 8,
    right: 16,
    bottom: 24,
    left: 6,
    children: <DemoBox label="Top / right / bottom / left spacing" />,
  },
};

export const MarginMode: Story = {
  render: () => (
    <div style={{ border: "1px dashed #cbd5e1", borderRadius: "14px" }}>
      <Spacing mode="margin" all={10}>
        <DemoBox label="Margin wrapper pushing away from the parent edges" />
      </Spacing>
    </div>
  ),
};

export const ResponsiveScale: Story = {
  args: {
    top: 16,
    x: 12,
    bottom: 20,
    mobileScale: 0.5,
    children: <DemoBox label="Desktop spacing scales down automatically on mobile" />,
  },
};
