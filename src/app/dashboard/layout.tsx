import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import DashboardNav from "./components/DashboardNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (!isStaff(user)) redirect("/account");

  const unreadMessages =
    user.role === "ADMIN"
      ? await prisma.contactMessage.count({ where: { handled: false } })
      : 0;

  return (
    <div className="flex min-h-[70vh] flex-1 flex-col lg:flex-row">
      <DashboardNav role={user.role} userName={user.name} unreadMessages={unreadMessages} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
