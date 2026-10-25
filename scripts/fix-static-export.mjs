import { existsSync, readdirSync, renameSync, rmdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Next.js 16 static export writes segment-cache files into nested directories
 * on Windows because the segment path keeps backslashes. The client requests
 * the flat, dot-separated filename, so those prefetches 404.
 *
 * This flattens only the affected `__next.*` folders. On Linux and macOS the
 * export already uses flat filenames and this script is a no-op.
 * Upstream issue: https://github.com/vercel/next.js/issues/85374
 */

const out = "out";

if (!existsSync(out)) {
  console.log("No out/ directory; nothing to flatten.");
  process.exit(0);
}

function collectFiles(dir, files) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectFiles(full, files);
    else files.push(full);
  }
}

function removeEmptyDirs(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) removeEmptyDirs(full);
  }
  if (readdirSync(dir).length === 0) rmdirSync(dir);
}

let moved = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;

    if (name.startsWith("__next.")) {
      const files = [];
      collectFiles(full, files);
      for (const file of files) {
        const suffix = relative(full, file).split(sep).join(".");
        const target = join(dir, `${name}.${suffix}`);
        renameSync(file, target);
        moved += 1;
      }
      removeEmptyDirs(full);
    } else {
      walk(full);
    }
  }
}

walk(out);

if (moved) {
  console.log(`Flattened ${moved} static-export segment file(s).`);
}
