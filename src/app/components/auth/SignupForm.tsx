"use client";
import { useRouter } from "next/navigation";
import { JSX, useState, FormEvent } from "react";

const inputBase =
    "w-full rounded-xl border border-line bg-surface-muted/60 py-2.5 pl-11 pr-10 text-sm text-ink placeholder:text-faint outline-none transition focus:border-primary-bright focus:bg-surface focus:ring-2 focus:ring-primary-bright/20";

function passwordScore(pw: string): number {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
}

const strengthMeta = [
    { label: "Weak", color: "bg-red-500", text: "text-red-600" },
    { label: "Fair", color: "bg-amber-500", text: "text-amber-600" },
    { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" },
];

export default function SignupForm({ redirectTo = "/account" }: { redirectTo?: string }): JSX.Element {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"CUSTOMER" | "FARMER">("CUSTOMER");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const score = passwordScore(password);
    const strength = strengthMeta[Math.max(0, score - 1)];

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Signup failed");
            router.push(role === "FARMER" ? "/dashboard" : redirectTo);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
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
            {success && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
                    <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {success}
                </div>
            )}

            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-muted">I am joining as</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setRole("CUSTOMER")}
                        aria-pressed={role === "CUSTOMER"}
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                            role === "CUSTOMER"
                                ? "border-primary-bright bg-primary-softer ring-2 ring-primary-bright/20"
                                : "border-line bg-surface hover:border-line-strong"
                        }`}
                    >
                        <p className={`text-sm font-semibold ${role === "CUSTOMER" ? "text-primary" : "text-ink"}`}>
                            Customer
                        </p>
                        <p className="mt-0.5 text-xs text-muted-2">Shop fresh produce</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("FARMER")}
                        aria-pressed={role === "FARMER"}
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                            role === "FARMER"
                                ? "border-primary-bright bg-primary-softer ring-2 ring-primary-bright/20"
                                : "border-line bg-surface hover:border-line-strong"
                        }`}
                    >
                        <p className={`text-sm font-semibold ${role === "FARMER" ? "text-primary" : "text-ink"}`}>
                            Farmer
                        </p>
                        <p className="mt-0.5 text-xs text-muted-2">Sell from your farm</p>
                    </button>
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-muted">Full name</label>
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-faint"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Farmer"
                        required
                        className={inputBase}
                    />
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-muted">Email</label>
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-faint"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className={inputBase}
                    />
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-muted">Password</label>
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-faint"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        required
                        className={inputBase}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition hover:text-muted"
                    >
                        {showPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-6-10-7s4.477-7 10-7c1.057 0 2.07.143 3.02.41" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.92 2.428-2.66 4.393-4.72 5.693" />
                                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
                {password && (
                    <div className="mt-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                            <div
                                className={`h-full rounded-full transition-all ${strength.color}`}
                                style={{ width: `${(score / 4) * 100}%` }}
                            />
                        </div>
                        <p className={`mt-1 text-xs font-medium ${strength.text}`}>
                            Password strength: {strength.label}
                        </p>
                    </div>
                )}
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-muted">Re-enter password</label>
                <div className="relative">
                    <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-faint"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        className={inputBase}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition hover:text-muted"
                    >
                        {showConfirmPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-6-10-7s4.477-7 10-7c1.057 0 2.07.143 3.02.41" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.92 2.428-2.66 4.393-4.72 5.693" />
                                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        Passwords do not match
                    </p>
                )}
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-2">
                <input
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-line-strong accent-primary-bright"
                />
                <span>
                    I agree to the{" "}
                    <a href="#" className="font-semibold text-primary-bright hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-semibold text-primary-bright hover:underline">
                        Privacy Policy
                    </a>
                </span>
            </label>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-500/30 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}