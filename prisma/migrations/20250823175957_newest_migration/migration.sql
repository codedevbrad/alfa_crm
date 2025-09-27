-- CreateEnum
CREATE TYPE "public"."SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'TUTORED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."AssignmentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."service_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "keys" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "tier" "public"."SubscriptionTier" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TutorAssignment" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "tutorProfileId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_keys_userId_service_key" ON "public"."service_keys"("userId", "service");

-- CreateIndex
CREATE INDEX "Subscription_studentProfileId_idx" ON "public"."Subscription"("studentProfileId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "public"."Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_endDate_idx" ON "public"."Subscription"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "TutorAssignment_subscriptionId_key" ON "public"."TutorAssignment"("subscriptionId");

-- CreateIndex
CREATE INDEX "TutorAssignment_tutorProfileId_idx" ON "public"."TutorAssignment"("tutorProfileId");

-- CreateIndex
CREATE INDEX "TutorAssignment_studentProfileId_idx" ON "public"."TutorAssignment"("studentProfileId");

-- AddForeignKey
ALTER TABLE "public"."service_keys" ADD CONSTRAINT "service_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorAssignment" ADD CONSTRAINT "TutorAssignment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorAssignment" ADD CONSTRAINT "TutorAssignment_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "public"."TutorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TutorAssignment" ADD CONSTRAINT "TutorAssignment_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
