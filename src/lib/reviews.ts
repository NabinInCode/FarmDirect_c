import { prisma } from "@/lib/prisma";

export type ProductRating = { avg: number; count: number };

export async function getRatingsFor(productIds: string[]): Promise<Map<string, ProductRating>> {
  const map = new Map<string, ProductRating>();
  if (productIds.length === 0) return map;

  const grouped = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  for (const g of grouped) {
    map.set(g.productId, { avg: g._avg.rating ?? 0, count: g._count.rating });
  }
  return map;
}

export function formatReviewDate(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}