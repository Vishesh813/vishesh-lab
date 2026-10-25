import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function BrandMark({ size = 19 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 5.5 12 19l7-13.5" />
      <circle cx="12" cy="6" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label={`${siteConfig.name} home`}>
      <span className="brand-mark">
        <BrandMark />
      </span>
      <span>
        Vishesh<span className="brand-muted">Lab</span>
      </span>
    </Link>
  );
}
