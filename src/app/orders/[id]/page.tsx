import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { OrderStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/lib/orders";
import { formatPaymentMethod, formatPrice } from "@/lib/format";
import ProductVisual from "@/app/components/products/ProductVisual";
import CancelOrderButton from "@/app/orders/CancelOrderButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id.slice(0, 8)}` };
}

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { id } = await params;
  const { paid } = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/orders/${id}`);

  const order = await getOrderById(id);
  if (!order || order.userId !== user.id) redirect("/orders");

  const status = statusStyles[order.status] ?? statusStyles.PENDING;
  const isFresh = order.status === "PENDING";

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      {paid === "1" && order.paymentMethod.toUpperCase() === "ESEWA" && (
        <div className="mb-6 rounded-xl border border-primary-bright/40 bg-primary-softer px-4 py-3 text-sm font-medium text-primary">
          Payment received via eSewa. Thank you!
        </div>
      )}
      <section className="rounded-[2rem] bg-gradient-to-br from-primary-softer via-cream to-primary-soft px-6 py-12 text-center shadow-sm sm:px-12">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-solid text-white">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <h1 className="mt-5 text-3xl font-bold text-ink sm:text-4xl">
          {isFresh ? "Order placed!" : "Order details"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          {isFresh
            ? `Thank you, ${user.name}. Your order is confirmed and our farmers are getting it ready.`
            : `Here's a summary of your order #${order.id.slice(0, 8)}.`}
        </p>
        <p className="mt-4 text-sm font-medium text-muted-2">
          Order{" "}
          <span className="font-mono text-primary-bright">#{order.id.slice(0, 8)}</span> ·{" "}
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · <span className={`rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
        </p>
      </section>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="border-b border-line bg-surface-muted/60 px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Items</h2>
        </div>
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 px-6 py-4">
              <Link href={`/products/${item.product.slug}`} className="w-14 shrink-0 overflow-hidden rounded-lg">
                <ProductVisual
                  name={item.product.name}
                  category={item.product.categoryName}
                  image={item.product.image}
                />
              </Link>
              <div className="flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-sm font-medium text-ink hover:text-primary-bright"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-muted-2">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 border-t border-line px-6 py-5 lg:grid-cols-[1fr_auto]">
          <div className="text-sm text-muted">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-faint">Deliver to</p>
              <p className="mt-1">{order.address}</p>
            </div>
            {order.phone && (
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-faint">Phone</p>
                <p className="mt-1">{order.phone}</p>
              </div>
            )}
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-faint">Payment</p>
              <p className="mt-1">{formatPaymentMethod(order.paymentMethod)}</p>
            </div>
          </div>

          <dl className="space-y-2 text-sm lg:text-right">
            <div className="flex justify-between gap-8">
              <dt className="text-muted-2">Subtotal</dt>
              <dd className="font-medium text-ink">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-8">
              <dt className="text-muted-2">Delivery</dt>
              <dd className={`font-medium ${order.deliveryFee === 0 ? "text-primary-bright" : "text-ink"}`}>
                {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
              </dd>
            </div>
            <div className="flex justify-between gap-8 border-t border-line pt-2">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="text-lg font-bold text-primary">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/orders"
          className="rounded-xl bg-primary-solid px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-solid-light"
        >
          View all orders
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary-softer"
        >
          Continue shopping
        </Link>
        {(order.status === "PENDING" || order.status === "CONFIRMED") && (
          <CancelOrderButton orderId={order.id} />
        )}
      </div>
    </main>
  );
}