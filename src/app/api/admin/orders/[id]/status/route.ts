import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { nextStatus } from "@/lib/dashboard";

const ALLOWED: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

interface OrderWithItems {
  id: string;
  status: OrderStatus;
  items: { quantity: number; productId: string }[];
}

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/orders/[id]/status">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  if (!isStaff(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  let body: { status?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const target = body.status as OrderStatus;
  if (!ALLOWED.includes(target)) {
    return NextResponse.json({ message: "Invalid order status" }, { status: 400 });
  }

  const order: OrderWithItems | null = await prisma.order.findUnique({
    where: { id },
    select: { id: true, status: true, items: { select: { quantity: true, productId: true } } },
  });
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  if (target === order.status) {
    return NextResponse.json({ message: "Order is already in this status" }, { status: 409 });
  }

  const isFarmer = user.role === "FARMER";
  const isAdmin = user.role === "ADMIN";

  if (isFarmer) {
    const owned = await prisma.orderItem.findMany({
      where: { orderId: id, product: { farmerId: user.id } },
      select: { productId: true },
    });
    const ownedIds = new Set(owned.map((o) => o.productId));

    if (ownedIds.size === 0) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (target !== "CANCELLED") {
      return NextResponse.json(
        { message: "Farmers can only cancel orders for their products." },
        { status: 403 }
      );
    }

    if (order.status === "DELIVERED") {
      return NextResponse.json({ message: "Delivered orders cannot be cancelled" }, { status: 409 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        const items = await tx.orderItem.findMany({
          where: { orderId: id, product: { farmerId: user.id } },
          select: { quantity: true, productId: true },
        });
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({ where: { id }, data: { status: "CANCELLED" } });
      });
      return NextResponse.json({ message: "Order cancelled" });
    } catch {
      return NextResponse.json({ message: "Could not cancel the order. Please try again." }, { status: 500 });
    }
  }

  if (isAdmin) {
    if (target === "CANCELLED") {
      if (order.status === "DELIVERED") {
        return NextResponse.json({ message: "Delivered orders cannot be cancelled" }, { status: 409 });
      }
      try {
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
          await tx.order.update({ where: { id }, data: { status: "CANCELLED" } });
        });
        return NextResponse.json({ message: "Order cancelled" });
      } catch {
        return NextResponse.json({ message: "Could not cancel the order. Please try again." }, { status: 500 });
      }
    }

    if (nextStatus(order.status) !== target) {
      return NextResponse.json(
        { message: `Orders cannot move from ${order.status} to ${target}` },
        { status: 409 }
      );
    }

    try {
      await prisma.order.update({ where: { id }, data: { status: target } });
      return NextResponse.json({ message: `Order is now ${target.toLowerCase()}` });
    } catch {
      return NextResponse.json({ message: "Could not update the order. Please try again." }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}