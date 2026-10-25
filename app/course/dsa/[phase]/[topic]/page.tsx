import type { Metadata } from "next";
import { LegacyRedirect } from "@/components/legacy-redirect";
import { dsaPhases, getDsaPhase, lessonHref } from "@/lib/dsa-course";

export const dynamicParams = false;

export function generateStaticParams() {
  return dsaPhases.flatMap((phase) =>
    phase.lessons.map((lesson) => ({
      phase: phase.name,
      topic: lesson.code,
    })),
  );
}

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function LegacyLessonPage({
  params,
}: {
  params: Promise<{ phase: string; topic: string }>;
}) {
  const { phase, topic } = await params;
  const phaseName = decodeURIComponent(phase);
  const lesson = getDsaPhase(phaseName)?.lessons.find(
    (entry) => entry.code === topic,
  );

  return (
    <LegacyRedirect
      href={lesson ? lessonHref(lesson.slug) : "/dsa/"}
      label="Open this lesson"
    />
  );
}
