import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ImageUpload } from "./ImageUpload";

const meta = {
  title: "Components/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Profile image",
    helperText: "Upload a JPG, PNG, or WebP image for your public profile.",
    buttonText: "Choose image",
    invalid: false,
    disabled: false,
    required: false,
    fullWidth: true,
    accept: "image/*",
    onChange: fn(),
  },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <ImageUpload {...args} />
    </div>
  ),
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithPreview: Story = {
  args: {
    label: "Workspace logo",
    helperText: "Preview uses the current image until a new file is selected.",
    previewUrl: "/webable-logo.png",
    previewAlt: "Current workspace logo",
    buttonText: "Replace image",
  },
};

export const InvalidState: Story = {
  args: {
    label: "Cover image",
    helperText: "Recommended size 1600 x 900 pixels.",
    invalid: true,
    invalidText: "Please upload a valid image file under 5 MB.",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Avatar",
    helperText: "Image uploads are locked for this workspace.",
    previewUrl: "/webable-logo.png",
    disabled: true,
  },
};
