import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { getDashboardProducts } from "@/lib/dashboard";
import { formatPrice } from "@/lib/format";
import FeaturedToggle from "./FeaturedToggle";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function DashboardProductsPage() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return null;

  const products = await getDashboardProducts(user.role, user.id);
  const canCreate = user.role === "ADMIN" || user.role === "FARMER";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        {canCreate && (
          <Link
            href="/dashboard/products/new"
            className="rounded-xl bg-[#1B4332] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2C6B4A]"
          >
            + New product
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          No products yet.
          {canCreate && (
            <Link href="/dashboard/products/new" className="mt-2 block font-medium text-[#2D6A4F] underline">
              Add your first product
            </Link>
          )}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/60 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Featured</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.unit}
                      {product.farmerName ? ` · ${product.farmerName}` : ""}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{product.categoryName}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : product.stock <= 10
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {product.stock === 0 ? "Out" : product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <FeaturedToggle productId={product.id} featured={product.featured} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#2D6A4F] transition hover:bg-[#EAF6EE]"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
