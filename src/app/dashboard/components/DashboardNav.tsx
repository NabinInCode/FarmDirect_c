"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import type { StaffRole } from "@/lib/dashboard";

const links: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/orders", label: "Orders" },
];

export default function DashboardNav({
  role,
  userName,
  unreadMessages = 0,
}: {
  role: StaffRole;
  userName: string;
  unreadMessages?: number;
}): JSX.Element {
  const pathname = usePathname();

  return (
    <aside className="border-r border-line bg-surface lg:w-60 lg:shrink-0">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 lg:block lg:border-b-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{userName}</p>
          <p className="text-xs uppercase tracking-widest text-primary-bright">
            {role === "ADMIN" ? "Administrator" : "Farmer"}
          </p>
        </div>
      </div>

      <nav className="flex gap-1 px-3 py-4 lg:flex-col" aria-label="Dashboard">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-primary-solid text-white" : "text-muted hover:bg-surface-muted hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        {role === "ADMIN" && (
          <Link
            href="/dashboard/messages"
            className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname.startsWith("/dashboard/messages")
                ? "bg-primary-solid text-white"
                : "text-muted hover:bg-surface-muted hover:text-primary"
            }`}
          >
            <span>Messages</span>
            {unreadMessages > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                {unreadMessages}
              </span>
            )}
          </Link>
        )}
      </nav>

      <div className="px-5 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-2 transition hover:text-primary"
        >
          <span aria-hidden>&larr;</span> Back to store
        </Link>
      </div>
    </aside>
  );
}
