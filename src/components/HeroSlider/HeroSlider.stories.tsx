import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import HeroSlider, { HeroSlide, SliderBody, SliderEvents, SliderSubTitle, SliderTitle } from "./HeroSlider";

const slides = [
  {
    id: "slide-1",
    imageSrc: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Developer workspace",
    subtitle: "Webable UI",
    title: "Build reusable interfaces faster",
    content1: "Compose consistent UI patterns across your React products without repeating layout work.",
    content2: "Ship polished experiences with component-driven workflows.",
    actions: [
      { label: "Get Started", href: "#", variant: "primary" as const },
      { label: "View Docs", href: "#", variant: "secondary" as const },
    ],
  },
  {
    id: "slide-2",
    imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Team collaboration meeting",
    subtitle: "Collaboration",
    title: "Keep your team aligned",
    content1: "Use predictable component APIs so designers and developers move together with less friction.",
    content2: "Document every variant in Storybook for fast handoff and review.",
    actions: [{ label: "Explore Components", href: "#", variant: "primary" as const }],
  },
  {
    id: "slide-3",
    imageSrc: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Analytics dashboard",
    subtitle: "Scale",
    title: "Grow confidently with shared UI",
    content1: "Adopt components once and reuse them across dashboards, admin tools, and customer-facing apps.",
    content2: "Reduce style drift while keeping your UI flexible.",
    actions: [{ label: "See Changelog", href: "#", variant: "secondary" as const }],
  },
];

const meta = {
  title: "Components/HeroSlider",
  component: HeroSlider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    slides,
    showNavButtons: true,
    showDots: true,
    autoPlay: false,
    autoPlayIntervalMs: 5000,
    pauseOnHover: true,
    contentPosition: "bottom-left",
    onSlideChange: fn(),
  },
} satisfies Meta<typeof HeroSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AutoPlay: Story = {
  args: {
    autoPlay: true,
    autoPlayIntervalMs: 3500,
  },
};

export const CenteredContent: Story = {
  args: {
    contentPosition: "middle-center",
  },
};

export const WithoutDotsOrNav: Story = {
  args: {
    showNavButtons: false,
    showDots: false,
  },
};

export const ComposedChildrenApi: Story = {
  args: {
    slides: undefined,
    showNavButtons: true,
    showDots: true,
    contentPosition: "bottom-left",
  },
  render: (args) => (
    <HeroSlider {...args}>
      <HeroSlide
        id="composed-1"
        imageSrc="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80"
        imageAlt="Developer desk"
      >
        <SliderSubTitle>Webable UI</SliderSubTitle>
        <SliderTitle>Compose slides as children</SliderTitle>
        <SliderBody slot="content1">Use semantic child components instead of a slides array.</SliderBody>
        <SliderBody slot="content2">Great when slide content gets richer than plain strings.</SliderBody>
        <SliderEvents>
          <a href="#" className="hero-slider__action hero-slider__action--primary">Start</a>
          <a href="#" className="hero-slider__action hero-slider__action--secondary">Learn more</a>
        </SliderEvents>
      </HeroSlide>

      <HeroSlide
        id="composed-2"
        imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
        imageAlt="Team collaboration"
      >
        <SliderSubTitle>Collaboration</SliderSubTitle>
        <SliderTitle>Child API works with all slider controls</SliderTitle>
        <SliderBody>Navigation buttons and dots still behave exactly the same.</SliderBody>
        <SliderEvents>
          <a href="#" className="hero-slider__action hero-slider__action--primary">Explore</a>
        </SliderEvents>
      </HeroSlide>
    </HeroSlider>
  ),
};
