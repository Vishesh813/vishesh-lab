import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DsaCourseList } from "@/components/dsa-course-list";
import { TrackDashboardProgress } from "@/components/track-dashboard-progress";
import { DsaRoadmap } from "@/components/dsa-roadmap";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRight,
} from "@/components/icons";
import { dsaLessons, lessonHref } from "@/lib/dsa-course";
import { canonical, ogImage, siteConfig } from "@/lib/site";

const description =
  "The complete DSA roadmap: programming foundations, complexity, arrays, strings, recursion, hashing, linked lists, stacks, queues, trees, graphs and dynamic programming.";

export const metadata: Metadata = {
  title: "DSA Roadmap",
  description,
  alternates: { canonical: canonical("/dsa/") },
  openGraph: {
    title: "DSA Roadmap — Vishesh",
    description,
    url: canonical("/dsa/"),
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Roadmap — Vishesh",
    description,
    images: [ogImage.url],
  },
};

export default function CoursePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vishesh DSA Roadmap",
    description,
    numberOfItems: dsaLessons.length,
    itemListElement: dsaLessons.map((lesson, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: lesson.title,
      url: canonical(lessonHref(lesson.slug)),
    })),
    provider: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <div className="shell dsa-dashboard">
        <section className="course-index-hero">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "DSA" }]} />
          <p className="eyebrow">DSA mode</p>
          <h1>Your DSA roadmap.</h1>
          <p className="page-lede">
            Pick a phase, or continue where you left off. Progress is stored in
            this browser.
          </p>
          <TrackDashboardProgress track="dsa" />
        </section>

        <div className="course-index-body">
          <div className="course-index-head">
            <div>
              <p className="eyebrow">The dependency chart</p>
              <h2>See how the phases connect.</h2>
            </div>
            <Link className="next-link" href="/progress/">
              Open progress
              <ArrowRight width={14} height={14} />
            </Link>
          </div>
          <DsaRoadmap />

          <div className="course-index-head course-list-head">
            <div>
              <p className="eyebrow">Free roadmap tracking</p>
              <h2>Every topic, in order.</h2>
            </div>
            <Link className="next-link" href="/progress/">
              DSA progress
              <ArrowRight width={14} height={14} />
            </Link>
          </div>
          <DsaCourseList />
        </div>
      </div>

      <JsonLd data={jsonLd} />
    </>
  );
}
