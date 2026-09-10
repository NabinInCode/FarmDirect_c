import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = generateResetToken();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashResetToken(token),
          resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });

      const origin =
        req.headers.get("origin")?.replace(/\/$/, "") ?? "http://localhost:3000";
      const resetUrl = `${origin}/reset-password?token=${token}`;

      // No mail service is configured for this college project, so the reset link
      // is logged to the server console (and returned in the response for the demo).
      console.log(`[FarmDirect] Password reset link: ${resetUrl}`);
      return NextResponse.json({
        message: "Reset link generated",
        resetUrl,
      });
    }

    // Always answer the same way so emails cannot be enumerated.
    return NextResponse.json(
      { message: "If an account exists for that email, a reset link has been generated." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}