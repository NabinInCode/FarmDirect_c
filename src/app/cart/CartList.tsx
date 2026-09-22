"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { formatPrice } from "@/lib/format";
import ProductVisual from "@/app/components/products/ProductVisual";
import type { CartLine } from "@/lib/cart";

export default function CartList({
  items,
}: {
  items: CartLine[];
}): JSX.Element {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeQuantity(item: CartLine, quantity: number) {
    if (busyId) return;
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/cart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(item: CartLine) {
    if (busyId) return;
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/cart/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:gap-6"
        >
          <Link href={`/products/${item.product.slug}`} className="w-24 shrink-0 sm:w-28">
            <div className="overflow-hidden rounded-xl">
              <ProductVisual
                name={item.product.name}
                category={item.product.categoryName}
                image={item.product.image}
              />
            </div>
          </Link>

          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-semibold text-ink hover:text-primary-bright"
                >
                  {item.product.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted-2">
                  {formatPrice(item.product.price)} / {item.product.unit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item)}
                disabled={busyId === item.id}
                aria-label={`Remove ${item.product.name} from cart`}
                className="rounded-lg p-1.5 text-faint transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="flex items-center rounded-lg border border-line">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => changeQuantity(item, item.quantity - 1)}
                  disabled={busyId === item.id || item.quantity <= 1}
                  className="px-3 py-1.5 text-sm font-semibold text-muted-2 transition hover:text-primary disabled:opacity-40"
                >
                  &minus;
                </button>
                <span className="w-8 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => changeQuantity(item, item.quantity + 1)}
                  disabled={busyId === item.id || item.quantity >= item.product.stock}
                  className="px-3 py-1.5 text-sm font-semibold text-muted-2 transition hover:text-primary disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <p className="text-base font-bold text-primary">{formatPrice(item.lineTotal)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}