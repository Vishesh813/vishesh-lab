"use client";

import Link from "next/link";
import { dsaPhases, firstLessonOfPhase, lessonHref } from "@/lib/dsa-course";
import {
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  NODE_HEIGHT,
  NODE_WIDTH,
  edgePath,
  graphEdges,
  nodePositions,
  roadmapNodeMeta,
} from "@/lib/graph";
import { dsaMeta } from "@/lib/module-meta";
import { computeStats, moduleStats, useProgress } from "@/lib/progress";
import { Check, ChevronRight } from "./icons";

function phaseStats(phase: string, map: Record<string, number[]>) {
  const lessons = dsaMeta.filter((lesson) => lesson.phase === phase);
  let done = 0;
  let total = 0;
  for (const lesson of lessons) {
    const stats = moduleStats(lesson, map);
    done += stats.done;
    total += stats.total;
  }
  return {
    lessons: lessons.length,
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
    complete: total > 0 && done === total,
  };
}

export function DsaRoadmap() {
  const { map } = useProgress();
  const overall = computeStats(dsaMeta, map);
  const byPhase = new Map(dsaPhases.map((phase) => [phase.name, phase]));

  return (
    <div className="roadmap-shell">
      <div className="roadmap-toolbar">
        <div className="roadmap-legend" aria-hidden="true">
          <span className="legend-item">
            <span className="legend-node" /> phase
          </span>
          <span className="legend-item">
            <span className="legend-beam" /> dependency
          </span>
          <span className="legend-item">
            <span className="status-dot" /> complete
          </span>
        </div>
        <div className="roadmap-overall">
          <strong>{overall.percent}%</strong>
          <span>
            of DSA complete · {overall.doneTopics}/{overall.totalTopics} key points
          </span>
        </div>
      </div>

      <div
        className="graph"
        aria-label="DSA roadmap chart. Each phase links to its first lesson; the connecting lines show recommended order."
      >
        <svg
          className="graph-edges"
          viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="roadmap-beam"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={GRAPH_WIDTH}
              y2={GRAPH_HEIGHT}
            >
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-2)" />
            </linearGradient>
            <marker
              id="roadmap-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-bright)" />
            </marker>
          </defs>
          {graphEdges.map(([from, to]) => (
            <path
              key={`${from}-${to}`}
              className="graph-edge"
              d={edgePath(from, to)}
              markerEnd="url(#roadmap-arrow)"
            />
          ))}
        </svg>

        {nodePositions.map((position, index) => {
          const meta = roadmapNodeMeta.find((node) => node.id === position.id);
          const phase = meta ? byPhase.get(meta.phase) : undefined;
          const first = phase ? firstLessonOfPhase(phase.name) : undefined;
          if (!meta || !phase || !first) return null;

          const stats = phaseStats(phase.name, map);
          return (
            <Link
              key={position.id}
              href={lessonHref(first.slug)}
              className={`roadmap-node${stats.complete ? " is-complete" : ""}`}
              style={{
                left: `${(position.x / GRAPH_WIDTH) * 100}%`,
                top: `${(position.y / GRAPH_HEIGHT) * 100}%`,
                width: `${(NODE_WIDTH / GRAPH_WIDTH) * 100}%`,
                height: `${(NODE_HEIGHT / GRAPH_HEIGHT) * 100}%`,
              }}
              title={`${meta.phase} — ${meta.blurb}`}
              aria-label={`${meta.phase}: ${stats.percent}% complete, ${stats.lessons} lessons. Open the first lesson.`}
            >
              <span className="node-step">
                <span>Phase {String(index + 1).padStart(2, "0")}</span>
                {stats.complete ? (
                  <span className="node-check" aria-hidden="true">
                    <Check width={10} height={10} />
                  </span>
                ) : (
                  <span>{stats.percent}%</span>
                )}
              </span>
              <span className="node-title">{meta.phase}</span>
              <span className="node-bar" aria-hidden="true">
                <span className="node-fill" style={{ width: `${stats.percent}%` }} />
              </span>
              <span className="node-pct">
                {stats.done}/{stats.total} key points
              </span>
            </Link>
          );
        })}
      </div>

      <div className="roadmap-mobile">
        {roadmapNodeMeta.map((meta, index) => {
          const phase = byPhase.get(meta.phase);
          const first = phase ? firstLessonOfPhase(phase.name) : undefined;
          if (!phase || !first) return null;
          const stats = phaseStats(phase.name, map);

          return (
            <Link
              key={meta.id}
              href={lessonHref(first.slug)}
              className={`mobile-node${stats.complete ? " is-complete" : ""}`}
            >
              <span className="mobile-step">{String(index + 1).padStart(2, "0")}</span>
              <span className="mobile-main">
                <span className="mobile-title">{meta.phase}</span>
                <span className="mobile-meta">
                  {stats.lessons} {stats.lessons === 1 ? "lesson" : "lessons"} ·{" "}
                  {stats.done}/{stats.total} key points
                </span>
              </span>
              <span className="mobile-bar" aria-hidden="true">
                <span style={{ width: `${stats.percent}%` }} />
              </span>
              <span className="mobile-pct">{stats.percent}%</span>
              <span className="mobile-arrow" aria-hidden="true">
                <ChevronRight width={14} height={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
