import { Tabs } from "@base-ui/react/tabs";
import { useEffect, useRef, type ReactNode } from "react";

export interface GuideTabItem<K extends string> {
  value: K;
  label: string;
  panel: ReactNode;
}

/**
 * Controlled tabs adapter used by the work-group section.
 *
 * Base UI owns ARIA wiring and keyboard behavior; the guide owns the selected key.
 * Keeping selection controlled is important because RoleFinder can change tabs from
 * outside this component and then request focus on the newly selected tab.
 */
export function GuideTabs<K extends string>({
  active,
  onChange,
  focusRequest,
  items,
  ariaLabel,
}: {
  active: K;
  onChange: (value: K) => void;
  focusRequest: number;
  items: GuideTabItem<K>[];
  ariaLabel: string;
}) {
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tab = tabRefs.current[active];
    const list = listRef.current;
    if (!tab || !list) return;

    // Keep the selected work group visible in the horizontally scrollable strip. Finder
    // selections additionally move keyboard focus to the selected tab.
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({
        left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
    if (focusRequest > 0) tab.focus({ preventScroll: true });
  }, [active, focusRequest]);

  return (
    <Tabs.Root
      className="guide-tabs-root"
      value={active}
      onValueChange={(value) => onChange(String(value) as K)}
    >
      <div className="tabs-wrap" data-reveal>
        <Tabs.List className="tabs" aria-label={ariaLabel} ref={listRef} activateOnFocus>
          {items.map((item) => (
            <Tabs.Tab
              key={item.value}
              className="tab"
              value={item.value}
              ref={(node) => { tabRefs.current[item.value] = node; }}
            >
              {item.label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className="tab-ind" />
        </Tabs.List>
      </div>
      {items.map((item) => (
        <Tabs.Panel key={item.value} className="role-panel" value={item.value}>
          {item.panel}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
