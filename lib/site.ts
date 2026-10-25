export const siteConfig = {
  name: "Vishesh Lab",
  shortName: "Vishesh",
  author: "Vishesh Tiwari",
  tagline: "DSA & System Design, made visual.",
  description:
    "A visual, two-mode field guide to data structures, algorithms and system design. Concise lessons, mapped practice, original case studies and progress that stays in your browser.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  basePath: (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, ""),
  locale: "en_US",
  language: "en",
} as const;

export function absoluteUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${siteConfig.basePath}${clean}`;
}

export function canonical(path = "/") {
  return absoluteUrl(path);
}

export const metadataBase = new URL(`${siteConfig.url}${siteConfig.basePath}/`);

export const ogImage = {
  url: `${siteConfig.basePath}/og.png`,
  width: 1200,
  height: 630,
  alt: "Vishesh Lab — DSA and System Design, made visual",
};
