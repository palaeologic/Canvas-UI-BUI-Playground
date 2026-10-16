# Canvas UI + Base UI Playground

A Bun + TypeScript + React playground containing a staff-facing model/effort guide and an advanced developer playbook. The project uses Base UI for selected interaction primitives and keeps Canvas effects optional and decorative. The playbook is served at `/playbook`.

## Run it

Requires [Bun](https://bun.sh) 1.2.3 or later (tested on 1.4.2).

```bash
bun install
bun run dev          # http://localhost:3000, with hot reload
bun test             # picker logic tests
bun run typecheck
bun run build        # bundles everything into dist/
cd dist && bun server.js   # serve the production build (PORT=8080 to change the port)
```

`server.ts` uses Bun's HTML imports: `/` serves `src/index.html` (React guide), `/playbook` serves
`src/playbook.html` (React playbook shell plus the shared decorative effects).

## Start here if you are changing the code

Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) before changing interaction or Canvas code. It explains Bun, the React/data flow, Base UI adapters, the Canvas safety boundary, and safe contribution recipes.

Base UI is used only for complex interaction primitives (picker radio groups, work-group tabs, and progressive disclosure). For current APIs, use https://base-ui.com/llms.txt and the **View as Markdown** link on the relevant Base UI component documentation page. Styling remains owned by this app's CSS tokens.

## Effects and the Canvas boundary

Canvas is optional decoration only. Essential forms, navigation, instructional text, tabs, tables, disclosures, buttons, and links stay in semantic React DOM. The picker no longer uses the Canvas UI/WebGL Ripple because a failed composition could obscure the whole form.

| Effect | Where | Built with | Failure behavior |
|---|---|---|---|
| DNA helix loader | page load | Canvas 2D | App content remains normal DOM |
| Drifting immune cells and antibodies | background | Canvas 2D | Background decoration disappears |
| Ring and particle click burst | controls | Canvas 2D, pointer-transparent | Click still works normally |
| Sequencing-style role reveal | role examples | CSS | Cards remain ordinary semantic DOM |

Everything respects `prefers-reduced-motion`. Debug switch: add `?nofx=all`, or a list such as `?nofx=reveal,cells,burst,loader`.

## Navigation, theme and interactions

| What | Where |
|---|---|
| Sticky top bar: 8 numbered chapters, sliding "you are here" pill, ticks on chapters already visited (remembered across visits), reading-progress line in the model colours | `src/guide/TopBar.tsx`, `src/guide/Chapters.tsx`, `src/styles/nav.css` |
| Phones: chapter menu ("4/8 Try it ▾") instead of the chapter row | same |
| "Next chapter" link at the end of each section, back-to-top button with a progress ring, skip link | same |
| Light/dark toggle. Follows the OS until the user picks one. Saved choice is applied by an inline `<head>` script, so there's no flash. The new theme grows out of the button (View Transitions), with a colour cross-fade elsewhere | `src/theme.ts`, `src/guide/ThemeToggle.tsx` (also on `/playbook`) |
| Scroll-in reveals with stagger. Content is only hidden once JS has opted in, so nothing disappears if a script fails | `src/fx/useReveal.ts`, `src/styles/motion.css` |
| Picker: Base UI radio groups, one-click examples, answer pills coloured by the setting they point to, sliding 4-step meter, "deciding" answer highlighted, start over, live result pinned to the bottom of the screen on phones | `src/guide/Picker.tsx`, `src/components/ui/PickerRadioGroup.tsx` |
| Roles: Base UI tabs with keyboard/ARIA behavior, sliding underline, swipeable strip on phones, "Copy prompt" on every card | `src/guide/Roles.tsx`, `src/components/ui/GuideTabs.tsx` |
| Roles: "Find your tab" search by job title or team, "Why this setting" chips with the three picker answers, "Try in the picker" loads them into the picker | `src/guide/RoleFinder.tsx`, `src/guide/WhyLine.tsx`, `src/data/finder.ts`, `src/data/tryInPicker.ts` |
| Keep learning chapter: a weekly compare-two-settings exercise and links to the tutorial, blog post, prompting guide and playbook | `src/guide/Learn.tsx`, `src/styles/roles-learn.css` |
| Card hover lift and colour accent (only on devices with a mouse), troubleshooting table becomes stacked cards on phones | `src/styles/guide.css` |
| Splash loader plays once per browser session; click to skip | `src/fx/DnaLoader.tsx` |
| Background cells fade behind the reading column so text stays readable | `src/styles/motion.css` |
| Rendering-path chip in the footer shows only with the native API or `?debug` | `src/guide/Help.tsx` |

Everything above also respects `prefers-reduced-motion`.

## Role groups

Examples are grouped by kind of work, not by job title: Leading & planning, Lab research, Clinical,
Manufacturing & process, Quality & validation, Software, IT & automation, and Business & operations.
`src/data/roles.ts` holds the examples plus `TITLES` (63 job titles) and `TEAMS` (24 teams), each mapped to a
main tab and sometimes a second one. When someone joins with a new title, add it to `TITLES`; the tests
fail if a title points to a tab that doesn't exist.

Each chat example carries its three picker answers. `src/data/roles.test.ts` checks that the picker would
recommend the setting the card shows, so examples and picker can't drift apart. Old tab keys (`leadership`,
`gmp`, `dev`, `it`, `pm`, `clinical`) still resolve, so saved tabs and old links keep working.

## Effort sweep

`scripts/sweep.ts` sends one prompt to one model at several effort levels through the Bedrock Messages
(Mantle) endpoint, then prints tokens, seconds and list cost:

```bash
AWS_BEARER_TOKEN_BEDROCK=… AWS_REGION=eu-north-1 bun run sweep sonnet            # low,medium,high,xhigh
AWS_BEARER_TOKEN_BEDROCK=… bun run sweep opus low,medium                          # pick levels
```

## Project layout

```
server.ts                 Bun server (HTML imports, HMR in dev)
src/index.html            guide entry      → main.tsx → App.tsx
src/playbook.html         playbook HTML shell → playbook-entry.tsx
src/playbook/             semantic playbook components, sections, data, navigation registry, CSS
src/playbook-fx.tsx       decorative playbook effects only
src/data/                 models, presets, picker logic, role examples, title finder (+ tests)
src/guide/                guide sections as React components
src/components/ui/        small Base UI adapters for complex interactions
src/fx/                   optional Canvas/CSS effects; never essential UI
src/styles/               tokens.css (light/dark), guide.css, fx.css, nav.css, motion.css
src/theme.ts              light/dark state shared by the guide and the playbook
scripts/sweep.ts          effort sweep against Bedrock
```

## Notes

- Fonts load from Google Fonts. For an offline or locked-down intranet, self-host IBM Plex and Familjen
  Grotesk and replace the `<link>` in the two HTML files.
- The playbook is a semantic React document. `src/playbook/playbook-nav.ts` is the single source of truth for
  section labels and anchors; both desktop and compact navigation render from it.
- `src/playbook-fx.tsx` must stay decorative-only. Navigation, instructional content, tables, forms, links,
  disclosures and copy controls belong in normal DOM/React.
- Before sharing an archive, run `bun test`, `bun run typecheck`, then `bun run build`. Never ship an old
  `dist/` next to newer `src/`; the production build must be regenerated from the source in the same archive.
