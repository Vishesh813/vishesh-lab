import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PostsBrowser } from "@/components/posts-browser";
import { posts } from "@/lib/posts";
import { canonical, ogImage, siteConfig } from "@/lib/site";

const description =
  "Original notes on DSA, system design and the interview process. Short reads on Big-O, sliding windows, caching, consistency and finishing a roadmap.";

export const metadata: Metadata = {
  title: "Posts",
  description,
  alternates: { canonical: canonical("/posts/") },
  openGraph: {
    title: "Posts — Vishesh",
    description,
    url: canonical("/posts/"),
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Posts — Vishesh",
    description,
    images: [ogImage.url],
  },
};

export default function PostsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Vishesh posts",
    description,
    url: canonical("/posts/"),
    inLanguage: siteConfig.language,
    publisher: { "@type": "Organization", name: siteConfig.name },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: canonical(`/posts/${post.slug}/`),
      datePublished: post.date,
      timeRequired: `PT${post.readTime}M`,
    })),
  };

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Posts" }]} />
          <p className="eyebrow">Posts</p>
          <h1 className="page-title">Notes for the stuck moments.</h1>
          <p className="page-lede">
            Short, original reads on the parts that usually get glossed over:
            growth rates, sliding windows, cache freshness, consistency and the
            habit of finishing what you start.
          </p>
        </div>
      </section>

      <div className="shell posts-page">
        <PostsBrowser posts={posts} />
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
