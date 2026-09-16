import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 4 * 1024 * 1024;

const ALLOWED_MIME_TYPES: Record<string, boolean> = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
  "image/gif": true,
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  if (!isStaff(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Please choose an image file." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES[file.type]) {
    return NextResponse.json(
      { message: "Only JPG, PNG, WEBP or GIF images are allowed." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { message: "Image must be 4 MB or smaller." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const record = await prisma.productImage.create({
      data: {
        data: buffer,
        mimeType: file.type,
      },
      select: { id: true },
    });

    return NextResponse.json(
      { url: `/api/product-images/${record.id}` },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Could not save the image. Please try again." },
      { status: 500 }
    );
  }
}
