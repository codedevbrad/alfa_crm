"use server"

import { prisma } from "@/lib/db/prisma"
import { SubscriptionTier } from "@/generated/prisma" // enums from your custom client output
// If you prefer, you can avoid importing the enum and use "FREE" as a string literal.

type MinimalUser = { id: string }

/**
 * Create (or ensure) a StudentProfile for this user and attach a FREE subscription.
 * Idempotent: if profile exists, it won't recreate; if an ACTIVE sub exists, it won't duplicate.
*/

export async function CreateNewStudent(user: MinimalUser) {
  if (!user?.id) throw new Error("CreateNewStudent: user.id is required")

  const result = await prisma.$transaction(async (tx) => {
    // 1) Upsert the student profile by userId
    const student = await tx.studentProfile.upsert({
      where: { userId: user.id },
      update: {}, // no-op update
      create: {
        userId: user.id,
        // If you ONLY call this on brand new users, you can nest-create the free sub here:
        // subscriptions: { create: { tier: "FREE", status: "ACTIVE" } },
      },
      select: { id: true },
    })

    // 2) Check for an existing ACTIVE subscription
    const existingActive = await tx.subscription.findFirst({
      where: { studentProfileId: student.id, status: "ACTIVE" },
      select: { id: true, tier: true },
    })

    // 3) If none, create the FREE subscription (ACTIVE, with no endDate)
    if (!existingActive) {
      await tx.subscription.create({
        data: {
          studentProfileId: student.id,
          tier: "FREE" as SubscriptionTier, // or just "FREE"
          status: "ACTIVE",
          // endDate: null // optional; left out since it's nullable and optional
        },
      })
    }

    return { studentProfileId: student.id, createdFree: !existingActive }
  })

  // (Optional logging)
  if (result.createdFree) {
    console.log(`FREE subscription created for studentProfile ${result.studentProfileId}`)
  } 
  else {
    console.log(`StudentProfile ${result.studentProfileId} already had an ACTIVE subscription`)
  }
  return { ok: true, ...result }
}