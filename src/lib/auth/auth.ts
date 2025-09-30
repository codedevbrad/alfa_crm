// src/lib/auth.ts
import "server-only"
import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import type { UserRole } from "@prisma/client"

export async function getCurrentUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("User not authenticated")
  return session.user.id
}

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user) return null

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: (session.user as any).role as UserRole | undefined, // from JWT/session
  }
}

// Get user with role-specific profiles (aligned to your Prisma schema)
export async function getUserWithProfile(userId?: string) {
  const id = userId ?? (await getCurrentUserId())

  return prisma.user.findUnique({
    where: { id },
    include: {
      adminProfile: true,
      workerProfile: true,
      serviceKeys: true, // handy if you need connected services
      // accounts: false, sessions: false  // (default false)
    },
  })
}

// Optional helpers if you need them later
export const isOnboarded = (role?: UserRole) => role && role !== ("NOTASSIGNED" as UserRole)
export const hasRole = (role: UserRole | undefined, allowed: UserRole[]) => !!role && allowed.includes(role)