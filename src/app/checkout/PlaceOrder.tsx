"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { JSX } from "react";

export default function PlaceOrder(): JSX.Element {
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submitToEsewa(url: string, fields: Record<string, string>) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.style.display = "none";
    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }

  async function handlePlaceOrder(event: React.FormEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    const data = new FormData(form);
    const paymentMethod = data.get("paymentMethod") === "esewa" ? "esewa" : "cod";
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.get("phone")?.toString().trim() ?? "",
          address: data.get("address")?.toString().trim() ?? "",
          paymentMethod,
        }),
      });
      const response = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/login?next=/checkout");
        return;
      }
      if (!res.ok) {
        setError(response?.message || "Could not place your order. Please try again.");
        return;
      }

      const esewa: { url?: string; fields?: Record<string, string> } | undefined = response?.esewa;
      if (esewa?.url && esewa.fields) {
        submitToEsewa(esewa.url, esewa.fields);
        return;
      }

      const orderId: string | undefined = response?.order?.id;
      if (orderId) {
        router.push(`/orders/${orderId}`);
      } else {
        router.push("/orders");
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="submit"
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full rounded-xl bg-[#1B4332] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2C6B4A] disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {placing ? "Redirecting to payment..." : "Place order"}
      </button>
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}