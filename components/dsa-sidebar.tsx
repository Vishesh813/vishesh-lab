"use client";

import { useMemo } from "react";
import { dsaPhases, lessonHref } from "@/lib/dsa-course";
import { moduleStats, useProgress } from "@/lib/progress";
import { RouteSidebar, type RouteGroup } from "./route-sidebar";

export function DsaSidebar() {
  const { map } = useProgress();

  const groups = useMemo<RouteGroup[]>(
    () =>
      dsaPhases.map((phase) => {
        const completed = phase.lessons.filter(
          (lesson) =>
            moduleStats(
              {
                slug: lesson.slug,
                step: 1,
                title: lesson.title,
                phase: lesson.phase,
                topics: lesson.keyPoints,
              },
              map,
            ).complete,
        ).length;

        return {
          id: phase.slug,
          label: phase.name,
          meta:
            completed > 0 ? (
              <span className="route-group-count">
                {completed}/{phase.lessons.length}
              </span>
            ) : undefined,
          items: phase.lessons.map((lesson) => ({
            label: lesson.title,
            href: lessonHref(lesson.slug),
          })),
        };
      }),
    [map],
  );

  return (
    <RouteSidebar
      title="DSA topics"
      homeHref="/dsa/"
      homeLabel="Roadmap"
      groups={groups}
      footer={[
        { label: "Full roadmap", href: "/dsa/" },
        { label: "My progress", href: "/progress/" },
      ]}
      triggerLabel="DSA topics"
      ariaLabel="DSA topics"
    />
  );
}
