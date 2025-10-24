"use server";

import { prisma } from "@/lib/db/prisma";
import { LeadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Delete a single lead if it's still NEW.
 */
export async function deleteLead(id: string) {
  // sanity
  if (!id) throw new Error("Missing lead id");

  const lead = await prisma.lead.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }
  if (lead.status !== "NEW") {
    throw new Error("Only NEW leads can be deleted");
  }

  await prisma.lead.delete({ where: { id } });
  // refresh the list + analytics
  revalidatePath("/crm/leads");
}

/**
 * Optional: bulk-delete all NEW leads.
 */
export async function deleteAllNewLeads() {
  await prisma.lead.deleteMany({ where: { status: "NEW" as LeadStatus } });
  revalidatePath("/crm/leads");
}
