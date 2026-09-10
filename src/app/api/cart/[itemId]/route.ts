import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";

export async function PATCH(_req: Request, ctx: RouteContext<"/api/cart/[itemId]">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { itemId } = await ctx.params;

  try {
    const body = await _req.json();
    const quantity = Math.round(Number(body?.quantity));

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: { select: { stock: true } } },
    });
    if (!item || item.userId !== user.id) {
      return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: Math.min(quantity, item.product.stock || quantity) },
      });
    }

    return NextResponse.json({ cart: await getCart(user.id) });
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/cart/[itemId]">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { itemId } = await ctx.params;

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ cart: await getCart(user.id) });
}