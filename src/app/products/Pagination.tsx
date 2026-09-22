"use client";
import Link from "next/link";
import { JSX } from "react";
import { buildUrl, type CatalogSort } from "@/lib/catalog";

export default function Pagination({
  page,
  totalPages,
  category,
  q,
  sort,
}: {
  page: number;
  totalPages: number;
  category?: string;
  q?: string;
  sort?: string;
}): JSX.Element | null {
  if (totalPages <= 1) return null;

  const sortParam = sort as CatalogSort | undefined;
  const makeUrl = (p: number) =>
    buildUrl({ category, q, sort: sortParam, page: p });

  const windowSize = 1;
  let start = Math.max(1, page - windowSize);
  let end = Math.min(totalPages, page + windowSize);
  if (page - windowSize < 1) end = Math.min(totalPages, end + (windowSize - (page - 1)));
  if (page + windowSize > totalPages) start = Math.max(1, start - (page + windowSize - totalPages));

  const pages: (number | "…")[] = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("…");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Link
        href={makeUrl(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition ${
          page <= 1
            ? "pointer-events-none border-line text-faint"
            : "border-line bg-surface text-ink-muted hover:border-primary-bright hover:text-primary-bright"
        }`}
      >
        Prev
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-faint">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeUrl(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition ${
              p === page
                ? "border-primary bg-primary-solid text-white"
                : "border-line bg-surface text-ink-muted hover:border-primary-bright hover:text-primary-bright"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={makeUrl(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition ${
          page >= totalPages
            ? "pointer-events-none border-line text-faint"
            : "border-line bg-surface text-ink-muted hover:border-primary-bright hover:text-primary-bright"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
