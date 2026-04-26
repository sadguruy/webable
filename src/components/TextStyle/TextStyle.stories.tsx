import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextStyle } from "./TextStyle";

const meta = {
  title: "Components/TextStyle",
  component: TextStyle,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    variant: "base",
    children: "This is reusable text content for Webable.",
    muted: false,
    truncate: false,
    tone: "default",
    align: "left",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "ul", "ol", "li", "label"],
    },
    variant: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "heading", "base", "fineprint", "label", "tagline", "crossed"],
    },
    tone: {
      control: "select",
      options: ["default", "muted", "success", "warning", "danger", "info"],
    },
    align: {
      control: "inline-radio",
      options: ["left", "center", "right"],
    },
    weight: {
      control: "inline-radio",
      options: ["regular", "medium", "semibold", "bold"],
    },
  },
} satisfies Meta<typeof TextStyle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Headings: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <TextStyle as="h1" variant="h1">Heading Level 1</TextStyle>
      <TextStyle as="h2" variant="h2">Heading Level 2</TextStyle>
      <TextStyle as="h3" variant="h3">Heading Level 3</TextStyle>
      <TextStyle as="h4" variant="h4">Heading Level 4</TextStyle>
      <TextStyle as="h5" variant="h5">Heading Level 5</TextStyle>
      <TextStyle as="h6" variant="h6">Heading Level 6</TextStyle>
    </div>
  ),
};

export const AliasVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <TextStyle variant="heading">Section heading alias</TextStyle>
      <TextStyle variant="base">
        Base copy alias for normal paragraphs in forms, cards, and content blocks.
      </TextStyle>
      <TextStyle variant="fineprint" muted>
        Fineprint alias for helper text, disclaimers, and low-emphasis details.
      </TextStyle>
      <TextStyle variant="label" as="label" htmlFor="example-field">
        Field label alias
      </TextStyle>
      <TextStyle variant="tagline">Fast reusable UI primitives</TextStyle>
      <TextStyle variant="crossed">$199.00</TextStyle>
    </div>
  ),
};

export const ParagraphAndSpan: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "42rem" }}>
      <TextStyle as="p" variant="base">
        Webable keeps typography consistent across React products while still letting
        teams choose the right semantic element for the job.
      </TextStyle>
      <TextStyle as="span" variant="fineprint">
        Inline metadata, helper labels, and compact UI text can share the same
        typography system.
      </TextStyle>
    </div>
  ),
};

export const Lists: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <TextStyle as="ul" variant="base">
        <li>Reusable buttons and actions</li>
        <li>Inputs, helper text, and labels</li>
        <li>Tabs and structured content patterns</li>
      </TextStyle>
      <TextStyle as="ol" variant="base">
        <li>Install the package</li>
        <li>Import the components</li>
        <li>Compose the UI in your app</li>
      </TextStyle>
    </div>
  ),
};

export const SingleListItem: Story = {
  render: () => (
    <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
      <TextStyle as="li" variant="base">
        Single list item rendered through the typography component
      </TextStyle>
    </ul>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div style={{ width: "220px" }}>
      <TextStyle truncate>
        This longer line shows how text can be visually truncated inside compact UI layouts.
      </TextStyle>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.65rem" }}>
      <TextStyle tone="default">Default product copy</TextStyle>
      <TextStyle tone="muted">Muted helper copy</TextStyle>
      <TextStyle tone="success">Profile saved successfully</TextStyle>
      <TextStyle tone="warning">Double-check these values before continuing</TextStyle>
      <TextStyle tone="danger">There was a problem submitting the form</TextStyle>
      <TextStyle tone="info">New version available for review</TextStyle>
    </div>
  ),
};

export const WeightAndAlign: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", width: "360px" }}>
      <TextStyle weight="regular" align="left">Regular left-aligned text</TextStyle>
      <TextStyle weight="medium" align="center">Medium centered text</TextStyle>
      <TextStyle weight="semibold" align="right">Semibold right-aligned text</TextStyle>
      <TextStyle weight="bold" align="left">Bold emphasis text</TextStyle>
    </div>
  ),
};

export const ClampedParagraph: Story = {
  render: () => (
    <div style={{ width: "280px" }}>
      <TextStyle as="p" clampLines={3}>
        Webable is designed for reusable interface patterns, and line clamping helps
        keep summaries, cards, and dense content layouts visually stable without
        forcing every consumer to hand-roll text overflow styles.
      </TextStyle>
    </div>
  ),
};

export const ScreenReaderOnly: Story = {
  render: () => (
    <div>
      <button type="button" aria-describedby="menu-help">
        Menu
      </button>
      <TextStyle as="span" srOnly id="menu-help">
        Opens the main navigation menu
      </TextStyle>
    </div>
  ),
};
