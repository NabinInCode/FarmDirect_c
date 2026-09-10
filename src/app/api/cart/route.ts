import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ cart: await getCart(user.id) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in to add items to your cart" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const productId = typeof body?.productId === "string" ? body.productId : "";
    const quantity = Math.round(Number(body?.quantity));

    if (!productId || !Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ message: "Invalid product or quantity" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true },
    });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: user.id, productId, quantity },
    });

    return NextResponse.json({ cart: await getCart(user.id) });
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}