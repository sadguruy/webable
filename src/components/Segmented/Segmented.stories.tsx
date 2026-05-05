import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import Segmented, { TabPanel, TabTitle } from "./Segmented";

const meta = {
  title: "Components/Segmented",
  component: Segmented,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultFirstTab: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ width: "min(720px, 100%)" }}>
      <Segmented>
        <TabTitle value="overview">Overview</TabTitle>
        <TabTitle value="activity">Activity</TabTitle>
        <TabTitle value="settings">Settings</TabTitle>

        <TabPanel value="overview">
          Overview content. Since no active tab is passed, the first tab is selected by default.
        </TabPanel>
        <TabPanel value="activity">
          Recent activity with events, updates, and timeline details.
        </TabPanel>
        <TabPanel value="settings">
          Settings panel content for account preferences and permissions.
        </TabPanel>
      </Segmented>
    </div>
  ),
};

export const ControlledActiveTab: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [active, setActive] = useState<string | number>("pricing");

    return (
      <div style={{ width: "min(720px, 100%)" }}>
        <Segmented activeTab={active} onTabChange={setActive}>
          <TabTitle value="pricing">Pricing</TabTitle>
          <TabTitle value="billing">Billing</TabTitle>
          <TabTitle value="history">History</TabTitle>

          <TabPanel value="pricing">Pricing details and selected plan information.</TabPanel>
          <TabPanel value="billing">Billing setup, payment methods, and invoice details.</TabPanel>
          <TabPanel value="history">Payment history and subscription events timeline.</TabPanel>
        </Segmented>
      </div>
    );
  },
};

export const DisabledTab: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ width: "min(720px, 100%)" }}>
      <Segmented>
        <TabTitle value="current">Current sprint</TabTitle>
        <TabTitle value="next" disabled>
          Next sprint
        </TabTitle>
        <TabTitle value="archive">Archive</TabTitle>

        <TabPanel value="current">Current sprint goals and progress tracking.</TabPanel>
        <TabPanel value="next">This content is locked until planning is complete.</TabPanel>
        <TabPanel value="archive">Archived sprint notes and completed outcomes.</TabPanel>
      </Segmented>
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ width: "min(720px, 100%)" }}>
      <Segmented fullWidth>
        <TabTitle value="team">Team</TabTitle>
        <TabTitle value="projects">Projects</TabTitle>
        <TabTitle value="integrations">Integrations</TabTitle>
        <TabTitle value="security">Security</TabTitle>

        <TabPanel value="team">Team members, ownership, and role assignments.</TabPanel>
        <TabPanel value="projects">Project list and status at a glance.</TabPanel>
        <TabPanel value="integrations">Connected services and API key management.</TabPanel>
        <TabPanel value="security">Authentication policy and access controls.</TabPanel>
      </Segmented>
    </div>
  ),
};
