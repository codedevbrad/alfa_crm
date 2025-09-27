// src/app/actions/subscriptions.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { SubscriptionTier } from "@/generated/prisma"; // from your prisma client output

// --------- helpers ---------
async function getStudentProfileIdByUserId(userId: string) {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!student) throw new Error("No student profile found for current user.");
  return student.id;
}

/** Cancel any ACTIVE sub and create a new ACTIVE one. */
async function activateSubscription(opts: {
  studentProfileId: string;
  tier: SubscriptionTier;
  endDate?: Date;
}) {
  const { studentProfileId, tier, endDate } = opts;

  await prisma.subscription.updateMany({
    where: { studentProfileId, status: "ACTIVE" },
    data: { status: "CANCELLED", endDate: new Date() },
  });

  const sub = await prisma.subscription.create({
    data: {
      studentProfileId,
      tier,
      status: "ACTIVE",
      ...(endDate ? { endDate } : {}),
    },
  });

  return sub;
}

// --------- public actions ---------

export async function startFreeTierAction() {
  const userId = await getCurrentUserId();
  const studentProfileId = await getStudentProfileIdByUserId(userId);

  const sub = await activateSubscription({ studentProfileId, tier: "FREE" });
  revalidatePath("/dashboard");
  return { ok: true, plan: sub.tier, status: sub.status, subscriptionId: sub.id };
}

export async function purchaseBasicAction() {
  const userId = await getCurrentUserId();
  const studentProfileId = await getStudentProfileIdByUserId(userId);

  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  const sub = await activateSubscription({ studentProfileId, tier: "BASIC", endDate: end });
  revalidatePath("/dashboard");
  return { ok: true, plan: sub.tier, status: sub.status, subscriptionId: sub.id };
}

export async function purchaseTutoredAction(formData: FormData) {
  const tutorProfileId = String(formData.get("tutorProfileId") ?? "");
  if (!tutorProfileId) return { ok: false, error: "Tutor is required." };

  const userId = await getCurrentUserId();
  const studentProfileId = await getStudentProfileIdByUserId(userId);

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    select: { id: true },
  });
  if (!tutor) return { ok: false, error: "Selected tutor not found." }

  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  const sub = await activateSubscription({ studentProfileId, tier: "TUTORED", endDate: end });

  await prisma.tutorAssignment.create({
    data: {
      subscriptionId: sub.id,
      tutorProfileId,
      studentProfileId,
      status: "ACTIVE",
    },
  });

  revalidatePath("/dashboard");
  return { ok: true, plan: sub.tier, status: sub.status, subscriptionId: sub.id, tutorProfileId };
}

export async function getTutorsAction() {
  const tutors = await prisma.tutorProfile.findMany({
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return tutors.map((t) => ({
    tutorProfileId: t.id,
    userId: t.user?.id ?? null,
    name: t.user?.name ?? "Unnamed Tutor",
    image: t.user?.image ?? null,
    hourlyRate: t.hourlyRate ? t.hourlyRate.toString() : null,
  }));
}

/** Get current ACTIVE subscription (and tutor, if tutored) */
export async function getMySubscriptionAction() {
  const userId = await getCurrentUserId();
  const studentProfileId = await getStudentProfileIdByUserId(userId);

  const sub = await prisma.subscription.findFirst({
    where: { studentProfileId, status: "ACTIVE" },
    include: {
      tutorAssignment: {
        include: {
          tutor: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
        },
      },
    },
    orderBy: { startDate: "desc" },
  });

  if (!sub) return null;

  return {
    id: sub.id,
    tier: sub.tier as SubscriptionTier,
    status: sub.status,
    startDate: sub.startDate.toISOString(),
    endDate: sub.endDate ? sub.endDate.toISOString() : null,
    tutor: sub.tutorAssignment
      ? {
        tutorProfileId: sub.tutorAssignment.tutorProfileId,
        name: sub.tutorAssignment.tutor.user?.name ?? "Your Tutor",
        image: sub.tutorAssignment.tutor.user?.image ?? null,
      }
      : null,
  };
}
