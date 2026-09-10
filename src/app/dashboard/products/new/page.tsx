import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { getCategories } from "@/lib/dashboard";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) notFound();

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/products" className="hover:text-[#2D6A4F]">
          Products
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-gray-900">New product</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">New product</h1>
        <p className="mt-1 text-sm text-gray-500">Add a fresh product to the store.</p>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
          No categories exist yet. Create a category before adding products.
        </p>
      ) : (
        <ProductForm categories={categories} submitUrl="/api/admin/products" />
      )}
    </div>
  );
}