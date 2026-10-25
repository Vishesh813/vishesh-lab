import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRight,
  Blueprint,
  BookOpen,
  CheckCircle,
  Code,
  Layers,
  Shield,
  Spark,
  Target,
} from "@/components/icons";
import { dsaLessons, dsaPhases, firstLesson, lessonHref } from "@/lib/dsa-course";
import { systemDesignModules } from "@/lib/system-design";
import { caseStudies } from "@/lib/case-studies";
import { posts } from "@/lib/posts";
import { canonical, ogImage, siteConfig } from "@/lib/site";

const description =
  "About Vishesh Lab: a focused learning platform for data structures, algorithms and system design. Why it exists, what it covers, how progress works and how the content is sourced.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: canonical("/about/") },
  openGraph: {
    title: "About — Vishesh Lab",
    description,
    url: canonical("/about/"),
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Vishesh Lab",
    description,
    images: [ogImage.url],
  },
};

const learn = [
  "Data structures from the first variable to graphs and dynamic programming.",
  "Algorithmic thinking: invariants, complexity, trade-offs and proof by example.",
  "System design: requirements, estimates, APIs, data, caching, queues and failure.",
  "Interview-focused problem-solving patterns, mapped back to the lesson that teaches them.",
  "Clean, readable code in JavaScript, Java, C++ and Python where it helps.",
  "A local progress map that shows what is done, what is next and what is still fuzzy.",
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Vishesh Lab",
    description,
    url: canonical("/about/"),
    inLanguage: siteConfig.language,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author,
      jobTitle: "Software engineer and educator",
      url: canonical("/about/"),
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: canonical("/"),
    },
  };

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <p className="eyebrow">About</p>
          <h1 className="page-title">About Vishesh Lab</h1>
          <p className="page-lede">
            Vishesh Lab is a focused learning platform designed to help students
            and professionals master data structures, algorithms, system design
            and interview problem-solving with clarity and confidence.
          </p>
          <div className="meta-row">
            <span className="meta-pill">
              <Layers width={12} height={12} aria-hidden="true" /> {dsaPhases.length} DSA topics
            </span>
            <span className="meta-pill">
              <BookOpen width={12} height={12} aria-hidden="true" /> {dsaLessons.length} lessons
            </span>
            <span className="meta-pill">
              <Code width={12} height={12} aria-hidden="true" /> {systemDesignModules.length} system modules
            </span>
            <span className="meta-pill">
              <Shield width={12} height={12} aria-hidden="true" /> no tracking
            </span>
          </div>
        </div>
      </section>

      <div className="shell about-page">
        <article className="about-article">
          <section className="about-block">
            <h2>What this is</h2>
            <p>
              This site is a structured path, not a content pile. The DSA track
              follows the order in which the ideas depend on each other. The
              System Design track adds the vocabulary and trade-offs that sit
              around the code. The practice and case studies are attached to the
              lesson that teaches the underlying idea.
            </p>
            <div className="about-tour">
              <div className="about-tour-visual" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <span className="about-tour-label">
                  <Spark width={12} height={12} aria-hidden="true" /> A short tour
                </span>
                <p>
                  Start with the lesson map. Each lesson gives you a definition, a
                  traced example, a code sample, a complexity table and a checklist.
                  Mark the checklist when you can explain it without notes.
                </p>
                <Link className="next-link" href={lessonHref(firstLesson.slug)}>
                  Open the first lesson
                  <ArrowRight width={13} height={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          <section className="about-block">
            <h2>What you will learn</h2>
            <ul className="about-learn">
              {learn.map((item) => (
                <li key={item}>
                  <CheckCircle width={14} height={14} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="about-block">
            <h2>How the tracks work</h2>
            <div className="track-summary-grid">
              <div className="track-summary-card">
                <Layers width={16} height={16} aria-hidden="true" />
                <h3>DSA Roadmap</h3>
                <p>
                  {dsaPhases.length} topics, {dsaLessons.length} lessons. From
                  programming foundations to dynamic programming. Each lesson:
                  definition, traced example, highlighted code in 4 languages,
                  checklist.
                </p>
                <Link className="next-link" href="/dsa/">
                  Open DSA roadmap
                  <ArrowRight width={13} height={13} aria-hidden="true" />
                </Link>
              </div>
              <div className="track-summary-card">
                <Blueprint width={16} height={16} aria-hidden="true" />
                <h3>System Design</h3>
                <p>
                  {systemDesignModules.length} modules from requirements to production.
                  {caseStudies.length} end-to-end case studies with estimates, APIs,
                  failure modes and trade-offs.
                </p>
                <Link className="next-link" href="/system-design/">
                  Open System Design
                  <ArrowRight width={13} height={13} aria-hidden="true" />
                </Link>
              </div>
              <div className="track-summary-card">
                <Target width={16} height={16} aria-hidden="true" />
                <h3>Practice & Tools</h3>
                <p>
                  Mapped DSA problems with progressive hints. Whiteboard for
                  sketching structures and systems. {posts.length} posts for the
                  stuck moments.
                </p>
                <Link className="next-link" href="/practice/">
                  Open practice
                  <ArrowRight width={13} height={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          <section className="about-block">
            <h2>How progress works</h2>
            <p>
              Everything is local. Checklists, notes, completed lessons and solved
              problems are stored in <code>localStorage</code> in your browser.
              No account, no server, no tracking. Export your progress if you
              switch devices.
            </p>
            <div className="about-cta-row">
              <Link className="btn btn-primary" href="/progress/">
                Open progress tracker
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
              <Link className="btn btn-secondary" href="/dsa/">
                Start the DSA roadmap
              </Link>
            </div>
          </section>

          <section className="about-block">
            <h2>Content principles</h2>
            <ul className="about-learn">
              <li>
                <CheckCircle width={14} height={14} aria-hidden="true" />
                <span>All prose, code samples, diagrams and case studies are original.</span>
              </li>
              <li>
                <CheckCircle width={14} height={14} aria-hidden="true" />
                <span>External links point to docs and articles we reference, not copy.</span>
              </li>
              <li>
                <CheckCircle width={14} height={14} aria-hidden="true" />
                <span>If a reference rots, the link is fixed — the source is never copied.</span>
              </li>
              <li>
                <CheckCircle width={14} height={14} aria-hidden="true" />
                <span>Open-source libraries and fonts are licensed and attributed.</span>
              </li>
            </ul>
          </section>

          <section className="about-block about-final">
            <p className="eyebrow">Start here</p>
            <h2>One lesson is enough for today.</h2>
            <p>
              Pick a track, read one lesson and mark one thing you can explain.
              The map gets clearer from there.
            </p>
            <div className="about-cta-row">
              <Link className="btn btn-primary btn-lg" href={lessonHref(firstLesson.slug)}>
                Start learning — it&apos;s free
                <ArrowRight width={15} height={15} aria-hidden="true" />
              </Link>
              <Link className="btn btn-secondary btn-lg" href="/progress/">
                See my progress
              </Link>
            </div>
          </section>
        </article>

        <aside className="sidebar about-side">
          <section className="side-card">
            <h2>At a glance</h2>
            <ul className="mini-list" style={{ marginTop: 0 }}>
              <li>
                <Layers width={13} height={13} aria-hidden="true" />
                <span>{dsaPhases.length} DSA topics · {dsaLessons.length} lessons</span>
              </li>
              <li>
                <Code width={13} height={13} aria-hidden="true" />
                <span>{systemDesignModules.length} System Design modules</span>
              </li>
              <li>
                <Target width={13} height={13} aria-hidden="true" />
                <span>{caseStudies.length} case studies · 8 practice problems</span>
              </li>
              <li>
                <Shield width={13} height={13} aria-hidden="true" />
                <span>Progress in localStorage only</span>
              </li>
            </ul>
          </section>

          <section className="side-card">
            <h2>Platform</h2>
            <ul className="mini-list" style={{ marginTop: 0 }}>
              <li>
                <Layers width={13} height={13} aria-hidden="true" />
                <span>Next.js 16 · App Router · static export</span>
              </li>
              <li>
                <Code width={13} height={13} aria-hidden="true" />
                <span>Tailwind CSS v4 · custom design system</span>
              </li>
              <li>
                <Spark width={13} height={13} aria-hidden="true" />
                <span>Chart.js · Excalidraw · Lucide icons</span>
              </li>
              <li>
                <Shield width={13} height={13} aria-hidden="true" />
                <span>GitHub Pages ready · no backend</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}