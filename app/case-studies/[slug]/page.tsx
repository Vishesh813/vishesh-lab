import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlueprintDiagram } from "@/components/blueprint-diagram";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DesignPrompt } from "@/components/design-prompt";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRight,
  Blueprint,
  CheckCircle,
  Clock,
  ExternalLink,
  Layers,
  Target,
} from "@/components/icons";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { getSystemDesignModule } from "@/lib/system-design";
import { canonical, ogImage, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const title = `${study.title} \u2014 System Design Case Study`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: canonical(`/case-studies/${study.slug}/`) },
    openGraph: {
      title,
      description: study.summary,
      url: canonical(`/case-studies/${study.slug}/`),
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.summary,
      images: [ogImage.url],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((entry) => entry.slug === study.slug);
  const previous = index > 0 ? caseStudies[index - 1] : undefined;
  const next = index < caseStudies.length - 1 ? caseStudies[index + 1] : undefined;
  const related = study.relatedModules
    .map((moduleSlug) => getSystemDesignModule(moduleSlug))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: study.title,
    description: study.summary,
    url: canonical(`/case-studies/${study.slug}/`),
    learningResourceType: "Case study",
    educationalLevel: study.difficulty,
    isAccessibleForFree: true,
    timeRequired: `PT${study.minutes}M`,
    inLanguage: siteConfig.language,
    provider: { "@type": "Organization", name: siteConfig.name },
    hasPart: study.checklist.map((item) => ({
      "@type": "DefinedTerm",
      name: item,
    })),
  };

  return (
    <div className="case-page">
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Case studies", href: "/case-studies/" },
              { label: `Case ${String(index + 1).padStart(2, "0")}` },
            ]}
          />
          <p className="eyebrow">
            Case study {String(index + 1).padStart(2, "0")} \u00b7 {study.difficulty}
          </p>
          <h1 className="page-title">{study.title}</h1>
          <p className="page-lede">{study.subtitle}</p>
          <div className="meta-row">
            <span className="meta-pill">
              <Clock width={12} height={12} aria-hidden="true" /> {study.minutes} min
            </span>
            <span className="meta-pill">
              <Layers width={12} height={12} aria-hidden="true" /> {study.requirements.length} requirements
            </span>
            <span className="meta-pill">
              <Blueprint width={12} height={12} aria-hidden="true" /> {study.blueprint.layers.length} layers
            </span>
            <span className="meta-pill">
              <Target width={12} height={12} aria-hidden="true" /> {study.decisions.length} trade-offs
            </span>
          </div>
        </div>
      </section>

      <div className="shell case-detail">
        <article className="case-article">
          <DesignPrompt prompt={study.prompt} minutes={Math.max(15, Math.round(study.minutes * 0.6))} />

          <section className="case-section">
            <h2>1. Requirements</h2>
            <p>
              Start with what the system must do, then separate it from how well it
              must do it. These are the functional promises this design keeps.
            </p>
            <ul className="case-list">
              {study.requirements.map((requirement) => (
                <li key={requirement}>
                  <CheckCircle width={13} height={13} aria-hidden="true" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="case-section">
            <h2>2. Constraints and assumptions</h2>
            <p>
              Every estimate below depends on these. If the interviewer changes one,
              the design should change with it.
            </p>
            <ul className="case-list is-muted">
              {study.constraints.map((constraint) => (
                <li key={constraint}>
                  <span className="case-list-dot" aria-hidden="true" />
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="case-section">
            <h2>3. Back-of-the-envelope estimates</h2>
            <div className="estimate-grid">
              {study.estimates.map((estimate) => (
                <div className="estimate-card" key={estimate.label}>
                  <span>{estimate.label}</span>
                  <strong>{estimate.value}</strong>
                  <p>{estimate.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="case-section">
            <h2>4. The shape</h2>
            <p>
              Read the diagram from the caller to the data. The interesting part is
              what crosses a boundary and what happens when it does not arrive.
            </p>
            <BlueprintDiagram blueprint={study.blueprint} />
          </section>

          <section className="case-section">
            <h2>5. API surface</h2>
            <p>
              A small, explicit contract. Each endpoint should say what it accepts,
              what it returns and whether repeating it is safe.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Path</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {study.api.map((endpoint) => (
                    <tr key={`${endpoint.method}-${endpoint.path}`}>
                      <td>
                        <span className={`method method-${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                      </td>
                      <td>
                        <code>{endpoint.path}</code>
                      </td>
                      <td>{endpoint.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="case-section">
            <h2>6. Data model</h2>
            <p>
              The data model is where most of the design hides. Name the key, the
              access pattern and what grows without bound.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Table / stream</th>
                    <th>Fields and notes</th>
                  </tr>
                </thead>
                <tbody>
                  {study.dataModel.map((table) => (
                    <tr key={table.name}>
                      <td>
                        <code>{table.name}</code>
                      </td>
                      <td>{table.fields}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {study.sections.map((section, sectionIndex) => (
            <section className="case-section" key={section.title}>
              <h2>
                {sectionIndex + 7}. {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul className="case-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>
                      <CheckCircle width={13} height={13} aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="case-section">
            <h2>Decisions and their costs</h2>
            <p>
              There is no free architecture. Each row is a choice, the situation
              that makes it reasonable, and the bill that arrives later.
            </p>
            <div className="decision-list">
              {study.decisions.map((decision, decisionIndex) => (
                <div className="decision-card" key={decision.choice}>
                  <div className="decision-head">
                    <span>{String(decisionIndex + 1).padStart(2, "0")}</span>
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
          </section>

          <section className="case-section">
            <h2>What breaks first</h2>
            <p>
              Failure is normal. The useful question is not whether a component
              fails, but what the user sees when it does.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Failure</th>
                    <th>Impact</th>
                    <th>Mitigation</th>
                  </tr>
                </thead>
                <tbody>
                  {study.failureModes.map((mode) => (
                    <tr key={mode.failure}>
                      <td>{mode.failure}</td>
                      <td>{mode.impact}</td>
                      <td>{mode.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="case-section">
            <h2>Go deeper</h2>
            <p>
              External references for a second explanation. The walk-through stands
              on its own, but another voice helps when a concept refuses to click.
            </p>
            <div className="refs">
              {study.refs.map((reference) => (
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
          </section>

          <div className="prev-next">
            {previous ? (
              <Link href={`/case-studies/${previous.slug}/`}>
                <span>\u2190 Previous case study</span>
                <strong>{previous.title}</strong>
              </Link>
            ) : (
              <Link href="/case-studies/">
                <span>\u2190 All case studies</span>
                <strong>Browse the set</strong>
              </Link>
            )}
            {next ? (
              <Link className="is-next" href={`/case-studies/${next.slug}/`}>
                <span>Next case study \u2192</span>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <Link className="is-next" href="/board/">
                <span>Next step \u2192</span>
                <strong>Sketch it on the board</strong>
              </Link>
            )}
          </div>
        </article>
      </div>

      <JsonLd data={jsonLd} />
    </div>
  );
}