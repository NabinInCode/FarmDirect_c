"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";
import { buildUrl } from "@/lib/catalog";

export default function SearchBar({
  category,
  sort,
}: {
  category?: string;
  sort?: string;
}): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function pushQuery(next: string) {
    const url = buildUrl({
      category,
      sort: (sort as never) || undefined,
      q: next || "",
    });
    router.push(url);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushQuery(next.trim()), 300);
  }

  function handleClear() {
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    pushQuery("");
  }

  return (
    <div
      className={`relative w-full sm:max-w-xs ${
        focused ? "ring-2 ring-[#2D6A4F]/40" : ""
      }`}
    >
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#2D6A4F]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
