import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Carousel, {
  CarouselBody,
  CarouselEvents,
  CarouselImg,
  CarouselItem,
  CarouselTitle,
} from "./Carousel";
import { TextStyle } from "../TextStyle";

const cards = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    title: "Engineering",
    body: "Build scalable product features with reusable patterns.",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    title: "Collaboration",
    body: "Keep teams aligned across design and development workflows.",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80",
    title: "Planning",
    body: "Organize tasks and priorities with clean component structures.",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    title: "Delivery",
    body: "Ship consistent interfaces faster across multiple products.",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
    title: "Analytics",
    body: "Track adoption and optimize user experience with confidence.",
  },
];

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    itemsPerView: { xs: 1, sm: 2, md: 3, lg: 4 },
    itemsPerSlide: 1,
    showNav: true,
    showDots: true,
    autoPlay: false,
    pauseOnHover: true,
    fillLoopItems: true,
    onPageChange: fn(),
    children: null,
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoItems = cards.map((card) => (
  <CarouselItem key={card.id}>
    <CarouselImg src={card.image} alt={card.title} />
    <CarouselTitle>
      <TextStyle as="span" variant="h5" weight="semibold">
        {card.title}
      </TextStyle>
    </CarouselTitle>
    <CarouselBody>
      <TextStyle as="p" variant="base" tone="muted">
        {card.body}
      </TextStyle>
    </CarouselBody>
    <CarouselEvents>
      <a href="#">Open</a>
    </CarouselEvents>
  </CarouselItem>
));

export const Playground: Story = {
  render: (args) => (
    <Carousel {...args}>{demoItems}</Carousel>
  ),
};

export const AutoPlay: Story = {
  args: {
    autoPlay: true,
    autoPlayIntervalMs: 3000,
  },
  render: (args) => (
    <Carousel {...args}>{demoItems}</Carousel>
  ),
};

export const WithoutDotsAndNav: Story = {
  args: {
    showNav: false,
    showDots: false,
  },
  render: (args) => (
    <Carousel {...args}>{demoItems}</Carousel>
  ),
};

export const SlideOneByOne: Story = {
  args: {
    itemsPerView: { xs: 1, sm: 2, md: 3, lg: 4 },
    itemsPerSlide: 1,
    loop: true,
    fillLoopItems: true,
  },
  render: (args) => (
    <Carousel {...args}>{demoItems}</Carousel>
  ),
};
