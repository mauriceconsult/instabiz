// lib/auth-utils.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";


export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireRole(role: "INDIVIDUAL" | "CORPORATE" | "ADMIN") {
  const user = await requireAuth();

  if (user.role !== role) {
    throw new Error("Forbidden");
  }

  return user;
}
