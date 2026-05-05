import { useEffect, useRef, useState } from "react";
import "./styles.css";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export interface TabsProps {
  tabs: TabItem[];
  value?: string;              // controlled
  defaultValue?: string;       // uncontrolled
  onChange?: (id: string) => void;
  orientation?: "horizontal" | "vertical";
}

export const Tabs = ({
  tabs,
  value,
  defaultValue,
  onChange,
  orientation = "horizontal",
}: TabsProps) => {
  const isControlled = value !== undefined;

  const resolveIndex = (id?: string) =>
    Math.max(0, tabs.findIndex(t => t.id === id));

  const [activeIndex, setActiveIndex] = useState(
    resolveIndex(value ?? defaultValue ?? tabs[0]?.id)
  );
  const [prevIndex, setPrevIndex] = useState(activeIndex);

  // Sync controlled value
  useEffect(() => {
    if (isControlled) {
      const idx = resolveIndex(value);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [value]);

  const activate = (index: number) => {
    setPrevIndex(activeIndex);
    if (!isControlled) setActiveIndex(index);
    onChange?.(tabs[index].id);
  };

  /* ---------- Keyboard navigation (ARIA) ---------- */
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    let next = index;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(last, index + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(0, index - 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;

    if (next !== index) {
      e.preventDefault();
      activate(next);
    }
  };

  /* ---------- Swipe (mobile) ---------- */
  const startX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0 && activeIndex < tabs.length - 1) activate(activeIndex + 1);
      if (delta > 0 && activeIndex > 0) activate(activeIndex - 1);
    }
  };

  const direction = activeIndex > prevIndex ? "slide-left" : "slide-right";

  return (
    <div className={`tabs-root ${orientation}`}>
      <div
        className="tabs-header"
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={index === activeIndex}
            tabIndex={index === activeIndex ? 0 : -1}
            className={`tab-btn ${index === activeIndex ? "active" : ""}`}
            onClick={() => activate(index)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="tabs-panel-wrapper"
        role="tabpanel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={tabs[activeIndex].id}
          className={`tabs-panel ${direction}`}
        >
          {tabs[activeIndex].content}
        </div>
      </div>
    </div>
  );
};