import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Search } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page is not on the Vishesh Lab map. Head back to the DSA roadmap or practice set.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="shell">
      <div className="empty-state">
        <p className="empty-code">404 · off the map</p>
        <h1>This page isn&apos;t on the map.</h1>
        <p>
          The page may have moved, or the link may have a typo. Use the DSA
          roadmap to find the lesson you were looking for, or press ⌘K to search
          every lesson, problem and note.
        </p>
        <div className="hero-ctas" style={{ justifyContent: "center" }}>
          <Link className="btn btn-primary" href="/dsa/">
            Open the DSA roadmap
            <ArrowRight width={16} height={16} aria-hidden="true" />
          </Link>
          <Link className="btn btn-secondary" href="/practice/">
            <Search width={15} height={15} aria-hidden="true" />
            Browse practice
          </Link>
        </div>
        <p className="side-note" style={{ marginTop: 24 }}>
          <Compass width={12} height={12} style={{ display: "inline", marginRight: 5 }} />
          Or start at the <Link href="/" style={{ color: "var(--ink)" }}>home page</Link>.
        </p>
      </div>
    </div>
  );
}
