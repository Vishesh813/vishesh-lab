# Build and data inventory

Snapshot: 25 October 2026  
Project: `D:\Workspace\vishesh-lab`  
Status: local development build, not deployed. No backend, no accounts, no analytics.

This document records what exists in the build, where each dataset lives, how it is generated, and the copyright status of each part. It is the source of truth for the static export and for any later content review.

---

## 1. What the site is

Vishesh Lab is a static learning site with two connected tracks:

- **DSA** — 17 topics and 22 lessons, ordered from programming foundations to dynamic programming.
- **System Design** — 12 modules and 6 end-to-end case studies.

Supporting surfaces are practice, posts, a local whiteboard, a progress dashboard and an about page. The site mirrors the information architecture of a conventional DSA course (topic sidebar, lesson header, completion control, notes and code tabs) but does not reuse another site's prose, code, images, video or branding.

**Reference boundary:** `dsawithpiyush.com` was inspected for public page anatomy only — navigation labels, topic order, lesson URL shape and the presence of a progress ring / notes / code tabs. No text, screenshots, diagrams, videos, stylesheets or source code were copied from it. See section 7.

---

## 2. Route inventory

All routes are statically generated at build time. Dynamic segments use `generateStaticParams()` and `dynamicParams = false`, so an unknown slug returns the 404 page rather than rendering on demand.

| Route | Source | Pages | Indexable | Notes |
| --- | --- | ---: | --- | --- |
| `/` | `app/page.tsx` | 1 | yes | Hero, roadmap tracking, two track cards, posts, tools, CTA |
| `/course/` | `app/course/page.tsx` | 1 | yes | DSA curriculum overview with sidebar |
| `/course/dsa/[phase]/[topic]/` | `app/course/dsa/[phase]/[topic]/page.tsx` | 22 | yes | One page per DSA lesson; phase is URL-encoded |
| `/system-design/` | `app/system-design/page.tsx` | 1 | yes | 12-module curriculum |
| `/system-design/[slug]/` | `app/system-design/[slug]/page.tsx` | 12 | yes | Module detail with blueprint, decisions, checklist |
| `/case-studies/` | `app/case-studies/page.tsx` | 1 | yes | Grouped by difficulty |
| `/case-studies/[slug]/` | `app/case-studies/[slug]/page.tsx` | 6 | yes | Full design walk-through |
| `/practice/` | `app/practice/page.tsx` | 1 | yes | Topic cards + filterable problem list |
| `/practice/[slug]/` | `app/practice/[slug]/page.tsx` | 8 | yes | Statement, examples, constraints, progressive hints |
| `/posts/` | `app/posts/page.tsx` | 1 | yes | Category tabs and pagination |
| `/posts/[slug]/` | `app/posts/[slug]/page.tsx` | 6 | yes | Structured post renderer |
| `/progress/` | `app/progress/page.tsx` | 1 | no (`noindex`) | Local dashboard; charts, export/import, clear |
| `/board/` | `app/board/page.tsx` | 1 | no (`noindex`) | Excalidraw whiteboard; local autosave |
| `/about/` | `app/about/page.tsx` | 1 | yes | Mission, coverage, content policy, creator |
| `not-found` | `app/not-found.tsx` | 1 | — | 404 surface |
| `/sitemap.xml` | `app/sitemap.ts` | 1 | — | Generated from every dataset |
| `/robots.txt` | `app/robots.ts` | 1 | — | Disallows `/progress/`; points at sitemap |
| `/manifest.webmanifest` | `app/manifest.ts` | 1 | — | PWA metadata and icons |
| `/llms.txt` | `app/llms.txt/route.ts` | 1 | — | Plain-text index of every lesson, module, case, problem and post |

**Total HTML pages:** 63 (including 404). Plus the four generated text/metadata routes.

Static export settings live in `next.config.ts`: `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`, optional `basePath` from `NEXT_PUBLIC_BASE_PATH`. `scripts/fix-static-export.mjs` flattens RSC prefetch output on Windows.

---

## 3. Dataset inventory

| Dataset | File | Records | Purpose |
| --- | --- | ---: | --- |
| DSA phases | `lib/dsa-course.ts` | 17 | Sidebar groups and course order |
| DSA lessons | `lib/dsa-course.ts` | 22 | Full lesson content and code samples |
| Legacy DSA modules | `lib/curriculum.ts` | 17 | Source for generated lessons and practice mapping; not a public route |
| System Design modules | `lib/system-design.ts` | 12 | Curriculum modules and blueprints |
| Case studies | `lib/case-studies.ts` | 6 | End-to-end design walk-throughs |
| Practice problems | `lib/problems.ts` | 8 | Problem statements and hints |
| Posts | `lib/posts.ts` | 6 | Structured essays |
| Progress metadata | `lib/module-meta.ts` | 40 | Unified progress entries: 22 DSA + 12 SD + 6 cases |

### 3.1 DSA lessons — `lib/dsa-course.ts`

```ts
type DsaLesson = {
  code: string;              // stable URL code, e.g. PROGRAMMING_BASICS
  title: string;
  phase: string;             // matches a DsaPhase.name
  summary: string;
  minutes: number;
  moduleSlug: string;        // maps to lib/curriculum.ts
  definition: string;
  blocks: LessonBlock[];     // titled prose sections, bullets, optional callout kind
  keyPoints: string[];
  mistakes: string[];
  codeSamples: CodeSample[]; // language, filename, code
  complexity: ComplexityRow[]; // operation, time, space
  practice: string[];        // linked problem slugs
  refs: Reference[];         // external reading, linked only
};
```

Composition:

- **Programming Foundations** — 6 hand-authored lessons matching the reference lesson codes: `PROGRAMMING_TOPIC_INTRO`, `PROGRAMMING_BASICS`, `CONDITIONS_AND_LOOPS`, `FUNCTIONS_AND_SCOPE`, `CLASSES_AND_OBJECTS`, `OBJECT_REFERENCES_AND_MEMORY`.
- **Remaining 16 topics** — one lesson each, generated by `moduleLesson(moduleSlug)` from `lib/curriculum.ts`, then given the reference phase name and a stable code (`ARRAYS`, `STRINGS`, `RECURSION`, …). The generator adds an original definition, key points, mistakes, code samples, complexity rows and references.
- **URL shape** — `lessonHref(phase, code)` returns `/course/dsa/{encoded phase}/{code}/`, matching the reference convention.
- **Navigation helpers** — `getDsaLesson`, `getNextDsaLesson`, `getPreviousDsaLesson`, `firstLessonOfPhase`, `lessonForModuleSlug`.

Content completeness rule: every lesson has a definition, at least one content block, key points and a code sample. A few generated lessons have empty `practice` or short `refs` arrays; the UI hides those sections rather than rendering empty shells.

### 3.2 System Design modules — `lib/system-design.ts`

```ts
type SystemDesignModule = {
  slug: string;
  step: number;              // 1..12
  title: string;
  phase: "Foundations" | "Scale" | "Distributed systems" | "Production";
  minutes: number;
  summary: string;
  mentalModel: string;
  ideas: string[];
  topics: string[];          // checklist items
  blueprint: Blueprint;      // caption + layers of nodes
  decisions: DesignDecision[]; // choice / when / cost
  question: string;          // interview prompt
  relatedCaseStudy?: string;
  refs: Reference[];
};
```

Blueprint node tones: `client`, `edge`, `service`, `data`, `async`, `external`. The diagram is rendered from data by `components/blueprint-diagram.tsx`; there are no image assets to license.

### 3.3 Case studies — `lib/case-studies.ts`

```ts
type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  difficulty: "Warm-up" | "Intermediate" | "Advanced";
  minutes: number;
  summary: string;
  prompt: string;
  requirements: string[];
  constraints: string[];
  estimates: { label: string; value: string; note: string }[];
  blueprint: Blueprint;
  api: { method: string; path: string; purpose: string }[];
  dataModel: { name: string; fields: string }[];
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
  decisions: DesignDecision[];
  failureModes: { failure: string; impact: string; mitigation: string }[];
  checklist: string[];
  relatedModules: string[];
  refs: Reference[];
};
```

The six studies are URL shortener, real-time chat, news feed, ticket dispatch, video streaming and rate limiting. Each is an original walk-through; external references are links only.

### 3.4 Practice problems — `lib/problems.ts`

```ts
type Problem = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  summary: string;
  statement: string;
  examples: { input: string; output: string; note?: string }[];
  constraints: string[];
  hints: string[];           // revealed one at a time
  moduleSlug: string;        // maps to a DSA lesson
  time: string;
  space: string;
};
```

Eight problems are live. The remaining topic cards show "in preparation" rather than filler problems. Statements and examples are original; the problem archetypes (pair sum, sliding window, subsets, linked-list reversal, BST inorder, topological sort, dynamic programming, …) are common exercise patterns, not copied judge text.

### 3.5 Posts — `lib/posts.ts`

```ts
type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;              // ISO
  displayDate: string;
  track: "DSA" | "System Design";
  accent: "green" | "blue" | "amber";
  glyph: string;
  blocks: PostBlock[];       // p, h2, ul, code, quote
};
```

Six posts, rendered by a structured block renderer rather than raw HTML or MDX. This avoids an HTML-injection surface and keeps typography consistent.

### 3.6 Progress metadata — `lib/module-meta.ts`

`ModuleMeta` flattens the three content tracks into one shape:

```ts
type ModuleMeta = {
  slug: string;              // lesson code, module slug or case-study slug
  step: number;
  title: string;
  phase: string;
  topics: string[];          // checklist length drives percentage
};
```

`allMeta` = 22 DSA lessons + 12 System Design modules + 6 case studies = 40 progress entries. `moduleMeta` remains as a deprecated alias for compatibility with older imports.

---

## 4. Client state inventory

All state is local. There is no API route, database, auth provider or third-party analytics script.

| Key | Written by | Shape | Purpose |
| --- | --- | --- | --- |
| `vishesh-lab.progress.v2` | `lib/progress.ts` | `Record<string, number[]>` | Completed checklist indices per lesson/module/case |
| `vishesh-lab.progress.v1` | legacy | same | Read-only fallback during migration |
| `vishesh-lab.solved.v1` | `lib/progress.ts` | `string[]` | Solved practice slugs |
| `vishesh-lab.notes.{lessonCode}` | `components/lesson-tools.tsx` | string | Per-lesson notes, autosaved |
| `vishesh-lab.board.v1` | `components/whiteboard.tsx` | `{ elements, files, savedAt }` | Excalidraw scene |
| `vishesh-lab.theme` | `components/theme-switcher.tsx` | `dark` \| `light` \| `system` | Theme preference |
| `vishesh-lab.accent` | `components/theme-switcher.tsx` | `green` \| `blue` \| `amber` | Accent preference |
| `vishesh-lab.dsa.auto-close` | `components/dsa-sidebar.tsx` | `"true"` \| `"false"` | Sidebar accordion behaviour |

Export/import uses the progress map and solved list only. The whiteboard and notes are not included in the progress JSON; this is stated in the UI.

---

## 5. Asset inventory

| Asset | Source | Status |
| --- | --- | --- |
| `public/icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon.ico` | Original Vishesh Lab mark | Owned |
| `public/og.png` | Original social card | Owned |
| `public/.nojekyll` | Build plumbing for GitHub Pages | Public-domain convention |
| Fonts: Geist, Geist Mono, Instrument Serif | Google Fonts via `next/font` | SIL OFL 1.1 |
| Icons | `lucide-react` (ISC) + site-specific composition | ISC |
| Diagrams | Rendered from structured data in `lib/` | Owned |
| Screenshots / stock photos / video | None | — |

No third-party images, illustrations, course thumbnails or embedded videos are shipped.

---

## 6. Build and QA checklist

Run from `D:\Workspace\vishesh-lab`:

```bash
npx tsc --noEmit        # type check
npm run lint            # ESLint
npm run build           # static export + postbuild flatten
npm run preview         # serve the exported site
```

Manual QA matrix:

- [ ] Home at desktop, tablet and mobile; hero, roadmap, track cards, posts, tools, CTA.
- [ ] Every route returns 200 and renders without a console error.
- [ ] DSA lesson: sidebar accordion, active lesson, auto-close toggle, mobile drawer, progress ring, mark complete, notes autosave, code tabs, copy.
- [ ] Course index: 17 topics, 22 lessons, per-topic progress.
- [ ] System Design index and all 12 modules: blueprint, checklist, related case study, prev/next.
- [ ] Case study index and all 6 studies: estimates, API table, data model, decisions, failure modes, refs, prev/next.
- [ ] Practice index: 17 category cards, solved counts, difficulty filter, all 8 problem pages, hint reveal, solved toggle.
- [ ] Posts: category tabs, pagination, all 6 post pages, code blocks, related links.
- [ ] Progress: charts render after hydration, doughnut/bar labels, next lesson, export/import/clear, mobile stacking.
- [ ] Whiteboard: Excalidraw loads, autosave, reset view, PNG export, clear, light/dark theme.
- [ ] About: coverage numbers, links, content policy, creator block.
- [ ] Theme: dark, light and system; green, blue and amber accents; no flash on reload.
- [ ] Accessibility: keyboard focus visible, skip link, landmark order, labels on icon buttons, `aria-pressed` / `aria-selected` states, reduced-motion preference.
- [ ] Metadata: title, description, canonical, OG/Twitter image, sitemap inclusion, `noindex` on progress and board.
- [ ] Internal link crawl: no `/course/[slug]` legacy links, no dead anchors.
- [ ] Static export: `out/` contains every route, `404.html`, sitemap, robots, manifest and `llms.txt`.
- [ ] Lighthouse: performance, accessibility, best practices, SEO.

Current known risks:

- `npm audit --omit=dev` reports 11 transitive advisories (2 high) from Excalidraw's Mermaid/KaTeX/nanoid dependency tree. No non-force fix; see `docs/LIBRARIES.md` and `THIRD_PARTY_NOTICES.md`.
- Excalidraw is lazy-loaded; an immediate screenshot after navigation can show the loading state before the chunk resolves.
- The site has no backend, so progress cannot sync between browsers. Export/import is the only migration path.

---

## 7. Copyright and provenance

### 7.1 Site content

All lesson prose, case-study prose, post prose, problem statements, hints, code samples, diagrams and page copy were written for Vishesh Lab. Copyright © 2026 Vishesh Tiwari. No license for redistribution has been granted yet; treat the content as all rights reserved until a license is chosen.

Recommended (pending decision):

- Prose and diagrams: CC BY-NC 4.0, so learners can share with attribution but cannot resell.
- Code samples: MIT, so readers can reuse snippets.
- Site source: MIT if the repository is made public.

These are recommendations, not current grants.

### 7.2 Reference site

`dsawithpiyush.com` was used as a structural reference only. The following were **not** copied:

- lesson prose, explanations, examples or exercises;
- source code, CSS, components or assets;
- screenshots, diagrams, illustrations, video or audio;
- logo, wordmark, colour palette or other brand assets;
- question banks or problem statements.

What was mirrored is functional and conventional: the order of DSA topics, the shape of a lesson URL, a left topic sidebar, a progress ring, a completion control and notes/code tabs. Topic names and algorithm names are common vocabulary and are not protected by copyright. The Vishesh Lab name, mark, copy and visual system are original.

### 7.3 External references

Lessons, modules and case studies link to external documentation and articles. Only the URL and a short descriptive label are stored. No external page content is mirrored, and links open with `rel="noopener noreferrer"`. A link is an attribution, not a licence to reproduce the destination.

### 7.4 Third-party software and fonts

Licences and notices are recorded in `THIRD_PARTY_NOTICES.md` and evaluated in `docs/LIBRARIES.md`. The short version:

| Component | Licence |
| --- | --- |
| Next.js, React, React DOM | MIT |
| Chart.js, react-chartjs-2 | MIT |
| Excalidraw | MIT |
| lucide-react | ISC |
| Tailwind CSS | MIT |
| TypeScript | Apache-2.0 |
| Geist, Geist Mono, Instrument Serif | SIL OFL 1.1 |

### 7.5 Data hygiene rules

1. Do not paste text from a course, book, blog or judge into `lib/`.
2. Do not add an image unless its licence and attribution are recorded in this file.
3. Do not add a dependency without adding it to `THIRD_PARTY_NOTICES.md`.
4. Keep external references as links; never mirror the destination.
5. If a contributor supplies content, record the contributor, date and licence in the dataset entry or a sidecar file.
6. Re-run the route and link checks after any dataset change.

---

## 8. Known gaps

- Practice covers 8 of 17 DSA topics; the remaining cards are explicitly marked "in preparation".
- DSA lessons beyond Programming Foundations are one lesson per topic; the reference has multiple lessons per topic. The data model supports adding more without a route change.
- No search-index update script; the command palette index is built in `app/layout.tsx` at render time.
- No automated accessibility or link test in CI yet.
- No deployment target configured; GitHub Pages needs the repository name, `NEXT_PUBLIC_BASE_PATH` and an explicit publish approval.
