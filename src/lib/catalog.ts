import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { getRatingsFor, type ProductRating } from "@/lib/reviews";

export type CatalogSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "popular";

export const PAGE_SIZE = 12;

export interface CatalogParams {
  category?: string;
  q?: string;
  sort?: CatalogSort;
  page?: number;
}

function productWhere(p: CatalogParams): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  if (p.category) {
    where.category = { slug: p.category };
  }
  if (p.q && p.q.trim()) {
    where.OR = [
      { name: { contains: p.q.trim() } },
      { description: { contains: p.q.trim() } },
      { category: { name: { contains: p.q.trim() } } },
    ];
  }
  return where;
}

export function buildUrl(p: CatalogParams): string {
  const sp = new URLSearchParams();
  if (p.category) sp.set("category", p.category);
  if (p.q && p.q.trim()) sp.set("q", p.q.trim());
  if (p.sort && p.sort !== "newest") sp.set("sort", p.sort);
  if (p.page && p.page > 1) sp.set("page", String(p.page));
  const qs = sp.toString();
  return qs ? `/products?${qs}` : "/products";
}

export interface CatalogResult {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
    stock: number;
    image: string;
    categoryName: string;
    rating: ProductRating | null;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export async function getCatalog(p: CatalogParams): Promise<CatalogResult> {
  const query = (p.q ?? "").trim();
  const page = Math.max(1, p.page ?? 1);
  const category = p.category;

  const where = productWhere({ category, q: query });

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] =
    { createdAt: "desc" };

  if (p.sort === "price_asc") orderBy = { price: "asc" };
  else if (p.sort === "price_desc") orderBy = { price: "desc" };
  else if (p.sort === "name_asc") orderBy = { name: "asc" };
  else if (p.sort === "name_desc") orderBy = { name: "desc" };
  else if (p.sort !== "newest") orderBy = { createdAt: "desc" };

  let products: Awaited<ReturnType<typeof queryProducts>> = [];
  let handledPopular = false;

  if (p.sort === "popular") {
    const groups = await prisma.orderItem.groupBy({
      where: {
        product: category ? { category: { slug: category } } : {},
      },
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
    });
    const allIds = groups.map((g) => g.productId);
    if (allIds.length > 0) {
      const fetched = await prisma.product.findMany({
        where: { ...where, id: { in: allIds } },
        include: { category: true },
      });
      const byId = new Map(fetched.map((p) => [p.id, p]));
      const pageIds = allIds
        .filter((id) => byId.has(id))
        .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
      products = pageIds.map((id) => byId.get(id)!);
      handledPopular = true;
    } else {
      products = [];
      handledPopular = true;
    }
  }

  if (products.length === 0 && !handledPopular) {
    products = await queryProducts(where, orderBy, safePage);
  }

  const ratings = await getRatingsFor(products.map((p) => p.id));

  return {
    products: products.map((p) => {
      const r = ratings.get(p.id);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        unit: p.unit,
        stock: p.stock,
        image: p.image,
        categoryName: p.category.name,
        rating: r && r.count > 0 ? r : null,
      };
    }),
    total,
    page: safePage,
    totalPages,
  };
}

async function queryProducts(
  where: Prisma.ProductWhereInput,
  orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[],
  page: number
) {
  return prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
}

export { productWhere };
