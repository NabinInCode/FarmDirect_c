import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  if (!isStaff(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    where: user.role === "ADMIN" ? {} : { farmerId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, price: true, stock: true, featured: true },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  if (!isStaff(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const unit = typeof body.unit === "string" ? body.unit.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const slug = typeof body.slug === "string" ? slugify(body.slug) : "";
  const price = Number(body.price);
  const stock = Math.round(Number(body.stock));
  const featured = Boolean(body.featured);
  const categoryId = typeof body.categoryId === "string" ? body.categoryId : "";

  if (!name || !description || !unit || !slug || !categoryId) {
    return NextResponse.json({ message: "Name, slug, description, unit and category are required" }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ message: "Please enter a valid price" }, { status: 400 });
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return NextResponse.json({ message: "Please enter a valid stock quantity" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ message: "Selected category does not exist" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ message: "A product with this slug already exists" }, { status: 409 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Math.round(price * 100),
        unit,
        image,
        stock,
        featured,
        categoryId,
        farmerId: user.role === "FARMER" ? user.id : null,
      },
      select: { id: true, name: true, slug: true },
    });
    return NextResponse.json({ product, message: "Product created" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Could not create the product. Please try again." }, { status: 500 });
  }
}