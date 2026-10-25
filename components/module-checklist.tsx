"use client";

import { setModuleProgress, toggleTopic, useProgress } from "@/lib/progress";
import { CheckCircle } from "./icons";

type Props = {
  slug: string;
  topics: string[];
};

export function ModuleChecklist({ slug, topics }: Props) {
  const { map } = useProgress();
  const done = new Set(map[slug] ?? []);
  const count = topics.filter((_, index) => done.has(index)).length;
  const percent = topics.length ? Math.round((count / topics.length) * 100) : 0;

  return (
    <section className="side-card" aria-labelledby="checklist-title">
      <div className="checklist-head">
        <h2 id="checklist-title">Module checklist</h2>
        <strong>
          {count}/{topics.length}
        </strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`${percent}% of this module complete`}
      >
        <span className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <ul className="checklist">
        {topics.map((topic, index) => (
          <li key={topic}>
            <label className="checklist-item">
              <input
                type="checkbox"
                checked={done.has(index)}
                onChange={() => toggleTopic(slug, index)}
              />
              <span>{topic}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="checklist-actions">
        <button
          type="button"
          className="link-btn"
          onClick={() => setModuleProgress(slug, topics.map((_, index) => index))}
        >
          Mark all
        </button>
        <button
          type="button"
          className="link-btn"
          onClick={() => setModuleProgress(slug, [])}
        >
          Reset
        </button>
        {percent === 100 ? (
          <span
            className="link-btn"
            style={{ color: "var(--green)", marginLeft: "auto" }}
          >
            <CheckCircle width={12} height={12} /> complete
          </span>
        ) : null}
      </div>
      <p className="side-note">
        Saved in this browser only. Use the progress page to export or import.
      </p>
    </section>
  );
}
