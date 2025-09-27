/* eslint-disable no-console */
import { PrismaClient, UserRole } from "../src/generated/prisma" // keep your generated path

const prisma = new PrismaClient()

async function main() {
  const tutorEmail = process.env.SEED_TUTOR_EMAIL || "tutor@example.com"

  const tutor = await prisma.user.upsert({
    where: { email: tutorEmail },
    create: {
      email: tutorEmail,
      name: "Taylor Tutor",
      role: UserRole.TUTOR,
      emailVerified: new Date(),
      tutorProfile: {
        create: { bio: "Passionate tutor ready to help 🚀", hourlyRate: "45.00" },
      },
    },
    update: {
      role: UserRole.TUTOR,
      tutorProfile: {
        upsert: {
          create: { bio: "Passionate tutor ready to help 🚀", hourlyRate: "45.00" },
          update: {},
        },
      },
    },
    include: { tutorProfile: true },
  })

  console.log("✅ Seeded Tutor:", tutor)
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())