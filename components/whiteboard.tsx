"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import { Check, Download, Rotate, Trash } from "./icons";

const STORAGE_KEY = "vishesh-lab.board.v1";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((module) => module.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="board-loading">
        <span className="status-dot" aria-hidden="true" />
        Loading the board…
      </div>
    ),
  },
);

type SavedBoard = {
  elements: ExcalidrawInitialDataState["elements"];
  files: ExcalidrawInitialDataState["files"];
  savedAt: number;
};

function readBoard(): SavedBoard | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedBoard>;
    if (!parsed || !Array.isArray(parsed.elements)) return null;
    return {
      elements: parsed.elements,
      files: parsed.files ?? {},
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

function relativeTime(timestamp: number) {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
}

const emptySubscribe = () => () => {};

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function Whiteboard() {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const saveTimer = useRef<number | null>(null);
  const [initialData] = useState<ExcalidrawInitialDataState>(() => {
    if (typeof window === "undefined") {
      return { elements: [], files: {}, scrollToContent: true };
    }
    const saved = readBoard();
    return saved
      ? { elements: saved.elements, files: saved.files, scrollToContent: true }
      : { elements: [], files: {}, scrollToContent: true };
  });
  const [savedAt, setSavedAt] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    return readBoard()?.savedAt ?? null;
  });
  const [status, setStatus] = useState<"saved" | "saving" | "idle">(() => {
    if (typeof window === "undefined") return "idle";
    return readBoard() ? "saved" : "idle";
  });
  const [exporting, setExporting] = useState(false);
  const theme = useSyncExternalStore<"light" | "dark">(
    subscribeTheme,
    getThemeSnapshot,
    () => "dark",
  );
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const persist = useCallback(
    (elements: readonly unknown[], files: unknown) => {
      setStatus("saving");
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          const payload: SavedBoard = {
            elements: elements as SavedBoard["elements"],
            files: files as SavedBoard["files"],
            savedAt: Date.now(),
          };
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
          setSavedAt(payload.savedAt);
          setStatus("saved");
        } catch {
          setStatus("idle");
        }
      }, 450);
    },
    [],
  );

  const exportPng = async () => {
    const api = apiRef.current;
    if (!api) return;
    setExporting(true);
    try {
      const { exportToBlob } = await import("@excalidraw/excalidraw");
      const blob = await exportToBlob({
        elements: api.getSceneElements(),
        appState: api.getAppState(),
        files: api.getFiles(),
        mimeType: "image/png",
        quality: 1,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vishesh-board-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const clearBoard = () => {
    if (!window.confirm("Clear every shape on this board? This cannot be undone.")) return;
    apiRef.current?.resetScene();
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
    setSavedAt(null);
    setStatus("idle");
  };

  return (
    <div className="board-shell">
      <header className="board-head">
        <div className="board-head-main">
          <p className="board-kicker">Whiteboard</p>
          <div className="board-title-row">
            <h1>Untitled board</h1>
            <span className={`board-status is-${status}`}>
              {status === "saving" ? (
                <>Saving…</>
              ) : status === "saved" && savedAt ? (
                <>
                  <Check width={11} height={11} aria-hidden="true" />
                  Saved {relativeTime(savedAt)}
                </>
              ) : (
                <>Changes not saved</>
              )}
            </span>
          </div>
        </div>
        <div className="board-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => apiRef.current?.scrollToContent(undefined, { animate: true })}>
            <Rotate width={13} height={13} aria-hidden="true" />
            Reset view
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={exportPng} disabled={exporting}>
            <Download width={13} height={13} aria-hidden="true" />
            {exporting ? "Exporting…" : "Export PNG"}
          </button>
        </div>
      </header>

      <div className="board-canvas">
        {mounted ? (
          <Excalidraw
            excalidrawAPI={(api) => {
              apiRef.current = api;
            }}
            initialData={initialData}
            theme={theme}
            onChange={(elements, _appState, files) => persist(elements, files)}
            UIOptions={{
              canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                export: false,
                saveAsImage: false,
              },
            }}
          />
        ) : null}
      </div>

      <footer className="board-foot">
        <span>
          <span className="status-dot" aria-hidden="true" />
          Auto-save enabled · this browser only
        </span>
        <span className="board-foot-hint">
          Hold space or the hand tool to pan · scroll to zoom
        </span>
        <button type="button" className="board-clear" onClick={clearBoard}>
          <Trash width={12} height={12} aria-hidden="true" />
          Clear board
        </button>
      </footer>
    </div>
  );
}
