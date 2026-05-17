import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Datepicker from "./Datepicker";

const meta = {
  title: "Components/Datepicker",
  component: Datepicker,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Datepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PopupDefault: Story = {
  args: {
    mode: "popup",
    label: "Select due date",
    helperText: "Click input to open calendar popup",
    onChange: fn(),
    onFocusedDateChange: fn(),
    onVisibleMonthChange: fn(),
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Datepicker {...args} />
    </div>
  ),
};

export const InlineCalendar: Story = {
  args: {
    mode: "inline",
    label: "Inline calendar",
    helperText: "Direct component view without popup trigger",
    onChange: fn(),
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Datepicker {...args} />
    </div>
  ),
};

export const ControlledSelection: Story = {
  args: {
    mode: "popup",
    label: "Controlled date",
    helperText: "Active selected value is controlled by state",
  },
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div style={{ width: "320px" }}>
        <Datepicker
          {...args}
          value={date}
          onChange={(nextDate) => setDate(nextDate)}
        />
      </div>
    );
  },
};

export const WithMinMaxRange: Story = {
  args: {
    mode: "popup",
    label: "Date range constrained",
    helperText: "Only current month dates are selectable",
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Datepicker {...args} />
    </div>
  ),
};
