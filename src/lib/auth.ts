import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session-cookies";
import type { Role } from "@prisma/client";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  address: string | null;
  phone: string | null;
};

export async function getCurrentUser(): Promise<PublicUser | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, role: true, address: true, phone: true },
  });

  return user;
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export type StaffRole = "FARMER" | "ADMIN";

export function isStaff(user: PublicUser): user is PublicUser & { role: StaffRole } {
  return user.role === "FARMER" || user.role === "ADMIN";
}

export async function requireStaff(): Promise<PublicUser & { role: StaffRole }> {
  const user = await requireUser();
  if (!isStaff(user)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}