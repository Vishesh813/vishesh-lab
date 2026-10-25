"use client";

import Link from "next/link";
import { ArrowRight } from "./icons";
import { dsaMeta, systemMeta } from "@/lib/module-meta";
import { computeStats, nextModule, useProgress } from "@/lib/progress";
import { getDsaLessonBySlug } from "@/lib/dsa-course";
import { getSystemDesignModule } from "@/lib/system-design";
import { ProgressRing } from "./progress-ring";

export function TrackDashboardProgress({
  track,
}: {
  track: "dsa" | "systems";
}) {
  const { map } = useProgress();
  const meta = track === "dsa" ? dsaMeta : systemMeta;
  const stats = computeStats(meta, map);
  const next = nextModule(meta, map);
  const started = stats.percent > 0;

  const lesson =
    track === "dsa"
      ? next
        ? getDsaLessonBySlug(next.slug)
        : undefined
      : next
        ? getSystemDesignModule(next.slug)
        : undefined;

  const title =
    lesson?.title ??
    (track === "dsa"
      ? "You finished the DSA path."
      : "You finished System Design.");

  const detail =
    lesson && track === "dsa"
      ? `${(lesson as { phase: string }).phase} · ${(lesson as { minutes: number }).minutes} min`
      : lesson
        ? `${(lesson as { phase: string }).phase} · ${(lesson as { minutes: number }).minutes} min`
        : track === "dsa"
          ? "Revisit any phase or open the practice set."
          : "Revisit any module or open a case study.";

  const href =
    next && track === "dsa"
      ? `/dsa/lessons/${next.slug}/`
      : next
        ? `/system-design/${next.slug}/`
        : track === "dsa"
          ? "/practice/"
          : "/case-studies/";

  const cta = next
    ? started
      ? track === "dsa"
        ? "Continue lesson"
        : "Continue module"
      : track === "dsa"
        ? "Start lesson"
        : "Start module"
    : track === "dsa"
      ? "Open practice"
      : "Open case studies";

  return (
    <div className="dsa-dash-progress">
      <div className="dsa-dash-ring">
        <ProgressRing percent={stats.percent} size={84} stroke={7} />
        <div>
          <strong>{stats.percent}% complete</strong>
          <span>
            {stats.doneTopics} of {stats.totalTopics} checklist points
          </span>
        </div>
      </div>

      <div className="dsa-dash-next">
        <p className="eyebrow">{next ? (started ? "Continue" : "Start") : "Complete"}</p>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>

      <Link className="btn btn-primary" href={href}>
        {cta}
        <ArrowRight width={14} height={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
