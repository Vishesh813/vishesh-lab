import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PracticeBrowser } from "@/components/practice-browser";
import { PracticeCategories } from "@/components/practice-categories";
import { ArrowRight, Code, Info, Layers, Target } from "@/components/icons";
import { problems } from "@/lib/problems";
import { canonical, ogImage, siteConfig } from "@/lib/site";

const description =
  "Practice DSA with problems mapped to the roadmap. Read the statement, work the examples, then open hints one at a time. Solved progress stays in this browser.";

export const metadata: Metadata = {
  title: "Practice DSA",
  description,
  alternates: { canonical: canonical("/practice/") },
  openGraph: {
    title: "Practice DSA — Vishesh",
    description,
    url: canonical("/practice/"),
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Practice DSA — Vishesh",
    description,
    images: [ogImage.url],
  },
};

export default function PracticePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vishesh practice set",
    description,
    numberOfItems: problems.length,
    itemListElement: problems.map((problem, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: problem.title,
      url: canonical(`/practice/${problem.slug}/`),
    })),
    provider: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <div className="shell practice-page">
        <PracticeCategories />

        <section className="practice-all" id="problems">
          <div className="ref-section-head">
            <div>
              <p className="eyebrow">All problems</p>
              <h2 className="h2">The live set.</h2>
            </div>
            <p>
              Filter by difficulty. Each problem links back to the lesson that
              teaches the underlying idea.
            </p>
          </div>

          <div className="meta-row" style={{ marginBottom: 18 }}>
            <span className="meta-pill">
              <Code width={12} height={12} aria-hidden="true" /> {problems.length} problems
            </span>
            <span className="meta-pill">
              <Layers width={12} height={12} aria-hidden="true" /> mapped to lessons
            </span>
            <span className="meta-pill">
              <Target width={12} height={12} aria-hidden="true" /> easy → hard
            </span>
          </div>

          <PracticeBrowser problems={problems} />
        </section>

        <div className="practice-bottom">
          <div className="notice">
            <Info width={16} height={16} aria-hidden="true" />
            <span>
              <strong>Before you code:</strong> restate the input, the output and
              what makes an answer valid. Then write the invariant. The hints are
              there for a genuine stall, not as a substitute for the first attempt.
            </span>
          </div>
          <Link className="next-link" href="/progress/">
            Track what you finish
            <ArrowRight width={14} height={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
