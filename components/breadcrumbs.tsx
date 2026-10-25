import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight } from "./icons";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
          {index < items.length - 1 ? (
            <ChevronRight className="sep" width={10} height={10} aria-hidden="true" />
          ) : null}
        </Fragment>
      ))}
    </nav>
  );
}
