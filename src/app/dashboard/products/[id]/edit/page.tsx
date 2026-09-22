import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { getCategories } from "@/lib/dashboard";
import ProductForm, { type ProductFormValues } from "../../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      unit: true,
      stock: true,
      image: true,
      featured: true,
      categoryId: true,
      farmerId: true,
    },
  });
  if (!product) notFound();
  if (user.role === "FARMER" && product.farmerId !== user.id) notFound();

  const categories = await getCategories();
  const initial: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price / 100,
    unit: product.unit,
    stock: product.stock,
    image: product.image,
    featured: product.featured,
    categoryId: product.categoryId,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/dashboard/products" className="hover:text-primary-bright">
          Products
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{product.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-ink">Edit product</h1>
        <p className="mt-1 text-sm text-muted-2">Update the details for {product.name}.</p>
      </div>

      <ProductForm
        categories={categories}
        initial={initial}
        submitUrl={`/api/admin/products/${product.id}`}
        method="PATCH"
      />
    </div>
  );
}