# Third-party notices

Vishesh Lab is a static site. It ships no third-party article text, course prose, images, video or audio. It does ship open-source JavaScript, open-source fonts and a set of generated icons. Their licences and copyright notices are reproduced below.

The complete resolved production dependency tree — 269 packages — is listed in [`docs/DEPENDENCY-LICENCES.md`](docs/DEPENDENCY-LICENCES.md). That register is generated from the installed tree, so it includes transitive packages that may be bundled into the client by Excalidraw or the Next.js runtime.

---

## Direct dependencies

| Package | Version | Licence | Copyright |
| --- | --- | --- | --- |
| `next` | 16.4.3 | MIT | Copyright (c) 2025 Vercel, Inc. |
| `react` | 19.3.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `react-dom` | 19.3.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `chart.js` | 4.6.1 | MIT | Copyright (c) 2014–2024 Chart.js Contributors |
| `react-chartjs-2` | 5.3.1 | MIT | Copyright 2020 Jeremy Ayerst |
| `@excalidraw/excalidraw` | 0.18.1 | MIT | Copyright (c) 2020 Excalidraw authors |
| `lucide-react` | 1.61.0 | ISC | Copyright (c) 2026 Lucide Icons and Contributors |
| `prism-react-renderer` | 2.4.1 | MIT | Copyright (c) 2018 Nearform |
| `tailwindcss` | 4.3.3 | MIT | Copyright (c) Tailwind Labs, Inc. |
| `typescript` | 5.9.3 | Apache-2.0 | Copyright Microsoft Corporation (development only) |

Notable transitive packages:

| Package | Licence | Copyright / note |
| --- | --- | --- |
| `mermaid` | MIT | Copyright (c) 2014–2022 Knut Sveidqvist |
| `katex` | MIT | Copyright (c) 2013–2020 Khan Academy and other contributors |
| `nanoid` | MIT | Copyright 2017 Andrey Sitnik |
| `lodash-es` | MIT | Copyright OpenJS Foundation and other contributors |
| `dompurify` | MPL-2.0 OR Apache-2.0 | Used by Mermaid; this project relies on the Apache-2.0 option |
| `chevrotain` | Apache-2.0 | Parser runtime used by Mermaid |
| `prismjs` | MIT | Syntax-highlighting engine bundled inside `prism-react-renderer`; Copyright (c) 2012 Lea Verou |

---

## Fonts

| Font | Source | Licence |
| --- | --- | --- |
| Geist | Vercel, via Google Fonts / `next/font` | SIL Open Font License 1.1 |
| Geist Mono | Vercel, via Google Fonts / `next/font` | SIL Open Font License 1.1 |
| Instrument Serif | Instrument, via Google Fonts / `next/font` | SIL Open Font License 1.1 |

The full OFL 1.1 text is included at [`public/licenses/OFL-1.1.txt`](public/licenses/OFL-1.1.txt) and is served at `/licenses/OFL-1.1.txt` in the exported site. The fonts are self-hosted by Next.js font optimisation at build time; no request is made to Google at runtime.

---

## MIT licence text

Applies to Next.js, React, React DOM, Chart.js, react-chartjs-2, Excalidraw, Tailwind CSS, Mermaid, KaTeX, nanoid, lodash-es, prism-react-renderer, PrismJS and the other MIT-licensed packages in the register.

```text
MIT License

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The `<year> <copyright holders>` placeholder is filled by the per-package lines in the table above and in `docs/DEPENDENCY-LICENCES.md`. The full licence files remain in each package under `node_modules/`.

---

## ISC licence text

Applies to `lucide-react`.

```text
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## Apache-2.0 and other licences

- **TypeScript** is Apache-2.0. It is a development dependency and is not shipped in the client bundle. The full text is at <https://www.apache.org/licenses/LICENSE-2.0> and in `node_modules/typescript/LICENSE.txt`.
- **Chevrotain** is Apache-2.0. It is pulled in by Mermaid's parser. The full text is in the package directory.
- **DOMPurify** is dual-licensed MPL-2.0 OR Apache-2.0. This project relies on the Apache-2.0 option.
- **caniuse-lite** is CC-BY-4.0. It supplies browser-support data at build time and is not part of the visible content.
- **sharp / libvips** (`@img/sharp-*`) is Apache-2.0 AND LGPL-3.0-or-later. It is an optional Next.js image dependency; this site sets `images.unoptimized: true` and uses static export, so it is not part of the shipped client.

---

## Excalidraw security note

`@excalidraw/excalidraw@0.18.1` brings in `@excalidraw/mermaid-to-excalidraw`, Mermaid, KaTeX, `nanoid` and `lodash-es`. `npm audit --omit=dev` reports 11 advisories in that transitive tree (2 high, 7 moderate, 2 low). There is no non-force fix; the force fix downgrades Excalidraw to 0.17.6.

The board is a local-only tool. The UI does not expose Mermaid import, HTML embedding, collaboration, remote scene loading or URL-based scene loading. The editor is lazy-loaded on `/board/` only. The advisories are tracked in `docs/LIBRARIES.md`; if a practical exploit path appears, the board should be replaced rather than force-downgraded.

---

## Content provenance

All site prose, lesson examples, case studies, posts, practice statements, diagrams and code samples are original to Vishesh Lab. Copyright © 2026 Vishesh Tiwari. No reference-site prose, code, images, video or branding is included. External references are links only.

If you believe a third-party work has been used without attribution, open an issue with the URL and the location in this repository. The claim will be checked against the dataset and either attributed or removed.

---

## Regenerating the register

```bash
npx --yes license-checker --production --json > licenses.json
node scripts/generate-license-register.mjs licenses.json
```

Review the diff before publishing. A new licence type or a package with no repository entry should be inspected manually.
