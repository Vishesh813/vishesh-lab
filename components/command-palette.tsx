"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Blueprint,
  BookOpen,
  Code,
  Compass,
  FileText,
  Layers,
  Search,
} from "./icons";

export type SearchType =
  | "DSA"
  | "System Design"
  | "Case study"
  | "Practice"
  | "Note"
  | "Page";

export type SearchItem = {
  type: SearchType;
  title: string;
  href: string;
  meta?: string;
};

const order: SearchType[] = [
  "DSA",
  "System Design",
  "Case study",
  "Practice",
  "Note",
  "Page",
];

const iconFor = {
  DSA: BookOpen,
  "System Design": Layers,
  "Case study": Blueprint,
  Practice: Code,
  Note: FileText,
  Page: Compass,
} as const;

type Props = {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
};

export function CommandPalette({ open, onClose, items }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    setQuery("");
    setSelected(0);
    onClose();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 16);
    return items
      .filter((item) =>
        `${item.title} ${item.type} ${item.meta ?? ""}`
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 30);
  }, [items, query]);

  const groups = useMemo(
    () =>
      order
        .map((type) => ({
          type,
          entries: filtered.filter((item) => item.type === type),
        }))
        .filter((group) => group.entries.length > 0),
    [filtered],
  );

  const flat = useMemo(
    () => groups.flatMap((group) => group.entries),
    [groups],
  );

  const go = (item: SearchItem) => {
    handleClose();
    router.push(item.href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((current) => Math.min(current + 1, flat.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((current) => Math.max(current - 1, 0));
    }
    if (event.key === "Enter" && flat[selected]) {
      event.preventDefault();
      go(flat[selected]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Search Vishesh Lab"
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) handleClose();
      }}
    >
      <div className="palette-head">
        <Search width={16} height={16} />
        <input
          ref={inputRef}
          className="palette-input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search both tracks, case studies and notes…"
          aria-label="Search both tracks, case studies and notes"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="kbd">ESC</span>
      </div>

      <div className="palette-list">
        {groups.length === 0 ? (
          <p className="palette-empty">
            No results for “{query}”. Try “graphs”, “caching”, “chat” or
            “interview”.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.type}>
              <div className="palette-group">{group.type}</div>
              {group.entries.map((item) => {
                const index = flat.indexOf(item);
                const Icon = iconFor[item.type];
                return (
                  <Link
                    key={`${item.type}-${item.href}`}
                    href={item.href}
                    className={`palette-item${index === selected ? " is-selected" : ""}`}
                    onMouseEnter={() => setSelected(index)}
                    onClick={handleClose}
                  >
                    <Icon width={14} height={14} />
                    <span>{item.title}</span>
                    {item.meta ? (
                      <span className="item-meta">{item.meta}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="palette-foot">
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> navigate
        </span>
        <span>
          <kbd>↵</kbd> open
        </span>
        <span style={{ marginLeft: "auto" }}>Vishesh Lab search</span>
      </div>
    </dialog>
  );
}
