import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./Divider";

const meta = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    orientation: "horizontal",
    tone: "default",
    thickness: 1,
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    tone: {
      control: "inline-radio",
      options: ["subtle", "default", "strong"],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    tone: "default",
    length: "100%",
  },
  render: (args) => (
    <div style={{ width: "420px" }}>
      <div style={{ paddingBottom: "1rem" }}>Section above</div>
      <Divider {...args} />
      <div style={{ paddingTop: "1rem" }}>Section below</div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    tone: "strong",
    length: 72,
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        height: "96px",
      }}
    >
      <span>Left block</span>
      <Divider {...args} />
      <span>Right block</span>
    </div>
  ),
};
