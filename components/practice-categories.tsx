"use client";

import Link from "next/link";
import { useMemo } from "react";
import { dsaPhases } from "@/lib/dsa-course";
import { problems } from "@/lib/problems";
import { useSolved } from "@/lib/progress";
import { ArrowRight, CheckCircle, Clock } from "./icons";

type Category = {
  name: string;
  count: number;
  solved: number;
  minutes: number;
  firstSlug?: string;
};

export function PracticeCategories() {
  const { solved } = useSolved();

  const categories = useMemo<Category[]>(() => {
    const phaseByModule = new Map<string, string>();
    for (const phase of dsaPhases) {
      for (const lesson of phase.lessons) {
        phaseByModule.set(lesson.moduleSlug, phase.name);
      }
    }

    return dsaPhases.map((phase) => {
      const entries = problems.filter(
        (problem) => phaseByModule.get(problem.moduleSlug) === phase.name,
      );
      return {
        name: phase.name,
        count: entries.length,
        solved: entries.filter((problem) => solved.includes(problem.slug)).length,
        minutes: entries.length * 18,
        firstSlug: entries[0]?.slug,
      };
    });
  }, [solved]);

  const total = categories.reduce((sum, category) => sum + category.count, 0);
  const solvedCount = categories.reduce((sum, category) => sum + category.solved, 0);

  return (
    <div className="practice-categories">
      <div className="practice-summary">
        <div>
          <p className="eyebrow">Practice DSA</p>
          <h1>One problem at a time.</h1>
          <p className="page-lede">
            The practice set follows the roadmap order. Open a topic, read the
            statement, and try the examples before the hints. Solved marks stay in
            this browser.
          </p>
        </div>
        <div className="practice-summary-stats">
          <div>
            <strong>{solvedCount}</strong>
            <span>solved</span>
          </div>
          <div>
            <strong>{total}</strong>
            <span>problems</span>
          </div>
          <div>
            <strong>{Math.round((solvedCount / Math.max(1, total)) * 100)}%</strong>
            <span>complete</span>
          </div>
        </div>
      </div>

      <div className="practice-category-grid">
        {categories.map((category, index) => {
          const content = (
            <>
              <div className="practice-category-top">
                <span className="practice-category-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {category.count ? (
                  <span className="practice-category-count">
                    {category.solved} / {category.count}
                  </span>
                ) : (
                  <span className="practice-category-count is-soon">soon</span>
                )}
              </div>
              <h2>{category.name}</h2>
              <p>
                {category.count
                  ? `${category.count} mapped ${category.count === 1 ? "problem" : "problems"} · about ${category.minutes} min`
                  : "The practice set for this topic is still being written."}
              </p>
              <span className="practice-category-foot">
                {category.firstSlug ? (
                  <>
                    <CheckCircle width={12} height={12} aria-hidden="true" />
                    Open the set
                  </>
                ) : (
                  <>
                    <Clock width={12} height={12} aria-hidden="true" />
                    In preparation
                  </>
                )}
                <ArrowRight width={13} height={13} aria-hidden="true" />
              </span>
            </>
          );

          return category.firstSlug ? (
            <Link
              className="practice-category"
              key={category.name}
              href={`/practice/${category.firstSlug}/`}
            >
              {content}
            </Link>
          ) : (
            <div className="practice-category is-disabled" key={category.name}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="practice-notice">
        <strong>Practice Section – Ongoing Enhancements</strong>
        <p>
          The first eight problems are live. The remaining topic sets are being
          written and reviewed; they will appear here as they are ready. No filler
          problems are added just to make the counters look bigger.
        </p>
      </div>
    </div>
  );
}
