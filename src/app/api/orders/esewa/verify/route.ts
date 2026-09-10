import { NextResponse } from "next/server";
import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  checkEsewaTransaction,
  decodeEsewaCallback,
  getEsewaConfig,
} from "@/lib/esewa";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data") ?? "";

  const fail = (path: string) => NextResponse.redirect(new URL(path, req.url), 302);

  const payload = decodeEsewaCallback(data, getEsewaConfig());
  if (!payload || !payload.transaction_uuid) {
    return fail("/orders?error=esewa_verification_failed");
  }

  const orderId = payload.transaction_uuid;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { select: { productId: true, quantity: true } } },
  });

  if (!order || order.paymentMethod !== "ESEWA") {
    return fail("/orders?error=esewa_verification_failed");
  }

  const user = await getCurrentUser();
  if (!user) return fail(`/login?next=/orders/${orderId}`);
  if (order.userId !== user.id) return fail("/orders");

  // Already finalised (success or cancellation) — e.g. a replayed callback.
  if (order.status !== OrderStatus.PENDING) {
    return fail(`/orders/${orderId}`);
  }

  const totalAmount = payload.total_amount ?? "";
  const amountPaid = Number(totalAmount);
  const expectedAmount = order.total / 100;
  if (Number.isNaN(amountPaid) || Math.abs(amountPaid - expectedAmount) > 0.01) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
    return fail("/orders?error=esewa_amount_mismatch");
  }

  const confirmed = await checkEsewaTransaction({
    transactionUuid: orderId,
    totalAmount,
    config: getEsewaConfig(),
  });
  if (confirmed === false) {
    await prisma.order.updateMany({
      where: { id: orderId, status: OrderStatus.PENDING },
      data: { status: OrderStatus.CANCELLED },
    });
    return fail("/orders?error=esewa_payment_not_completed");
  }

  try {
    const outcome = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const current = await tx.order.findUnique({
        where: { id: orderId },
        select: { status: true },
      });
      if (!current || current.status !== OrderStatus.PENDING) return false;

      const insufficient = await tx.product.count({
        where: {
          id: { in: order.items.map((i) => i.productId) },
          OR: order.items.map((i) => ({ id: i.productId, stock: { lt: i.quantity } })),
        },
      });

      if (insufficient > 0) {
        await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CANCELLED },
        });
        return false;
      }

      for (const item of order.items) {
        await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: order.userId } });

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentRef: payload.transaction_code ?? null,
          paidAt: new Date(),
        },
      });

      return true;
    });

    if (!outcome) {
      return fail(`/orders/${orderId}?error=esewa_cancelled_out_of_stock`);
    }
  } catch {
    return fail("/orders?error=esewa_processing_failed");
  }

  return NextResponse.redirect(new URL(`/orders/${orderId}?paid=1`, req.url), 302);
}