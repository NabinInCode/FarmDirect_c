import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { getDashboardStats, getDashboardOrders } from "@/lib/dashboard";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return null;

  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(user.role, user.id),
    getDashboardOrders(user.role, user.id),
  ]);

  const cards = [
    { label: "Products", value: String(stats.productCount), href: "/dashboard/products" },
    {
      label: "Orders",
      value: String(stats.orderCount),
      href: "/dashboard/orders",
      note: `${stats.pendingCount} pending`,
    },
    { label: "Revenue", value: formatPrice(stats.revenueCents), href: "/dashboard/orders" },
    {
      label: "Low stock",
      value: String(stats.lowStockCount),
      href: "/dashboard/products",
      note: `${stats.outOfStockCount} out of stock`,
      warn: stats.lowStockCount > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {user.role === "ADMIN" ? "Store overview" : "Your farm at a glance"}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
            {card.note && (
              <p className={`mt-1 text-xs font-medium ${card.warn ? "text-red-600" : "text-gray-500"}`}>
                {card.note}
              </p>
            )}
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent orders</h2>
          <Link href="/dashboard/orders" className="text-sm font-medium text-[#2D6A4F] hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <ul className="divide-y divide-gray-100">
              {recentOrders.slice(0, 8).map((order) => {
                const status = statusStyles[order.status]
                  ? statusStyles[order.status]
                  : statusStyles.PENDING;
                return (
                  <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Order <span className="font-mono text-[#2D6A4F]">#{order.id.slice(0, 8)}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customerName} · {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="text-sm font-bold text-[#1B4332]">{formatPrice(order.total)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
