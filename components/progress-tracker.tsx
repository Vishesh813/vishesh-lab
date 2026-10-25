"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { dsaPhases, getDsaLessonBySlug, lessonHref } from "@/lib/dsa-course";
import { caseStudyMeta, dsaMeta, systemMeta } from "@/lib/module-meta";
import {
  clearProgress,
  computeStats,
  exportProgress,
  importProgress,
  moduleStats,
  nextModule,
  useProgress,
  useSolved,
} from "@/lib/progress";
import { caseStudies } from "@/lib/case-studies";
import { systemDesignModules } from "@/lib/system-design";
import { ProgressCharts } from "./progress-charts";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Info,
  Rotate,
  Target,
  Upload,
} from "./icons";

type Message = { text: string; error?: boolean } | null;
type Mode = "dsa" | "systems";

export function ProgressTracker() {
  const { map } = useProgress();
  const { solved } = useSolved();
  const [message, setMessage] = useState<Message>(null);
  const [mode, setMode] = useState<Mode>("dsa");

  const dsa = computeStats(dsaMeta, map);
  const systems = computeStats(systemMeta, map);
  const cases = computeStats(caseStudyMeta, map);

  const nextDsa = nextModule(dsaMeta, map);
  const nextLesson = nextDsa ? getDsaLessonBySlug(nextDsa.slug) : undefined;
  const nextSystem = nextModule(systemMeta, map);

  const dsaPhaseRows = dsaPhases.map((phase) => {
    const lessons = dsaMeta.filter((lesson) => lesson.phase === phase.name);
    const percent = lessons.length
      ? Math.round(
          lessons.reduce((total, lesson) => total + moduleStats(lesson, map).percent, 0) /
            lessons.length,
        )
      : 0;
    return { phase, percent };
  });

  const systemRows = systemDesignModules.map((module) => ({
    module,
    stats: moduleStats(
      {
        slug: module.slug,
        step: module.step,
        title: module.title,
        phase: module.phase,
        topics: module.topics,
      },
      map,
    ),
  }));

  const handleExport = () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `vishesh-lab-progress-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage({ text: "Progress exported. Keep the JSON file somewhere safe." });
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importProgress(text);
    setMessage({ text: result.message, error: !result.ok });
    event.target.value = "";
  };

  const handleClear = () => {
    if (!window.confirm("Clear every marked lesson, topic and solved problem? This cannot be undone.")) {
      return;
    }
    clearProgress();
    setMessage({ text: "Progress cleared. Your map is blank again." });
  };

  return (
    <div className="progress-tracker">
      <div className="progress-hero">
        <div>
          <p className="eyebrow">Progress</p>
          <h1>Two modes. Two honest scores.</h1>
          <p className="page-lede">
            DSA and System Design are tracked separately. Switch modes to see the
            lessons, modules and case studies that belong to that path — never a
            blended number.
          </p>
        </div>
        <div className="progress-hero-actions">
          <Link className="btn btn-primary" href="/dsa/">
            DSA roadmap
            <ArrowRight width={14} height={14} aria-hidden="true" />
          </Link>
          <Link className="btn btn-secondary" href="/practice/">
            <Target width={14} height={14} aria-hidden="true" />
            Practice
          </Link>
        </div>
      </div>

      <div className="progress-mode-switch" role="tablist" aria-label="Progress mode">
        <button
          type="button"
          role="tab"
          id="progress-tab-dsa"
          aria-selected={mode === "dsa"}
          aria-controls="progress-panel-dsa"
          className={mode === "dsa" ? "is-active" : ""}
          onClick={() => setMode("dsa")}
        >
          <span>DSA</span>
          <strong>{dsa.percent}%</strong>
          <small>
            {dsa.completeModules}/{dsaMeta.length} lessons
          </small>
        </button>
        <button
          type="button"
          role="tab"
          id="progress-tab-systems"
          aria-selected={mode === "systems"}
          aria-controls="progress-panel-systems"
          className={mode === "systems" ? "is-active" : ""}
          onClick={() => setMode("systems")}
        >
          <span>System Design</span>
          <strong>{systems.percent}%</strong>
          <small>
            {systems.completeModules}/{systemMeta.length} modules
          </small>
        </button>
      </div>

      {mode === "dsa" ? (
        <div
          role="tabpanel"
          id="progress-panel-dsa"
          aria-labelledby="progress-tab-dsa"
          className="progress-panel"
        >
          <div className="progress-stats">
            <div className="progress-stat">
              <span>DSA roadmap</span>
              <strong>{dsa.percent}%</strong>
              <p>
                {dsa.doneTopics} of {dsa.totalTopics} key points
              </p>
            </div>
            <div className="progress-stat">
              <span>Lessons</span>
              <strong>
                {dsa.completeModules}/{dsaMeta.length}
              </strong>
              <p>marked complete</p>
            </div>
            <div className="progress-stat">
              <span>Practice</span>
              <strong>{solved.length}</strong>
              <p>problems marked solved</p>
            </div>
          </div>

          <ProgressCharts
            done={dsa.doneTopics}
            remaining={Math.max(0, dsa.totalTopics - dsa.doneTopics)}
            labels={dsaPhaseRows.map((row) => row.phase.name)}
            values={dsaPhaseRows.map((row) => row.percent)}
            title="DSA completion"
            barTitle="DSA phase completion"
            itemLabel="phases"
          />

          <section className="progress-list-card">
            <div className="progress-list-head">
              <div>
                <h2>DSA topics</h2>
                <p>{dsa.percent}% of the DSA roadmap</p>
              </div>
              <Link className="next-link" href="/dsa/">
                Full roadmap
                <ArrowRight width={13} height={13} aria-hidden="true" />
              </Link>
            </div>
            <div className="progress-list">
              {dsaPhaseRows.map(({ phase, percent }, index) => {
                const first = phase.lessons[0];
                return (
                  <Link
                    className="progress-row"
                    key={phase.name}
                    href={lessonHref(first.slug)}
                  >
                    <span className="progress-row-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="progress-row-name">{phase.name}</span>
                    <span className="progress-row-bar">
                      <span style={{ width: `${percent}%` }} />
                    </span>
                    <span className="progress-row-pct">{percent}%</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="progress-next">
            <div>
              <p className="eyebrow">
                {nextLesson ? "Continue DSA" : "DSA roadmap complete"}
              </p>
              <h2>
                {nextLesson
                  ? nextLesson.title
                  : "You have marked every DSA lesson."}
              </h2>
              <p>
                {nextLesson
                  ? `${nextLesson.phase} · ${nextLesson.minutes} min · ${nextLesson.keyPoints.length} key points`
                  : "Revisit a topic, or export your progress before switching devices."}
              </p>
            </div>
            {nextLesson ? (
              <Link
                className="btn btn-primary"
                href={lessonHref(nextLesson.slug)}
              >
                Open lesson
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
            ) : (
              <Link className="btn btn-secondary" href="/dsa/">
                Browse the roadmap
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
            )}
          </section>
        </div>
      ) : (
        <div
          role="tabpanel"
          id="progress-panel-systems"
          aria-labelledby="progress-tab-systems"
          className="progress-panel"
        >
          <div className="progress-stats">
            <div className="progress-stat">
              <span>System Design</span>
              <strong>{systems.percent}%</strong>
              <p>
                {systems.doneTopics} of {systems.totalTopics} topics
              </p>
            </div>
            <div className="progress-stat">
              <span>Modules</span>
              <strong>
                {systems.completeModules}/{systemMeta.length}
              </strong>
              <p>marked complete</p>
            </div>
            <div className="progress-stat">
              <span>Case studies</span>
              <strong>{cases.percent}%</strong>
              <p>
                {cases.completeModules}/{caseStudyMeta.length} complete
              </p>
            </div>
          </div>

          <ProgressCharts
            done={systems.doneTopics}
            remaining={Math.max(0, systems.totalTopics - systems.doneTopics)}
            labels={systemRows.map((row) => row.module.title)}
            values={systemRows.map((row) => row.stats.percent)}
            title="System Design completion"
            barTitle="Module completion"
            itemLabel="modules"
          />

          <section className="progress-list-card">
            <div className="progress-list-head">
              <div>
                <h2>System Design modules</h2>
                <p>{systems.percent}% of the systems track</p>
              </div>
              <Link className="next-link" href="/system-design/">
                Full track
                <ArrowRight width={13} height={13} aria-hidden="true" />
              </Link>
            </div>
            <div className="progress-list">
              {systemRows.map(({ module, stats }) => (
                <Link
                  className="progress-row"
                  key={module.slug}
                  href={`/system-design/${module.slug}/`}
                >
                  <span className="progress-row-num">
                    {String(module.step).padStart(2, "0")}
                  </span>
                  <span className="progress-row-name">{module.title}</span>
                  <span className="progress-row-bar">
                    <span style={{ width: `${stats.percent}%` }} />
                  </span>
                  <span className="progress-row-pct">{stats.percent}%</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="progress-list-card">
            <div className="progress-list-head">
              <div>
                <h2>Case studies</h2>
                <p>{cases.percent}% of the design practice</p>
              </div>
              <Link className="next-link" href="/case-studies/">
                All case studies
                <ArrowRight width={13} height={13} aria-hidden="true" />
              </Link>
            </div>
            <div className="progress-case-grid">
              {caseStudies.map((study, index) => {
                const stats = moduleStats(
                  {
                    slug: study.slug,
                    step: index + 1,
                    title: study.title,
                    phase: "Case studies",
                    topics: study.checklist,
                  },
                  map,
                );
                return (
                  <Link
                    className="progress-case"
                    key={study.slug}
                    href={`/case-studies/${study.slug}/`}
                  >
                    <span className={`badge badge-${study.difficulty.toLowerCase()}`}>
                      {study.difficulty}
                    </span>
                    <strong>{study.title}</strong>
                    <span className="progress-case-bar">
                      <span style={{ width: `${stats.percent}%` }} />
                    </span>
                    <span>{stats.percent}%</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="progress-next">
            <div>
              <p className="eyebrow">
                {nextSystem ? "Continue System Design" : "Systems track complete"}
              </p>
              <h2>
                {nextSystem
                  ? nextSystem.title
                  : "You have marked every systems module."}
              </h2>
              <p>
                {nextSystem
                  ? `${nextSystem.phase} · module ${String(nextSystem.step).padStart(2, "0")} · ${nextSystem.topics.length} topics`
                  : "Move on to the case studies, or export your progress first."}
              </p>
            </div>
            {nextSystem ? (
              <Link
                className="btn btn-primary"
                href={`/system-design/${nextSystem.slug}/`}
              >
                Open module
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
            ) : (
              <Link className="btn btn-secondary" href="/case-studies/">
                Open case studies
                <ArrowRight width={14} height={14} aria-hidden="true" />
              </Link>
            )}
          </section>
        </div>
      )}

      <div className="progress-bottom">
        <section className="progress-data">
          <div className="progress-data-head">
            <h2>Your data</h2>
            <span>
              <Info width={12} height={12} aria-hidden="true" />
              local only
            </span>
          </div>
          <p>
            Export a JSON backup before switching browsers or clearing site data.
            Import restores the same file.
          </p>
          <div className="progress-data-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
              <Download width={13} height={13} aria-hidden="true" />
              Export JSON
            </button>
            <label className="import-label">
              <Upload width={13} height={13} aria-hidden="true" />
              Import JSON
              <input type="file" accept="application/json,.json" onChange={handleImport} />
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-sm danger-btn"
              onClick={handleClear}
            >
              <Rotate width={13} height={13} aria-hidden="true" />
              Clear
            </button>
          </div>
          <p
            className={`status-line${message?.error ? " is-error" : ""}`}
            role="status"
            aria-live="polite"
          >
            {message?.text ?? ""}
          </p>
        </section>
      </div>

      <div className="progress-footnote">
        <CheckCircle width={13} height={13} aria-hidden="true" />
        <span>
          Progress is stored under <code>vishesh-lab.progress.v2</code> in
          localStorage. It never leaves this browser unless you export it.
        </span>
      </div>
    </div>
  );
}
