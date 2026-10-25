"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { Brand } from "./brand";
import { CommandPalette, type SearchItem } from "./command-palette";
import { ThemeSwitcher } from "./theme-switcher";
import { ArrowRight, Command, Menu, Search, X } from "./icons";

const links = [
  { href: "/dsa/", label: "DSA" },
  { href: "/system-design/", label: "System Design" },
  { href: "/practice/", label: "Practice" },
  { href: "/board/", label: "Board" },
  { href: "/posts/", label: "Posts" },
  { href: "/progress/", label: "Progress" },
  { href: "/about/", label: "About" },
];

const mobileExtra: { href: string; label: string }[] = [];

export function SiteHeader({ searchItems }: { searchItems: SearchItem[] }) {
  const pathname = usePathname();
  const path = pathname.replace(siteConfig.basePath, "") || "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, ""));

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="shell nav-shell">
        <Brand />

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${isActive(link.href) ? " is-active" : ""}`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="search-btn"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search Vishesh Lab"
          >
            <Search width={14} height={14} />
            <span className="search-label">Search</span>
            <span className="kbd">
              <Command width={10} height={10} />K
            </span>
          </button>
          <ThemeSwitcher />
          <Link href="/dsa/" className="btn btn-primary btn-sm nav-start">
            Start DSA
            <ArrowRight width={13} height={13} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X width={17} height={17} /> : <Menu width={17} height={17} />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`mobile-nav${menuOpen ? " is-open" : ""}`}>
        {[...links, ...mobileExtra].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "is-active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          className="mobile-search"
          onClick={() => {
            setMenuOpen(false);
            setPaletteOpen(true);
          }}
        >
          <Search width={15} height={15} />
          Search lessons and systems
          <span className="kbd" style={{ marginLeft: "auto" }}>
            ⌘K
          </span>
        </button>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={searchItems}
      />
    </header>
  );
}
