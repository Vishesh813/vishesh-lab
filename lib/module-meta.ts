import type { ModuleMeta, Track } from "./types";
import { dsaLessons } from "./dsa-course";
import { systemDesignModules } from "./system-design";
import { caseStudies } from "./case-studies";

export const dsaMeta: ModuleMeta[] = dsaLessons.map((lesson, index) => ({
  slug: lesson.slug,
  step: index + 1,
  title: lesson.title,
  phase: lesson.phase,
  topics: lesson.keyPoints,
  track: "dsa",
}));

export const systemMeta: ModuleMeta[] = systemDesignModules.map((module) => ({
  slug: module.slug,
  step: module.step,
  title: module.title,
  phase: module.phase,
  topics: module.topics,
  track: "systems",
}));

export const caseStudyMeta: ModuleMeta[] = caseStudies.map((study, index) => ({
  slug: study.slug,
  step: index + 1,
  title: study.title,
  phase: "Case studies",
  topics: study.checklist,
  track: "case-study",
}));

export const allMeta: ModuleMeta[] = [...dsaMeta, ...systemMeta, ...caseStudyMeta];

/** @deprecated Use allMeta, dsaMeta, systemMeta or caseStudyMeta. */
export const moduleMeta: ModuleMeta[] = allMeta;

export const trackMeta: Record<Track, ModuleMeta[]> = {
  dsa: dsaMeta,
  systems: systemMeta,
  "case-study": caseStudyMeta,
};

export const trackLabels: Record<Track, string> = {
  dsa: "DSA",
  systems: "System Design",
  "case-study": "Case studies",
};

export function getModuleMeta(slug: string) {
  return allMeta.find((module) => module.slug === slug);
}

export { dsaLessons };
