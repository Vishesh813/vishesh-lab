import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Spotlight } from "@/components/spotlight";
import type { SearchItem } from "@/components/command-palette";
import { dsaLessons, lessonHref } from "@/lib/dsa-course";
import { systemDesignModules } from "@/lib/system-design";
import { caseStudies } from "@/lib/case-studies";
import { problems } from "@/lib/problems";
import { posts } from "@/lib/posts";
import { canonical, metadataBase, ogImage, siteConfig } from "@/lib/site";
import "./globals.css";
import "./extra.css";
import "./replica.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${siteConfig.name} — ${siteConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author, url: canonical("/about/") }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  keywords: [
    "DSA roadmap",
    "system design roadmap",
    "system design interview",
    "data structures and algorithms",
    "learn DSA visually",
    "system design case studies",
    "coding interview preparation",
    "Big-O",
    "distributed systems",
  ],
  alternates: { canonical: canonical("/") },
  icons: {
    icon: [
      { url: `${siteConfig.basePath}/icon.svg`, type: "image/svg+xml" },
      {
        url: `${siteConfig.basePath}/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: `${siteConfig.basePath}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: `${siteConfig.basePath}/favicon.ico`,
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
    shortcut: `${siteConfig.basePath}/icon.svg`,
    apple: `${siteConfig.basePath}/apple-touch-icon.png`,
  },
  manifest: `${siteConfig.basePath}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: canonical("/"),
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: [`${siteConfig.basePath}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050705" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8f3" },
  ],
  colorScheme: "dark light",
};

const searchItems: SearchItem[] = [
  ...dsaLessons.map((lesson) => ({
    type: "DSA" as const,
    title: lesson.title,
    href: lessonHref(lesson.slug),
    meta: `${lesson.phase} · ${lesson.minutes} min`,
  })),
  ...systemDesignModules.map((module) => ({
    type: "System Design" as const,
    title: module.title,
    href: `/system-design/${module.slug}/`,
    meta: `Module ${String(module.step).padStart(2, "0")} · ${module.phase}`,
  })),
  ...caseStudies.map((study) => ({
    type: "Case study" as const,
    title: study.title,
    href: `/case-studies/${study.slug}/`,
    meta: `${study.difficulty} · ${study.minutes} min`,
  })),
  ...problems.map((problem) => ({
    type: "Practice" as const,
    title: problem.title,
    href: `/practice/${problem.slug}/`,
    meta: problem.difficulty,
  })),
  ...posts.map((post) => ({
    type: "Note" as const,
    title: post.title,
    href: `/posts/${post.slug}/`,
    meta: `${post.track} · ${post.readTime} min`,
  })),
  { type: "Page", title: "DSA roadmap", href: "/dsa/", meta: "DSA mode" },
  {
    type: "Page",
    title: "System Design curriculum",
    href: "/system-design/",
    meta: "Systems mode",
  },
  {
    type: "Page",
    title: "All case studies",
    href: "/case-studies/",
    meta: "Design practice",
  },
  { type: "Page", title: "All practice problems", href: "/practice/", meta: "Practice" },
  { type: "Page", title: "All field notes", href: "/posts/", meta: "Notes" },
  { type: "Page", title: "Interview board", href: "/board/", meta: "Tool" },
  { type: "Page", title: "Progress by mode", href: "/progress/", meta: "Local" },
  { type: "Page", title: "About Vishesh Lab", href: "/about/", meta: "Page" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteConfig.name,
      alternateName: "Vishesh Lab",
      url: canonical("/"),
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      isAccessibleForFree: true,
      publisher: {
        "@type": "Person",
        name: siteConfig.author,
        url: canonical("/about/"),
      },
    },
    {
      "@type": "Person",
      name: siteConfig.author,
      url: canonical("/about/"),
      jobTitle: "Software engineer and educator",
    },
  ],
};

const themeBoot = `(function(){try{var m=localStorage.getItem("vishesh-lab.theme")||"dark";var a=localStorage.getItem("vishesh-lab.accent")||"green";var d=m==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):m;if(d!=="light"&&d!=="dark")d="dark";if(a!=="green"&&a!=="blue"&&a!=="amber")a="green";document.documentElement.dataset.theme=d;document.documentElement.dataset.accent=a;document.documentElement.style.colorScheme=d;}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.language}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      data-theme="dark"
      data-accent="green"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <div className="site-bg" aria-hidden="true">
          <div className="aurora aurora-a" />
          <div className="aurora aurora-b" />
          <div className="aurora aurora-c" />
          <div className="grid-veil" />
          <div className="grain" />
        </div>

        <Spotlight />
        <SiteHeader searchItems={searchItems} />

        <main id="main">{children}</main>

        <SiteFooter />

        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent-bright)" />
              <stop offset="55%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
        </svg>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <noscript>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 200,
              padding: "10px 16px",
              background: "#0a0f0b",
              borderTop: "1px solid rgba(148,163,184,.2)",
              color: "#c9d2c4",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Progress tracking needs JavaScript. Every lesson, case study and note
            remains readable without it.
          </div>
        </noscript>
      </body>
    </html>
  );
}
