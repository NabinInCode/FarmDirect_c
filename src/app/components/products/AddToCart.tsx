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
        <span className="text-sm font-medium text-gray-600">Quantity</span>
        <div className="flex items-center rounded-xl border border-gray-200 bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-lg font-semibold text-gray-500 transition hover:text-[#1B4332] disabled:opacity-40"
            disabled={qty <= 1 || status === "adding"}
          >
            &minus;
          </button>
          <span className="w-10 text-center text-sm font-semibold text-gray-900">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="px-4 py-2 text-lg font-semibold text-gray-500 transition hover:text-[#1B4332] disabled:opacity-40"
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
          className="w-full rounded-xl bg-[#1B4332] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#2C6B4A] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {status === "adding" ? "Adding..." : inStock ? "Add to cart" : "Out of stock"}
        </button>
        <button
          type="button"
          onClick={() => add(true)}
          disabled={!inStock || status === "adding"}
          className="w-full rounded-xl border-2 border-[#1B4332] px-6 py-3.5 text-base font-semibold text-[#1B4332] transition hover:bg-[#EAF6EE] disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
        >
          Buy now
        </button>
      </div>

      {status === "added" && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-[#EAF6EE] px-4 py-2" role="status">
          <p className="text-sm font-medium text-[#1B4332]">{productName} added to cart</p>
          <Link href="/cart" className="text-sm font-semibold text-[#2D6A4F] underline hover:text-[#1B4332]">
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