import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCatalog, type CatalogSort } from "@/lib/catalog";
import SearchBar from "./SearchBar";
import SortSelect from "./SortSelect";
import ProductsGrid from "./ProductsGrid";
import Pagination from "./Pagination";

export const dynamic = "force-dynamic";

const SORTS: CatalogSort[] = [
  "newest",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
  "popular",
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;

  const activeCategory = raw(params.category);
  const query = raw(params.q) ?? "";
  const sortRaw = raw(params.sort) ?? "newest";
  const sort: CatalogSort = SORTS.includes(sortRaw as CatalogSort)
    ? (sortRaw as CatalogSort)
    : "newest";

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const result = await getCatalog({
    category: activeCategory,
    q: query,
    sort,
    page: raw(params.page) ? Number(raw(params.page)) : undefined,
  });

  const activeCategoryName = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name
    : undefined;
  const hasActiveFilters = Boolean(activeCategory || query);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Farm fresh</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-500">
          {result.total} item{result.total === 1 ? "" : "s"}
          {activeCategoryName ? ` in ${activeCategoryName}` : ""}
          {query ? ` matching “${query}”` : ""} — straight from the farm.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={query ? `/products?q=${encodeURIComponent(query)}` : "/products"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory
                ? "border border-gray-200 bg-white text-gray-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                : "bg-[#1B4332] text-white"
            }`}
          >
            All
          </Link>
          {categories.map((category) => {
            const active = category.slug === activeCategory;
            const base = new URLSearchParams();
            if (query) base.set("q", query);
            if (sort !== "newest") base.set("sort", sort);
            base.set("category", category.slug);
            return (
              <Link
                key={category.id}
                href={`/products?${base.toString()}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#1B4332] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <SearchBar category={activeCategory} sort={sort} />
          <SortSelect category={activeCategory} q={query} sort={sort} />
        </div>
      </div>

      <ProductsGrid
        products={result.products}
        emptyMessage={
          hasActiveFilters
            ? "No products match your search or filters."
            : "No products in this category yet."
        }
        clearFiltersHref={hasActiveFilters ? "/products" : undefined}
      />

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        category={activeCategory}
        q={query}
        sort={sort}
      />
    </main>
  );
}
