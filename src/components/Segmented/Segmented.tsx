import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import "./styles.css";

type SegmentedValue = string | number;

export interface SegmentedProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children: ReactNode;
  activeTab?: SegmentedValue;
  defaultActiveTab?: SegmentedValue;
  onTabChange?: (value: SegmentedValue) => void;
  fullWidth?: boolean;
}

export interface TabTitleProps {
  value: SegmentedValue;
  children: ReactNode;
  disabled?: boolean;
}

export interface TabPanelProps {
  value: SegmentedValue;
  children: ReactNode;
  lazy?: boolean;
}

interface TypedComp<P> {
  (props: P): ReactElement | null;
  __segmentedType?: "title" | "panel";
}

export const TabTitle: TypedComp<TabTitleProps> = () => null;
TabTitle.__segmentedType = "title";

export const TabPanel: TypedComp<TabPanelProps> = () => null;
TabPanel.__segmentedType = "panel";

function getChildKind(node: ReactNode): "title" | "panel" | null {
  if (!isValidElement(node)) {
    return null;
  }

  const candidate = node.type as TypedComp<unknown>;
  return candidate.__segmentedType ?? null;
}

export function Segmented({
  children,
  activeTab,
  defaultActiveTab,
  onTabChange,
  fullWidth = false,
  className = "",
  ...props
}: SegmentedProps) {
  const childArray = Children.toArray(children);

  const tabTitles = childArray.filter((child) => getChildKind(child) === "title") as ReactElement<TabTitleProps>[];
  const tabPanels = childArray.filter((child) => getChildKind(child) === "panel") as ReactElement<TabPanelProps>[];

  const firstTabValue = tabTitles[0]?.props.value;
  const isControlled = activeTab !== undefined;
  const [internalActive, setInternalActive] = useState<SegmentedValue | undefined>(
    defaultActiveTab ?? firstTabValue,
  );

  const selected = (isControlled ? activeTab : internalActive) ?? firstTabValue;

  const titleIndex = useMemo(
    () => tabTitles.findIndex((tab) => tab.props.value === selected),
    [selected, tabTitles],
  );

  const setSelected = (value: SegmentedValue, disabled = false) => {
    if (disabled) {
      return;
    }

    if (!isControlled) {
      setInternalActive(value);
    }

    onTabChange?.(value);
  };

  const onTitleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabledTitles = tabTitles.filter((tab) => !tab.props.disabled);
    const enabledIndex = enabledTitles.findIndex((tab) => tab.props.value === tabTitles[index].props.value);
    if (enabledIndex < 0) {
      return;
    }

    let nextEnabledIndex = enabledIndex;
    if (event.key === "ArrowRight") nextEnabledIndex = Math.min(enabledTitles.length - 1, enabledIndex + 1);
    if (event.key === "ArrowLeft") nextEnabledIndex = Math.max(0, enabledIndex - 1);
    if (event.key === "Home") nextEnabledIndex = 0;
    if (event.key === "End") nextEnabledIndex = enabledTitles.length - 1;

    if (nextEnabledIndex !== enabledIndex) {
      event.preventDefault();
      const nextTab = enabledTitles[nextEnabledIndex];
      setSelected(nextTab.props.value, nextTab.props.disabled);
    }
  };

  const currentPanel = tabPanels.find((panel) => panel.props.value === selected);

  const classes = [
    "segmented",
    fullWidth ? "segmented--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <div className="segmented__tablist" role="tablist" aria-label="Segmented tabs">
        {tabTitles.map((tab, index) => {
          const isActive = tab.props.value === selected;
          const tabId = `segmented-tab-${String(tab.props.value)}`;
          const panelId = `segmented-panel-${String(tab.props.value)}`;

          return (
            <button
              key={String(tab.props.value)}
              id={tabId}
              type="button"
              className={`segmented__tab ${isActive ? "is-active" : ""}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive || (titleIndex < 0 && index === 0) ? 0 : -1}
              disabled={tab.props.disabled}
              onClick={() => setSelected(tab.props.value, tab.props.disabled)}
              onKeyDown={(event) => onTitleKeyDown(event, index)}
            >
              {tab.props.children}
            </button>
          );
        })}
      </div>

      <div className="segmented__panel-wrap">
        {currentPanel ? (
          <div
            id={`segmented-panel-${String(currentPanel.props.value)}`}
            role="tabpanel"
            aria-labelledby={`segmented-tab-${String(currentPanel.props.value)}`}
            className="segmented__panel"
          >
            {currentPanel.props.children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface SegmentedStatic {
  TabTitle: typeof TabTitle;
  TabPanel: typeof TabPanel;
}

const SegmentedWithStatics = Segmented as typeof Segmented & SegmentedStatic;
SegmentedWithStatics.TabTitle = TabTitle;
SegmentedWithStatics.TabPanel = TabPanel;

export default SegmentedWithStatics;
