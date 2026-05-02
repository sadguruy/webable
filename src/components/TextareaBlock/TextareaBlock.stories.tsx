import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { TextareaBlock } from "./TextareaBlock";

const meta = {
  title: "Components/TextareaBlock",
  component: TextareaBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Description",
    helperText: "Add more context so your teammates understand the request.",
    placeholder: "Write here...",
    mode: "plain",
    minHeight: 140,
    invalid: false,
    disabled: false,
    required: false,
    onChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["plain", "rich"],
    },
  },
  render: (args) => (
    <div style={{ width: "420px" }}>
      <TextareaBlock {...args} />
    </div>
  ),
} satisfies Meta<typeof TextareaBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PlainAutoResize: Story = {
  args: {
    mode: "plain",
    defaultValue:
      "This textarea grows with content and keeps the same form-field structure as the rest of the library.",
  },
};

export const RichEditor: Story = {
  args: {
    mode: "rich",
    richValue:
      "<h2>Release notes</h2><p><strong>Rich mode</strong> now supports links, images, lists, and tables for more realistic editing flows.</p><ul><li>Bold text</li><li>Italic text</li><li>Bullet and numbered lists</li></ul><p><a href='https://example.com'>Read docs</a></p>",
    helperText: "Use the toolbar for headings, links, images, lists, and tables.",
  },
};

export const InvalidState: Story = {
  args: {
    mode: "plain",
    invalid: true,
    invalidText: "Please add a longer explanation before submitting this form.",
    required: true,
  },
};
