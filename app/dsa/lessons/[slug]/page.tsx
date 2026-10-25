import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeTabs, LessonNotes } from "@/components/lesson-tools";
import { LessonProgressRing, MarkComplete } from "@/components/lesson-status";
import { VideoPlaceholder } from "@/components/video-placeholder";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Code,
  ExternalLink,
  Info,
  Layers,
  Target,
} from "@/components/icons";
import {
  dsaLessons,
  getDsaLessonBySlug,
  getNextDsaLesson,
  getPreviousDsaLesson,
  lessonHref,
  type DsaLesson,
} from "@/lib/dsa-course";
import { getProblem } from "@/lib/problems";
import type { Problem } from "@/lib/problems";
import { canonical, ogImage, siteConfig } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const dynamicParams = false;

export function generateStaticParams() {
  return dsaLessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDsaLessonBySlug(slug);
  if (!entry) return {};

  const title =
    entry.title === entry.phase
      ? `${entry.phase} — start here`
      : `${entry.title} – ${entry.phase}`;
  return {
    title,
    description: entry.summary,
    alternates: {
      canonical: canonical(`/dsa/lessons/${entry.slug}/`),
    },
    openGraph: {
      title,
      description: entry.summary,
      url: canonical(`/dsa/lessons/${entry.slug}/`),
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

function ProblemLink({ problem }: { problem: Problem }) {
  return (
    <Link className="ref-link" href={`/practice/${problem.slug}/`}>
      <Code width={11} height={11} aria-hidden="true" />
      {problem.title}
      <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
        {problem.difficulty}
      </span>
    </Link>
  );
}

function Block({ block }: { block: DsaLesson["blocks"][number] }) {
  const kind = block.kind ?? "plain";
  const Icon =
    kind === "warning" ? Info : kind === "definition" ? BookOpen : kind === "note" ? Info : CheckCircle;

  if (kind === "definition" || kind === "warning" || kind === "note") {
    return (
      <section className={`lesson-callout is-${kind}`}>
        <div className="lesson-callout-head">
          <Icon width={15} height={15} aria-hidden="true" />
          <h2>{block.title}</h2>
        </div>
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {block.bullets?.length ? (
          <ul className="lesson-bullets">
            {block.bullets.map((bullet) => (
              <li key={bullet}>
                <CheckCircle width={12} height={12} aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  return (
    <section className="lesson-section">
      <h2>{block.title}</h2>
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {block.bullets?.length ? (
        <ul className="lesson-bullets">
          {block.bullets.map((bullet) => (
            <li key={bullet}>
              <CheckCircle width={12} height={12} aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default async function DsaLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getDsaLessonBySlug(slug);
  if (!entry) notFound();

  const previous = getPreviousDsaLesson(entry.code);
  const next = getNextDsaLesson(entry.code);
  const practiceProblems = entry.practice
    .map((slug) => getProblem(slug))
    .filter((problem): problem is Problem => Boolean(problem));
  const hasMistakeBlock = entry.blocks.some((block) =>
    /mistake/i.test(block.title),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: entry.title,
    description: entry.summary,
    url: canonical(`/dsa/lessons/${entry.slug}/`),
    learningResourceType: "Lesson",
    educationalLevel: entry.phase,
    isAccessibleForFree: true,
    timeRequired: `PT${entry.minutes}M`,
    inLanguage: siteConfig.language,
    provider: { "@type": "Organization", name: siteConfig.name },
    hasPart: entry.keyPoints.map((point) => ({
      "@type": "DefinedTerm",
      name: point,
    })),
  };

  return (
    <>
      <article className="lesson">
        <header className="lesson-head">
          <div className="lesson-head-main">
            <nav className="lesson-crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/dsa/">DSA Roadmap</Link>
              <span>/</span>
              <span>{entry.phase}</span>
            </nav>
            <h1>{entry.title} in Data Structures</h1>
            <p className="lesson-summary">{entry.summary}</p>
            <div className="lesson-meta">
              <span>
                <Clock width={12} height={12} /> {entry.minutes} min
              </span>
              <span>
                <Layers width={12} height={12} /> {entry.keyPoints.length} key points
              </span>
              <span>
                <Target width={12} height={12} /> {entry.phase}
              </span>
            </div>
          </div>
          <LessonProgressRing
            code={entry.code}
            title={entry.title}
            phase={entry.phase}
            points={entry.keyPoints}
          />
        </header>

        <h2 className="lesson-explainer">
          {entry.phase} – Explained with Examples
        </h2>

        <VideoPlaceholder
          title="Video walkthrough"
          description="The written lesson is ready now. A recorded walkthrough is being edited and will appear here — check back soon."
          minutes={entry.minutes}
        />

        <MarkComplete
          code={entry.code}
          title={entry.title}
          phase={entry.phase}
          points={entry.keyPoints}
        />

        <div className="lesson-grid">
          <div className="lesson-body">
            {entry.blocks.map((block) => (
              <Block block={block} key={block.title} />
            ))}

            <CodeTabs samples={entry.codeSamples} />

            {!hasMistakeBlock && entry.mistakes.length ? (
              <section className="lesson-section">
                <h2>Common beginner mistakes</h2>
                <ul className="lesson-bullets is-warning">
                  {entry.mistakes.map((mistake) => (
                    <li key={mistake}>
                      <Info width={12} height={12} aria-hidden="true" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="lesson-section">
              <h2>Complexity at a glance</h2>
              <p>
                Growth matters more than a stopwatch reading. These are the
                costs worth remembering for this topic.
              </p>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Operation</th>
                      <th>Time</th>
                      <th>Space</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.complexity.map((row) => (
                      <tr key={row.operation}>
                        <td>{row.operation}</td>
                        <td>{row.time}</td>
                        <td>{row.space}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {practiceProblems.length ? (
              <section className="lesson-section">
                <h2>Practice this</h2>
                <p>
                  Solve the mapped problem before moving on. The hints are there
                  if you stall, not to replace the attempt.
                </p>
                <div className="refs">
                  {practiceProblems.map((problem) => (
                    <ProblemLink key={problem.slug} problem={problem} />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="lesson-section">
              <h2>Go deeper</h2>
              <p>
                External references for a second explanation. The lesson stands
                on its own, but another voice helps when a concept refuses to
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
            </section>

            <div className="lesson-next-prev">
              {previous ? (
                <Link href={lessonHref(previous.slug)}>
                  <span>← Previous</span>
                  <strong>{previous.title}</strong>
                </Link>
              ) : (
                <Link href="/dsa/">
                  <span>← Curriculum</span>
                  <strong>All DSA topics</strong>
                </Link>
              )}
              {next ? (
                <Link
                  className="is-next"
                  href={lessonHref(next.slug)}
                >
                  <span>Next →</span>
                  <strong>{next.title}</strong>
                </Link>
              ) : (
                <Link className="is-next" href="/practice/">
                  <span>Next →</span>
                  <strong>Practice the full set</strong>
                </Link>
              )}
            </div>
          </div>

          <aside className="lesson-side">
            <LessonNotes code={entry.code} key={entry.code} />

            <section className="lesson-side-card">
              <h2>Key points</h2>
              <ul className="lesson-keypoints">
                {entry.keyPoints.map((point) => (
                  <li key={point}>
                    <CheckCircle width={12} height={12} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>

            <section className="lesson-side-card">
              <h2>Next lesson</h2>
              {next ? (
                <>
                  <p className="side-note" style={{ margin: "0 0 10px" }}>
                    {next.phase}
                  </p>
                  <Link className="next-link" href={lessonHref(next.slug)}>
                    {next.title}
                    <ArrowRight width={13} height={13} aria-hidden="true" />
                  </Link>
                </>
              ) : (
                <Link className="next-link" href="/practice/">
                  Open the practice set
                  <ArrowRight width={13} height={13} aria-hidden="true" />
                </Link>
              )}
            </section>
          </aside>
        </div>
      </article>

      <JsonLd data={jsonLd} />
    </>
  );
}
