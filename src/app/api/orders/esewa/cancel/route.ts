import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("oid") ?? "";

  const user = await getCurrentUser();
  if (orderId && user) {
    await prisma.order.updateMany({
      where: {
        id: orderId,
        userId: user.id,
        paymentMethod: "ESEWA",
        status: OrderStatus.PENDING,
      },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  return NextResponse.redirect(new URL("/orders?error=esewa_cancelled", req.url), 302);
}