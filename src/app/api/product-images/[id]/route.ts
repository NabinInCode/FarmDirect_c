import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const image = await prisma.productImage.findUnique({
      where: { id },
      select: { data: true, mimeType: true },
    });

    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    const body = new Uint8Array(image.data);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }
}