import type { Metadata } from "next";
import { LegacyRedirect } from "@/components/legacy-redirect";
import {
  dsaPhases,
  getDsaPhase,
  lessonHref,
} from "@/lib/dsa-course";

export const dynamicParams = false;

export function generateStaticParams() {
  return dsaPhases.flatMap((phase) =>
    phase.lessons.map((lesson) => ({
      legacy: [phase.name, lesson.code],
    })),
  );
}

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function LegacyDsaLessonPage({
  params,
}: {
  params: Promise<{ legacy: string[] }>;
}) {
  const { legacy } = await params;
  const [phase, topic] = legacy;
  const lesson = phase
    ? getDsaPhase(decodeURIComponent(phase))?.lessons.find(
        (entry) => entry.code === topic,
      )
    : undefined;

  return (
    <LegacyRedirect
      href={lesson ? lessonHref(lesson.slug) : "/dsa/"}
      label="Open this lesson"
    />
  );
}
