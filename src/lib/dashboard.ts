import { prisma } from "@/lib/prisma";
import type { OrderStatus, Prisma } from "@prisma/client";

export type StaffRole = "FARMER" | "ADMIN";

function productWhere(role: StaffRole, userId: string): Prisma.ProductWhereInput {
  return role === "ADMIN" ? {} : { farmerId: userId };
}

function orderWhere(role: StaffRole, userId: string): Prisma.OrderWhereInput {
  if (role === "ADMIN") return {};
  return {
    items: {
      some: { product: { farmerId: userId } },
    },
  };
}

export interface DashboardStats {
  productCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  orderCount: number;
  pendingCount: number;
  revenueCents: number;
  totalItemsSold: number;
}

export async function getDashboardStats(
  role: StaffRole,
  userId: string
): Promise<DashboardStats> {
  const productCount = await prisma.product.count({
    where: productWhere(role, userId),
  });
  const lowStockCount = await prisma.product.count({
    where: { ...productWhere(role, userId), stock: { gt: 0, lte: 10 } },
  });
  const outOfStockCount = await prisma.product.count({
    where: { ...productWhere(role, userId), stock: 0 },
  });

  const [orderAgg, pendingAgg] = await Promise.all([
    prisma.order.aggregate({
      where: orderWhere(role, userId),
      _count: { _all: true },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: { ...orderWhere(role, userId), status: "PENDING" },
    }),
  ]);

  let totalItemsSold = 0;
  if (orderAgg._count._all > 0) {
    const items = await prisma.orderItem.groupBy({
      where: {
        order: orderWhere(role, userId),
      },
      by: ["quantity"],
      _sum: { quantity: true },
    });
    totalItemsSold = items.reduce((sum, i) => sum + (i._sum.quantity ?? 0), 0);
  }

  return {
    productCount,
    lowStockCount,
    outOfStockCount,
    orderCount: orderAgg._count._all,
    pendingCount: pendingAgg,
    revenueCents: orderAgg._sum.total ?? 0,
    totalItemsSold,
  };
}

export interface DashboardProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  unit: string;
  featured: boolean;
  categoryName: string;
  farmerName: string | null;
}

export async function getDashboardProducts(
  role: StaffRole,
  userId: string
): Promise<DashboardProduct[]> {
  const rows = await prisma.product.findMany({
    where: productWhere(role, userId),
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      farmer: { select: { name: true } },
    },
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock: p.stock,
    unit: p.unit,
    featured: p.featured,
    categoryName: p.category.name,
    farmerName: p.farmer?.name ?? null,
  }));
}

export interface DashboardCategory {
  id: string;
  name: string;
  slug: string;
}

export async function getCategories(): Promise<DashboardCategory[]> {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export interface DashboardOrderItem {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  productSlug: string;
  farmerName: string | null;
}

export interface DashboardOrder {
  id: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  phone: string | null;
  paymentMethod: string;
  customerName: string;
  createdAt: string;
  items: DashboardOrderItem[];
  itemCount: number;
}

export async function getDashboardOrders(
  role: StaffRole,
  userId: string
): Promise<DashboardOrder[]> {
  const rows = await prisma.order.findMany({
    where: orderWhere(role, userId),
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, slug: true, farmer: { select: { name: true } } } },
        },
      },
    },
  });

  return rows.map((o) => ({
    id: o.id,
    status: o.status,
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    total: o.total,
    address: o.address,
    phone: o.phone,
    paymentMethod: o.paymentMethod,
    customerName: o.user.name,
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    items: o.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      price: i.price,
      productName: i.product.name,
      productSlug: i.product.slug,
      farmerName: i.product.farmer?.name ?? null,
    })),
  }));
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
];

export function nextStatus(status: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(status);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}

export interface DashboardContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

export async function getContactMessages(): Promise<DashboardContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    handled: m.handled,
    createdAt: m.createdAt.toISOString(),
  }));
}
