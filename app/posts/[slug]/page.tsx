import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CodeBlock } from "@/components/code-block";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Info,
} from "@/components/icons";
import { lessonHref } from "@/lib/dsa-course";
import { getPost, posts } from "@/lib/posts";
import type { PostBlock } from "@/lib/posts";
import { canonical, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonical(`/posts/${post.slug}/`) },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical(`/posts/${post.slug}/`),
      type: "article",
      publishedTime: post.date,
      authors: ["Vishesh Lab"],
      tags: [post.category],
    },
  };
}

const related: Record<string, { title: string; href: string; label: string }> = {
  "big-o-without-the-math-anxiety": {
    title: "Time & Space Complexity",
    href: lessonHref("time-and-space-complexity"),
    label: "DSA topic 02",
  },
  "one-sliding-window-template": {
    title: "Strings",
    href: lessonHref("strings"),
    label: "DSA topic 04",
  },
  "how-to-actually-finish-a-roadmap": {
    title: "The full DSA roadmap",
    href: "/dsa/",
    label: "22 lessons",
  },
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.findIndex((entry) => entry.slug === post.slug);
  const previous = posts[index - 1];
  const next = posts[index + 1];
  const relatedEntry = related[post.slug];

  const headingIds = new Map<number, string>();
  let headingIndex = 0;
  post.blocks.forEach((block, blockIndex) => {
    if (block.type === "h2") {
      headingIndex += 1;
      headingIds.set(blockIndex, `section-${headingIndex}`);
    }
  });
  const headings = post.blocks
    .map((block, blockIndex) => ({ block, blockIndex }))
    .filter(
      (entry): entry is { block: Extract<PostBlock, { type: "h2" }>; blockIndex: number } =>
        entry.block.type === "h2",
    );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: canonical(`/posts/${post.slug}/`),
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    timeRequired: `PT${post.readTime}M`,
    inLanguage: siteConfig.language,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: canonical(`/posts/${post.slug}/`),
    isAccessibleForFree: true,
  };

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Field notes", href: "/posts/" },
              { label: post.title },
            ]}
          />
          <div className="post-meta">
            <span className="post-tag">{post.category}</span>
            <span>{post.displayDate}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
          <h1 className="page-title is-wide" style={{ marginTop: 18 }}>
            {post.title}
          </h1>
          <p className="page-lede">{post.excerpt}</p>
          <div className={`post-art post-art-${post.accent} article-banner`} aria-hidden="true">
            <span className="post-glyph">{post.glyph}</span>
          </div>
        </div>
      </section>

      <div className="shell article-layout">
        <article className="article-main prose-article">
          {post.blocks.map((block, blockIndex) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2 key={blockIndex} id={headingIds.get(blockIndex)}>
                    {block.text}
                  </h2>
                );
              case "p":
                return <p key={blockIndex}>{block.text}</p>;
              case "ul":
                return (
                  <ul key={blockIndex}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              case "quote":
                return <blockquote key={blockIndex}>{block.text}</blockquote>;
              case "code":
                return (
                  <CodeBlock
                    key={blockIndex}
                    code={block.code}
                    language={block.language}
                    filename={`example.${block.language.toLowerCase() === "python" ? "py" : "txt"}`}
                  />
                );
              default:
                return null;
            }
          })}

          <div className="notice" style={{ marginTop: 30 }}>
            <Info width={16} height={16} aria-hidden="true" />
            <span>
              <strong>Keep going:</strong> notes explain the idea, but the map is
              where the idea becomes yours. Open the related module and mark the
              topics you can explain without looking.
            </span>
          </div>

          <div className="prev-next">
            {previous ? (
              <Link href={`/posts/${previous.slug}/`}>
                <span>← Previous note</span>
                <strong>{previous.title}</strong>
              </Link>
            ) : (
              <Link href="/posts/">
                <span>← Field notes</span>
                <strong>All notes</strong>
              </Link>
            )}
            {next ? (
              <Link className="is-next" href={`/posts/${next.slug}/`}>
                <span>Next note →</span>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <Link className="is-next" href="/posts/">
                <span>Field notes →</span>
                <strong>Back to all notes</strong>
              </Link>
            )}
          </div>
        </article>

        <aside className="article-sidebar">
          {headings.length ? (
            <nav className="toc" aria-label="On this page">
              <p className="toc-title">On this page</p>
              <ol>
                {headings.map((entry) => (
                  <li key={entry.blockIndex}>
                    <a href={`#${headingIds.get(entry.blockIndex)}`}>{entry.block.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {relatedEntry ? (
            <section className="side-card">
              <h2>Related notes</h2>
              <p className="side-note" style={{ margin: "0 0 10px" }}>
                {relatedEntry.label}
              </p>
              <p className="next-title" style={{ margin: "0 0 10px", fontSize: "1.05rem" }}>
                {relatedEntry.title}
              </p>
              <Link className="next-link" href={relatedEntry.href}>
                Open it
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
            </section>
          ) : null}

          <section className="side-card">
            <h2>Read next</h2>
            <div className="refs" style={{ marginTop: 0 }}>
              {posts
                .filter((entry) => entry.slug !== post.slug)
                .map((entry) => (
                  <Link className="ref-link" key={entry.slug} href={`/posts/${entry.slug}/`}>
                    <FileText width={11} height={11} aria-hidden="true" />
                    {entry.title}
                  </Link>
                ))}
            </div>
            <p className="side-note">
              <BookOpen width={11} height={11} style={{ display: "inline", marginRight: 4 }} />
              {posts.length} original notes in total.
            </p>
          </section>

          <section className="side-card">
            <h2>Reading time</h2>
            <div className="stat-pair" style={{ marginTop: 0 }}>
              <div>
                <strong style={{ fontSize: "1.25rem" }}>{post.readTime}</strong>
                <span>minutes</span>
              </div>
              <div>
                <strong style={{ fontSize: "1.25rem" }}>{post.category}</strong>
                <span>category</span>
              </div>
            </div>
            <p className="side-note">
              <Clock width={11} height={11} style={{ display: "inline", marginRight: 4 }} />
              Published {post.displayDate}.
            </p>
          </section>
        </aside>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
