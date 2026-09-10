import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(_req: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { handled: !message.handled },
      select: { id: true, handled: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Could not update the message. Please try again." },
      { status: 500 }
    );
  }
}