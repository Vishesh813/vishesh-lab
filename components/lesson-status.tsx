"use client";

import { moduleStats, setModuleProgress, useProgress } from "@/lib/progress";
import { ProgressRing } from "./progress-ring";
import { Check } from "./icons";

function statsFor(code: string, title: string, phase: string, points: string[], map: Record<string, number[]>) {
  return moduleStats(
    { slug: code, step: 1, title, phase, topics: points },
    map,
  );
}

export function LessonProgressRing({
  code,
  title,
  phase,
  points,
  size = 78,
}: {
  code: string;
  title: string;
  phase: string;
  points: string[];
  size?: number;
}) {
  const { map } = useProgress();
  const stats = statsFor(code, title, phase, points, map);

  return (
    <div className="lesson-ring">
      <ProgressRing percent={stats.percent} size={size} stroke={7} />
      <div className="lesson-ring-label">
        <strong>
          {stats.done} / {stats.total}
        </strong>
        <span>{title}</span>
      </div>
    </div>
  );
}

export function MarkComplete({
  code,
  title,
  phase,
  points,
}: {
  code: string;
  title: string;
  phase: string;
  points: string[];
}) {
  const { map } = useProgress();
  const stats = statsFor(code, title, phase, points, map);

  return (
    <div className="mark-complete">
      <button
        type="button"
        role="checkbox"
        aria-checked={stats.complete}
        className={`mark-box${stats.complete ? " is-done" : ""}`}
        onClick={() =>
          setModuleProgress(
            code,
            stats.complete ? [] : points.map((_, index) => index),
          )
        }
      >
        {stats.complete ? <Check width={13} height={13} /> : null}
      </button>
      <button
        type="button"
        className="mark-label"
        onClick={() =>
          setModuleProgress(
            code,
            stats.complete ? [] : points.map((_, index) => index),
          )
        }
      >
        {stats.complete ? "Completed" : "Mark as completed"}
      </button>
      <span className="mark-note">
        {stats.done}/{stats.total} key points · saved in this browser
      </span>
    </div>
  );
}
