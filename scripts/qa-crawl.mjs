import { writeFileSync } from "node:fs";

const baseArg = process.argv.find((arg) => arg.startsWith("--base="));
const base = (baseArg?.slice("--base=".length) ?? "http://localhost:3001").replace(/\/$/, "");

const extraRoutes = ["/progress/", "/board/", "/this-page-does-not-exist/"];

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function textOf(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

async function fetchPage(path) {
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const response = await fetch(url, { redirect: "manual" });
  const html = await response.text();
  return { path, url, status: response.status, html };
}

function analyse(path, result) {
  const { html, status } = result;
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
  const description =
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] ??
    html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/)?.[1] ??
    "";
  const canonical =
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/)?.[1] ??
    html.match(/<link[^>]+href="([^"]*)"[^>]+rel="canonical"/)?.[1] ??
    "";
  const ogImage =
    html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]*)"/)?.[1] ?? "";
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((match) =>
    textOf(match[1]),
  );
  const links = [...html.matchAll(/href="([^"]+)"/g)]
    .map((match) => decodeEntities(match[1]))
    .filter((href) => href.startsWith("/") || href.startsWith(base));
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const htmlWithoutCode = html.replace(/<pre[\s\S]*?<\/pre>/g, "");
  const suspicious = [];
  if (/>undefined</.test(htmlWithoutCode)) suspicious.push("renders 'undefined'");
  if (/>NaN</.test(htmlWithoutCode)) suspicious.push("renders 'NaN'");

  return {
    path,
    status,
    title,
    description,
    canonical,
    ogImage,
    h1Count: h1s.length,
    h1: h1s[0] ?? "",
    links,
    ids,
    suspicious,
    bytes: Buffer.byteLength(html),
  };
}

function normalise(href) {
  if (href.startsWith(base)) href = href.slice(base.length) || "/";
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
  let path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  if (!path) path = "/";
  if (!path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path)) path += "/";
  return { path, hash };
}

const sitemapResponse = await fetch(`${base}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const url = match[1];
  return url.startsWith(base) ? url.slice(base.length) || "/" : new URL(url).pathname;
});

const routes = [...new Set([...sitemapPaths, ...extraRoutes])];
const pages = [];
for (const path of routes) {
  try {
    const result = await fetchPage(path);
    pages.push(analyse(path, result));
  } catch (error) {
    pages.push({
      path,
      status: 0,
      title: "",
      description: "",
      canonical: "",
      ogImage: "",
      h1Count: 0,
      h1: "",
      links: [],
      ids: new Set(),
      suspicious: [String(error)],
      bytes: 0,
    });
  }
}

const pageByPath = new Map(pages.map((page) => [page.path, page]));
const linkTargets = new Map();
for (const page of pages) {
  for (const raw of page.links) {
    const { path, hash } = normalise(raw);
    if (!linkTargets.has(path)) linkTargets.set(path, { sources: new Set(), hashes: new Set() });
    linkTargets.get(path).sources.add(page.path);
    if (hash) linkTargets.get(path).hashes.add(hash);
  }
}

const broken = [];
const redirects = [];
const badAnchors = [];
for (const [path, meta] of [...linkTargets.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  if (path.startsWith("/_next/") || path.startsWith("/api/")) continue;
  try {
    const response = await fetch(`${base}${path}`, { redirect: "manual" });
    if (response.status >= 400) {
      broken.push({ path, status: response.status, sources: [...meta.sources].slice(0, 3) });
    } else if (response.status >= 300 && response.status < 400) {
      redirects.push({
        path,
        status: response.status,
        location: response.headers.get("location") ?? "",
        sources: [...meta.sources].slice(0, 3),
      });
    } else {
      for (const hash of meta.hashes) {
        const target = pageByPath.get(path);
        if (target && hash && !target.ids.has(hash)) {
          badAnchors.push({ path, hash, sources: [...meta.sources].slice(0, 3) });
        }
      }
    }
  } catch (error) {
    broken.push({ path, status: 0, sources: [...meta.sources].slice(0, 3), error: String(error) });
  }
}

const missingTitle = pages.filter((page) => page.status === 200 && !page.title);
const missingDescription = pages.filter(
  (page) => page.status === 200 && !page.description && !page.path.includes("this-page"),
);
const missingCanonical = pages.filter(
  (page) =>
    page.status === 200 &&
    !page.canonical &&
    !page.path.includes("this-page") &&
    page.path !== "/board/" &&
    page.path !== "/progress/",
);
const multipleH1 = pages.filter((page) => page.h1Count > 1);
const noH1 = pages.filter((page) => page.status === 200 && page.h1Count === 0);
const suspicious = pages.filter((page) => page.suspicious.length > 0);

const report = [
  "# QA crawl report",
  "",
  `Base: \`${base}\`  `,
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Summary",
  "",
  `- Pages fetched: **${pages.length}**`,
  `- Page responses not 200: **${pages.filter((page) => page.status !== 200).length}**`,
  `- Unique internal links checked: **${linkTargets.size}**`,
  `- Broken internal links: **${broken.length}**`,
  `- Internal redirects: **${redirects.length}**`,
  `- Bad in-page anchors: **${badAnchors.length}**`,
  `- Pages missing a title: **${missingTitle.length}**`,
  `- Pages missing a description: **${missingDescription.length}**`,
  `- Pages missing a canonical: **${missingCanonical.length}**`,
  `- Pages with more than one h1: **${multipleH1.length}**`,
  `- Pages with no h1: **${noH1.length}**`,
  `- Pages with suspicious output: **${suspicious.length}**`,
  "",
  "## Page results",
  "",
  "| Route | Status | H1 | Title | Links | Bytes |",
  "| --- | ---: | ---: | --- | ---: | ---: |",
  ...pages.map(
    (page) =>
      `| \`${page.path}\` | ${page.status} | ${page.h1Count} | ${page.title || "—"} | ${page.links.length} | ${page.bytes} |`,
  ),
  "",
  "## Broken links",
  "",
  broken.length
    ? [
        "| Target | Status | Found on |",
        "| --- | ---: | --- |",
        ...broken.map(
          (entry) =>
            `| \`${entry.path}\` | ${entry.status} | ${entry.sources.map((source) => `\`${source}\``).join(", ")} |`,
        ),
      ].join("\n")
    : "None.",
  "",
  "## Internal redirects",
  "",
  redirects.length
    ? [
        "| Target | Status | Location | Found on |",
        "| --- | ---: | --- | --- |",
        ...redirects.map(
          (entry) =>
            `| \`${entry.path}\` | ${entry.status} | ${entry.location || "—"} | ${entry.sources.map((source) => `\`${source}\``).join(", ")} |`,
        ),
      ].join("\n")
    : "None.",
  "",
  "## Bad anchors",
  "",
  badAnchors.length
    ? [
        "| Target | Anchor | Found on |",
        "| --- | --- | --- |",
        ...badAnchors.map(
          (entry) =>
            `| \`${entry.path}\` | \`#${entry.hash}\` | ${entry.sources.map((source) => `\`${source}\``).join(", ")} |`,
        ),
      ].join("\n")
    : "None.",
  "",
  "## Metadata gaps",
  "",
  `- Missing title: ${missingTitle.map((page) => `\`${page.path}\``).join(", ") || "none"}`,
  `- Missing description: ${missingDescription.map((page) => `\`${page.path}\``).join(", ") || "none"}`,
  `- Missing canonical: ${missingCanonical.map((page) => `\`${page.path}\``).join(", ") || "none"}`,
  `- Multiple h1: ${multipleH1.map((page) => `\`${page.path}\``).join(", ") || "none"}`,
  `- No h1: ${noH1.map((page) => `\`${page.path}\``).join(", ") || "none"}`,
  `- Suspicious output: ${suspicious.map((page) => `\`${page.path}\` (${page.suspicious.join("; ")})`).join(", ") || "none"}`,
  "",
  "## Notes",
  "",
  "- The 404 route is fetched as `/this-page-does-not-exist/`; a 404 status there is expected and is excluded from the broken-page count only in the page table, not the link check.",
  "- `/progress/` and `/board/` are intentionally excluded from the sitemap and marked `noindex`.",
  "- External links are not fetched; only internal navigation is checked.",
  "- Canonical URLs use `NEXT_PUBLIC_SITE_URL`; set it to the deployed origin before publishing.",
  "",
];

writeFileSync("docs/QA-REPORT.md", report.join("\n"));

console.log(
  JSON.stringify(
    {
      pages: pages.length,
      non200: pages.filter((page) => page.status !== 200).length,
      links: linkTargets.size,
      broken: broken.length,
      redirects: redirects.length,
      badAnchors: badAnchors.length,
      missingTitle: missingTitle.length,
      missingDescription: missingDescription.length,
      missingCanonical: missingCanonical.length,
      multipleH1: multipleH1.length,
      noH1: noH1.length,
      suspicious: suspicious.length,
    },
    null,
    2,
  ),
);
if (broken.length) console.log("Broken:", broken);
if (redirects.length) console.log("Redirects:", redirects.slice(0, 20));
if (badAnchors.length) console.log("Bad anchors:", badAnchors.slice(0, 20));
