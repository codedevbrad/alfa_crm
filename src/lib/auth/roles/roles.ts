// lib/roles.ts
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

// Change a user’s role
export async function changeUserRole(userId: string, newRole: UserRole) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  })
}

// ---- Role checks ----
export function isAdmin(role?: UserRole): boolean {
  return role === UserRole.ADMIN
}

export function isManager(role?: UserRole): boolean {
  return role === UserRole.MANAGER
}

export function isWorker(role?: UserRole): boolean {
  return role === UserRole.WORKER
}

export function isAssigned(role?: UserRole): boolean {
  return role !== undefined && role !== UserRole.NOTASSIGNED
}

// ---- Access utilities ----
export function canAccessAdminPanel(role?: UserRole): boolean {
  return isAdmin(role) || isManager(role) // up to you if managers also get access
}

export function canManageWorkers(role?: UserRole): boolean {
  return isManager(role) || isAdmin(role)
}

export function canWorkOnProjects(role?: UserRole): boolean {
  return isWorker(role) || isManager(role) || isAdmin(role)
}
