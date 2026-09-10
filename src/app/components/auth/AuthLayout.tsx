import Image from "next/image";
import Link from "next/link";
import { JSX, ReactNode } from "react";

interface AuthLayoutProps {
    badge: string;
    title: string;
    subtitle: string;
    children: ReactNode;
    quote: string;
    quoteAuthor: string;
}

const stats = [
    { value: "1200+", label: "Happy customers" },
    { value: "45+", label: "Local farms" },
    { value: "100%", label: "Fresh guarantee" },
];

export default function AuthLayout({
    badge,
    title,
    subtitle,
    children,
    quote,
    quoteAuthor,
}: AuthLayoutProps): JSX.Element {
    return (
        <main className="flex w-full bg-[#F5F7F4] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-950/10 ring-1 ring-black/5 lg:grid lg:grid-cols-2">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#123524] via-[#1B4332] to-[#2D6A4F] p-10 text-white lg:flex">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-300/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-amber-300/10 blur-2xl" />
                    <div className="pointer-events-none absolute right-10 top-1/2 h-40 w-40 rounded-full bg-white/5 blur-xl" />

                    <div className="relative space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.jpg"
                                alt="FarmDirect logo"
                                width={44}
                                height={44}
                                className="rounded-lg ring-2 ring-white/10"
                            />
                            <span className="text-xl font-semibold tracking-tight">FarmDirect</span>
                        </Link>

                        <div>
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-100 ring-1 ring-white/20">
                                {badge}
                            </span>
                            <h2 className="mt-4 text-3xl font-bold leading-tight">{title}</h2>
                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-emerald-100/90">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <svg
                            className="h-8 w-8 text-amber-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path d="M14.017 21v-7.391C14.017 11.615 15.7 10 19.5 10l.5.002V12.4c-2.2.09-3 .16-3.5 3.71H19v5h-4.983v.027zM4 21v-7.391C4 11.615 5.7 10 9.5 10l.5.002V12.4c-2.2.09-3 .16-3.5 3.71H9v5H4z" />
                        </svg>
                        <p className="mt-3 text-sm italic leading-relaxed text-emerald-50/95">{quote}</p>
                        <p className="mt-3 text-xs font-semibold tracking-wide text-emerald-200">
                            {quoteAuthor}
                        </p>
                    </div>

                    <div className="relative flex items-center gap-6 border-t border-white/10 pt-6">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-xl font-bold">{stat.value}</p>
                                <p className="mt-0.5 text-[11px] text-emerald-200">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 sm:p-10 lg:p-12">
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-2.5 lg:hidden"
                        aria-label="FarmDirect home"
                    >
                        <Image
                            src="/logo.jpg"
                            alt="FarmDirect logo"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <span className="text-lg font-semibold text-[#1B4332]">FarmDirect</span>
                    </Link>

                    {children}
                </div>
            </div>
        </main>
    );
}