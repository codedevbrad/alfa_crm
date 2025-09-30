/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs" // Prisma needs Node runtime

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { Prisma, LeadStatus } from "@prisma/client"
import { z } from "zod"

// Accept number or string for amount
const AmountSchema = z
  .union([z.number(), z.string()])
  .transform((v) => (v === "" ? undefined : v))
  .optional()

const CreateLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  service: z.string().optional(),
  amount: AmountSchema, // will convert below
  source: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional().default(LeadStatus.NEW),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const input = CreateLeadSchema.parse(body)

    const data = {
      name: input.name,
      company: input.company ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      service: input.service ?? null,
      amount:
        input.amount !== undefined && input.amount !== null
          ? new Prisma.Decimal(input.amount as any)
          : null,
      source: input.source ?? null,
      status: input.status ?? LeadStatus.NEW,
      notes: input.notes ?? null,
    } satisfies Prisma.LeadCreateInput

    const lead = await prisma.lead.create({ data })

    return NextResponse.json(lead, { status: 201 })
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", issues: err.issues },
        { status: 400 }
      )
    }
    console.error("Create lead error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
