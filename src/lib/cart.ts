import { prisma } from "@/lib/prisma";

export interface CartLine {
  id: string;
  quantity: number;
  lineTotal: number;
  product: {
    id: string;
    slug: string;
    name: string;
    unit: string;
    price: number;
    stock: number;
    image: string;
    categoryName: string;
  };
}

export interface Cart {
  items: CartLine[];
  count: number;
  subtotal: number;
}

export async function getCart(userId: string): Promise<Cart> {
  const rows = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      product: { include: { category: { select: { name: true } } } },
    },
  });

  const items: CartLine[] = rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    lineTotal: row.product.price * row.quantity,
    product: {
      id: row.product.id,
      slug: row.product.slug,
      name: row.product.name,
      unit: row.product.unit,
      price: row.product.price,
      stock: row.product.stock,
      image: row.product.image,
      categoryName: row.product.category.name,
    },
  }));

  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}