// Change this line:
// import { PrismaClient } from "@prisma/client";

// To this:
import { PrismaClient } from "@/generated/prisma";

// Rest of your file stays the same
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // uncomment for noisy SQL logs in dev
    // log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}