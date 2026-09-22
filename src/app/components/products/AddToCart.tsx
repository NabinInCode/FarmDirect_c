"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

type Status = "idle" | "adding" | "added" | "error";

export default function AddToCart({
  productId,
  productName,
  productSlug,
  inStock,
}: {
  productId: string;
  productName: string;
  productSlug: string;
  inStock: boolean;
}): JSX.Element {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<Status>("idle");

  async function add(goToCart: boolean) {
    if (!inStock) return;
    setStatus("adding");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (res.status === 401) {
        router.push(`/login?next=/products/${productSlug}`);
        return;
      }
      if (!res.ok) throw new Error("Failed to add");
      setStatus("added");
      if (goToCart) {
        window.setTimeout(() => router.push("/cart"), 400);
      } else {
        router.refresh();
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted">Quantity</span>
        <div className="flex items-center rounded-xl border border-line bg-surface">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-lg font-semibold text-muted-2 transition hover:text-primary disabled:opacity-40"
            disabled={qty <= 1 || status === "adding"}
          >
            &minus;
          </button>
          <span className="w-10 text-center text-sm font-semibold text-ink">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="px-4 py-2 text-lg font-semibold text-muted-2 transition hover:text-primary disabled:opacity-40"
            disabled={status === "adding"}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => add(false)}
          disabled={!inStock || status === "adding"}
          className="w-full rounded-xl bg-primary-solid px-6 py-3.5 text-base font-semibold text-white transition hover:bg-primary-solid-light disabled:cursor-not-allowed disabled:bg-surface-muted"
        >
          {status === "adding" ? "Adding..." : inStock ? "Add to cart" : "Out of stock"}
        </button>
        <button
          type="button"
          onClick={() => add(true)}
          disabled={!inStock || status === "adding"}
          className="w-full rounded-xl border-2 border-primary px-6 py-3.5 text-base font-semibold text-primary transition hover:bg-primary-softer disabled:cursor-not-allowed disabled:border-line-strong disabled:text-faint"
        >
          Buy now
        </button>
      </div>

      {status === "added" && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-primary-softer px-4 py-2" role="status">
          <p className="text-sm font-medium text-primary">{productName} added to cart</p>
          <Link href="/cart" className="text-sm font-semibold text-primary-bright underline hover:text-primary">
            View cart
          </Link>
        </div>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600" role="alert">
          Couldn&apos;t add to cart. Please try again.
        </p>
      )}
    </div>
  );
}