import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductRating } from "@/lib/reviews";
import ProductVisual from "@/app/components/products/ProductVisual";
import RatingStars from "@/app/components/RatingStars";

interface ProductsGridItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  categoryName: string;
  rating: ProductRating | null;
}

export default function ProductsGrid({
  products,
  emptyMessage = "No products found.",
  clearFiltersHref,
}: {
  products: ProductsGridItem[];
  emptyMessage?: string;
  clearFiltersHref?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line-strong py-16 text-center">
        <p className="text-muted-2">{emptyMessage}</p>
        {clearFiltersHref && (
          <Link
            href={clearFiltersHref}
            className="rounded-full bg-primary-solid px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-solid"
          >
            Clear filters
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <ProductVisual
            name={product.name}
            category={product.categoryName}
            image={product.image}
          />
          <div className="p-4">
            <h2 className="truncate text-sm font-semibold text-ink group-hover:text-primary-bright">
              {product.name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-2">{product.unit}</p>
            {product.rating && (
              <RatingStars value={product.rating.avg} size="sm" />
            )}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-base font-bold text-primary">{formatPrice(product.price)}</p>
              <span
                className={`text-xs font-medium ${product.stock > 0 ? "text-primary-bright" : "text-red-500"}`}
              >
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
