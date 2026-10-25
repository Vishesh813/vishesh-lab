import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";

const root = resolve("out");
const pages = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".html")) pages.push(full);
  }
}
walk(root);

const missing = [];
const anchors = [];
const checked = new Set();
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const rel = relative(root, page);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let url = match[1].replace(/&amp;/g, "&");
    if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("data:") || url.startsWith("javascript:")) continue;
    if (url.startsWith("#")) {
      const id = url.slice(1);
      if (id && !html.includes(`id="${id}"`)) anchors.push(`${rel} -> ${url}`);
      continue;
    }
    const [pathPart, hash] = url.split("#");
    const clean = pathPart.split("?")[0];
    if (!clean) continue;
    let target = clean.startsWith("/") ? join(root, clean) : resolve(dirname(page), clean);
    if (clean.endsWith("/")) target = join(target, "index.html");
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
    if (!existsSync(target)) {
      if (!checked.has(`${rel}|${url}`)) missing.push(`${rel} -> ${url}`);
      checked.add(`${rel}|${url}`);
      continue;
    }
    if (hash && target.endsWith(".html")) {
      const targetHtml = readFileSync(target, "utf8");
      if (!targetHtml.includes(`id="${hash}"`)) anchors.push(`${rel} -> ${url}`);
    }
  }
}
console.log(`pages: ${pages.length}`);
console.log(`missing links: ${missing.length}`);
for (const item of missing.slice(0, 60)) console.log("  " + item);
console.log(`missing anchors: ${anchors.length}`);
for (const item of anchors.slice(0, 60)) console.log("  " + item);
