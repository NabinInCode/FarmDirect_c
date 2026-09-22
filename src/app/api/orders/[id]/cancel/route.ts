import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CANCELLABLE: OrderStatus[] = ["PENDING", "CONFIRMED"];

export async function POST(req: Request, ctx: RouteContext<"/api/orders/[id]/cancel">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in to cancel an order" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      status: true,
      items: { select: { quantity: true, productId: true } },
    },
  });
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }
  if (order.userId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  if (!CANCELLABLE.includes(order.status)) {
    return NextResponse.json(
      { message: "This order can no longer be cancelled." },
      { status: 409 }
    );
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
    return NextResponse.json(
      { message: "Could not cancel the order. Please try again." },
      { status: 500 }
    );
  }
}