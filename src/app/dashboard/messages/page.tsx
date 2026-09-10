import { getCurrentUser } from "@/lib/auth";
import { isStaff } from "@/lib/auth";
import { getContactMessages } from "@/lib/dashboard";
import HandledToggle from "./HandledToggle";

export const dynamic = "force-dynamic";

export default async function DashboardMessagesPage() {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return null;

  const messages = await getContactMessages();
  const unhandled = messages.filter((m) => !m.handled).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Contact messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          {messages.length} message{messages.length === 1 ? "" : "s"}
          {unhandled > 0 ? ` — ${unhandled} unhandled` : ""}
        </p>
      </div>

      {user.role !== "ADMIN" ? (
        <p className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          Only administrators can view contact messages.
        </p>
      ) : messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                m.handled ? "border-gray-200" : "border-[#2D6A4F]/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-gray-900">{m.subject}</h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {m.name} · {m.email}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <HandledToggle messageId={m.id} handled={m.handled} />
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}