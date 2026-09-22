"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

export default function FeaturedToggle({
  productId,
  featured,
}: {
  productId: string;
  featured: boolean;
}): JSX.Element {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      // keep current state
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={featured}
      aria-label={featured ? "Unmark featured" : "Mark featured"}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-40 ${
        featured ? "bg-amber-500 text-white" : "bg-surface-muted text-muted-2 hover:bg-surface-muted"
      }`}
    >
      {featured ? "Featured" : "Off"}
    </button>
  );
}
