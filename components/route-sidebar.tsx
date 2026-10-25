"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/site";
import { ChevronLeft, ChevronRight, Menu, X } from "./icons";
import type { ReactNode } from "react";

export type RouteGroup = {
  id: string;
  label: string;
  meta?: ReactNode;
  items: { label: string; href: string }[];
};

type FooterLink = { label: string; href: string };

function normalisePath(path: string) {
  const withoutBase = path.replace(siteConfig.basePath, "") || "/";
  return withoutBase.replace(/\/+$/, "") || "/";
}

export function RouteSidebar({
  title,
  homeHref,
  homeLabel,
  groups,
  footer,
  triggerLabel,
  ariaLabel,
}: {
  title: string;
  homeHref: string;
  homeLabel: string;
  groups: RouteGroup[];
  footer: FooterLink[];
  triggerLabel: string;
  ariaLabel: string;
}) {
  const pathname = usePathname();
  const currentPath = normalisePath(pathname);
  const activeGroupId = useMemo(
    () =>
      groups.find((group) =>
        group.items.some((item) => normalisePath(item.href) === currentPath),
      )?.id,
    [groups, currentPath],
  );
  const [openIds, setOpenIds] = useState<string[]>(
    activeGroupId ? [activeGroupId] : [],
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((v) => !v);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const storageKey = `vishesh-lab.route-sidebar.${ariaLabel}.collapsed.v2`;

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "true") setCollapsed(true);
    } catch {
      // Ignore storage failures.
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(storageKey, String(collapsed));
    } catch {
      // Ignore storage failures.
    }
    const shell = document.querySelector(".route-shell");
    if (shell) shell.classList.toggle("is-collapsed", collapsed);
  }, [collapsed, storageKey, mounted]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const toggleCollapsed = () => {
    if (window.innerWidth <= 1024) setMobileOpen(true);
    else setCollapsed((value) => !value);
  };

  const toggleGroup = (id: string) => {
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  };

  const nav = (
    <div className="route-nav">
      <div className="route-nav-head">
        <h2>{title}</h2>
        <button
          type="button"
          className="route-collapse-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? `Expand ${ariaLabel}` : `Collapse ${ariaLabel}`}
        >
          {collapsed ? (
            <ChevronRight width={16} height={16} aria-hidden="true" />
          ) : (
            <ChevronLeft width={16} height={16} aria-hidden="true" />
          )}
        </button>
        <Link href={homeHref} className="route-nav-home" onClick={closeMobile}>
          {homeLabel}
        </Link>
      </div>

      <div className="route-group-list">
        {groups.map((group) => {
          const isActiveGroup = group.id === activeGroupId;
          const isOpen = isActiveGroup || openIds.includes(group.id);
          const single = group.items.length === 1;
          const item = group.items[0];

          return (
            <div
              className={`route-group${isActiveGroup ? " is-active" : ""}`}
              key={group.id}
            >
              {single ? (
                <Link
                  href={item.href}
                  className="route-group-trigger"
                  aria-current={
                    normalisePath(item.href) === currentPath ? "page" : undefined
                  }
                  onClick={closeMobile}
                >
                  <span>{group.label}</span>
                  {group.meta ? (
                    <span className="route-group-side">{group.meta}</span>
                  ) : null}
                </Link>
              ) : (
                <button
                  type="button"
                  className="route-group-trigger"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                >
                  <span>{group.label}</span>
                  <span className="route-group-side">
                    {group.meta}
                    <ChevronRight
                      width={14}
                      height={14}
                      className={`route-chevron${isOpen ? " is-open" : ""}`}
                    />
                  </span>
                </button>
              )}

              {!single && isOpen ? (
                <ul className="route-items">
                  {group.items.map((entry) => {
                    const active = normalisePath(entry.href) === currentPath;
                    return (
                      <li key={entry.href}>
                        <Link
                          href={entry.href}
                          className={active ? "is-current" : ""}
                          aria-current={active ? "page" : undefined}
                          onClick={closeMobile}
                        >
                          {entry.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="route-nav-foot">
        {footer.map((link) => (
          <Link key={link.href + link.label} href={link.href} onClick={closeMobile}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <aside className="route-sidebar" aria-label={ariaLabel}>
        {nav}
      </aside>

      <button
        type="button"
        className="route-mobile-trigger"
        onClick={toggleMobile}
        aria-label={`Toggle ${ariaLabel}`}
        aria-expanded={mobileOpen}
      >
        <Menu width={16} height={16} aria-hidden="true" />
        {triggerLabel}
      </button>

      {mobileOpen ? (
        <div className="route-drawer">
          <div
            className="route-drawer-backdrop"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div
            className="route-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            <button
              type="button"
              className="route-drawer-close"
              onClick={closeMobile}
              aria-label={`Close ${ariaLabel}`}
            >
              <X width={18} height={18} aria-hidden="true" />
            </button>
            {nav}
          </div>
        </div>
      ) : null}
    </>
  );
}