import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { StatusAlert } from "./StatusAlert";

const meta = {
  title: "Components/StatusAlert",
  component: StatusAlert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Changes saved",
    message: "Your data was updated successfully.",
    tone: "success",
    position: "static",
    placement: "top-right",
    offset: 16,
    closable: true,
    onClose: fn(),
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["success", "error", "warning", "info"],
    },
    position: {
      control: "inline-radio",
      options: ["static", "absolute", "fixed"],
    },
    placement: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
  },
  render: (args) => (
    <div style={{ width: "min(560px, 100%)" }}>
      <StatusAlert {...args} />
    </div>
  ),
} satisfies Meta<typeof StatusAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SuccessCreate: Story = {
  args: {
    title: "Record created",
    message: "The customer profile was created successfully.",
    tone: "success",
  },
};

export const ErrorDelete: Story = {
  args: {
    title: "Delete failed",
    message: "We could not delete this record. Please try again in a moment.",
    tone: "error",
  },
};

export const WarningUpdate: Story = {
  args: {
    title: "Partial update",
    message: "Most changes were saved, but one optional field could not be updated.",
    tone: "warning",
  },
};

export const AutoClose: Story = {
  args: {
    title: "Upload complete",
    message: "The image was uploaded successfully and this alert will close automatically.",
    tone: "success",
    autoCloseSeconds: 4,
  },
};

export const ManualOnly: Story = {
  args: {
    title: "API unavailable",
    message: "The service is temporarily unavailable. Close this alert after reviewing the message.",
    tone: "error",
    autoCloseSeconds: undefined,
    closable: true,
  },
};

export const FixedTopRight: Story = {
  args: {
    title: "Saved",
    message: "This alert is floating in a fixed position.",
    tone: "success",
    position: "fixed",
    placement: "top-right",
  },
  render: (args) => (
    <div style={{ minHeight: "220px", position: "relative" }}>
      <StatusAlert {...args} />
    </div>
  ),
};

export const AbsoluteBottomCenter: Story = {
  args: {
    title: "Update failed",
    message: "This alert is positioned absolutely inside a relative container.",
    tone: "error",
    position: "absolute",
    placement: "bottom-center",
  },
  render: (args) => (
    <div
      style={{
        minHeight: "260px",
        position: "relative",
        border: "1px dashed #cbd5e1",
        borderRadius: "12px",
      }}
    >
      <StatusAlert {...args} />
    </div>
  ),
};
