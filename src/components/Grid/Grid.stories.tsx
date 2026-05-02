import type { Meta, StoryObj } from "@storybook/react-vite";

import { Column, Grid } from "./Grid";

function DemoBlock({ label }: { label: string }) {
  return (
    <div
      style={{
        minHeight: "72px",
        borderRadius: "12px",
        border: "1px solid #dbe7ee",
        background: "#f8fafc",
        display: "grid",
        placeItems: "center",
        color: "#14213d",
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

const meta = {
  title: "Components/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FixedContainer: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Grid container="fixed" gap="md">
      <Column xs={12} md={8}>
        <DemoBlock label="xs=12 md=8" />
      </Column>
      <Column xs={12} md={4}>
        <DemoBlock label="xs=12 md=4" />
      </Column>
      <Column xs={12} sm={6} lg={3}>
        <DemoBlock label="xs=12 sm=6 lg=3" />
      </Column>
      <Column xs={12} sm={6} lg={3}>
        <DemoBlock label="xs=12 sm=6 lg=3" />
      </Column>
      <Column xs={12} sm={6} lg={3}>
        <DemoBlock label="xs=12 sm=6 lg=3" />
      </Column>
      <Column xs={12} sm={6} lg={3}>
        <DemoBlock label="xs=12 sm=6 lg=3" />
      </Column>
    </Grid>
  ),
};

export const FluidContainer: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Grid container="fluid" gap="lg">
      <Column xs={12} md={6} lg={7}>
        <DemoBlock label="Fluid content area" />
      </Column>
      <Column xs={12} md={6} lg={5}>
        <DemoBlock label="Fluid side panel" />
      </Column>
    </Grid>
  ),
};
