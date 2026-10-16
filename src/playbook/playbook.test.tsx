import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Playbook } from "./Playbook";
import { Disclosure } from "./components/Disclosure";
import { PLAYBOOK_NAV } from "./playbook-nav";
import { ROUTING_ROWS } from "./data/routing-matrix";

describe("playbook document", () => {
  test("renders semantic hero metadata and all registered sections", () => {
    const html = renderToStaticMarkup(<Playbook />);
    expect(html).toContain('href="/">← Staff guide');
    expect(html).toContain("Platform guide");
    expect(html).toContain("For developers, platform &amp; IT admins");
    expect(html).toContain("Amazon Bedrock");
    expect(html).toContain('href="#defaults"');
    expect(html).toContain("<main");
    expect(html).not.toContain("<canvas");
    for (const group of PLAYBOOK_NAV) {
      for (const item of group.items) {
        expect((html.match(new RegExp(`id="${item.id}"`, "g")) ?? []).length).toBe(1);
      }
    }
  });

  test("progressive disclosure uses native details and summary", () => {
    const html = renderToStaticMarkup(<Disclosure summary="More">Detail</Disclosure>);
    expect(html).toContain("<details");
    expect(html).toContain("<summary>More</summary>");
  });

  test("routing rows have stable unique ids", () => {
    expect(new Set(ROUTING_ROWS.map((row) => row.id)).size).toBe(ROUTING_ROWS.length);
  });
});
