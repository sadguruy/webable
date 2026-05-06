import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import "./styles.css";

export type HeroSliderContentPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface HeroSliderAction {
  label: string;
  href: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
  variant?: "primary" | "secondary";
}

export interface HeroSliderSlide {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  content1?: string;
  content2?: string;
  actions?: HeroSliderAction[];
}

export interface HeroSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  slides?: HeroSliderSlide[];
  children?: ReactNode;
  initialIndex?: number;
  showNavButtons?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
  pauseOnHover?: boolean;
  height?: string | number;
  contentPosition?: HeroSliderContentPosition;
  onSlideChange?: (index: number) => void;
}

export interface HeroSlideProps {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  children?: ReactNode;
}

export interface SliderTitleProps {
  children: ReactNode;
}

export interface SliderSubTitleProps {
  children: ReactNode;
}

export interface SliderBodyProps {
  children: ReactNode;
  slot?: "content1" | "content2";
}

export interface SliderEventsProps {
  children: ReactNode;
}

type MarkerType = "hero-slide" | "slider-title" | "slider-subtitle" | "slider-body" | "slider-events";

interface TypedComponent<P> {
  (props: P): ReactElement | null;
  __heroMarker?: MarkerType;
}

export const HeroSlide: TypedComponent<HeroSlideProps> = () => null;
HeroSlide.__heroMarker = "hero-slide";

export const SliderTitle: TypedComponent<SliderTitleProps> = () => null;
SliderTitle.__heroMarker = "slider-title";

export const SliderSubTitle: TypedComponent<SliderSubTitleProps> = () => null;
SliderSubTitle.__heroMarker = "slider-subtitle";

export const SliderBody: TypedComponent<SliderBodyProps> = () => null;
SliderBody.__heroMarker = "slider-body";

export const SliderEvents: TypedComponent<SliderEventsProps> = () => null;
SliderEvents.__heroMarker = "slider-events";

function getMarker(node: ReactNode): MarkerType | null {
  if (!isValidElement(node)) {
    return null;
  }
  const typed = node.type as TypedComponent<unknown>;
  return typed.__heroMarker ?? null;
}

function extractText(children: ReactNode) {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  return "";
}

function normalizeSlides(slides: HeroSliderSlide[] | undefined, children: ReactNode): HeroSliderSlide[] {
  if (slides?.length) {
    return slides;
  }

  const heroSlides = Children.toArray(children).filter(
    (node) => getMarker(node) === "hero-slide",
  ) as ReactElement<HeroSlideProps>[];

  return heroSlides.map((slideNode) => {
    const fragments = Children.toArray(slideNode.props.children);
    let title = "";
    let subtitle = "";
    let content1 = "";
    let content2 = "";
    let events: ReactNode = null;

    fragments.forEach((fragment) => {
      const marker = getMarker(fragment);
      if (!marker || !isValidElement(fragment)) return;
      const typedFragment = fragment as ReactElement<{
        children?: ReactNode;
        slot?: "content1" | "content2";
      }>;

      if (marker === "slider-title") title = extractText(typedFragment.props.children);
      if (marker === "slider-subtitle") subtitle = extractText(typedFragment.props.children);
      if (marker === "slider-body") {
        const slot = typedFragment.props.slot ?? (content1 ? "content2" : "content1");
        if (slot === "content1") content1 = extractText(typedFragment.props.children);
        else content2 = extractText(typedFragment.props.children);
      }
      if (marker === "slider-events") events = typedFragment.props.children;
    });

    return {
      id: slideNode.props.id,
      imageSrc: slideNode.props.imageSrc,
      imageAlt: slideNode.props.imageAlt,
      title,
      subtitle,
      content1,
      content2,
      // preserve classic actions support if needed; child events handled separately at render time
      actions: undefined,
      // store custom events on object via symbol-like cast
      ...(events ? ({ __eventsNode: events } as unknown as object) : {}),
    } as HeroSliderSlide & { __eventsNode?: ReactNode };
  });
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {direction === "left" ? (
        <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function normalizeStartIndex(index: number, total: number) {
  if (total === 0) return 0;
  return Math.min(Math.max(index, 0), total - 1);
}

export function HeroSlider({
  slides,
  children,
  initialIndex = 0,
  showNavButtons = true,
  showDots = true,
  autoPlay = false,
  autoPlayIntervalMs = 5000,
  pauseOnHover = true,
  height = "460px",
  contentPosition = "bottom-left",
  onSlideChange,
  className = "",
  ...props
}: HeroSliderProps) {
  const normalizedSlides = useMemo(() => normalizeSlides(slides, children), [slides, children]);

  const [activeIndex, setActiveIndex] = useState(() =>
    normalizeStartIndex(initialIndex, normalizedSlides.length),
  );
  const [isPaused, setIsPaused] = useState(false);

  const containerStyle = useMemo(
    () => ({
      height: typeof height === "number" ? `${height}px` : height,
    }),
    [height],
  );

  const goTo = (nextIndex: number) => {
    if (normalizedSlides.length === 0) return;
    const normalized = ((nextIndex % normalizedSlides.length) + normalizedSlides.length) % normalizedSlides.length;
    setActiveIndex(normalized);
    onSlideChange?.(normalized);
  };

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  useEffect(() => {
    if (!autoPlay || isPaused || normalizedSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => {
        const next = (previous + 1) % normalizedSlides.length;
        onSlideChange?.(next);
        return next;
      });
    }, autoPlayIntervalMs);

    return () => window.clearInterval(timer);
  }, [autoPlay, isPaused, normalizedSlides.length, autoPlayIntervalMs, onSlideChange]);

  useEffect(() => {
    setActiveIndex(normalizeStartIndex(initialIndex, normalizedSlides.length));
  }, [initialIndex, normalizedSlides.length]);

  if (!normalizedSlides.length) return null;

  const classes = ["hero-slider", className].filter(Boolean).join(" ");

  return (
    <section
      className={classes}
      style={containerStyle}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slider"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goPrev();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goNext();
        }
      }}
      tabIndex={0}
      {...props}
    >
      <div className="hero-slider__track">
        {normalizedSlides.map((slide, index) => {
          const customEvents = (slide as HeroSliderSlide & { __eventsNode?: ReactNode }).__eventsNode;
          return (
            <article
              key={slide.id}
              className={`hero-slider__slide ${index === activeIndex ? "is-active" : ""}`}
              aria-hidden={index !== activeIndex}
            >
              <img
                src={slide.imageSrc}
                alt={slide.imageAlt ?? slide.title ?? "Hero image"}
                className="hero-slider__image"
              />
              <div className="hero-slider__overlay" />

              <div className={`hero-slider__content hero-slider__content--${contentPosition}`}>
                {slide.subtitle ? <p className="hero-slider__subtitle">{slide.subtitle}</p> : null}
                {slide.title ? <h2 className="hero-slider__title">{slide.title}</h2> : null}
                {slide.content1 ? <p className="hero-slider__text">{slide.content1}</p> : null}
                {slide.content2 ? <p className="hero-slider__text hero-slider__text--secondary">{slide.content2}</p> : null}

                {customEvents ? (
                  <div className="hero-slider__actions">{customEvents}</div>
                ) : slide.actions?.length ? (
                  <div className="hero-slider__actions">
                    {slide.actions.map((action) => (
                      <a
                        key={`${slide.id}-${action.label}`}
                        href={action.href}
                        target={action.target}
                        rel={action.target === "_blank" ? "noopener noreferrer" : undefined}
                        className={`hero-slider__action hero-slider__action--${action.variant ?? "primary"}`}
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {showNavButtons && normalizedSlides.length > 1 ? (
        <>
          <button type="button" className="hero-slider__nav hero-slider__nav--prev" aria-label="Previous slide" onClick={goPrev}>
            <ChevronIcon direction="left" />
          </button>
          <button type="button" className="hero-slider__nav hero-slider__nav--next" aria-label="Next slide" onClick={goNext}>
            <ChevronIcon direction="right" />
          </button>
        </>
      ) : null}

      {showDots && normalizedSlides.length > 1 ? (
        <div className="hero-slider__dots" role="tablist" aria-label="Slide navigation">
          {normalizedSlides.map((slide, index) => (
            <button
              key={`${slide.id}-dot`}
              type="button"
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === activeIndex}
              className={`hero-slider__dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

interface HeroSliderStatic {
  Slide: typeof HeroSlide;
  SliderTitle: typeof SliderTitle;
  SliderSubTitle: typeof SliderSubTitle;
  SliderBody: typeof SliderBody;
  SliderEvents: typeof SliderEvents;
}

const HeroSliderWithStatic = HeroSlider as typeof HeroSlider & HeroSliderStatic;
HeroSliderWithStatic.Slide = HeroSlide;
HeroSliderWithStatic.SliderTitle = SliderTitle;
HeroSliderWithStatic.SliderSubTitle = SliderSubTitle;
HeroSliderWithStatic.SliderBody = SliderBody;
HeroSliderWithStatic.SliderEvents = SliderEvents;

export default HeroSliderWithStatic;
