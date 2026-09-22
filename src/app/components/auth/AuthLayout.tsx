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
        <main className="flex w-full bg-primary-softer px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-surface shadow-xl shadow-black/10 ring-1 ring-line lg:grid lg:grid-cols-2">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-softer via-primary-softer to-primary-soft p-10 text-ink lg:flex">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-soft/60 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-primary-soft/70 blur-2xl" />

                    <div className="relative space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="FarmDirect logo"
                                width={44}
                                height={33}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-semibold tracking-tight">FarmDirect</span>
                        </Link>

                        <div>
                            <span className="inline-flex rounded-full bg-primary-solid/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                                {badge}
                            </span>
                            <h2 className="mt-4 text-3xl font-bold leading-tight text-ink">{title}</h2>
                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <svg
                            className="h-8 w-8 text-primary"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path d="M14.017 21v-7.391C14.017 11.615 15.7 10 19.5 10l.5.002V12.4c-2.2.09-3 .16-3.5 3.71H19v5h-4.983v.027zM4 21v-7.391C4 11.615 5.7 10 9.5 10l.5.002V12.4c-2.2.09-3 .16-3.5 3.71H9v5H4z" />
                        </svg>
                        <p className="mt-3 text-sm italic leading-relaxed text-muted">{quote}</p>
                        <p className="mt-3 text-xs font-semibold tracking-wide text-primary">
                            {quoteAuthor}
                        </p>
                    </div>

                    <div className="relative flex items-center gap-6 border-t border-line/70 pt-6">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-xl font-bold text-ink">{stat.value}</p>
                                <p className="mt-0.5 text-[11px] text-muted-2">{stat.label}</p>
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
                            src="/logo.png"
                            alt="FarmDirect logo"
                            width={40}
                            height={30}
                            className="rounded-lg"
                        />
                        <span className="text-lg font-semibold text-primary">FarmDirect</span>
                    </Link>

                    {children}
                </div>
            </div>
        </main>
    );
}