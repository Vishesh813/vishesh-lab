"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Trash } from "./icons";
import { CodeSnippet } from "./code-snippet";

export function CodeTabs({
  samples,
}: {
  samples: { language: string; filename: string; code: string }[];
}) {
  const [active, setActive] = useState(0);
  const sample = samples[active] ?? samples[0];

  if (!sample) return null;

  return (
    <div className="code-example">
      <div className="code-example-head">
        <h2>Code example</h2>
        <span className="code-example-hint">Switch language, then copy</span>
      </div>

      <div className="code-tabs" role="tablist" aria-label="Code language">
        {samples.map((entry, index) => (
          <button
            key={entry.language}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={index === active ? "is-active" : ""}
            onClick={() => setActive(index)}
          >
            {entry.language.toUpperCase()}
          </button>
        ))}
      </div>

      <CodeSnippet
        key={sample.filename}
        code={sample.code}
        language={sample.language}
        filename={sample.filename}
        className="is-embedded"
      />
    </div>
  );
}

const noteListeners = new Set<() => void>();

function subscribeToNotes(callback: () => void) {
  noteListeners.add(callback);
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  return () => {
    noteListeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function writeNote(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
  for (const listener of noteListeners) listener();
}

function useStoredNote(key: string) {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) ?? "";
    } catch {
      return "";
    }
  }, [key]);
  return useSyncExternalStore(subscribeToNotes, getSnapshot, () => "");
}

export function LessonNotes({ code }: { code: string }) {
  const key = `vishesh-lab.notes.${code}`;
  const stored = useStoredNote(key);
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);
  const timer = useRef<number | null>(null);
  const value = draft ?? stored;

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const onChange = (next: string) => {
    setDraft(next);
    setSaved(false);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      writeNote(key, next);
      setSaved(true);
    }, 450);
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <section className="lesson-notes" aria-labelledby="notes-title">
      <div className="lesson-notes-head">
        <h2 id="notes-title">Your notes</h2>
        <span>{saved ? "Saved locally" : "Saving…"}</span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write the definition in your own words, or note the part that still feels fuzzy…"
        rows={7}
        aria-label="Your notes for this lesson"
      />
      <div className="lesson-notes-foot">
        <span>{words} words · this browser only</span>
        {value ? (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              if (timer.current) window.clearTimeout(timer.current);
              setDraft("");
              writeNote(key, "");
              setSaved(true);
            }}
          >
            <Trash width={11} height={11} /> Clear
          </button>
        ) : null}
      </div>
    </section>
  );
}
