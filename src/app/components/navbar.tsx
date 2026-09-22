"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useState, useEffect } from "react";

interface PublicUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function Navbar(): JSX.Element {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let active = true;
        fetch("/api/auth/me")
            .then((res) => (res.ok ? res.json() : { user: null }))
            .then((data) => {
                if (active) setUser(data.user ?? null);
            })
            .catch(() => {
                if (active) setUser(null);
            })
            .finally(() => {
                if (active) setLoadingUser(false);
            });
        return () => {
            active = false;
        };
    }, []);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.refresh();
    }

    return (
        <nav className="w-full border-b border-white/10 bg-primary-deep text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2 ">
                        <Link href="/" className="flex items-center rounded-md p-2 transition hover:bg-surface/10">
                            <Image src="/logo.png" alt="FarmDirect logo" width={72} height={54} />
                        </Link>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-2">
                        <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 transition hover:bg-surface/10 hover:text-white">Home</Link>
                        <Link href="/products" className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 transition hover:bg-surface/10 hover:text-white">Products</Link>
                        <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 transition hover:bg-surface/10 hover:text-white">About</Link>
                        <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 transition hover:bg-surface/10 hover:text-white">Contact</Link>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-3">
                        <Link
                            href="/cart"
                            aria-label="Cart"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-50/90 transition hover:bg-surface/10 hover:text-white"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.5a1 1 0 00.9 1.5h13.4M16 21a1 1 0 100-2 1 1 0 000 2zm-7 0a1 1 0 100-2 1 1 0 000 2z"
                                />
                            </svg>
                            Cart
                        </Link>
                        {loadingUser ? null : user ? (
                            <>
                                {user.role === "FARMER" || user.role === "ADMIN" ? (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-50/90 transition hover:bg-surface/10 hover:text-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : null}
                                <Link
                                    href="/account"
                                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-50/90 transition hover:bg-surface/10 hover:text-white"
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface/20 text-xs font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                    {user.name.split(" ")[0]}
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="rounded-lg border border-white/30 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-surface/10">
                                    Log in
                                </Link>
                                <Link href="/signup" className="rounded-lg bg-surface px-4 py-1.5 text-sm font-semibold text-primary-deep transition hover:bg-emerald-50">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            aria-label="Toggle menu"
                            onClick={() => setOpen((v) => !v)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {open && (
                <div className="md:hidden border-t border-white/10 bg-primary-deep px-4 pb-4 pt-2 space-y-1">
                    <Link href="/" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">Home</Link>
                    <Link href="/products" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">Products</Link>
                    <Link href="/about" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">About</Link>
                    <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">Contact</Link>
                    <Link href="/cart" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">Cart</Link>
                    <div className="pt-2 border-t border-white/10">
                        {user ? (
                            <>
                                {user.role === "FARMER" || user.role === "ADMIN" ? (
                                    <Link href="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">
                                        Dashboard
                                    </Link>
                                ) : null}
                                <Link href="/account" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">
                                    Account
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        handleLogout();
                                    }}
                                    className="block rounded-lg px-3 py-2 text-sm font-medium text-red-300 hover:bg-surface/10 hover:text-red-200"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-50/90 hover:bg-surface/10 hover:text-white">Log in</Link>
                                <Link href="/signup" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-surface/10">Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}