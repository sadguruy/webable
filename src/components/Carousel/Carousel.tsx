import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import "./styles.css";

type Marker =
  | "carousel-item"
  | "carousel-img"
  | "carousel-title"
  | "carousel-body"
  | "carousel-events"
  | "carousel-nav"
  | "carousel-dots";

type Breakpoint = "xs" | "sm" | "md" | "lg";

type TypedComponent<P> = {
  (props: P): ReactElement | null;
  __carouselMarker?: Marker;
  displayName?: string;
  name?: string;
};

export type ItemsPerView = number | Partial<Record<Breakpoint, number>>;

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children: ReactNode;
  itemsPerView?: ItemsPerView;
  itemsPerSlide?: number;
  showNav?: boolean;
  showDots?: boolean;
  loop?: boolean;
  fillLoopItems?: boolean;
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
  pauseOnHover?: boolean;
  gap?: string | number;
  onPageChange?: (page: number) => void;
}

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CarouselImgProps extends ImgHTMLAttributes<HTMLImageElement> {}

export interface CarouselTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface CarouselBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CarouselEventsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CarouselNavProps extends HTMLAttributes<HTMLDivElement> {}
export interface CarouselDotsProps extends HTMLAttributes<HTMLDivElement> {}

export const CarouselItem: TypedComponent<CarouselItemProps> = ({ children, className = "", ...props }) => {
  const classes = ["carousel__item", className].filter(Boolean).join(" ");
  return (
    <article className={classes} {...props}>
      {children}
    </article>
  );
};
CarouselItem.__carouselMarker = "carousel-item";
CarouselItem.displayName = "CarouselItem";

export const CarouselImg: TypedComponent<CarouselImgProps> = ({ className = "", alt = "", ...props }) => {
  const classes = ["carousel__img", className].filter(Boolean).join(" ");
  return <img className={classes} alt={alt} {...props} />;
};
CarouselImg.__carouselMarker = "carousel-img";
CarouselImg.displayName = "CarouselImg";

export const CarouselTitle: TypedComponent<CarouselTitleProps> = ({ children, className = "", ...props }) => {
  const classes = ["carousel__title", className].filter(Boolean).join(" ");
  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
};
CarouselTitle.__carouselMarker = "carousel-title";
CarouselTitle.displayName = "CarouselTitle";

export const CarouselBody: TypedComponent<CarouselBodyProps> = ({ children, className = "", ...props }) => {
  const classes = ["carousel__body", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
CarouselBody.__carouselMarker = "carousel-body";
CarouselBody.displayName = "CarouselBody";

export const CarouselEvents: TypedComponent<CarouselEventsProps> = ({ children, className = "", ...props }) => {
  const classes = ["carousel__events", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
CarouselEvents.__carouselMarker = "carousel-events";
CarouselEvents.displayName = "CarouselEvents";

export const CarouselNav: TypedComponent<CarouselNavProps> = ({ className = "", children, ...props }) => {
  const classes = ["carousel__nav", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
CarouselNav.__carouselMarker = "carousel-nav";
CarouselNav.displayName = "CarouselNav";

export const CarouselDots: TypedComponent<CarouselDotsProps> = ({ className = "", children, ...props }) => {
  const classes = ["carousel__dots", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
CarouselDots.__carouselMarker = "carousel-dots";
CarouselDots.displayName = "CarouselDots";

function Chevron({ direction }: { direction: "left" | "right" }) {
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

function markerOf(node: ReactNode): Marker | null {
  if (!isValidElement(node)) return null;
  const typed = node.type as TypedComponent<unknown> & { displayName?: string; name?: string };
  const marker = typed.__carouselMarker;
  if (marker) return marker;

  const name = typed.displayName ?? typed.name ?? "";
  if (name === "CarouselItem") return "carousel-item";
  if (name === "CarouselImg") return "carousel-img";
  if (name === "CarouselTitle") return "carousel-title";
  if (name === "CarouselBody") return "carousel-body";
  if (name === "CarouselEvents") return "carousel-events";
  if (name === "CarouselNav") return "carousel-nav";
  if (name === "CarouselDots") return "carousel-dots";
  return null;
}

function resolvePerView(itemsPerView: ItemsPerView | undefined, width: number) {
  if (!itemsPerView) return width < 640 ? 1 : width < 768 ? 2 : width < 1024 ? 3 : 4;
  if (typeof itemsPerView === "number") return Math.max(1, itemsPerView);

  const xs = Math.max(1, itemsPerView.xs ?? 1);
  const sm = Math.max(1, itemsPerView.sm ?? xs);
  const md = Math.max(1, itemsPerView.md ?? sm);
  const lg = Math.max(1, itemsPerView.lg ?? md);

  if (width < 640) return xs;
  if (width < 768) return sm;
  if (width < 1024) return md;
  return lg;
}

function chunkItems<T>(items: T[], size: number) {
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
}

function buildWindows<T>({
  items,
  perView,
  step,
  loop,
  fillLoopItems,
}: {
  items: T[];
  perView: number;
  step: number;
  loop: boolean;
  fillLoopItems: boolean;
}) {
  const total = items.length;
  if (total === 0) return [] as T[][];

  const windows: T[][] = [];

  if (loop && fillLoopItems) {
    for (let start = 0; start < total; start += step) {
      const row: T[] = [];
      for (let offset = 0; offset < perView; offset += 1) {
        row.push(items[(start + offset) % total]);
      }
      windows.push(row);
    }
    return windows;
  }

  if (loop && !fillLoopItems) {
    const pages = chunkItems(items, perView);
    return pages;
  }

  for (let start = 0; start < total; start += step) {
    const row = items.slice(start, start + perView);
    if (row.length) {
      windows.push(row);
    }
    if (start + perView >= total) {
      break;
    }
  }

  return windows;
}

export function Carousel({
  children,
  itemsPerView = { xs: 1, sm: 2, md: 3, lg: 4 },
  itemsPerSlide = 1,
  showNav = true,
  showDots = true,
  loop = true,
  fillLoopItems = false,
  autoPlay = false,
  autoPlayIntervalMs = 5000,
  pauseOnHover = true,
  gap = "1rem",
  onPageChange,
  className = "",
  ...props
}: CarouselProps) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const allChildren = Children.toArray(children);
  const itemNodes = allChildren.filter((node) => markerOf(node) === "carousel-item") as ReactElement<CarouselItemProps>[];
  const perView = resolvePerView(itemsPerView, viewportWidth);
  const step = Math.max(1, itemsPerSlide);
  const pages = useMemo(
    () =>
      buildWindows({
        items: itemNodes,
        perView,
        step,
        loop,
        fillLoopItems,
      }),
    [itemNodes, perView, step, loop, fillLoopItems],
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(0, pages.length - 1)));
  }, [pages.length]);

  useEffect(() => {
    if (!autoPlay || paused || pages.length <= 1) return;
    const timer = window.setInterval(() => {
      setPage((current) => {
        const next = current + 1;
        if (next >= pages.length) return loop ? 0 : current;
        return next;
      });
    }, autoPlayIntervalMs);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, pages.length, autoPlayIntervalMs, loop]);

  useEffect(() => {
    onPageChange?.(page);
  }, [page, onPageChange]);

  const goPrev = () => {
    setPage((current) => {
      if (current === 0) return loop ? Math.max(0, pages.length - 1) : current;
      return current - 1;
    });
  };

  const goNext = () => {
    setPage((current) => {
      if (current >= pages.length - 1) return loop ? 0 : current;
      return current + 1;
    });
  };

  if (!itemNodes.length) return null;

  const classes = ["carousel", className].filter(Boolean).join(" ");
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;

  return (
    <section
      className={classes}
      aria-roledescription="carousel"
      aria-label="Content carousel"
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
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
      <div className="carousel__viewport">
        <div
          className="carousel__pages"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((pageItems, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="carousel__page"
              style={{
                gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))`,
                gap: gapValue,
              }}
            >
              {pageItems}
            </div>
          ))}
        </div>
      </div>

      {showNav && pages.length > 1 ? (
        <CarouselNav>
          <button
            type="button"
            className="carousel__nav-btn"
            onClick={goPrev}
            aria-label="Previous items"
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            className="carousel__nav-btn"
            onClick={goNext}
            aria-label="Next items"
          >
            <Chevron direction="right" />
          </button>
        </CarouselNav>
      ) : null}

      {showDots && pages.length > 1 ? (
        <CarouselDots>
          {pages.map((_, dotIndex) => (
            <button
              key={`dot-${dotIndex}`}
              type="button"
              className={`carousel__dot ${dotIndex === page ? "is-active" : ""}`}
              aria-label={`Go to set ${dotIndex + 1}`}
              aria-selected={dotIndex === page}
              onClick={() => setPage(dotIndex)}
            />
          ))}
        </CarouselDots>
      ) : null}
    </section>
  );
}

interface CarouselStatic {
  Item: typeof CarouselItem;
  CarouselImg: typeof CarouselImg;
  CarouselTitle: typeof CarouselTitle;
  CarouselBody: typeof CarouselBody;
  CarouselEvents: typeof CarouselEvents;
  CarouselNav: typeof CarouselNav;
  CarouselDots: typeof CarouselDots;
}

const CarouselWithStatic = Carousel as typeof Carousel & CarouselStatic;
CarouselWithStatic.Item = CarouselItem;
CarouselWithStatic.CarouselImg = CarouselImg;
CarouselWithStatic.CarouselTitle = CarouselTitle;
CarouselWithStatic.CarouselBody = CarouselBody;
CarouselWithStatic.CarouselEvents = CarouselEvents;
CarouselWithStatic.CarouselNav = CarouselNav;
CarouselWithStatic.CarouselDots = CarouselDots;

export default CarouselWithStatic;
