// scripts/convert-student-to-tutor.ts
// Run with:  pnpm tsx scripts/convert-student-to-tutor.ts alice@example.com [--yes]
/* eslint-disable no-console */
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@/generated/prisma"

async function main() {
  const email = process.argv[2]
  const autoYes = process.argv.includes("--yes")

  if (!email) {
    console.log("❌ Please provide a user email")
    console.log("Usage: pnpm tsx scripts/convert-student-to-tutor.ts <email> [--yes]")
    process.exit(1)
  }

  console.log(`🎓 Converting user to TUTOR`)
  console.log(`📧 ${email}\n`)

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      tutorProfile: true,
      studentProfile: true,
      adminProfile: true,
    },
  })

  if (!user) {
    console.log(`❌ No user found for ${email}`)
    const candidates = await prisma.user.findMany({
      select: { email: true, name: true, role: true },
      take: 10,
      orderBy: { createdAt: "desc" } as any, // ignore if you don’t have createdAt
    })
    if (candidates.length) {
      console.log("\n📋 Recent users:")
      for (const u of candidates) {
        console.log(`  - ${u.email} (${u.name ?? "—"}) [${u.role}]`)
      }
    }
    process.exit(1)
  }

  console.log(`✅ Found: ${user.name ?? "Unnamed"} (${user.id}) [${user.role}]`)
  console.log(`   Profiles: student=${!!user.studentProfile ? "✅" : "❌"}  tutor=${!!user.tutorProfile ? "✅" : "❌"}  admin=${!!user.adminProfile ? "✅" : "❌"}`)

  // Idempotency: already a tutor with profile
  if (user.role === UserRole.TUTOR && user.tutorProfile) {
    console.log("\n✅ Already a TUTOR with profile. Nothing to do.")
    await prisma.$disconnect()
    process.exit(0)
  }

  // Plan
  console.log("\n📊 Planned changes:")
  if (user.role !== UserRole.TUTOR) console.log(`  - Role: ${user.role} → TUTOR`)
  if (!user.tutorProfile) console.log(`  - Create TutorProfile`)
  if (user.studentProfile) console.log(`  - Delete StudentProfile (subscriptions & assignments cascade)`)
  if (user.adminProfile) console.log(`  - Delete AdminProfile`)

  if (!autoYes) {
    console.log("\n⏳ Proceeding in 2 seconds… (Ctrl+C to cancel)")
    await new Promise((r) => setTimeout(r, 2000))
  }

  // Execute
  await prisma.$transaction(async (tx) => {
    // Remove conflicting profiles (CASCADE does the heavy lifting downstream)
    if (user.studentProfile) {
      await tx.studentProfile.delete({ where: { userId: user.id } })
      console.log("   ✅ Removed StudentProfile (related rows removed via CASCADE)")
    }
    if (user.adminProfile) {
      await tx.adminProfile.delete({ where: { userId: user.id } })
      console.log("   ✅ Removed AdminProfile")
    }

    // Update role
    if (user.role !== UserRole.TUTOR) {
      await tx.user.update({ where: { id: user.id }, data: { role: UserRole.TUTOR } })
      console.log("   ✅ Updated user role → TUTOR")
    }

    // Ensure tutor profile
    await tx.tutorProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    })
    console.log("   ✅ Ensured TutorProfile")
  })

  // Re‑read for verification
  const updated = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      tutorProfile: true,
      studentProfile: true,
      adminProfile: true,
    },
  })

  const ok = !!updated && updated.role === UserRole.TUTOR && !!updated.tutorProfile
  console.log("\n🔍 Verification:", ok ? "✅ OK" : "❌ FAILED")
  if (ok) {
    console.log(`👤 ${updated!.email} now has role ${updated!.role}`)
    console.log(`   StudentProfile: ${updated!.studentProfile ? "✅" : "❌"}  TutorProfile: ${updated!.tutorProfile ? "✅" : "❌"}  AdminProfile: ${updated!.adminProfile ? "✅" : "❌"}`)
  }

  await prisma.$disconnect()
  process.exit(ok ? 0 : 1)
}

main().catch(async (e) => {
  console.error("💥 Script error:", e)
  await prisma.$disconnect()
  process.exit(1)
});