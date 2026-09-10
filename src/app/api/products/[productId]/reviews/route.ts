import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface ReviewBody {
  rating?: unknown;
  comment?: unknown;
}

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/products/[productId]/reviews">
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in to leave a review" }, { status: 401 });
  }

  const { productId } = await ctx.params;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  if (existing) {
    return NextResponse.json(
      { message: "You have already reviewed this product." },
      { status: 409 }
    );
  }

  const purchased = await prisma.orderItem.findFirst({
    where: { productId, order: { userId: user.id } },
  });
  if (!purchased) {
    return NextResponse.json(
      { message: "Only customers who purchased this product can review it." },
      { status: 403 }
    );
  }

  let body: ReviewBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const rating = Math.round(Number(body.rating));
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { message: "Rating must be between 1 and 5." },
      { status: 400 }
    );
  }
  if (!comment) {
    return NextResponse.json({ message: "Please write a short review." }, { status: 400 });
  }
  if (comment.length > 1000) {
    return NextResponse.json({ message: "Review must be under 1000 characters." }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: { userId: user.id, productId, rating, comment },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(
      {
        review: {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt.toISOString(),
          authorName: review.user.name,
        },
        message: "Review posted",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Could not post your review. Please try again." },
      { status: 500 }
    );
  }
}