import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import Accordian, {
  AccordianItem,
  AccordianPanel,
  AccordianTitle,
} from "./Accordian";

function UpIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m5 12.5 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const meta = {
  title: "Components/Accordian",
  component: Accordian,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Accordian>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPlusMinus: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ width: "min(680px, 100%)" }}>
      <Accordian defaultOpenValues={["item-1"]}>
        <AccordianItem value="item-1">
          <AccordianTitle>Project details</AccordianTitle>
          <AccordianPanel>
            This panel can hold descriptive information, release notes, or setup instructions.
          </AccordianPanel>
        </AccordianItem>

        <AccordianItem value="item-2">
          <AccordianTitle>Team permissions</AccordianTitle>
          <AccordianPanel>
            Configure access levels and assign roles for editors, viewers, and administrators.
          </AccordianPanel>
        </AccordianItem>

        <AccordianItem value="item-3">
          <AccordianTitle>Notifications</AccordianTitle>
          <AccordianPanel>
            Choose notification channels for updates, failed tasks, and deployment reminders.
          </AccordianPanel>
        </AccordianItem>
      </Accordian>
    </div>
  ),
};

export const CustomUpDownIcons: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ width: "min(680px, 100%)" }}>
      <Accordian openIcon={<UpIcon />} closeIcon={<DownIcon />}>
        <AccordianItem value="faq-1">
          <AccordianTitle>How do I publish components?</AccordianTitle>
          <AccordianPanel>
            Run your build, bump versions, and publish the package to your configured registry.
          </AccordianPanel>
        </AccordianItem>
        <AccordianItem value="faq-2">
          <AccordianTitle>Can this be used in multiple apps?</AccordianTitle>
          <AccordianPanel>
            Yes. The component package is designed for reuse across multiple React projects.
          </AccordianPanel>
        </AccordianItem>
      </Accordian>
    </div>
  ),
};

export const MultipleOpen: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ width: "min(680px, 100%)" }}>
      <Accordian multiple defaultOpenValues={["multi-1", "multi-2"]}>
        <AccordianItem value="multi-1">
          <AccordianTitle>Design tokens</AccordianTitle>
          <AccordianPanel>Use shared tokens to keep spacing, color, and typography consistent.</AccordianPanel>
        </AccordianItem>
        <AccordianItem value="multi-2">
          <AccordianTitle>Accessibility checks</AccordianTitle>
          <AccordianPanel>Include keyboard testing and semantic roles in your component acceptance checklist.</AccordianPanel>
        </AccordianItem>
        <AccordianItem value="multi-3" disabled>
          <AccordianTitle>Legacy migrations</AccordianTitle>
          <AccordianPanel>This section is currently locked while migration work is in progress.</AccordianPanel>
        </AccordianItem>
      </Accordian>
    </div>
  ),
};

export const ControlledExample: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [openValues, setOpenValues] = useState<(string | number)[]>(["controlled-1"]);

    return (
      <div style={{ width: "min(680px, 100%)" }}>
        <Accordian openValues={openValues} onChange={setOpenValues}>
          <AccordianItem value="controlled-1">
            <AccordianTitle>Controlled state</AccordianTitle>
            <AccordianPanel>
              This accordian is controlled by React state, useful for syncing with URL or app logic.
            </AccordianPanel>
          </AccordianItem>
          <AccordianItem value="controlled-2">
            <AccordianTitle>Second panel</AccordianTitle>
            <AccordianPanel>Switching here updates the same controlled open state array.</AccordianPanel>
          </AccordianItem>
        </Accordian>
      </div>
    );
  },
};
