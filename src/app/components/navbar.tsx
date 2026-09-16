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
        <nav className="w-full bg-[#1B4332] text-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2 ">
                        <Link href="/" className="flex items-center rounded-md p-2 hover:bg-[#2C6B4A]">
                            <Image src="/logo.png" alt="FarmDirect logo" width={80} height={60} />
                        </Link>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Link href="/">Home</Link>
                        <Link href="/products">Products</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-3">
                        <Link
                            href="/cart"
                            aria-label="Cart"
                            className="flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition hover:bg-[#2C6B4A]"
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
                                        className="flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition hover:bg-[#2C6B4A]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : null}
                                <Link
                                    href="/account"
                                    className="flex items-center gap-2 rounded-md px-3 py-1 font-medium transition hover:bg-[#2C6B4A]"
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D9F0E1] text-xs font-bold text-[#1B4332]">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                    {user.name.split(" ")[0]}
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-md bg-red-500/90 hover:bg-red-500 px-3 py-1 font-medium text-xs"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="bg-white hover:bg-amber-600 hover:text-white text-black px-3 py-1 rounded-md font-medium">
                                    Log in
                                </Link>
                                <Link href="/signup" className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md font-medium">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            aria-label="Toggle menu"
                            onClick={() => setOpen((v) => !v)}
                            className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
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
                <div className="md:hidden px-4 pb-4 space-y-2">
                    <Link href="/" onClick={() => setOpen(false)} className="block">Home</Link>
                    <Link href="/products" onClick={() => setOpen(false)} className="block">Products</Link>
                    <Link href="/about" onClick={() => setOpen(false)} className="block">About</Link>
                    <Link href="/contact" onClick={() => setOpen(false)} className="block">Contact</Link>
                    <Link href="/cart" onClick={() => setOpen(false)} className="block">Cart</Link>
                    <div className="pt-2 border-t border-white/10">
                        {user ? (
                            <>
                                {user.role === "FARMER" || user.role === "ADMIN" ? (
                                    <Link href="/dashboard" onClick={() => setOpen(false)} className="block py-2">
                                        Dashboard
                                    </Link>
                                ) : null}
                                <Link href="/account" onClick={() => setOpen(false)} className="block py-2">
                                    Account
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        handleLogout();
                                    }}
                                    className="block py-2 font-medium text-red-200"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setOpen(false)} className="block py-2">Log in</Link>
                                <Link href="/signup" onClick={() => setOpen(false)} className="block py-2 font-medium">Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}