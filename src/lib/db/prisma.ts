import { PrismaClient } from "@prisma/client";

// Rest of your file stays the same
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}