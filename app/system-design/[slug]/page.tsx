import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlueprintDiagram } from "@/components/blueprint-diagram";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DesignPrompt } from "@/components/design-prompt";
import { JsonLd } from "@/components/json-ld";
import { VideoPlaceholder } from "@/components/video-placeholder";
import {
  ArrowRight,
  Blueprint,
  CheckCircle,
  Clock,
  ExternalLink,
  Layers,
  Target,
} from "@/components/icons";
import {
  getNextSystemDesignModule,
  getPreviousSystemDesignModule,
  getSystemDesignModule,
  systemDesignModules,
} from "@/lib/system-design";
import { getCaseStudy } from "@/lib/case-studies";
import { canonical, ogImage, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return systemDesignModules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getSystemDesignModule(slug);
  if (!entry) return {};

  const title = `${entry.title} — System Design ${String(entry.step).padStart(2, "0")}`;
  return {
    title,
    description: entry.summary,
    alternates: { canonical: canonical(`/system-design/${entry.slug}/`) },
    openGraph: {
      title,
      description: entry.summary,
      url: canonical(`/system-design/${entry.slug}/`),
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.summary,
      images: [ogImage.url],
    },
  };
}

export default async function SystemDesignModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getSystemDesignModule(slug);
  if (!entry) notFound();

  const previous = getPreviousSystemDesignModule(entry.step);
  const next = getNextSystemDesignModule(entry.step);
  const related = entry.relatedCaseStudy
    ? getCaseStudy(entry.relatedCaseStudy)
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: entry.title,
    description: entry.summary,
    url: canonical(`/system-design/${entry.slug}/`),
    learningResourceType: "Lesson",
    educationalLevel: entry.phase,
    isAccessibleForFree: true,
    timeRequired: `PT${entry.minutes}M`,
    inLanguage: siteConfig.language,
    provider: { "@type": "Organization", name: siteConfig.name },
    hasPart: entry.topics.map((topic) => ({
      "@type": "DefinedTerm",
      name: topic,
    })),
  };

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "System Design", href: "/system-design/" },
              { label: `Module ${String(entry.step).padStart(2, "0")}` },
            ]}
          />
          <p className="eyebrow">
            System Design {String(entry.step).padStart(2, "0")} · {entry.phase}
          </p>
          <h1 className="page-title">{entry.title}</h1>
          <p className="page-lede">{entry.summary}</p>
          <div className="meta-row">
            <span className="meta-pill">
              <Clock width={12} height={12} aria-hidden="true" /> {entry.minutes} min
            </span>
            <span className="meta-pill">
              <Layers width={12} height={12} aria-hidden="true" />{" "}
              {entry.topics.length} topics
            </span>
            <span className="meta-pill">
              <Blueprint width={12} height={12} aria-hidden="true" /> blueprint
            </span>
            <span className="meta-pill">
              <Target width={12} height={12} aria-hidden="true" /> {entry.phase}
            </span>
          </div>
        </div>
      </section>

      <div className="shell">
        <article className="prose-article">
          <div className="mental-model">
            <strong>Mental model</strong>
            {entry.mentalModel}
          </div>

          <VideoPlaceholder
            compact
            title="Module walkthrough"
            description="The written module is ready now. A recorded walkthrough is being edited and will appear here — check back soon."
            minutes={entry.minutes}
          />

          <h2 id="blueprint">The shape</h2>
          <p>
            Read the diagram from the caller to the data. Each layer has one job;
            the interesting part is what crosses a boundary and what happens when
            it does not arrive.
          </p>
          <BlueprintDiagram blueprint={entry.blueprint} />

          <h2 id="ideas">Core ideas</h2>
          <ul className="idea-list">
            {entry.ideas.map((idea) => (
              <li key={idea}>
                <CheckCircle width={14} height={14} aria-hidden="true" />
                <span>{idea}</span>
              </li>
            ))}
          </ul>

          <h2 id="topics">What this module covers</h2>
          <p>
            The checklist in the sidebar is the working list. Tick a topic when
            you can explain it, draw it, and name one cost of choosing it.
          </p>
          <div className="chip-row" style={{ marginTop: 14 }}>
            {entry.topics.map((topic) => (
              <span className="chip" key={topic}>
                {topic}
              </span>
            ))}
          </div>

          <h2 id="decisions">Decisions and their costs</h2>
          <p>
            There is no free architecture. Each row is a choice, the situation
            that makes it reasonable, and the bill that arrives later.
          </p>
          <div className="decision-list">
            {entry.decisions.map((decision, index) => (
              <div className="decision-card" key={decision.choice}>
                <div className="decision-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{decision.choice}</h3>
                </div>
                <div className="decision-body">
                  <div>
                    <span className="decision-label">Choose it when</span>
                    <p>{decision.when}</p>
                  </div>
                  <div>
                    <span className="decision-label">What it costs</span>
                    <p>{decision.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 id="prompt">Try it out loud</h2>
          <DesignPrompt prompt={entry.question} minutes={15} />

          {related ? (
            <>
              <h2 id="case-study">See it in a full design</h2>
              <p>
                The case studies apply this module end to end. Read the prompt,
                make your own sketch first, then compare.
              </p>
              <Link className="design-related" href={`/case-studies/${related.slug}/`}>
                <span className="design-related-icon">
                  <Blueprint width={18} height={18} />
                </span>
                <span>
                  <span className="design-related-label">Case study</span>
                  <strong>{related.title}</strong>
                  <span className="design-related-copy">{related.subtitle}</span>
                </span>
                <ArrowRight width={15} height={15} />
              </Link>
            </>
          ) : null}

          <h2 id="references">Go deeper</h2>
          <p>
            External references for a second explanation. The module is designed
            to stand on its own, but another voice helps when a concept refuses to
            click.
          </p>
          <div className="refs">
            {entry.refs.map((reference) => (
              <a
                className="ref-link"
                key={reference.href}
                href={reference.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {reference.label}
                <ExternalLink width={11} height={11} aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="prev-next">
            {previous ? (
              <Link href={`/system-design/${previous.slug}/`}>
                <span>← Previous module</span>
                <strong>{previous.title}</strong>
              </Link>
            ) : (
              <Link href="/system-design/">
                <span>← Track index</span>
                <strong>All system design modules</strong>
              </Link>
            )}
            {next ? (
              <Link className="is-next" href={`/system-design/${next.slug}/`}>
                <span>Next module →</span>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <Link className="is-next" href="/case-studies/">
                <span>Next step →</span>
                <strong>Open the case studies</strong>
              </Link>
            )}
          </div>
        </article>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
