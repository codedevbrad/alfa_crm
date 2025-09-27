// src/lib/auth/access/requireRole.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import { UserRole } from "@/generated/prisma"

type RequireRoleOptions = {
  /** Which roles can access this area */
  allowed: UserRole[]
  /** Where to bounce the user back after logging in */
  returnTo: string
  /** Extra checks for tutors (e.g. profile must exist) */
  enforceTutorProfile?: boolean
}

export async function requireRole({
  allowed,
  returnTo,
  enforceTutorProfile = false,
}: RequireRoleOptions) {
  const session = await auth()

  // Not signed in → send to login with callback
  if (!session?.user?.id) {
    redirect(`/login?unauthorized=not-signed-in&callbackUrl=${encodeURIComponent(returnTo)}`)
  }

  const role = session.user.role as UserRole | undefined
  if (!role || !allowed.includes(role)) {
    redirect(`/login?unauthorized=forbidden&callbackUrl=${encodeURIComponent(returnTo)}`)
  }

  // If we need tutor profile checks, fetch once and verify
  if (role === UserRole.TUTOR && enforceTutorProfile) {
    const tutor = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        tutorProfile: true,
        accounts: true,
      },
    })

    if (!tutor || tutor.role !== UserRole.TUTOR) {
      redirect(`/login?unauthorized=invalid-tutor&callbackUrl=${encodeURIComponent(returnTo)}`)
    }

    if (!tutor.tutorProfile) {
      // Send them to setup with a way back afterward
      redirect(`/tutorHub/setup?reason=profile-missing&callbackUrl=${encodeURIComponent(returnTo)}`)
    }

    // ✅ Return useful data for headers/pages
    return { session, tutor }
  }

  // Student (or tutor without extra checks) — return session only
  return { session }
}

/* ----------------------------------- */
/* Convenience wrappers                */
/* ----------------------------------- */

export async function requireTutor(returnTo = "/tutorHub") {
  return requireRole({
    allowed: [UserRole.TUTOR],
    returnTo,
    enforceTutorProfile: true,
  })
}

export async function requireStudent(returnTo = "/platform") {
  return requireRole({
    allowed: [UserRole.STUDENT],
    returnTo,
  })
}
