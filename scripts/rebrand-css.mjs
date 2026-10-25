import { readFileSync, writeFileSync } from "node:fs";

let css = readFileSync("../algoatlas/app/globals.css", "utf8");

// Map old brand tokens onto the new theme layer.
css = css.replace(
  /@theme inline \{[\s\S]*?\n\}/,
  `@theme inline {
  --color-void: var(--void);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-muted: var(--muted);
  --color-dim: var(--dim);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --color-accent-2: var(--accent-2);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-serif: var(--font-instrument-serif);
}`,
);

css = css.replace(
  /:root \{[\s\S]*?\n\}/,
  `:root {
  color-scheme: dark;
  --void: #050705;
  --void-2: #080b08;
  --panel: rgba(14, 19, 15, 0.72);
  --panel-solid: #0a0f0b;
  --panel-soft: rgba(18, 25, 19, 0.55);
  --panel-soft-hover: rgba(23, 32, 24, 0.72);
  --card-bg: linear-gradient(180deg, rgba(17, 24, 18, 0.68), rgba(7, 11, 8, 0.62));
  --card-bg-hover: linear-gradient(180deg, rgba(23, 32, 24, 0.78), rgba(8, 12, 9, 0.66));
  --console-bg: linear-gradient(180deg, rgba(15, 22, 16, 0.96), rgba(5, 8, 6, 0.97));
  --code-bg: #060a07;
  --code-ink: #cbd8cc;
  --header-bg: rgba(5, 8, 6, 0.58);
  --header-bg-strong: rgba(5, 8, 6, 0.9);
  --ink: #f2f7f1;
  --ink-soft: #cbd8cc;
  --muted: #94a398;
  --dim: #68766c;
  --line: rgba(163, 185, 167, 0.14);
  --line-strong: rgba(163, 185, 167, 0.26);
  --accent: #4ade80;
  --accent-rgb: 74, 222, 128;
  --accent-bright: #86efac;
  --accent-bright-rgb: 134, 239, 172;
  --accent-deep: #15803d;
  --accent-2: #bef264;
  --accent-2-rgb: 190, 242, 100;
  --green: #34d399;
  --amber: #fbbf24;
  --danger: #fb7185;
  --radius: 18px;
  --shadow: 0 30px 80px -45px rgba(0, 0, 0, 0.95);
  --selection: rgba(74, 222, 128, 0.32);
}

html[data-accent="blue"] {
  --accent: #60a5fa;
  --accent-rgb: 96, 165, 250;
  --accent-bright: #93c5fd;
  --accent-bright-rgb: 147, 197, 253;
  --accent-deep: #1d4ed8;
  --accent-2: #38bdf8;
  --accent-2-rgb: 56, 189, 248;
  --selection: rgba(96, 165, 250, 0.32);
}

html[data-accent="amber"] {
  --accent: #fbbf24;
  --accent-rgb: 251, 191, 36;
  --accent-bright: #fde68a;
  --accent-bright-rgb: 253, 230, 138;
  --accent-deep: #b45309;
  --accent-2: #f59e0b;
  --accent-2-rgb: 245, 158, 11;
  --selection: rgba(251, 191, 36, 0.3);
}

html[data-theme="light"] {
  color-scheme: light;
  --void: #f6f8f3;
  --void-2: #eef2e9;
  --panel: rgba(255, 255, 255, 0.8);
  --panel-solid: #ffffff;
  --panel-soft: rgba(255, 255, 255, 0.72);
  --panel-soft-hover: rgba(255, 255, 255, 0.94);
  --card-bg: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(246, 249, 243, 0.82));
  --card-bg-hover: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(240, 247, 237, 0.92));
  --console-bg: linear-gradient(180deg, #ffffff, #f1f6ed);
  --code-bg: #0b120d;
  --code-ink: #d5e1d7;
  --header-bg: rgba(247, 250, 244, 0.72);
  --header-bg-strong: rgba(247, 250, 244, 0.94);
  --ink: #0a140d;
  --ink-soft: #253b2d;
  --muted: #4d6354;
  --dim: #65796a;
  --line: rgba(22, 50, 30, 0.13);
  --line-strong: rgba(22, 50, 30, 0.24);
  --accent: #15803d;
  --accent-rgb: 21, 128, 61;
  --accent-bright: #047857;
  --accent-bright-rgb: 4, 120, 87;
  --accent-deep: #14532d;
  --accent-2: #4d7c0f;
  --accent-2-rgb: 77, 124, 15;
  --selection: rgba(21, 128, 61, 0.22);
  --shadow: 0 30px 80px -45px rgba(18, 42, 25, 0.3);
}

html[data-theme="light"][data-accent="blue"] {
  --accent: #1d4ed8;
  --accent-rgb: 29, 78, 216;
  --accent-bright: #1e40af;
  --accent-bright-rgb: 30, 64, 175;
  --accent-deep: #1e3a8a;
  --accent-2: #0369a1;
  --accent-2-rgb: 3, 105, 161;
  --selection: rgba(29, 78, 216, 0.2);
}

html[data-theme="light"][data-accent="amber"] {
  --accent: #b45309;
  --accent-rgb: 180, 83, 9;
  --accent-bright: #92400e;
  --accent-bright-rgb: 146, 64, 14;
  --accent-deep: #78350f;
  --accent-2: #a16207;
  --accent-2-rgb: 161, 98, 7;
  --selection: rgba(180, 83, 9, 0.2);
}`,
);

css = css
  .replaceAll("var(--violet-bright)", "var(--accent-bright)")
  .replaceAll("var(--violet)", "var(--accent)")
  .replaceAll("var(--cyan)", "var(--accent-2)")
  .replaceAll("var(--magenta)", "var(--accent-2)")
  .replace(/#8b5cf6/gi, "var(--accent)")
  .replace(/#a78bfa/gi, "var(--accent-bright)")
  .replace(/#22d3ee/gi, "var(--accent-2)")
  .replace(/#ddd6fe/gi, "var(--accent-bright)")
  .replace(/#6d28d9|#4f46e5|#4338ca|#7c3aed|#4c1d95/gi, "var(--accent-deep)")
  .replace(/rgba\(139, 92, 246, ([^)]+)\)/g, (_, alpha) => `rgba(var(--accent-rgb), ${alpha})`)
  .replace(/rgba\(167, 139, 250, ([^)]+)\)/g, (_, alpha) => `rgba(var(--accent-bright-rgb), ${alpha})`)
  .replace(/rgba\(34, 211, 238, ([^)]+)\)/g, (_, alpha) => `rgba(var(--accent-2-rgb), ${alpha})`)
  .replace(/rgba\(109, 40, 217, ([^)]+)\)/g, (_, alpha) => `rgba(var(--accent-rgb), ${alpha})`)
  .replace(/rgba\(8, 145, 178, ([^)]+)\)/g, (_, alpha) => `rgba(var(--accent-2-rgb), ${alpha})`)
  .replace(/rgba\(190, 24, 93, ([^)]+)\)/g, (_, alpha) => `rgba(var(--accent-2-rgb), ${alpha})`);

const backgrounds = new Map([
  ["background: rgba(5, 6, 10, 0.58);", "background: var(--header-bg);"],
  ["background: rgba(5, 6, 10, 0.86);", "background: var(--header-bg-strong);"],
  ["background: rgba(13, 16, 28, 0.66);", "background: var(--panel);"],
  ["background: rgba(17, 21, 36, 0.5);", "background: var(--panel-soft);"],
  ["background: rgba(17, 21, 36, 0.55);", "background: var(--panel-soft);"],
  ["background: rgba(17, 21, 36, 0.6);", "background: var(--panel-soft);"],
  ["background: linear-gradient(180deg, rgba(17, 21, 36, 0.6), rgba(8, 10, 18, 0.55));", "background: var(--card-bg);"],
  ["background: linear-gradient(180deg, rgba(21, 25, 44, 0.7), rgba(9, 11, 20, 0.6));", "background: var(--card-bg-hover);"],
  ["background: linear-gradient(180deg, rgba(17, 21, 36, 0.55), rgba(8, 10, 18, 0.55));", "background: var(--card-bg);"],
  ["background: linear-gradient(180deg, rgba(24, 28, 48, 0.7), rgba(9, 11, 20, 0.6));", "background: var(--card-bg-hover);"],
  ["background: linear-gradient(180deg, rgba(15, 19, 34, 0.94), rgba(7, 9, 17, 0.96));", "background: var(--console-bg);"],
  ["background: #070a12;", "background: var(--code-bg);"],
  ["color: #cbd5e1;", "color: var(--code-ink);"],
  ["background: rgba(139, 92, 246, 0.42);", "background: var(--selection);"],
  ["background: rgba(13, 16, 28, 0.7);", "background: var(--panel);"],
  ["background: rgba(8, 10, 18, 0.55);", "background: var(--panel-soft);"],
]);

for (const [from, to] of backgrounds) css = css.split(from).join(to);

writeFileSync("app/globals.css", css);
console.log("Rebuilt app/globals.css from the original with theme tokens.");
