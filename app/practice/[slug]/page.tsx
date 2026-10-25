import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRight,
  Code,
  Info,
  Layers,
  Target,
} from "@/components/icons";
import { lessonForModuleSlug, lessonHref } from "@/lib/dsa-course";
import { getProblem, problems } from "@/lib/problems";
import { canonical, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return problems.map((problem) => ({ slug: problem.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return {};

  return {
    title: problem.title,
    description: problem.summary,
    alternates: { canonical: canonical(`/practice/${problem.slug}/`) },
    openGraph: {
      title: problem.title,
      description: problem.summary,
      url: canonical(`/practice/${problem.slug}/`),
      type: "article",
    },
  };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const index = problems.findIndex((entry) => entry.slug === problem.slug);
  const previous = problems[index - 1];
  const next = problems[index + 1];
  const relatedLesson = lessonForModuleSlug(problem.moduleSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: problem.title,
    description: problem.summary,
    url: canonical(`/practice/${problem.slug}/`),
    learningResourceType: "Problem",
    educationalLevel: problem.difficulty,
    isAccessibleForFree: true,
    inLanguage: siteConfig.language,
    about: problem.tags,
    provider: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Practice", href: "/practice/" },
              { label: problem.title },
            ]}
          />
          <p className="eyebrow">Practice problem · {problem.difficulty}</p>
          <h1 className="page-title is-wide">{problem.title}</h1>
          <p className="page-lede">{problem.summary}</p>
          <div className="meta-row">
            <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            <span className="meta-pill">
              <Code width={12} height={12} aria-hidden="true" /> {problem.time} time
            </span>
            <span className="meta-pill">
              <Layers width={12} height={12} aria-hidden="true" /> {problem.space} space
            </span>
            <span className="meta-pill">
              <Target width={12} height={12} aria-hidden="true" /> {problem.tags[0]}
            </span>
          </div>
        </div>
      </section>

      <div className="shell problem-detail-grid">
        <article className="prose-article">
          <div className="notice">
            <Info width={16} height={16} aria-hidden="true" />
            <span>
              <strong>Try it first.</strong> This page gives hints, not a solution.
              Read the examples, work an approach on paper, then open a hint if you
              stall. The related module is linked in the sidebar.
            </span>
          </div>

          <h2 id="problem">Problem</h2>
          <p>{problem.statement}</p>

          <h2 id="examples">Examples</h2>
          {problem.examples.map((example, exampleIndex) => (
            <div className="example-block" key={`${example.input}-${exampleIndex}`}>
              <span>Input</span>
              <strong>{example.input}</strong>
              <span style={{ marginTop: 8 }}>Output</span>
              <strong>{example.output}</strong>
              {example.note ? (
                <>
                  <span style={{ marginTop: 8 }}>Note</span>
                  <strong>{example.note}</strong>
                </>
              ) : null}
            </div>
          ))}

          <h2 id="constraints">Constraints</h2>
          <ul className="constraint-list">
            {problem.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>

          <h2 id="hints">Hints</h2>
          <p>Open one at a time. The later hints get more specific.</p>
          <div className="hints">
            {problem.hints.map((hint, hintIndex) => (
              <details key={hint}>
                <summary>Hint {hintIndex + 1}</summary>
                <p>{hint}</p>
              </details>
            ))}
          </div>

          <h2 id="next-step">After you solve it</h2>
          <p>
            State the time and space cost, then compare it with the target in the
            sidebar. If your solution is slower, ask which operation is repeated
            and whether a different structure makes it constant-time.
          </p>
          <div className="refs">
            {relatedLesson ? (
              <Link
                className="ref-link"
                href={lessonHref(relatedLesson.slug)}
              >
                <ArrowRight width={11} height={11} aria-hidden="true" />
                Read {relatedLesson.title}
              </Link>
            ) : null}
            <Link className="ref-link" href="/practice/">
              <Code width={11} height={11} aria-hidden="true" />
              All problems
            </Link>
          </div>

          <div className="prev-next">
            {previous ? (
              <Link href={`/practice/${previous.slug}/`}>
                <span>← Previous problem</span>
                <strong>{previous.title}</strong>
              </Link>
            ) : (
              <Link href="/practice/">
                <span>← Practice index</span>
                <strong>All problems</strong>
              </Link>
            )}
            {next ? (
              <Link className="is-next" href={`/practice/${next.slug}/`}>
                <span>Next problem →</span>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <Link className="is-next" href="/practice/">
                <span>Practice index →</span>
                <strong>Back to the set</strong>
              </Link>
            )}
          </div>
        </article>

        <aside className="sidebar">
          {relatedLesson ? (
            <section className="side-card">
              <h2>Related lesson</h2>
              <p className="side-note" style={{ margin: "0 0 10px" }}>
                {relatedLesson.phase} · {relatedLesson.minutes} min
              </p>
              <p className="next-title" style={{ margin: "0 0 10px", fontSize: "1.05rem" }}>
                {relatedLesson.title}
              </p>
              <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: "0.78rem", lineHeight: 1.6 }}>
                {relatedLesson.summary}
              </p>
              <Link
                className="next-link"
                href={lessonHref(relatedLesson.slug)}
              >
                Open lesson
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
            </section>
          ) : null}

          <section className="side-card">
            <h2>Target complexity</h2>
            <div className="stat-pair" style={{ marginTop: 0 }}>
              <div>
                <strong style={{ fontSize: "1.2rem" }}>{problem.time}</strong>
                <span>time</span>
              </div>
              <div>
                <strong style={{ fontSize: "1.2rem" }}>{problem.space}</strong>
                <span>space</span>
              </div>
            </div>
            <div className="chip-row">
              {problem.tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="side-card">
            <h2>How to attempt it</h2>
            <ol className="step-list">
              <li>
                <span className="step-num">01</span>
                <span>Restate the input, output and validity condition.</span>
              </li>
              <li>
                <span className="step-num">02</span>
                <span>Trace one example by hand before writing code.</span>
              </li>
              <li>
                <span className="step-num">03</span>
                <span>Name the invariant, then check the edge cases.</span>
              </li>
              <li>
                <span className="step-num">04</span>
                <span>State the cost and compare it with the target.</span>
              </li>
            </ol>
          </section>

          <section className="side-card">
            <h2>More practice</h2>
            <div className="refs" style={{ marginTop: 0 }}>
              {problems
                .filter((entry) => entry.slug !== problem.slug)
                .slice(0, 3)
                .map((entry) => (
                  <Link
                    className="ref-link"
                    key={entry.slug}
                    href={`/practice/${entry.slug}/`}
                  >
                    <ArrowRight width={11} height={11} aria-hidden="true" />
                    {entry.title}
                  </Link>
                ))}
            </div>
          </section>
        </aside>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
