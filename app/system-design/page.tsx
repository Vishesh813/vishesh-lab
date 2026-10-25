import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SystemDesignList } from "@/components/system-design-list";
import { TrackDashboardProgress } from "@/components/track-dashboard-progress";
import {
  ArrowRight,
  Blueprint,
  Clock,
  Compass,
  Layers,
  MapIcon,
  PenTool,
  Target,
} from "@/components/icons";
import { systemDesignModules } from "@/lib/system-design";
import { caseStudies } from "@/lib/case-studies";
import { canonical, ogImage, siteConfig } from "@/lib/site";

const title = "System Design — from requirements to production";
const description =
  "A twelve-module system design track: requirements, scaling, caching, databases, queues, consistency, resilience, observability, security and the 45-minute interview loop.";

export const metadata: Metadata = {
  title: "System Design track",
  description,
  alternates: { canonical: canonical("/system-design/") },
  openGraph: {
    title,
    description,
    url: canonical("/system-design/"),
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage.url],
  },
};

const totalMinutes = systemDesignModules.reduce(
  (total, module) => total + module.minutes,
  0,
);

const phases = [
  {
    name: "Foundations",
    copy: "Frame the problem, make one server survive, and put a clear contract at the edge.",
  },
  {
    name: "Scale",
    copy: "Caches, indexes, partitions and the read/write paths that decide what breaks first.",
  },
  {
    name: "Distributed systems",
    copy: "Queues, consistency, failure and the promises a multi-service system can keep.",
  },
  {
    name: "Production",
    copy: "Observability, security and the interview loop that ties the whole design together.",
  },
];

const loop = [
  "Clarify the user, scale and the two hardest requirements.",
  "Estimate QPS, storage and the read/write split.",
  "Draw the smallest end-to-end path before adding parts.",
  "Pick one hard component and go deep.",
  "Break it on purpose, then close with trade-offs.",
];

export default function SystemDesignPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vishesh Lab System Design track",
    description,
    numberOfItems: systemDesignModules.length,
    itemListElement: systemDesignModules.map((module) => ({
      "@type": "ListItem",
      position: module.step,
      name: module.title,
      url: canonical(`/system-design/${module.slug}/`),
    })),
    provider: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <section className="page-hero track-hero">
        <div className="shell">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "System Design" }]}
          />
          <div className="track-hero-grid">
            <div>
              <p className="eyebrow">Track 02 · System Design</p>
              <h1 className="page-title">
                Design the shape <span className="serif gradient-text">around</span>{" "}
                the code.
              </h1>
              <p className="page-lede">
                Twelve short modules that build one repeatable design loop:
                requirements, estimates, interfaces, data, scale, failure and the
                trade-offs you can defend. Then walk six complete case studies.
              </p>
              <div className="meta-row">
                <span className="meta-pill">
                  <Layers width={12} height={12} aria-hidden="true" />{" "}
                  {systemDesignModules.length} modules
                </span>
                <span className="meta-pill">
                  <Clock width={12} height={12} aria-hidden="true" /> ~
                  {Math.round(totalMinutes / 60)}h focused
                </span>
                <span className="meta-pill">
                  <Blueprint width={12} height={12} aria-hidden="true" />{" "}
                  {caseStudies.length} case studies
                </span>
                <span className="meta-pill">
                  <PenTool width={12} height={12} aria-hidden="true" /> interview
                  board
                </span>
              </div>
            </div>

            <div className="track-hero-panel" aria-hidden="true">
              <div className="panel-bar">
                <span>design-loop.diagram</span>
                <span className="panel-live">
                  <span className="status-dot" /> draft
                </span>
              </div>
              <div className="panel-flow">
                <span className="panel-node">Requirements</span>
                <span className="panel-link" />
                <span className="panel-node">API</span>
                <span className="panel-link" />
                <span className="panel-node is-accent">Data</span>
                <span className="panel-link" />
                <span className="panel-node">Scale</span>
              </div>
              <div className="panel-flow is-second">
                <span className="panel-node is-ghost">Failure</span>
                <span className="panel-link" />
                <span className="panel-node is-ghost">Trade-offs</span>
                <span className="panel-link" />
                <span className="panel-node is-ghost">Measure</span>
              </div>
              <div className="panel-foot">
                <span>0–45 min</span>
                <span>one loop, every prompt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TrackDashboardProgress track="systems" />
        </div>
      </section>

      <div className="shell design-layout">
        <div className="design-main">
          <section className="design-intro">
            <div>
              <p className="eyebrow">How the track works</p>
              <h2 className="h2">Learn the move, then make the move.</h2>
              <p className="sub">
                Each module gives you one mental model, a blueprint, a set of
                decisions with their costs, and a prompt to design out loud. The
                checklist is what you can explain, not what you have skimmed.
              </p>
            </div>
            <ol className="loop-list">
              {loop.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <SystemDesignList modules={systemDesignModules} />
        </div>

        <aside className="sidebar design-sidebar">
          <section className="side-card">
            <h2>Phases</h2>
            <div className="phase-nav">
              {phases.map((phase, index) => {
                const count = systemDesignModules.filter(
                  (module) => module.phase === phase.name,
                ).length;
                return (
                  <div key={phase.name}>
                    <span className="phase-nav-head">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {phase.name}
                      <strong>{count}</strong>
                    </span>
                    <p>{phase.copy}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="side-card">
            <h2>Case studies</h2>
            <p className="side-note" style={{ marginTop: 0 }}>
              Full walk-throughs with estimates, APIs, failure modes and a
              checklist you can mark.
            </p>
            <div className="refs">
              {caseStudies.slice(0, 4).map((study) => (
                <Link
                  className="ref-link"
                  key={study.slug}
                  href={`/case-studies/${study.slug}/`}
                >
                  <Blueprint width={11} height={11} aria-hidden="true" />
                  {study.title}
                </Link>
              ))}
            </div>
            <Link className="next-link" href="/case-studies/" style={{ marginTop: 12 }}>
              All case studies
              <ArrowRight width={14} height={14} aria-hidden="true" />
            </Link>
          </section>

          <section className="side-card">
            <h2>Start here</h2>
            <div className="course-start">
              <p className="side-note" style={{ margin: 0 }}>
                New to design interviews? Begin with the framing module, then
                sketch the first case study.
              </p>
              <Link className="next-link" href="/system-design/design-foundations/">
                <Compass width={14} height={14} aria-hidden="true" />
                Module 01: Requirements
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
              <Link className="next-link" href="/board/">
                <PenTool width={14} height={14} aria-hidden="true" />
                Open the interview board
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
              <Link className="next-link" href="/progress/">
                <MapIcon width={14} height={14} aria-hidden="true" />
                See both tracks
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section className="side-card">
            <h2>The one rule</h2>
            <p className="side-note" style={{ margin: 0 }}>
              <Target
                width={12}
                height={12}
                style={{ display: "inline", marginRight: 5 }}
              />
              Name the trade-off every time. A design without a cost is a diagram,
              not a decision.
            </p>
          </section>
        </aside>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
