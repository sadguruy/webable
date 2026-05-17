import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ActionButton } from "../ActionButton";
import ModelDialog, {
  ModelDialogBody,
  ModelDialogCloseButton,
  ModelDialogFooter,
  ModelDialogHeader,
  ModelDialogPrimaryButton,
  ModelDialogTitle,
} from "./ModelDialog";

const meta = {
  title: "Components/ModelDialog",
  component: ModelDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    showCloseButton: true,
  },
  argTypes: {
    showCloseButton: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ModelDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoDialog({
  size = "md",
  variant = "alert",
  showFooter = true,
}: {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "alert" | "success" | "error" | "warning";
  showFooter?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <ActionButton label="Open Dialog" onClick={() => setOpen(true)} />
      <ModelDialog
        open={open}
        onOpenChange={setOpen}
        size={size}
        variant={variant}
        showFooter={showFooter}
      >
        <ModelDialogHeader>
          <ModelDialogTitle>{variant[0].toUpperCase() + variant.slice(1)} dialog</ModelDialogTitle>
        </ModelDialogHeader>

        <ModelDialogBody>
          This dialog supports backdrop click, escape key close, close icon, and variant-based color styling.
        </ModelDialogBody>

        {showFooter ? (
          <ModelDialogFooter>
            <ModelDialogCloseButton>Cancel</ModelDialogCloseButton>
            <ModelDialogPrimaryButton onClick={() => setOpen(false)}>
              Confirm
            </ModelDialogPrimaryButton>
          </ModelDialogFooter>
        ) : null}
      </ModelDialog>
    </div>
  );
}

export const AlertDefault: Story = {
  args: {
    children: null,
  },
  render: () => <DemoDialog variant="alert" size="md" />,
};

export const ComposedUsage: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ padding: "2rem" }}>
        <ActionButton label="Open Composed Dialog" onClick={() => setOpen(true)} />

        <ModelDialog
          open={open}
          onOpenChange={setOpen}
          size="md"
          variant="alert"
          showFooter
        >
          <ModelDialogHeader>
            <ModelDialogTitle>Delete project?</ModelDialogTitle>
          </ModelDialogHeader>

          <ModelDialogBody>
            This is where you put your body content. You can render text, forms, lists, or any custom JSX.
          </ModelDialogBody>

          <ModelDialogFooter>
            <ModelDialogCloseButton>Keep project</ModelDialogCloseButton>
            <ModelDialogPrimaryButton onClick={() => setOpen(false)}>
              Delete project
            </ModelDialogPrimaryButton>
          </ModelDialogFooter>
        </ModelDialog>
      </div>
    );
  },
};

export const SuccessSmall: Story = {
  args: {
    children: null,
  },
  render: () => <DemoDialog variant="success" size="sm" />,
};

export const ErrorLarge: Story = {
  args: {
    children: null,
  },
  render: () => <DemoDialog variant="error" size="lg" />,
};

export const WarningNoFooter: Story = {
  args: {
    children: null,
  },
  render: () => <DemoDialog variant="warning" size="sm" showFooter={false} />,
};

export const ExtraSmall: Story = {
  args: {
    children: null,
  },
  render: () => <DemoDialog variant="alert" size="xs" />,
};

export const WithoutTopCloseButton: Story = {
  args: {
    children: null,
    showCloseButton: false,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ padding: "2rem" }}>
        <ActionButton label="Open Dialog Without Top Close" onClick={() => setOpen(true)} />
        <ModelDialog
          open={open}
          onOpenChange={setOpen}
          size="sm"
          variant="warning"
          showCloseButton={false}
        >
          <ModelDialogHeader>
            <ModelDialogTitle>Confirm action</ModelDialogTitle>
          </ModelDialogHeader>
          <ModelDialogBody>
            The top-right close icon is hidden in this variant. Users can still close via footer buttons,
            backdrop click, or Esc (if enabled).
          </ModelDialogBody>
          <ModelDialogFooter>
            <ModelDialogCloseButton>Cancel</ModelDialogCloseButton>
            <ModelDialogPrimaryButton onClick={() => setOpen(false)}>
              Continue
            </ModelDialogPrimaryButton>
          </ModelDialogFooter>
        </ModelDialog>
      </div>
    );
  },
};
