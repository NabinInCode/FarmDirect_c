"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

export default function CancelOrderButton({ orderId }: { orderId: string }): JSX.Element {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!window.confirm("Cancel this order? Quantities will be returned to stock.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Could not cancel the order. Please try again.");
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
    <div className="text-right">
      {error && <p className="mb-2 text-sm font-medium text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleCancel}
        disabled={busy}
        className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-40"
      >
        {busy ? "Cancelling..." : "Cancel order"}
      </button>
    </div>
  );
}