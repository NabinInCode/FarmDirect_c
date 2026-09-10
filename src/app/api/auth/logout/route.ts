import { NextResponse } from "next/server";
import { destroySessionCookie } from "@/lib/session-cookies";

export async function POST() {
  await destroySessionCookie();
  return NextResponse.json({ message: "Logged out" });
}