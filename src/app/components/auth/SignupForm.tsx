"use client";
import { JSX, useState, FormEvent } from "react";

export default function SignupForm(): JSX.Element {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Signup failed");
            setSuccess(data?.message || "Account created");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-emerald-400">{success}</p>}

            <div>
                <label className="block text-sm mb-1">Full name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-black pr-10 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-6-10-7s4.477-7 10-7c1.057 0 2.07.143 3.02.41" />
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.92 2.428-2.66 4.393-4.72 5.693" />
                                <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm mb-1">Re-enter password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-black pr-10 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showConfirmPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-6-10-7s4.477-7 10-7c1.057 0 2.07.143 3.02.41" />
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.92 2.428-2.66 4.393-4.72 5.693" />
                                <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md shadow-sm disabled:opacity-60"
                >
                    {loading ? "Please wait..." : "Create account"}
                </button>
            </div>

            <div className="mt-4">
                <div className="flex items-center my-4">
                    <span className="flex-grow border-t border-gray-200"></span>
                    <span className="px-3 text-sm text-gray-400">or</span>
                    <span className="flex-grow border-t border-gray-200"></span>
                </div>

                <button
                    type="button"
                    onClick={() => (window.location.href = "/api/auth/google")}
                    className="w-full inline-flex items-center justify-center gap-3 border rounded-md px-3 py-2 hover:bg-gray-50"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path fill="#EA4335" d="M12 11.5v2.9h6.1c-.3 1.8-1.9 5.3-6.1 5.3-3.7 0-6.8-3-6.8-6.8S8.3 6.1 12 6.1c2 0 3.3.9 4.1 1.6l1.9-1.9C17.6 3.9 15.1 3 12 3 6.5 3 2 7.5 2 13s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"/>
                    </svg>
                    Continue with Google
                </button>
            </div>
        </form>
    );
}
