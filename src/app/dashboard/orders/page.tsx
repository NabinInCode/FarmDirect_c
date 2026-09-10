import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { getDashboardOrders, nextStatus, type DashboardOrder } from "@/lib/dashboard";
import { formatPaymentMethod, formatPrice } from "@/lib/format";
import OrderStatusControls from "./OrderStatusControls";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default async function DashboardOrdersPage() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return null;

  const orders = await getDashboardOrders(user.role, user.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          {orders.length} order{orders.length === 1 ? "" : "s"}
          {user.role === "FARMER" ? " for your products" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              canAdvance={user.role === "ADMIN"}
              canCancel={user.role === "ADMIN"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  canAdvance,
  canCancel,
}: {
  order: DashboardOrder;
  canAdvance: boolean;
  canCancel: boolean;
}) {
  const status = statusStyles[order.status] ?? statusStyles.PENDING;
  const next = nextStatus(order.status);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Order <span className="font-mono text-[#2D6A4F]">#{order.id.slice(0, 8)}</span>
          </p>
          <p className="text-xs text-gray-500">
            {order.customerName} ·{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
          <span className="text-base font-bold text-[#1B4332]">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1fr_auto]">
        <div>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray-900">
                  {item.productName}
                  {item.farmerName && (
                    <span className="text-gray-400"> · {item.farmerName}</span>
                  )}
                  <span className="text-gray-400"> × {item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-1 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium text-gray-900">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery</dt>
              <dd className="font-medium text-gray-900">
                {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Payment</dt>
              <dd className="font-medium text-gray-900">{formatPaymentMethod(order.paymentMethod)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Deliver to</dt>
              <dd className="max-w-xs text-right text-gray-900">{order.address}</dd>
            </div>
            {order.phone && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium text-gray-900">{order.phone}</dd>
              </div>
            )}
          </dl>
        </div>

        <OrderStatusControls
          orderId={order.id}
          status={order.status}
          next={next}
          canAdvance={canAdvance}
          canCancel={canCancel}
        />
      </div>
    </div>
  );
}