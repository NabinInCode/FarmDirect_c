import { prisma } from "@/lib/prisma";
import type { OrderStatus, Prisma } from "@prisma/client";

export interface SerializedOrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    slug: string;
    name: string;
    unit: string;
    image: string;
    categoryName: string;
  };
}

export interface SerializedOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  phone: string | null;
  paymentMethod: string;
  createdAt: string;
  items: SerializedOrderItem[];
}

const orderInclude = {
  items: {
    include: {
      product: {
        include: { category: { select: { name: true } } },
      },
    },
  },
} as const;

type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export function serializeOrder(order: OrderWithItems): SerializedOrder {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    address: order.address,
    phone: order.phone,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        slug: item.product.slug,
        name: item.product.name,
        unit: item.product.unit,
        image: item.product.image,
        categoryName: item.product.category.name,
      },
    })),
  };
}

export async function getOrders(userId: string): Promise<SerializedOrder[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });
  return orders.map((order) => serializeOrder(order));
}

export async function getOrderById(orderId: string): Promise<SerializedOrder | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });
  return order ? serializeOrder(order) : null;
}