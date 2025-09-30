// src/scripts/db/admin.assign.ts
/* eslint-disable no-console */
import { PrismaClient, UserRole } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] // use positional: npm run setup:promote:admin -- you@company.com
  const autoYes = process.argv.includes("--yes")

  if (!email) {
    console.log("❌ Please provide a user email")
    console.log("Usage: npm run setup:promote:admin -- you@company.com [--yes]")
    process.exit(1)
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { adminProfile: true },
  })

  if (!user) {
    console.log(`❌ No user found for ${email}`)
    process.exit(1)
  }

  console.log(`✅ Found user: ${user.email} [${user.role}]`)
  console.log("📊 Planned changes:")
  if (user.role !== UserRole.ADMIN) console.log(`  - Role → ADMIN`)
  if (!user.adminProfile) console.log(`  - Create AdminProfile`)

  if (!autoYes) {
    console.log("\n⏳ Proceeding in 2 seconds… (Ctrl+C to cancel)")
    await new Promise((r) => setTimeout(r, 2000))
  }

  await prisma.$transaction(async (tx) => {
    if (user.role !== UserRole.ADMIN) {
      await tx.user.update({
        where: { id: user.id },
        data: { role: UserRole.ADMIN },
      })
      console.log("   ✅ Updated role → ADMIN")
    }

    if (!user.adminProfile) {
      await tx.adminProfile.create({
        data: { userId: user.id, permissions: [] },
      })
      console.log("   ✅ Created AdminProfile")
    }
  })

  console.log(`\n👤 ${email} is now an ADMIN ✅`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error("💥 Script error:", e)
  await prisma.$disconnect()
  process.exit(1)
})
