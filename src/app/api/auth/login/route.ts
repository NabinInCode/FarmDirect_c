import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body || {};

        if (!email || !password) {
            return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
        }

        // TODO: Replace with real authentication logic.
        // For now return success for any non-empty credentials.
        return NextResponse.json({ message: "Logged in" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
}
