import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getOrders } from "@/lib/orders";
import { formatPaymentMethod, formatPrice } from "@/lib/format";
import ProductVisual from "@/app/components/products/ProductVisual";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/orders");

  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const paid = params.paid === "1";

  const orderErrors: Record<string, string> = {
    esewa_verification_failed: "We couldn't verify your eSewa payment. Please contact support.",
    esewa_amount_mismatch: "The payment amount didn't match the order total, so the order was cancelled.",
    esewa_payment_not_completed: "The eSewa payment was not completed, so the order was cancelled.",
    esewa_cancelled: "You cancelled the eSewa payment, so the order was cancelled.",
    esewa_cancelled_out_of_stock:
      "Payment was received but stock ran out, so the order was cancelled. Please contact support for a refund.",
    esewa_processing_failed: "Something went wrong processing your payment. Please contact support.",
  };

  const orders = await getOrders(user.id);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Order history</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Your orders</h1>
      </div>

      {paid && (
        <div className="mb-6 rounded-xl border border-[#2D6A4F]/40 bg-[#EAF6EE] px-4 py-3 text-sm font-medium text-[#1B4332]">
          Payment received. Thank you for your order!
        </div>
      )}

      {error && orderErrors[error] && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {orderErrors[error]}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-lg font-medium text-gray-700">No orders yet</p>
          <p className="mt-2 text-sm text-gray-500">When you place an order it will show up here.</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-[#1B4332] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2C6B4A]"
          >
            Shop products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusStyles[order.status] ?? statusStyles.PENDING;
            return (
              <div key={order.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="transition hover:opacity-80"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      Order <span className="font-mono text-[#2D6A4F]">#{order.id.slice(0, 8)}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <ul className="divide-y divide-gray-100">
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
                          className="text-sm font-medium text-gray-900 hover:text-[#2D6A4F]"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="grid gap-4 border-t border-gray-100 px-6 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="text-sm text-gray-500">
                    <p>
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                      {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "" : "s"}
                    </p>
                    {order.address && (
                      <p className="mt-1 max-w-md text-xs text-gray-400">Deliver to: {order.address}</p>
                    )}
                    {order.phone && <p className="text-xs text-gray-400">Phone: {order.phone}</p>}
                    <p className="mt-1 text-xs font-medium text-gray-500">
                      {formatPaymentMethod(order.paymentMethod)}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-500">Subtotal: {formatPrice(order.subtotal)}</p>
                    <p className="text-gray-500">
                      Delivery: {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
                    </p>
                    <p className="text-base font-bold text-[#1B4332]">
                      Total: {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}