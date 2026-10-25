"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Problem } from "@/lib/problems";
import { ArrowUpRight, Rotate } from "./icons";

const filters = ["All", "Easy", "Medium", "Hard"] as const;
type Filter = (typeof filters)[number];

export function PracticeBrowser({ problems }: { problems: Problem[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? problems
        : problems.filter((problem) => problem.difficulty === filter),
    [filter, problems],
  );

  return (
    <>
      <div className="practice-toolbar">
        <div className="filter-row" role="group" aria-label="Filter problems by difficulty">
          {filters.map((entry) => (
            <button
              key={entry}
              type="button"
              className={`filter${filter === entry ? " is-active" : ""}`}
              aria-pressed={filter === entry}
              onClick={() => setFilter(entry)}
            >
              {entry}
            </button>
          ))}
        </div>
        <span className="practice-count">
          {visible.length} of {problems.length} problems
        </span>
      </div>

      {visible.length ? (
        <div className="problem-grid">
          {visible.map((problem) => (
            <Link
              key={problem.slug}
              href={`/practice/${problem.slug}/`}
              className="problem-card"
            >
              <div className="problem-top">
                <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
                <span className="problem-tags">
                  {problem.tags.slice(0, 2).join(" · ")}
                </span>
              </div>
              <h2 className="problem-title">{problem.title}</h2>
              <p className="problem-copy">{problem.summary}</p>
              <div className="problem-foot">
                <span>
                  {problem.time} time · {problem.space} space
                </span>
                <ArrowUpRight className="problem-arrow" width={14} height={14} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="filter-empty">
          <p>No {filter.toLowerCase()} problems in this set yet.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFilter("All")}>
            <Rotate width={14} height={14} aria-hidden="true" />
            Show all problems
          </button>
        </div>
      )}
    </>
  );
}
