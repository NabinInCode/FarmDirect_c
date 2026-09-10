import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">My account</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Welcome back, {user.name.split(" ")[0]}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D9F0E1] text-xl font-bold text-[#1B4332]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <dl className="border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between py-1">
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium text-gray-900">{user.role === "FARMER" ? "Farmer" : "Customer"}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-500">Orders</dt>
              <dd className="font-medium">
                <Link href="/orders" className="text-[#2D6A4F] hover:underline">
                  View order history
                </Link>
              </dd>
            </div>
          </dl>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}