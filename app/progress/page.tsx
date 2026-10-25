import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ProgressTracker } from "@/components/progress-tracker";
import { canonical, siteConfig } from "@/lib/site";

const title = "Progress — DSA and System Design, tracked separately";
const description =
  "Track DSA lessons in one mode and System Design modules plus case studies in another. Separate charts, next steps and JSON export without an account.";

export const metadata: Metadata = {
  title: "Progress",
  description,
  alternates: { canonical: canonical("/progress/") },
  openGraph: {
    title,
    description,
    url: canonical("/progress/"),
    type: "website",
  },
  robots: { index: false, follow: true },
};

export default function ProgressPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical("/progress/"),
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
  };

  return (
    <>
      <div className="shell progress-page">
        <ProgressTracker />
      </div>
      <JsonLd data={jsonLd} />
    </>
  );
}
