// lib/roles.ts
import { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/db/prisma";


// Helper function to change user role
export async function changeUserRole(userId: string, newRole: UserRole) {
  // Start a transaction to ensure data consistency
  return await prisma.$transaction(async (tx) => {
    // Update user role
    const user = await tx.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Delete existing profiles
    await tx.tutorProfile.deleteMany({ where: { userId } });
    await tx.studentProfile.deleteMany({ where: { userId } });
    await tx.adminProfile.deleteMany({ where: { userId } });

    // Create new profile based on role
    switch (newRole) {
      case UserRole.STUDENT:
        await tx.studentProfile.create({
          data: { userId },
        });
        break;
      case UserRole.TUTOR:
        await tx.tutorProfile.create({
          data: { userId },
        });
        break;
      case UserRole.ADMIN:
        await tx.adminProfile.create({
          data: { userId, permissions: [] },
        });
        break;
    }

    return user;
  });
}

// Role checking utilities
export function isAdmin(role?: UserRole): boolean {
  return role === UserRole.ADMIN;
}

export function isTutor(role?: UserRole): boolean {
  return role === UserRole.TUTOR;
}

export function isStudent(role?: UserRole): boolean {
  return role === UserRole.STUDENT;
}

export function canAccessAdminPanel(role?: UserRole): boolean {
  return isAdmin(role);
}

export function canCreateTutorSessions(role?: UserRole): boolean {
  return isTutor(role) || isAdmin(role);
}

export function canBookSessions(role?: UserRole): boolean {
  return isStudent(role) || isAdmin(role);
}