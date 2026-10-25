import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = "out";
const pages = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".html")) pages.push(full);
  }
}
walk(root);

const issues = [];
const rows = [];
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const rel = relative(root, page).replaceAll("\\", "/");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? "";
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  const lang = html.match(/<html lang="([^"]*)"/)?.[1] ?? "";
  if (!title) issues.push(`${rel}: missing title`);
  if (!desc) issues.push(`${rel}: missing description`);
  if (!canonical) issues.push(`${rel}: missing canonical`);
  if (!ogImage) issues.push(`${rel}: missing og:image`);
  if (h1s !== 1) issues.push(`${rel}: ${h1s} h1 elements`);
  if (lang !== "en") issues.push(`${rel}: lang=${lang}`);
  if (canonical && !canonical.startsWith("http://localhost:3000")) issues.push(`${rel}: canonical ${canonical}`);
  if (ogImage && !ogImage.endsWith("/og.png")) issues.push(`${rel}: og ${ogImage}`);
  rows.push({ rel, title, canonical });
}
console.log(`pages: ${pages.length}`);
console.log(`issues: ${issues.length}`);
for (const i of issues) console.log("  " + i);
console.log("--- unique titles ---");
console.log(new Set(rows.map((r) => r.title)).size);
