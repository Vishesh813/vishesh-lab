"use client";

import Link from "next/link";
import { useState } from "react";
import type { SystemDesignModule } from "@/lib/system-design";
import { moduleStats, useProgress } from "@/lib/progress";
import { ChevronRight, Clock } from "./icons";

const phases = ["Foundations", "Scale", "Distributed systems", "Production"] as const;

function phaseId(phase: string) {
  return phase.toLowerCase().replace(/\s+/g, "-");
}

export function SystemDesignList({
  modules,
}: {
  modules: SystemDesignModule[];
}) {
  const { map } = useProgress();
  const [phase, setPhase] = useState<string>("All");

  const visible =
    phase === "All" ? modules : modules.filter((module) => module.phase === phase);

  return (
    <>
      <div className="track-filter" role="group" aria-label="Filter modules by phase">
        <button
          type="button"
          className={`filter${phase === "All" ? " is-active" : ""}`}
          onClick={() => setPhase("All")}
          aria-pressed={phase === "All"}
        >
          All <span>{modules.length}</span>
        </button>
        {phases.map((entry) => {
          const count = modules.filter((module) => module.phase === entry).length;
          return (
            <button
              key={entry}
              type="button"
              className={`filter${phase === entry ? " is-active" : ""}`}
              onClick={() => setPhase(entry)}
              aria-pressed={phase === entry}
            >
              {entry} <span>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="design-modules">
        {visible.map((module) => {
          const progress = moduleStats(
            {
              slug: module.slug,
              step: module.step,
              title: module.title,
              phase: module.phase,
              topics: module.topics,
              track: "systems",
            },
            map,
          );
          return (
            <Link
              key={module.slug}
              href={`/system-design/${module.slug}/`}
              className="design-module"
              id={phase === "All" ? phaseId(module.phase) : undefined}
            >
              <span className="design-module-step">
                {String(module.step).padStart(2, "0")}
              </span>
              <span className="design-module-main">
                <span className="design-module-phase">{module.phase}</span>
                <span className="design-module-title">{module.title}</span>
                <span className="design-module-summary">{module.summary}</span>
                <span className="design-module-topics">
                  {module.topics.slice(0, 3).join(" · ")}
                </span>
              </span>
              <span className="design-module-side">
                <span className="design-module-time">
                  <Clock width={11} height={11} /> {module.minutes} min
                </span>
                <span className="design-module-bar">
                  <span style={{ width: `${progress.percent}%` }} />
                </span>
                <span className="design-module-pct">
                  {progress.done}/{progress.total} topics
                </span>
              </span>
              <span className="design-module-arrow">
                <ChevronRight width={16} height={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
