# Playbook modularization and navigation redesign

Date: 2026-10-16
Status: Approved direction; implementation pending spec review

## Intent

Improve only the `/playbook` (“Model & Effort Playbook”) experience. Preserve its visual identity, technical content, stable section anchors, and single-page reference behavior while improving comprehension, hierarchy, scanning, interaction, and mixed-experience learning.

The page must remain useful both as a first-read learning path and as a non-linear reference for developers, platform staff, and IT admins using Amazon Bedrock.

## Success criteria

1. The hero no longer presents non-interactive metadata as breadcrumb links.
2. Wide desktop navigation exposes conceptual hierarchy without a long horizontal list.
3. Narrow layouts use compact grouped navigation without clipped/overloaded horizontal scrolling.
4. Every navigation target is generated from one registry and resolves to a real section anchor.
5. The source is split into maintainable section/components/data files rather than one ~800-line HTML file.
6. Core rules stay immediately visible; edge cases, rationale, and long implementation detail use semantic progressive disclosure.
7. Browser find, copy/paste, anchors, keyboard navigation, screen-reader semantics, and zoom remain native DOM behaviors.
8. Canvas remains decorative/enhancement-only.
9. `dist/` is regenerated from the current source so the shipped build matches the source.

## Product structure

Keep a single user-facing URL:

- `/playbook`
- stable deep links such as `/playbook#matrix`, `/playbook#bio`, `/playbook#habit`

Do not split the current playbook into multiple routes yet. The ability to search the complete playbook with browser Find and jump between sections is more valuable at the current size.

Future route splitting is out of scope unless the playbook materially grows.

## Information architecture

Use seven conceptual navigation groups:

1. Understand
   - `#dials` — Two dials
   - `#explorer` — Effort explorer
2. Diagnose
   - `#when` — When to change effort
   - `#which` — Effort or model?
3. Choose & route
   - `#defaults` — Defaults & prices
   - `#matrix` — Routing matrix
4. Configure
   - `#chat` — Chat presets
   - `#openchamber` — OpenChamber
5. Platform
   - `#bio` — Biology refusals
   - `#bedrock` — Bedrock gotchas
6. Measure
   - `#sweep` — Run a sweep
7. Govern
   - `#habit` — Governance

A single typed `PLAYBOOK_NAV` registry is the source of truth for labels, groups, and anchor IDs. Desktop rail and compact navigation are rendered from this registry. Tests assert that each registered anchor has a corresponding section.

## Header / hero

Replace the faux breadcrumb:

`← Staff guide · Platform guide · Developers, platform and IT admins · Amazon Bedrock`

with:

- one real back link: `← Staff guide`
- non-interactive scope metadata:
  - `Platform guide`
  - `For developers, platform & IT admins`
  - `Amazon Bedrock`

The metadata must not use link styling or breadcrumb separators.

Preserve the title, reagent/dose metaphor, model colors, default rings, and matrix concept.

Tighten the explanatory lede so the hierarchy is:

1. Model = capability.
2. Effort = amount of planning/reading/checking.
3. Matrix = available effort levels and defaults.

Add a compact `See defaults & prices →` link from the hero matrix to `#defaults`.

The matrix remains semantic HTML/CSS; ambient cell graphics remain Canvas/decorative.

## Responsive navigation

### Wide desktop

Use a sticky left section rail generated from `PLAYBOOK_NAV`. Show group labels and subsection links. The current section is highlighted with `aria-current="location"`.

The main content keeps a readable prose measure while wide reference components can break out.

### Laptop / tablet

Use one compact grouped nav containing only the seven conceptual group labels. It may wrap; it must not rely on a clipped 12-item horizontal scroller.

### Mobile

Use a compact `Sections` disclosure/menu showing the current group and all section links. No horizontally scrolling TOC.

### URL behavior

Scroll-spy updates the current anchor using `history.replaceState()` so copied URLs point to the visible section without creating excessive browser-history entries. Explicit anchor clicks retain normal navigation behavior.

## Layout / width

Separate prose measure from component/reference width.

- prose: constrained readable measure
- normal cards/grids: existing content width
- reference breakouts: wider routing matrix, code, and dense comparison surfaces
- navigation rail: occupies desktop side space rather than competing with the prose column

Do not widen long-form prose simply because the viewport is wide.

## Progressive disclosure

Standard section anatomy:

1. Core rule / answer — always visible.
2. Operational guidance / comparison / matrix — always visible.
3. Rationale, edge cases, long implementation notes — semantic `<details>/<summary>` where appropriate.

Use progressive disclosure for:

- extended rationale
- tuning methodology
- implementation caveats
- long code samples
- optional references
- advanced edge cases

Do not collapse:

- safety/GxP requirements
- current model defaults
- primary routing recommendations
- refusal handling
- core diagnostic rules

## Content refinements

Preserve the approved diagnostic hierarchy:

`Context → Effort → Model`

For “When to change effort”, always show the prerequisite that task, files, and tools must be correct before effort is adjusted.

Use conditional wording for uncertain diagnosis rather than asserting a cause.

The effort explorer must visibly state `Illustrative, not benchmark data` inside the visualization/component itself.

Current facts such as defaults/prices include a visible “Verified” date/owner treatment.

## Source architecture

Replace the monolithic `src/playbook.html` implementation with a React/DOM playbook entry point and modular files. Target structure:

```
src/playbook/
  Playbook.tsx
  playbook-nav.ts
  playbook.css
  components/
    PlaybookHero.tsx
    SectionNav.tsx
    SectionRail.tsx
    SectionHeader.tsx
    Disclosure.tsx
  sections/
    Concepts.tsx
    EffortExplorer.tsx
    Tuning.tsx
    Diagnosis.tsx
    Defaults.tsx
    RoutingMatrix.tsx
    ChatPresets.tsx
    OpenChamber.tsx
    BiologyRefusals.tsx
    Bedrock.tsx
    Sweep.tsx
    Governance.tsx
  data/
    routing-matrix.ts
    model-defaults.ts
```

If a section is mostly static markup, it may remain a simple React component rather than being over-abstracted. Do not create component wrappers that add no semantic or maintenance value.

`src/playbook-fx.tsx` remains responsible only for optional/decorative effects and must not own instructional content, navigation, forms, or critical interaction.

## Testing

Follow TDD for behavior changes.

Add tests for:

1. every `PLAYBOOK_NAV` item maps to a unique section ID;
2. no navigation entry targets a missing section;
3. faux breadcrumb labels are not links;
4. compact nav contains seven groups rather than twelve peer links;
5. mobile navigation does not require horizontal scrolling;
6. scroll-spy fragment synchronization uses the current section ID;
7. the hero has a valid `#defaults` shortcut;
8. progressive-disclosure components retain accessible native semantics;
9. Canvas is not used for navigation or instructional content.

Run the existing tests, TypeScript typecheck, production build, and a local smoke check on both `/` and `/playbook` when the runtime is available.

## Build/export

`dist/` must be regenerated after source changes. The exported ZIP must contain source and a matching fresh `dist/` build. The final verification report must explicitly distinguish source-level checks from an actual successful Bun production build.

## Out of scope

- redesigning the staff guide
- changing model/preset policy decisions
- adding new platform guide routes solely to make header metadata clickable
- creating twelve independent playbook pages
- moving semantic content into Canvas
- broad visual-identity redesign
