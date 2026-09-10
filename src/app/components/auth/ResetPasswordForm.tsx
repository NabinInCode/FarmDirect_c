"use client";
import Link from "next/link";
import { JSX, useState, FormEvent } from "react";

export default function ResetPasswordForm({ token }: { token: string }): JSX.Element {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirm) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Something went wrong");
            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div className="mt-8 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                <p className="font-medium">Password updated!</p>
                <p className="mt-1">
                    You can now log in with your new password.{" "}
                    <Link href="/login" className="font-semibold text-[#2D6A4F] underline">
                        Go to login
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
                    <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {error}
                </div>
            )}

            <p className="text-sm text-gray-500">
                Choose a new password (at least 6 characters).
            </p>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#2D6A4F] focus:bg-white focus:ring-2 focus:ring-[#2D6A4F]/20"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</label>
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#2D6A4F] focus:bg-white focus:ring-2 focus:ring-[#2D6A4F]/20"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-500/30 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Updating..." : "Update password"}
            </button>
        </form>
    );
}