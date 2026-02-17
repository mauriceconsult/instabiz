import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// ✅ Debug - remove after fix
console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL prefix:", process.env.DATABASE_URL?.substring(0, 30));

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL!,
    }),
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

