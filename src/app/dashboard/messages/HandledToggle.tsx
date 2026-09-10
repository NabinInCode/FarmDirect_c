"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

export default function HandledToggle({
  messageId,
  handled,
}: {
  messageId: string;
  handled: boolean;
}): JSX.Element {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, { method: "PATCH" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "Could not update message.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-60 ${
          handled
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
        }`}
      >
        {busy ? "Updating…" : handled ? "Handled" : "Mark handled"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}