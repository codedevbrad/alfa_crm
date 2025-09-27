import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'

import TutorDashboard from './dashboard'

async function getTutorProfile() {
  // Get current session...
  const session = await auth();

  // Get full tutor data with profile
  return await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tutorProfile: true,
      accounts: true,
    }
  });
}

export default async function TutorHubPage() {

  const tutor = await getTutorProfile();

  return (
    <div className="min-h-screen">
      <TutorDashboard tutor={tutor} tutorProfile={tutor.tutorProfile} />
    </div>
  );
}