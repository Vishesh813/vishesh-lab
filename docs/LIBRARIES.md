# Library evaluation

The goal was to stop hand-writing infrastructure that a maintained library already does well, without turning a static study site into a component-framework migration. Each candidate was judged on:

1. **Real use case** — does it replace code we would otherwise write and maintain?
2. **Static export fit** — works with `output: "export"`, no server runtime.
3. **Licence** — OSI-approved or clearly compatible with a public study site.
4. **Cost** — bundle size, hydration, accessibility and upgrade risk.
5. **Design fit** — can it live inside the existing black/white/green system instead of replacing it?

---

## Adopted

| Library | Version | Licence | Used for | Why |
| --- | --- | --- | --- | --- |
| `chart.js` | 4.6.1 | MIT | Progress doughnut and horizontal bar charts | Canvas charting with a small, tree-shakeable API. Replaces hand-rolled SVG math, scales, ticks and tooltips. |
| `react-chartjs-2` | 5.3.1 | MIT | React wrappers for the two charts | Thin wrapper; no extra chart engine. Keeps chart lifecycle inside React. |
| `@excalidraw/excalidraw` | 0.18.1 | MIT | `/board/` whiteboard | A complete drawing surface: shapes, arrows, text, freehand, pan, zoom, undo, export. Building this from scratch would be weeks of work and worse accessibility. |
| `lucide-react` | 1.61.0 | ISC | Icon set behind `components/icons.tsx` | Replaced a 371-line hand-drawn SVG file with a maintained, tree-shaken set. Keeps a single stroke style and one import surface. |
| `next` | 16.4.3 | MIT | Framework, routing, static export, fonts, metadata | Already the project base. |
| `react`, `react-dom` | 19.3.0 | MIT | UI runtime | Required by Next.js. |
| `tailwindcss` | 4.3.3 | MIT | Utility layer and design tokens | Already the project base; the visual system is custom CSS on top of tokens. |

### Chart.js — why it is a real win

The progress page needs a doughnut with a centre label, a horizontal bar chart with 17 category labels, responsive sizing, tooltips and theme-aware colours. Hand-written SVG would need:

- arc path math and label collision handling;
- scale ticks and percentage formatting;
- hit-testing for tooltips;
- resize observers and device-pixel-ratio handling.

Chart.js provides all of it. Only the controllers and elements actually used are registered (`ArcElement`, `BarElement`, `CategoryScale`, `LinearScale`, `Tooltip`, `Legend`), so the bundle does not include every chart type.

**Accessibility mitigation:** the chart is decorative reinforcement, not the only source of the numbers. The same data appears as text in the progress stat cards and the per-topic progress rows. A visually hidden summary and `aria-label` should be kept on the chart container; the canvas itself is not keyboard-interactive. See the QA checklist in `BUILD-INVENTORY.md`.

### Excalidraw — why it is a real win, and its risk

The board is a full drawing tool, not a decorative canvas. Excalidraw supplies the toolbar, shape editing, text, arrows, selection, undo/redo, pan/zoom, image export and local scene serialization. Rebuilding that on `react-konva` would still leave us writing the entire interaction model.

It is loaded with `next/dynamic` and `ssr: false`, so the editor chunk is not part of the initial page load. The board is local-only: no collaboration, no room links, no server upload. Autosave writes the scene to `localStorage` under `vishesh-lab.board.v1`; export produces a PNG in the browser.

**Accepted risk:** Excalidraw 0.18.1 pulls in `@excalidraw/mermaid-to-excalidraw`, which brings Mermaid, KaTeX, `nanoid` and `lodash-es`. `npm audit --omit=dev` reports 11 advisories (2 high, 7 moderate, 2 low) in that transitive tree. There is no non-force fix; `npm audit fix --force` would downgrade Excalidraw to 0.17.6, a breaking change. Mitigations:

- the board has no user-supplied HTML or Mermaid input path in our UI;
- no collaboration or remote scene loading;
- the editor is lazy-loaded and same-origin only;
- the audit is documented and re-checked on every dependency update;
- if the advisories become exploitable in our usage, replace the board with a smaller canvas tool rather than force-downgrading.

### lucide-react — why it is a real win

`components/icons.tsx` used to define 41 SVG paths by hand. It now imports 41 Lucide icons and applies shared defaults (`width: 18`, `height: 18`, `strokeWidth: 1.7`, `aria-hidden: true`). Call sites keep the same names and props, so no page code changed. The package is tree-shaken; only the imported icons ship.

---

## Considered, not adopted

| Candidate | Decision | Reason |
| --- | --- | --- |
| `shadcn/ui` + Radix primitives | Deferred | Would replace a working custom design system with a large component migration. The site's value is content and layout, not form controls. Radix Accordion/Dialog could be adopted selectively later for the sidebar and command palette. |
| `tldraw` | Rejected | Excellent whiteboard, but the licence is not OSI-approved and free use carries branding/watermark conditions. Excalidraw is MIT and fits the local-only board. |
| `react-konva` / `konva` | Rejected | A canvas primitive, not a whiteboard. We would still write selection, text editing, arrows, undo and export. |
| `perfect-freehand` | Rejected | Solves stroke smoothing only; not a complete board. |
| MDX / `react-markdown` | Rejected | Content is structured TypeScript data rendered by explicit components. MDX would add a compiler, loosen the content schema and create an HTML-injection surface for no gain. |
| `date-fns` / `dayjs` | Rejected | Dates are static ISO strings; `Intl.DateTimeFormat` covers the display needs. |
| `framer-motion` | Rejected | CSS transitions are enough; the site respects reduced motion. A motion runtime is not justified. |
| `zustand` / Redux | Rejected | Progress is a small map in `localStorage` with a custom event. React state plus `storage` events is sufficient. |
| TanStack Query / SWR | Rejected | No server data, no API routes, no revalidation. |
| Prism / Shiki | Deferred | Code blocks are pre-written strings with custom styling. Syntax highlighting would add build weight and another theme to maintain; revisit if code volume grows. |
| KaTeX | Rejected | No mathematical notation in the current content. Complexity is written as plain text (`O(n log n)`). |
| `cmdk` | Deferred | The command palette is small and already keyboard-accessible. A library would be reasonable if the search surface grows. |
| `@radix-ui/react-accordion` | Deferred | The DSA sidebar works, but a Radix accordion would improve roving focus and ARIA semantics. Adopt only if the custom accordion becomes a maintenance problem. |

---

## Dependency policy

1. A new dependency must remove more code than it adds, or provide a capability that is unsafe to hand-roll (drawing, charting, accessibility primitives).
2. Prefer MIT / ISC / Apache-2.0. Reject licences that require watermarks or restrict commercial use unless the site explicitly accepts them.
3. Client-only libraries must be lazy-loaded if they are larger than a small component.
4. Every dependency gets an entry in `THIRD_PARTY_NOTICES.md`.
5. Run `npm audit --omit=dev` after every install and record unresolved advisories.
6. No analytics, tracking pixels, ad SDKs or remote fonts at runtime.

---

## Update checklist

```bash
npm outdated
npm audit --omit=dev
npx tsc --noEmit
npm run lint
npm run build
```

After an Excalidraw update, re-test: initial mount, autosave, reload restore, PNG export, clear board, light/dark theme, mobile toolbar. After a Chart.js update, re-test: doughnut centre label, 17-row bar chart, tooltips, resize, light/dark colours, empty state.
