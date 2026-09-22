"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { StarIcon } from "./RatingStars";

export interface ExistingReview {
  id: string;
  rating: number;
  comment: string;
}

export default function ReviewForm({
  productId,
  canReview,
  existing,
}: {
  productId: string;
  canReview: boolean;
  existing: ExistingReview | null;
}): JSX.Element {
  const router = useRouter();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(existing);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        editing ? `/api/reviews/${existing!.id}` : `/api/products/${productId}/reviews`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Could not post your review.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!existing) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews/${existing.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Could not delete your review.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <h3 className="text-base font-semibold text-ink">
        {editing ? "Edit your review" : "Write a review"}
      </h3>

      <div className="flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <StarIcon
                className={`h-6 w-6 ${n <= (hover || rating) ? "text-amber-400" : "text-faint"}`}
                filled={n <= (hover || rating)}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-2">
          {rating > 0 ? `${rating} out of 5` : "Rate this product"}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="Tell others what you thought of it. Freshness, taste, packaging…"
        className="w-full rounded-xl border border-line px-3 py-2 text-sm focus:border-primary-bright focus:outline-none focus:ring-1 focus:ring-primary-bright"
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-primary-solid px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-solid-light disabled:opacity-40"
        >
          {busy ? "Saving…" : editing ? "Update review" : "Post review"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
          >
            Delete
          </button>
        )}
        {canReview && !editing && (
          <p className="text-xs text-faint">Verified purchase</p>
        )}
      </div>

      {!canReview && (
        <p className="text-xs text-faint">
          Reviews are only accepted from customers who bought this product.
        </p>
      )}
    </form>
  );
}