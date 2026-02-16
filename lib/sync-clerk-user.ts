// lib/sync-clerk-user.ts
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncClerkUser(clerkId: string) {
  try {
    // ✅ Fix: Call clerkClient() as a function first
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkId);

    // Sync to your database
    const user = await prisma.user.upsert({
      where: { clerkId },
      create: {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          null,
        image: clerkUser.imageUrl || null,
        role: "INDIVIDUAL",
      },
      update: {
        email: clerkUser.emailAddresses[0].emailAddress,
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          null,
        image: clerkUser.imageUrl || null,
      },
    });

    console.log("User synced to database:", user.id);
    return user;
  } catch (error) {
    console.error("Error syncing Clerk user:", error);
    throw error;
  }
}

// Helper to get current user with auto-sync
export async function getCurrentUser(clerkId: string) {
  // Try to get user from database
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // If not found in database, sync from Clerk
  if (!user) {
    console.log("User not in database, syncing from Clerk...");
    user = await syncClerkUser(clerkId);
  }

  return user;
}
