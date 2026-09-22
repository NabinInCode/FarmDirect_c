"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import type { OrderStatus } from "@prisma/client";

const actionLabel: Record<string, string> = {
  CONFIRMED: "Confirm order",
  SHIPPED: "Mark shipped",
  DELIVERED: "Mark delivered",
};

export default function OrderStatusControls({
  orderId,
  status: initialStatus,
  next,
  canAdvance,
  canCancel,
}: {
  orderId: string;
  status: OrderStatus;
  next: OrderStatus | null;
  canAdvance: boolean;
  canCancel: boolean;
}): JSX.Element {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status: OrderStatus = initialStatus;

  const terminal = status === "DELIVERED" || status === "CANCELLED";

  async function updateStatus(newStatus: OrderStatus) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Could not update the order.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (terminal) {
    return (
      <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm font-medium text-muted-2">
        {status === "CANCELLED" ? "This order was cancelled." : "This order was delivered."}
      </p>
    );
  }

  if (!canAdvance && !canCancel) {
    return (
      <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm font-medium text-muted-2">
        Status is updated by the store admin.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-2 lg:w-44">
      {canAdvance && next && (
        <button
          type="button"
          onClick={() => updateStatus(next)}
          disabled={busy}
          className="rounded-xl bg-primary-solid px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-solid-light disabled:opacity-40"
        >
          {actionLabel[next] ?? `Move to ${next}`}
        </button>
      )}
      {canCancel && initialStatus !== "CANCELLED" && !terminal && (
        <button
          type="button"
          onClick={() => updateStatus("CANCELLED")}
          disabled={busy}
          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
        >
          Cancel order
        </button>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}