# Architecture guide

This document is the starting point for developers who are new to this project, including people who have not used **Bun**, **Base UI**, or the browser **Canvas API** before.

## The three layers

The app deliberately separates three concerns:

1. **Semantic application layer — React + Base UI.** Forms, navigation, instructional text, tabs, tables, disclosures, buttons, and links live here as ordinary DOM.
2. **Presentation layer — CSS.** `src/styles/` owns layout, responsive behavior, colors, light/dark themes, focus styles, and component appearance.
3. **Optional effects layer — Canvas/CSS motion.** `src/fx/` can add background cells, click bursts, the loading animation, and non-essential reveal motion.

### Non-negotiable Canvas safety rule

**Essential UI must never depend on Canvas.** A Canvas failure may remove decoration, but it must never hide content, block pointer input, or change the meaning of a control. Do not wrap forms, navigation, instructional text, tabs, tables, or disclosures in a Canvas/WebGL component.

The picker used to be wrapped in a WebGL ripple. A failed WebGL composition could become an opaque rectangle over the form, which is why the picker now renders directly in normal DOM.

## Bun: runtime, dev server, tests, and builds

Bun is used as the JavaScript runtime, package manager, test runner, development server runtime, and production bundler.

Common commands from the project root:

```bash
bun install
bun run dev       # development server with hot reload
bun test          # project tests
bun run typecheck # TypeScript without emitting files
bun run build     # production bundle into dist/
```

`server.ts` uses Bun HTML imports. `/` serves the staff guide from `src/index.html`; `/playbook` serves the developer playbook from `src/playbook.html`.

### `dist/` is generated output

**Do not edit `dist/` directly.** Source changes belong under `src/` (or in `server.ts`/scripts). Always regenerate `dist/` with `bun run build`. A source archive must not contain a stale production build from an older revision.

## React project map

- `src/App.tsx` — composes the staff-guide chapters and decorative effects.
- `src/guide/` — staff-guide sections.
- `src/guide/navigation/` — sticky chapter navigation and scroll progress.
- `src/guide/picker/` — picker-specific presentation components.
- `src/guide/roles/` — work-group tabs/cards.
- `src/components/ui/` — small Base UI adapters shared by guide sections.
- `src/data/` — models, presets, picker rules, work-group data, finder mappings, and logic tests.
- `src/playbook/` — semantic developer-playbook components and its single navigation registry.
- `src/fx/` — optional visual effects only.
- `src/styles/` — design tokens and styles.

## Base UI: behavior without a second design system

The project uses [`@base-ui/react`](https://base-ui.com/) for interaction primitives that are easy to get subtly wrong by hand:

- picker answers: Radio Group;
- work-group selection: Tabs;
- supporting examples/resources: Collapsible.

Base UI is intentionally unstyled. The app's tokens and CSS remain the source of truth for appearance. Base UI state attributes such as `data-checked`, `data-active`, and `data-open` are styled in `src/styles/base-ui.css`.

For AI-assisted or unfamiliar development, start with Base UI's documentation index:

- https://base-ui.com/llms.txt
- Each Base UI docs page also has a **View as Markdown** link. Use that component-specific Markdown when changing a Base UI adapter.

Do not migrate ordinary headings, links, cards, or document navigation to Base UI just for consistency. Use the browser's native semantics when they already solve the problem.

## Picker data flow

The picker has a strict separation between **interaction** and **recommendation logic**:

```text
Base UI Radio Group
        ↓
PickerQuestion onChange(level)
        ↓
Picker owns Answers state
        ↓
recommend(answers) in src/data/picker.ts
        ↓
PickerResult renders the recommended preset
```

`recommend()` must remain independent of React/Base UI. That lets logic tests catch recommendation drift without rendering the interface.

### Adding or changing a picker option

1. Change the question/routing data in `src/data/picker.ts`.
2. Keep values compatible with the `Level` type.
3. Add or update logic tests before changing UI copy.
4. Do not put recommendation rules inside `PickerRadioGroup` or `PickerQuestion`.

## Work-group finder and tabs

`Roles.tsx` owns the selected `RoleKey`. The title/team finder can change that state and request focus. `GuideTabs` passes the controlled state to Base UI Tabs, which owns keyboard navigation and ARIA relationships.

```text
RoleFinder result
      ↓
Roles setActive(roleKey) + focus request
      ↓
GuideTabs value/onValueChange
      ↓
Base UI Tab + matching Panel
```

Work-group content itself remains in `src/data/roles.ts`.

### Adding a work-group example

1. Add the example to the correct role in `src/data/roles.ts`.
2. For chat examples, include its three picker answers.
3. Run the role tests; they verify the answers recommend the setting shown on the card.
4. Keep names/titles out of example data where company guidance says to use role titles instead.

## Chapter navigation and dead-link prevention

`CHAPTERS` in `src/guide/Chapters.tsx` is the single registry for staff-guide section IDs and labels. Desktop navigation, mobile navigation, progress tracking, and next-section links must derive from it.

### Adding a chapter safely

1. Add the section component and a stable `id`.
2. Add exactly one matching entry to `CHAPTERS`.
3. Keep the heading/anchor semantic HTML.
4. Run the navigation/source-contract tests before shipping.

Do not create an independent hard-coded chapter list inside another toolbar.

## Canvas and motion

Current Canvas effects are deliberately non-essential:

- `CellField.tsx` — fixed, pointer-transparent background cells/antibodies.
- `ClickBurst.tsx` — pointer-transparent click particles.
- `DnaLoader.tsx` — introductory decoration; the real app remains React DOM.
- `SequenceReveal.tsx` — now **CSS-only** so role cards never depend on experimental HTML-in-Canvas.

Effects respect reduced motion. `?nofx=all` disables all optional effects; individual effects can be disabled with values such as `?nofx=cells,burst,loader,reveal`.

### Adding a Canvas effect safely

Before writing Canvas code, ask: “If this canvas renders nothing or renders a solid rectangle, can the user still read and operate the page?” If the answer is no, the effect belongs in semantic HTML/CSS instead.

For a safe Canvas effect:

1. render it behind content or with `pointer-events: none`;
2. mark decorative canvases `aria-hidden="true"`;
3. read colors from CSS tokens rather than hard-coding a second theme;
4. respect reduced motion;
5. support `?nofx` when practical;
6. never store product state only inside the canvas.

## Light and dark themes

`src/styles/tokens.css` defines theme-aware custom properties. Components should consume tokens such as `--ink`, `--muted`, `--surface`, `--line`, `--accent`, and the model/effort colors instead of hard-coded black or white.

Base UI focus/selected/open states are styled in `src/styles/base-ui.css` using these same tokens.

## Before sharing a build

Run, in order:

```bash
bun install
bun test
bun run typecheck
bun run build
```

Then verify `/` and `/playbook` from the freshly generated build. Never pair newer `src/` with an older `dist/`.
