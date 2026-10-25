"use client";

import { useEffect, useState } from "react";
import type { ModuleMeta } from "./types";

export type ProgressMap = Record<string, number[]>;

export const PROGRESS_KEY = "vishesh-lab.progress.v2";
export const LEGACY_PROGRESS_KEY = "vishesh-lab.progress.v1";
export const SOLVED_KEY = "vishesh-lab.solved.v1";
export const PROGRESS_EVENT = "vishesh-lab:progress";
export const SOLVED_EVENT = "vishesh-lab:solved";

function cleanIndices(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter(
        (item): item is number =>
          typeof item === "number" && Number.isInteger(item) && item >= 0,
      ),
    ),
  ).sort((a, b) => a - b);
}

export function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw =
      window.localStorage.getItem(PROGRESS_KEY) ??
      window.localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const next: ProgressMap = {};
    for (const [slug, value] of Object.entries(parsed)) {
      const clean = cleanIndices(value);
      if (clean.length) next[slug] = clean;
    }
    return next;
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    // Storage can be unavailable in private modes; keep the UI honest.
  }
}

export function toggleTopic(slug: string, index: number) {
  const map = readProgress();
  const current = new Set(map[slug] ?? []);
  if (current.has(index)) current.delete(index);
  else current.add(index);
  const next = Array.from(current).sort((a, b) => a - b);
  if (next.length) map[slug] = next;
  else delete map[slug];
  saveProgress(map);
}

export function setModuleProgress(slug: string, indices: number[]) {
  const map = readProgress();
  const next = cleanIndices(indices);
  if (next.length) map[slug] = next;
  else delete map[slug];
  saveProgress(map);
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
    window.localStorage.removeItem(SOLVED_KEY);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
    window.dispatchEvent(new Event(SOLVED_EVENT));
  } catch {
    // Ignore storage failures.
  }
}

export function readSolved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SOLVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return Array.from(
      new Set(parsed.filter((item): item is string => typeof item === "string")),
    );
  } catch {
    return [];
  }
}

export function saveSolved(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOLVED_KEY, JSON.stringify(Array.from(new Set(slugs))));
    window.dispatchEvent(new Event(SOLVED_EVENT));
  } catch {
    // Ignore storage failures.
  }
}

export function toggleSolved(slug: string) {
  const solved = new Set(readSolved());
  if (solved.has(slug)) solved.delete(slug);
  else solved.add(slug);
  saveSolved(Array.from(solved));
}

export function exportProgress(): string {
  return JSON.stringify(
    {
      app: "Vishesh Lab",
      version: 2,
      exportedAt: new Date().toISOString(),
      progress: readProgress(),
      solved: readSolved(),
    },
    null,
    2,
  );
}

export function importProgress(raw: string): { ok: boolean; message: string } {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const source =
      parsed && typeof parsed === "object" && "progress" in parsed
        ? (parsed as { progress: unknown }).progress
        : parsed;

    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return { ok: false, message: "That file does not contain a progress map." };
    }

    const map: ProgressMap = {};
    for (const [slug, value] of Object.entries(source)) {
      const clean = cleanIndices(value);
      if (clean.length) map[slug] = clean;
    }

    const solvedSource =
      parsed && typeof parsed === "object" && "solved" in parsed
        ? (parsed as { solved: unknown }).solved
        : [];
    const solved = Array.isArray(solvedSource)
      ? solvedSource.filter((item): item is string => typeof item === "string")
      : [];

    saveProgress(map);
    saveSolved(solved);
    return {
      ok: true,
      message: `Progress imported: ${Object.keys(map).length} checklists and ${solved.length} solved problems.`,
    };
  } catch {
    return { ok: false, message: "That file is not valid JSON." };
  }
}

export function moduleStats(module: ModuleMeta, map: ProgressMap) {
  const done = (map[module.slug] ?? []).filter(
    (index) => index < module.topics.length,
  ).length;
  return {
    done,
    total: module.topics.length,
    percent: module.topics.length
      ? Math.round((done / module.topics.length) * 100)
      : 0,
    complete: module.topics.length > 0 && done === module.topics.length,
  };
}

export function computeStats(meta: ModuleMeta[], map: ProgressMap) {
  const totalTopics = meta.reduce(
    (total, module) => total + module.topics.length,
    0,
  );
  const doneTopics = meta.reduce(
    (total, module) => total + moduleStats(module, map).done,
    0,
  );
  const completeModules = meta.filter(
    (module) => moduleStats(module, map).complete,
  ).length;
  const startedModules = meta.filter(
    (module) => moduleStats(module, map).done > 0,
  ).length;

  return {
    totalTopics,
    doneTopics,
    completeModules,
    startedModules,
    percent: totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0,
  };
}

export function nextModule(meta: ModuleMeta[], map: ProgressMap) {
  return meta.find((module) => !moduleStats(module, map).complete) ?? null;
}

export function useProgress() {
  const [map, setMap] = useState<ProgressMap>({});

  useEffect(() => {
    const sync = () => setMap(readProgress());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { map };
}

export function useSolved() {
  const [solved, setSolved] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSolved(readSolved());
    sync();
    window.addEventListener(SOLVED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SOLVED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { solved };
}
