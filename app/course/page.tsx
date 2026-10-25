import type { Metadata } from "next";
import { LegacyRedirect } from "@/components/legacy-redirect";

export const metadata: Metadata = {
  title: "DSA Roadmap",
  robots: { index: false, follow: true },
};

export default function LegacyCoursePage() {
  return <LegacyRedirect href="/dsa/" label="Open the DSA roadmap" />;
}
