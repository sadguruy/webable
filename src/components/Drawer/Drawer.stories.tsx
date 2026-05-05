import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ActionButton } from "../ActionButton";
import Drawer, { DrawerBody, DrawerCloseButton, DrawerFooter } from "./Drawer";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RightDrawer: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ padding: "2rem" }}>
        <ActionButton label="Open Drawer" onClick={() => setOpen(true)} />

        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Edit workspace"
          width={460}
          placement="right"
        >
          <DrawerBody>
            Use this panel for forms, details, and side-by-side tasks without leaving the current page context.
          </DrawerBody>
          <DrawerFooter>
            <DrawerCloseButton>Cancel</DrawerCloseButton>
            <ActionButton label="Save changes" variant="primary" />
          </DrawerFooter>
        </Drawer>
      </div>
    );
  },
};

export const LeftDrawer: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ padding: "2rem" }}>
        <ActionButton label="Open Left Drawer" onClick={() => setOpen(true)} />

        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Navigation"
          width={360}
          placement="left"
        >
          <DrawerBody>
            This placement is useful for side navigation, filters, or secondary app panels.
          </DrawerBody>
          <DrawerFooter>
            <DrawerCloseButton>Close</DrawerCloseButton>
          </DrawerFooter>
        </Drawer>
      </div>
    );
  },
};

export const EscAndOverlayClose: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ padding: "2rem" }}>
        <ActionButton label="Try Esc / Overlay Close" onClick={() => setOpen(true)} />

        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Dismiss behavior"
          width={420}
          closeOnEsc
          closeOnOverlayClick
        >
          <DrawerBody>
            Press Escape or click outside the panel to close this drawer.
          </DrawerBody>
          <DrawerFooter>
            <DrawerCloseButton>Done</DrawerCloseButton>
          </DrawerFooter>
        </Drawer>
      </div>
    );
  },
};
