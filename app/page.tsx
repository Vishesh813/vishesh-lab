import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Layers,
  PenTool,
  Spark,
} from "@/components/icons";
import { dsaLessons, dsaPhases } from "@/lib/dsa-course";
import { systemDesignModules } from "@/lib/system-design";
import { caseStudies } from "@/lib/case-studies";
import { posts } from "@/lib/posts";
import { canonical, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — DSA and System Design, kept separate`,
  description:
    "Two focused tracks: DSA and System Design. Separate roadmaps, lessons, practice and progress. Pick one and start learning.",
  alternates: { canonical: canonical("/") },
};

export default function Home() {
  const totalMinutes = dsaLessons.reduce(
    (total, lesson) => total + lesson.minutes,
    0,
  );

  return (
    <>
      <section className="ref-hero">
        <div className="shell ref-hero-inner">
          <span className="ref-hero-badge">
            <Spark width={12} height={12} aria-hidden="true" />
            Two focused tracks · pick one
          </span>
          <h1>
            Choose your
            <br />
            <span className="gradient-text">mode.</span>
          </h1>
          <p>
            DSA and System Design stay separate here — separate roadmaps,
            separate lessons, separate progress. Open one and the navigation
            stays inside that mode.
          </p>

          <div className="mode-choice-grid">
            <Link className="mode-choice-card" href="/dsa/">
              <span className="mode-choice-kicker">
                <Layers width={12} height={12} aria-hidden="true" />
                DSA
              </span>
              <h2>Data structures &amp; algorithms</h2>
              <p>
                One clear path from programming foundations to dynamic
                programming, with traced examples, highlighted code and local
                progress.
              </p>
              <span className="mode-choice-meta">
                {dsaPhases.length} topics · {dsaLessons.length} lessons ·{" "}
                {Math.round(totalMinutes / 60)}h · code in 4 languages
              </span>
              <span className="mode-choice-cta">
                Open the DSA roadmap
                <ArrowRight width={15} height={15} aria-hidden="true" />
              </span>
            </Link>

            <Link className="mode-choice-card" href="/system-design/">
              <span className="mode-choice-kicker">
                <Layers width={12} height={12} aria-hidden="true" />
                System Design
              </span>
              <h2>Requirements to production</h2>
              <p>
                Twelve modules from framing to the interview loop, plus six full
                case studies with estimates, failure modes and trade-offs.
              </p>
              <span className="mode-choice-meta">
                {systemDesignModules.length} modules · {caseStudies.length} case
                studies · own progress view
              </span>
              <span className="mode-choice-cta">
                Open System Design
                <ArrowRight width={15} height={15} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section ref-notes-section">
        <div className="shell">
          <div className="ref-section-head">
            <div>
              <p className="eyebrow">Posts</p>
              <h2 className="h2">Notes for the stuck moments.</h2>
            </div>
            <Link className="next-link" href="/posts/">
              All posts
              <ArrowRight width={14} height={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="ref-post-list">
            {posts.slice(0, 3).map((post) => (
              <Link
                className="ref-post-row"
                href={`/posts/${post.slug}/`}
                key={post.slug}
              >
                <span className="ref-post-tag">{post.category}</span>
                <span className="ref-post-main">
                  <strong>{post.title}</strong>
                  <span>{post.excerpt}</span>
                </span>
                <span className="ref-post-time">
                  {post.readTime} min
                  <ArrowRight width={13} height={13} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          <div className="ref-home-tools">
            <Link className="ref-tool-card" href="/practice/">
              <Code width={17} height={17} aria-hidden="true" />
              <span>
                <strong>Practice</strong>
                <span>Mapped DSA problems with progressive hints.</span>
              </span>
              <ArrowRight width={14} height={14} aria-hidden="true" />
            </Link>
            <Link className="ref-tool-card" href="/board/">
              <PenTool width={17} height={17} aria-hidden="true" />
              <span>
                <strong>Whiteboard</strong>
                <span>Sketch a structure or a system, then export it.</span>
              </span>
              <ArrowRight width={14} height={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="ref-cta">
            <div>
              <p className="eyebrow">Start here</p>
              <h2>Pick a mode above.</h2>
              <p>
                Each track stands alone. Open one and the navigation, lessons and
                progress stay inside that mode.
              </p>
            </div>
            <div className="ref-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/dsa/">
                Start with DSA
                <ArrowRight width={15} height={15} aria-hidden="true" />
              </Link>
              <Link className="btn btn-secondary btn-lg" href="/system-design/">
                Start with System Design
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
