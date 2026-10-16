import { Collapsible } from "@base-ui/react/collapsible";
import type { ReactNode } from "react";

/**
 * Progressive disclosure for supporting material only.
 * `hiddenUntilFound` keeps collapsed content searchable by the browser where the
 * platform supports hidden="until-found", which is useful on handbook-style pages.
 */
export function Disclosure({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Collapsible.Root className={className}>
      <Collapsible.Trigger className="disclosure-trigger">
        <span>{label}</span>
        <span className="disclosure-caret" aria-hidden="true">⌄</span>
      </Collapsible.Trigger>
      <Collapsible.Panel className="disclosure-panel" hiddenUntilFound>
        {children}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
