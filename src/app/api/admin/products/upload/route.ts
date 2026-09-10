import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
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

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
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

  const filename = `${Date.now()}-${randomUUID()}.${ext}`;

  // On Vercel use Blob storage; locally fall back to the filesystem.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { url } = await put(`products/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({ url }, { status: 201 });
    } catch {
      return NextResponse.json(
        { message: "Could not save the image. Please try again." },
        { status: 500 }
      );
    }
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  } catch {
    return NextResponse.json({ message: "Could not save the image. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ url: `/uploads/products/${filename}` }, { status: 201 });
}