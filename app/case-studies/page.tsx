import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ArrowRight, Blueprint, Clock, Layers, Target } from "@/components/icons";
import { caseStudies, caseStudyDifficulties } from "@/lib/case-studies";
import { systemDesignModules } from "@/lib/system-design";
import { canonical, ogImage, siteConfig } from "@/lib/site";

const description =
  "Six end-to-end system design case studies: URL shortener, real-time chat, news feed, ticket dispatch, video streaming and rate limiting. Requirements, estimates, APIs, data models, failure modes and trade-offs.";

export const metadata: Metadata = {
  title: "System Design Case Studies",
  description,
  alternates: { canonical: canonical("/case-studies/") },
  openGraph: {
    title: "System Design Case Studies — Vishesh",
    description,
    url: canonical("/case-studies/"),
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Case Studies — Vishesh",
    description,
    images: [ogImage.url],
  },
};

export default function CaseStudiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vishesh system design case studies",
    description,
    numberOfItems: caseStudies.length,
    itemListElement: caseStudies.map((study, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: study.title,
      url: canonical(`/case-studies/${study.slug}/`),
    })),
    provider: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Case studies" }]} />
          <p className="eyebrow">Design practice</p>
          <h1 className="page-title">Walk the system before the interview does.</h1>
          <p className="page-lede">
            Each case study is a complete design pass: clarify the requirements,
            estimate the load, choose a data shape, name the hard part, and say what
            breaks first. Read the prompt and sketch your own answer before you
            compare.
          </p>
          <div className="meta-row">
            <span className="meta-pill">
              <Layers width={12} height={12} aria-hidden="true" /> {caseStudies.length} case studies
            </span>
            <span className="meta-pill">
              <Clock width={12} height={12} aria-hidden="true" /> 25–45 min each
            </span>
            <span className="meta-pill">
              <Blueprint width={12} height={12} aria-hidden="true" /> blueprint + failure modes
            </span>
            <span className="meta-pill">
              <Target width={12} height={12} aria-hidden="true" /> {systemDesignModules.length} linked modules
            </span>
          </div>
        </div>
      </section>

      <div className="shell case-index">
        {caseStudyDifficulties.map((difficulty) => {
          const studies = caseStudies.filter((study) => study.difficulty === difficulty);
          if (!studies.length) return null;
          return (
            <section className="case-group" key={difficulty}>
              <div className="case-group-head">
                <h2>{difficulty}</h2>
                <span>{studies.length} case {studies.length === 1 ? "study" : "studies"}</span>
              </div>
              <div className="case-grid">
                {studies.map((study) => {
                  const index = caseStudies.findIndex((entry) => entry.slug === study.slug);
                  return (
                    <Link className="case-card" href={`/case-studies/${study.slug}/`} key={study.slug}>
                      <div className="case-card-top">
                        <span className="case-card-num">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={`badge badge-${study.difficulty.toLowerCase()}`}>
                          {study.difficulty}
                        </span>
                        <span className="case-card-time">
                          <Clock width={11} height={11} aria-hidden="true" />
                          {study.minutes} min
                        </span>
                      </div>
                      <h3>{study.title}</h3>
                      <p className="case-card-sub">{study.subtitle}</p>
                      <p className="case-card-summary">{study.summary}</p>
                      <div className="case-card-stats">
                        <span>{study.requirements.length} requirements</span>
                        <span>{study.decisions.length} decisions</span>
                        <span>{study.failureModes.length} failure modes</span>
                      </div>
                      <span className="next-link">
                        Open the walk-through
                        <ArrowRight width={14} height={14} aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="case-index-cta">
          <div>
            <p className="eyebrow">Need the building blocks first?</p>
            <h2>The System Design track is the vocabulary.</h2>
            <p>
              Twelve modules cover requirements, scaling, APIs, caching, data,
              queues, consistency, resilience, observability and security. The case
              studies assume that vocabulary.
            </p>
          </div>
          <Link className="btn btn-primary" href="/system-design/">
            Open the track
            <ArrowRight width={14} height={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
