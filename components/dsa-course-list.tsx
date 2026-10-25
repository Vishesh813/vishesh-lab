"use client";

import Link from "next/link";
import { dsaPhases, lessonHref } from "@/lib/dsa-course";
import { moduleStats, useProgress } from "@/lib/progress";
import { ChevronRight, Clock } from "./icons";

export function DsaCourseList() {
  const { map } = useProgress();

  return (
    <div className="course-topic-list">
      {dsaPhases.map((phase, index) => {
        const lessons = phase.lessons;
        const done = lessons.filter((lesson) =>
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
        const percent = Math.round((done / lessons.length) * 100);

        return (
          <section className="course-topic" key={phase.name}>
            <div className="course-topic-head">
              <span className="course-topic-num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{phase.name}</h2>
                <p>
                  {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} ·{" "}
                  {lessons.reduce((total, lesson) => total + lesson.minutes, 0)} min
                </p>
              </div>
              <span className="course-topic-progress">{percent}%</span>
            </div>

            <div className="course-topic-lessons">
              {lessons.map((lesson) => {
                const stats = moduleStats(
                  {
                    slug: lesson.slug,
                    step: 1,
                    title: lesson.title,
                    phase: lesson.phase,
                    topics: lesson.keyPoints,
                  },
                  map,
                );
                return (
                  <Link
                    key={lesson.code}
                    href={lessonHref(lesson.slug)}
                    className="course-topic-lesson"
                  >
                    <span className="course-lesson-dot" data-done={stats.complete} />
                    <span className="course-lesson-main">
                      <strong>{lesson.title}</strong>
                      <span>{lesson.summary}</span>
                    </span>
                    <span className="course-lesson-time">
                      <Clock width={11} height={11} /> {lesson.minutes} min
                    </span>
                    <span className="course-lesson-bar">
                      <span style={{ width: `${stats.percent}%` }} />
                    </span>
                    <ChevronRight width={15} height={15} />
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
