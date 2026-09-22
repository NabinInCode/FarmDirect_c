"use client";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { buildUrl, type CatalogSort } from "@/lib/catalog";

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "popular", label: "Best Selling" },
];

export default function SortSelect({
  category,
  q,
  sort,
}: {
  category?: string;
  q?: string;
  sort?: string;
}): JSX.Element {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as CatalogSort;
    const url = buildUrl({ category, q, sort: value });
    router.push(url);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-2">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={sort ?? "newest"}
        onChange={handleChange}
        className="rounded-full border border-line bg-surface py-2 pl-3 pr-8 text-sm font-medium text-ink-muted shadow-sm outline-none transition focus:border-primary-bright"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
