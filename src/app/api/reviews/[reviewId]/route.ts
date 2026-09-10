import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";

export async function PATCH(req: Request, ctx: RouteContext<"/api/reviews/[reviewId]">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in" }, { status: 401 });
  }

  const { reviewId } = await ctx.params;

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { user: { select: { name: true } } },
  });
  if (!review) {
    return NextResponse.json({ message: "Review not found" }, { status: 404 });
  }

  if (review.userId !== user.id && !isStaff(user)) {
    return NextResponse.json({ message: "You can only edit your own review." }, { status: 403 });
  }

  let body: { rating?: unknown; comment?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const rating = body.rating !== undefined ? Math.round(Number(body.rating)) : review.rating;
  const comment = body.comment !== undefined ? String(body.comment).trim() : review.comment;

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
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(
      {
        review: {
          id: updated.id,
          rating: updated.rating,
          comment: updated.comment,
          createdAt: updated.createdAt.toISOString(),
          authorName: updated.user.name,
        },
        message: "Review updated",
      }
    );
  } catch {
    return NextResponse.json(
      { message: "Could not update your review. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/reviews/[reviewId]">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in" }, { status: 401 });
  }

  const { reviewId } = await ctx.params;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    return NextResponse.json({ message: "Review not found" }, { status: 404 });
  }

  if (review.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ message: "You can only delete your own review." }, { status: 403 });
  }

  await prisma.review.delete({ where: { id: reviewId } });
  return NextResponse.json({ message: "Review deleted" });
}