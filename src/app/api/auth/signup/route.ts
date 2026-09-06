import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body || {};

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        // TODO: Replace with real signup logic (create user, hash password).
        return NextResponse.json({ message: "Account created" }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
}
