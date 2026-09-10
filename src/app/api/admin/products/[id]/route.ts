import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function findAuthorizedProduct(id: string, userId: string, role: "FARMER" | "ADMIN") {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  if (role === "ADMIN") return product;
  if (product.farmerId === userId) return product;
  return null;
}

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/products/[id]">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  if (!isStaff(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const product = await findAuthorizedProduct(id, user.id, user.role);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const data: Prisma.ProductUpdateInput = {};

  if (typeof body.featured === "boolean") {
    data.featured = body.featured;
  }

  if (typeof body.name === "string" && body.name.trim()) {
    data.name = body.name.trim();
  }
  if (typeof body.description === "string") {
    data.description = body.description.trim();
  }
  if (typeof body.unit === "string" && body.unit.trim()) {
    data.unit = body.unit.trim();
  }
  if (typeof body.image === "string") {
    data.image = body.image.trim();
  }
  if (typeof body.categoryId === "string" && body.categoryId) {
    data.category = { connect: { id: body.categoryId } };
  }
  if (typeof body.slug === "string" && body.slug.trim()) {
    const slug = slugify(body.slug);
    const clash = await prisma.product.findUnique({ where: { slug } });
    if (clash && clash.id !== id) {
      return NextResponse.json({ message: "A product with this slug already exists" }, { status: 409 });
    }
    data.slug = slug;
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ message: "Please enter a valid price" }, { status: 400 });
    }
    data.price = Math.round(price * 100);
  }
  if (body.stock !== undefined) {
    const stock = Math.round(Number(body.stock));
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({ message: "Please enter a valid stock quantity" }, { status: 400 });
    }
    data.stock = stock;
  }
  if (body.featured === undefined && Object.keys(data).length === 0) {
    return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data,
      select: { id: true, name: true, slug: true, price: true, stock: true, featured: true },
    });
    return NextResponse.json({ product: updated, message: "Product updated" });
  } catch {
    return NextResponse.json({ message: "Could not update the product. Please try again." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/products/[id]">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  if (!isStaff(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const product = await findAuthorizedProduct(id, user.id, user.role);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  try {
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);
    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json(
      { message: "Could not delete the product. It may be linked to existing orders." },
      { status: 409 }
    );
  }
}