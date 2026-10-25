"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Palette, Sun } from "./icons";

export type ThemeMode = "dark" | "light" | "system";
export type Accent = "green" | "blue" | "amber";

export const THEME_KEY = "vishesh-lab.theme";
export const ACCENT_KEY = "vishesh-lab.accent";

const modes: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
];

const accents: { id: Accent; label: string; color: string }[] = [
  { id: "green", label: "Green", color: "#4ade80" },
  { id: "blue", label: "Blue", color: "#60a5fa" },
  { id: "amber", label: "Amber", color: "#fbbf24" },
];

function resolveTheme(mode: ThemeMode) {
  if (mode !== "system") return mode;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(mode: ThemeMode, accent: Accent) {
  const root = document.documentElement;
  root.dataset.theme = resolveTheme(mode);
  root.dataset.accent = accent;
  root.style.colorScheme = root.dataset.theme;
}

export function ThemeSwitcher() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored === "dark" || stored === "light" || stored === "system"
      ? stored
      : "dark";
  });
  const [accent, setAccent] = useState<Accent>(() => {
    if (typeof window === "undefined") return "green";
    const stored = window.localStorage.getItem(ACCENT_KEY);
    return stored === "green" || stored === "blue" || stored === "amber"
      ? stored
      : "green";
  });
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyTheme("system", accent);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode, accent]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chooseMode = (next: ThemeMode) => {
    setMode(next);
    window.localStorage.setItem(THEME_KEY, next);
    applyTheme(next, accent);
  };

  const chooseAccent = (next: Accent) => {
    setAccent(next);
    window.localStorage.setItem(ACCENT_KEY, next);
    applyTheme(mode, next);
  };

  return (
    <div className="theme-wrap" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn theme-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="theme-panel"
        aria-label="Appearance settings"
      >
        <Palette width={16} height={16} />
      </button>

      {open ? (
        <div id="theme-panel" className="theme-panel" role="dialog" aria-label="Appearance">
          <div className="theme-panel-head">
            <span>Appearance</span>
            <span className="mono-note">saved locally</span>
          </div>

          <div className="theme-group">
            <span className="theme-label">Mode</span>
            <div className="theme-segment" role="group" aria-label="Colour mode">
              {modes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`theme-mode${mode === id ? " is-active" : ""}`}
                  onClick={() => chooseMode(id)}
                  aria-pressed={mode === id}
                >
                  <Icon width={13} height={13} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="theme-group">
            <span className="theme-label">Accent</span>
            <div className="accent-row" role="group" aria-label="Accent colour">
              {accents.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`accent-choice${accent === entry.id ? " is-active" : ""}`}
                  onClick={() => chooseAccent(entry.id)}
                  aria-label={`${entry.label} accent`}
                  aria-pressed={accent === entry.id}
                >
                  <span
                    className="accent-swatch"
                    style={{ background: entry.color }}
                    aria-hidden="true"
                  >
                    {accent === entry.id ? <Check width={10} height={10} /> : null}
                  </span>
                  {entry.label}
                </button>
              ))}
            </div>
          </div>

          <p className="theme-note">
            Your choice stays in this browser. Progress is stored separately.
          </p>
        </div>
      ) : null}
    </div>
  );
}
