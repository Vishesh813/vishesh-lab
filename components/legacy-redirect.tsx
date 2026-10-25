"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LegacyRedirect({
  href,
  label = "Continue",
}: {
  href: string;
  label?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <div
      className="shell legacy-redirect"
      style={{ padding: "80px 0", maxWidth: 640 }}
    >
      <p className="eyebrow">Moved</p>
      <h1>This page has a new home.</h1>
      <p className="page-lede">
        The DSA roadmap now lives under <code>/dsa/</code>. The old address
        still works and will take you there.
      </p>
      <Link className="btn btn-primary" href={href}>
        {label}
      </Link>
    </div>
  );
}
