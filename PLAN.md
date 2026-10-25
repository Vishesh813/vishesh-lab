# Vishesh Lab — build plan

## 1. Product brief

**Problem.** Interview preparation is split across DSA notes, system-design videos, random problem lists, and scattered progress trackers. Learners lose the thread between learning a concept and practising it.

**Primary user.** Vishesh and learners like him: comfortable with code, preparing for software engineering interviews, studying in short focused sessions on a laptop or phone.

**Current alternative.** A folder of bookmarks, a spreadsheet, and several content sites with different structures and no shared progress.

**Wedge.** One calm, visual atlas with two explicit tracks — DSA and System Design — where every lesson has a mental model, a checklist, a practice path, and local progress.

**Core loop.** Choose a track → open the next module → read the model → tick what you can explain → solve/design → see progress → continue.

**Success in 30 days.** Every page has an obvious next action; a learner can complete a full track without creating an account; the static site builds and deploys cleanly.

**Non-goals.** Accounts, backend, cloud sync, code execution, video hosting, social feeds, leaderboards, streaks, fake testimonials, analytics, AI tutor.

## 2. Scope

### Must ship
- Vishesh Lab branding throughout, including metadata, icons and OG image.
- Two first-class tracks: DSA (17 modules) and System Design (12 modules).
- Six original system-design case studies.
- Light/dark themes and green/blue/amber accents, persisted locally.
- Unified progress for DSA, System Design, case studies and solved practice.
- Search across both tracks, practice, notes and pages.
- Original notes, about, 404, sitemap, robots, manifest, llms.txt.
- Responsive, keyboard-accessible, reduced-motion-safe UI.
- Static GitHub Pages export.

### Should ship
- Interview whiteboard with saved sketches, prompt, timer and PNG export.
- Problem solved state.
- Track filters on notes and case studies.
- Copy button on code samples.
- Rich empty, loading and error states.

### Won't ship
- Auth, comments, cloud storage, video, code runner, social proof.

## 3. Route inventory and page specs

| Route | Goal | Primary action | Must verify |
| --- | --- | --- | --- |
| `/` | Explain the two-track offer in one screen | Enter a track | Both tracks visible; no DSA-only copy; theme controls; mobile hero |
| `/course/` | Browse the DSA route | Open next module | 17 modules, 4 phases, track switch, progress |
| `/course/[slug]/` | Teach one DSA concept | Tick topics / open practice | Original copy, code, complexity, next/prev, metadata |
| `/system-design/` | Browse the System Design route | Open next module | 12 modules, phases, blueprint, track switch, progress |
| `/system-design/[slug]/` | Teach one design concept | Tick topics / open case study | Diagram, tradeoffs, related case study, next/prev, metadata |
| `/case-studies/` | Browse design case studies | Open a case study | 6 cards, filters, difficulty, time |
| `/case-studies/[slug]/` | Walk one end-to-end design | Tick design checklist | Requirements, estimates, architecture, API, data, scale, failure, tradeoffs |
| `/practice/` | Choose a DSA problem | Open a problem | Solved status, filters, design-practice link |
| `/practice/[slug]/` | Practise one problem | Mark solved | Examples, constraints, hints, related module, solved state |
| `/posts/` | Read short field notes | Open a note | DSA + System Design filters, no dead cards |
| `/posts/[slug]/` | Read one note | Continue to related content | Prose, code, track label, related links |
| `/progress/` | See and manage progress | Continue next item / export | Both tracks, solved practice, empty state, import/export/clear |
| `/board/` | Sketch an interview design | Save/export | Canvas, tools, prompt, timer, clear, keyboard labels |
| `/about/` | Build trust and explain the product | Start a track | Vishesh branding, originality, accessibility, privacy |
| `not-found` | Recover from a bad URL | Search or go home | 404 status, search, links |
| Global palette | Find anything fast | Open result | Both tracks, case studies, keyboard, empty state |
| SEO files | Crawl and share correctly | — | Canonicals, OG, sitemap, robots, manifest, llms.txt |

## 4. Content architecture

- **DSA:** 17 existing modules, rewritten/rebranded around Vishesh Lab; 8 mapped problems; 3+ notes.
- **System Design:** 12 modules across Foundations, Scale, Distributed systems and Production.
- **Case studies:** URL shortener, real-time chat, news feed, ride dispatch, video streaming, distributed rate limiter.
- **Notes:** 3 existing DSA notes plus 3 System Design notes; every note tagged by track.
- **Progress:** one storage namespace with unique slugs; per-track summaries plus overall; solved problem IDs separate.
- **Search:** one typed index built at render time from all content sources.

## 5. Design system

- Black/white/green visual base; green gradient default.
- User accents: Green, Blue, Amber. User mode: Dark, Light, System.
- `data-theme` and `data-accent` on `<html>`; values persisted and applied before paint.
- One spacing scale, one radius scale, one motion scale.
- Serif display italic accent used sparingly; mono labels for structure.
- Track identity by icon and label, never by colour alone.
- 44px minimum interactive targets on touch.
- Focus visible, skip link, reduced-motion support, semantic landmarks.
- All backgrounds and borders expressed through theme tokens so both modes are coherent.

## 6. Build order

1. Rebrand foundation: package, config, site metadata, layout, icons, README.
2. Theme engine: tokens, dark/light, accents, switcher, no-flash boot script.
3. Content: System Design curriculum, case studies, notes, unified types.
4. Navigation and search: header, mobile menu, command palette, footer.
5. Pages: home, DSA, System Design, case studies, practice, notes, progress, board, about, 404.
6. Progress: DSA/SD/case-study checklists, solved practice, export/import.
7. Visual QA: desktop/mobile screenshots, contrast, overflow, empty states.
8. Technical QA: lint, typecheck, build, recursive crawl, metadata, anchors, console.
9. Performance/a11y: Lighthouse, keyboard-only, reduced motion, 200% zoom.
10. Deployment package: GitHub Pages workflow, basePath verification, docs.

## 7. Recursive audit checklist

### Every page
- [ ] One clear H1; logical heading order.
- [ ] Title, description, canonical, Open Graph and Twitter image.
- [ ] Breadcrumb and active navigation state.
- [ ] Primary action above the fold; no dead end at the bottom.
- [ ] Loading/empty/error state where data or local storage is involved.
- [ ] Mobile 360px, tablet 768px, desktop 1440px.
- [ ] Keyboard-only path and visible focus.
- [ ] 200% zoom without clipped content.
- [ ] Reduced-motion behavior.
- [ ] No placeholder copy, broken link, missing anchor or horizontal overflow.
- [ ] Light and dark themes; all three accents.
- [ ] No console errors or hydration warnings.

### Components
- [ ] Header, footer, palette, theme switcher, track switch.
- [ ] Progress rings, checklists, bars, cards, filters, code blocks.
- [ ] Blueprint diagrams, tables, callouts, buttons, badges, forms.
- [ ] Canvas controls, dialogs, import file input, timer.

### Technical
- [ ] `npm run lint`, typecheck, production build.
- [ ] Recursive crawl of every exported HTML page.
- [ ] Internal links, anchors, static assets and manifest resolve with basePath.
- [ ] Sitemap covers every index and detail route.
- [ ] Robots, llms.txt, RSS if shipped.
- [ ] GitHub Pages workflow works with project basePath.
- [ ] Lighthouse performance/accessibility/best-practices/SEO targets.
- [ ] No unapproved git commit, push or deploy.

## 8. Launch gate

- All must-ship routes exist and are linked.
- Every checklist item above passes or has a documented, justified exception.
- Static build succeeds from a clean install.
- Crawl reports zero missing pages, assets or anchors.
- No broken layout at 360/768/1440.
- Progress survives reload; import/export/clear are reversible or confirmed.
- Deployment instructions are current; deployment itself waits for explicit approval.
