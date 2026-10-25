# Vishesh Lab

A static, no-account study atlas for data structures and algorithms. Seventeen short modules, eight mapped practice problems and three original field notes, tied together by an interactive dependency roadmap.

The site is a design and content experiment: the information architecture follows a conventional DSA syllabus, while all prose, examples, code samples and visual design are original to this project.

## What is inside

- **17 modules** across four phases, each with a mental model, core ideas, a worked code sample, a complexity table and references.
- **8 practice problems** with examples, constraints and progressive hints, mapped back to the module that teaches the idea.
- **3 field notes** on Big-O, sliding windows and finishing a roadmap.
- **Interactive roadmap** showing dependencies between modules and local completion.
- **Progress dashboard** with per-topic checklists, next-module routing and JSON export/import.
- **Search palette** (`Ctrl K` / `⌘ K`) across modules, problems, notes and pages.
- **Static-first SEO**: canonical URLs, Open Graph, JSON-LD, sitemap, robots, web manifest and `llms.txt`.

Progress is stored only in the browser's `localStorage`. There are no accounts, analytics, cookies or server-side profiles.

## Stack

- Next.js 16 (App Router, static export)
- React 19
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/turbopack`
- `next/font` (Geist, Geist Mono, Instrument Serif)
- No UI component library, no animation library, no backend

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and preview the static export

```bash
npm run build
npm run preview
```

The production build is written to `out/`. The preview server runs at [http://localhost:4173](http://localhost:4173) and serves the exported files exactly as a static host would, including trailing-slash redirects and the custom 404 page.

To build for a subpath deployment, set both public variables:

```bash
NEXT_PUBLIC_BASE_PATH=/vishesh-lab NEXT_PUBLIC_SITE_URL=https://owner.github.io npm run build
```

`NEXT_PUBLIC_BASE_PATH` is applied to links, assets and metadata. `NEXT_PUBLIC_SITE_URL` is used for canonical URLs, the sitemap and structured data.

## Deploy to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. It runs lint and build, derives the correct base path from the repository name, adds `.nojekyll`, and deploys `out/` through GitHub Pages.

1. Push the project to a GitHub repository.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually.

For a project repository such as `owner/vishesh-lab`, the workflow deploys to `https://owner.github.io/vishesh-lab/`. For a user site repository named `owner.github.io`, it deploys to the domain root with no base path.

If you use a custom domain, set `NEXT_PUBLIC_SITE_URL` to that domain in the workflow and keep `NEXT_PUBLIC_BASE_PATH` empty.

## Project structure

```text
app/                  App Router pages, metadata routes and global styles
  course/             17 module pages
  practice/           8 problem pages
  posts/              3 article pages
  progress/           local dashboard
  about/              navigation and content policy
components/           Header, footer, roadmap, checklists, search, charts
lib/                  Curriculum, problems, posts, graph layout, progress store
assets/               Source SVGs for the Open Graph image and app icons
public/               Exported static assets (icons, OG image, .nojekyll)
scripts/serve.mjs     Zero-dependency static preview server
```

## Content and privacy

- All site copy, code samples and examples are original to Vishesh Lab.
- External reference links belong to their respective authors and are provided as a second explanation, not as copied material.
- The module order follows a conventional DSA syllabus and is not copied from another course.
- Progress never leaves the browser. Use the progress page to export a JSON backup or import one on another device.
- There are no third-party scripts, trackers or advertising pixels.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Lint-free production build into `out/` |
| `npm run preview` | Serve the exported `out/` directory at port 4173 |
| `npm run lint` | Run ESLint across the project |
