// src/lib/auth.ts ...
import { auth } from "@/auth"
import { prisma } from "../db/prisma"

export async function getCurrentUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('User not authenticated');
  return session.user.id;
}

// Helper function to get user with profile
export async function getUserWithProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tutorProfile: true,
      studentProfile: true,
      adminProfile: true,
    },
  });
}