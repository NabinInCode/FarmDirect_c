import { NextResponse } from "next/server";
import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeOrder } from "@/lib/orders";
import { buildEsewaPayment, getEsewaConfig } from "@/lib/esewa";

const FREE_DELIVERY_THRESHOLD = 49900;
const DELIVERY_FEE = 4000;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in to place an order" }, { status: 401 });
  }

  let body: { phone?: unknown; address?: unknown; paymentMethod?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const paymentMethod = body.paymentMethod === "esewa" ? "esewa" : "cod";

  if (!phone || !address) {
    return NextResponse.json(
      { message: "Please provide a delivery address and phone number." },
      { status: 400 }
    );
  }
  if (phone.length < 7 || phone.length > 15) {
    return NextResponse.json(
      { message: "Please enter a valid phone number." },
      { status: 400 }
    );
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: { select: { id: true, name: true, price: true, stock: true } } },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ message: "Your cart is empty" }, { status: 400 });
  }

  const unavailable = cartItems.find((item) => item.quantity > item.product.stock);
  if (unavailable) {
    return NextResponse.json(
      {
        message: `Only ${unavailable.product.stock} of "${unavailable.product.name}" left in stock. Please reduce the quantity.`,
      },
      { status: 409 }
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  if (paymentMethod === "esewa") {
    await prisma.order.updateMany({
      where: { userId: user.id, paymentMethod: "ESEWA", status: OrderStatus.PENDING },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: user.id,
          status: OrderStatus.PENDING,
          subtotal,
          deliveryFee,
          total,
          address,
          phone,
          paymentMethod: paymentMethod === "esewa" ? "ESEWA" : "COD",
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: { include: { product: { include: { category: { select: { name: true } } } } } },
        },
      });

      if (paymentMethod === "cod") {
        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.product.id },
            data: { stock: { decrement: item.quantity } },
          });
        }
        await tx.cartItem.deleteMany({ where: { userId: user.id } });
      }

      await tx.user.update({
        where: { id: user.id },
        data: { phone, address },
      });

      return created;
    });

    if (paymentMethod === "esewa") {
      const origin = req.headers.get("origin") ?? new URL(req.url).origin;
      const esewa = buildEsewaPayment({
        totalCents: order.total,
        transactionUuid: order.id,
        successUrl: `${origin}/api/orders/esewa/verify`,
        failureUrl: `${origin}/api/orders/esewa/cancel?oid=${order.id}`,
        config: getEsewaConfig(),
      });
      return NextResponse.json(
        { order: serializeOrder(order), message: "Redirecting to eSewa", esewa },
        { status: 201 }
      );
    }

    return NextResponse.json({ order: serializeOrder(order), message: "Order placed" }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: "Could not place the order. Please try again." }, { status: 409 });
    }
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}