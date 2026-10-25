"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts";
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "./icons";

const PAGE_SIZE = 4;

export function PostsBrowser({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState("For You");
  const [page, setPage] = useState(1);

  const tabs = useMemo(() => {
    const categories = Array.from(new Set(posts.map((post) => post.category)));
    return ["For You", "All", "DSA", "System Design", ...categories];
  }, [posts]);

  const filtered = useMemo(() => {
    if (active === "For You" || active === "All") return posts;
    if (active === "DSA" || active === "System Design") {
      return posts.filter((post) => post.track === active);
    }
    return posts.filter((post) => post.category === active);
  }, [active, posts]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectTab = (tab: string) => {
    setActive(tab);
    setPage(1);
  };

  return (
    <div className="posts-browser">
      <div className="post-tabs" role="tablist" aria-label="Post categories">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            className={active === tab ? "is-active" : ""}
            onClick={() => selectTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="post-list">
          {visible.map((post) => (
            <article className="post-row" key={post.slug}>
              <div className="post-row-meta">
                <span className={`post-row-track is-${post.accent}`}>{post.track}</span>
                <span>{post.category}</span>
                <span>{post.displayDate}</span>
                <span>
                  <Clock width={11} height={11} aria-hidden="true" />
                  {post.readTime} min
                </span>
              </div>
              <h2>
                <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link className="post-row-link" href={`/posts/${post.slug}/`}>
                Read more
                <ArrowRight width={13} height={13} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="post-empty">
          <p>No posts in this category yet.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => selectTab("All")}>
            Show all posts
          </button>
        </div>
      )}

      {pages > 1 ? (
        <nav className="post-pagination" aria-label="Post pages">
          <button
            type="button"
            className="post-page-btn"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={current === 1}
            aria-label="Previous page"
          >
            <ChevronLeft width={14} height={14} />
          </button>
          {Array.from({ length: pages }, (_, index) => index + 1).map((entry) => (
            <button
              key={entry}
              type="button"
              className={`post-page-btn${entry === current ? " is-active" : ""}`}
              onClick={() => setPage(entry)}
              aria-current={entry === current ? "page" : undefined}
            >
              {entry}
            </button>
          ))}
          <button
            type="button"
            className="post-page-btn"
            onClick={() => setPage((value) => Math.min(pages, value + 1))}
            disabled={current === pages}
            aria-label="Next page"
          >
            <ChevronRight width={14} height={14} />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
