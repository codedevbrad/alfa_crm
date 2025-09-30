// app/crm/leads/page.tsx
export const runtime = "nodejs"

import { prisma } from "@/lib/db/prisma"
import { LeadStatus, Prisma } from "@prisma/client"
import Link from "next/link"

const GBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })

const STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "QUOTED",
  "WON",
  "IN_PROGRESS",
  "COMPLETED",
  "LOST",
]

function isLeadStatus(val: string): val is LeadStatus {
  return (STATUS_ORDER as string[]).includes(val)
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, string> = {
    NEW: "bg-blue-100 text-blue-700",
    QUOTED: "bg-yellow-100 text-yellow-800",
    WON: "bg-emerald-100 text-emerald-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-slate-100 text-slate-700",
    LOST: "bg-rose-100 text-rose-700",
  }
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${map[status]}`}>
      {status.toLowerCase().replace("_", " ")}
    </span>
  )
}

export default async function LeadsPage({
  searchParams,
}: {
  // 👇 Next 15: searchParams is a Promise
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = (await searchParams) ?? {}

  const q = typeof sp.q === "string" ? sp.q.trim() : ""
  const statusParam = typeof sp.status === "string" ? sp.status : undefined
  const status = statusParam && isLeadStatus(statusParam) ? statusParam : undefined
  const service = typeof sp.service === "string" ? sp.service : undefined

  // Build where clause
  const where: Prisma.LeadWhereInput = {
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
      ],
    }),
    ...(status && { status }),
    ...(service && { service }),
  }

  // Parallel queries
  const [leads, totalsByStatus] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        service: true,
        amount: true,
        source: true,
        status: true,
        notes: true,
        createdAt: true,
      },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { amount: true },
    }),
  ])

  const totalsMap = new Map<LeadStatus, { count: number; sum: Prisma.Decimal | null }>()
  totalsByStatus.forEach((t) => {
    totalsMap.set(t.status, { count: t._count._all, sum: t._sum.amount ?? null })
  })

  const services = Array.from(new Set(leads.map((l) => l.service).filter(Boolean) as string[])).sort()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CRM &amp; Leads</h1>
        <p className="text-sm text-muted-foreground">Manage your sales pipeline and customer relationships</p>
      </div>

      {/* Search + filters + Add Lead */}
      <form className="flex flex-wrap gap-3 items-center">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search leads…"
          className="h-10 w-full md:w-80 rounded-md border px-3 text-sm"
        />

        <select name="status" defaultValue={status ?? ""} className="h-10 rounded-md border px-3 text-sm">
          <option value="">All Status</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {s.toLowerCase().replace("_", " ")}
            </option>
          ))}
        </select>

        <select name="service" defaultValue={service ?? ""} className="h-10 rounded-md border px-3 text-sm">
          <option value="">All Services</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button type="submit" className="h-10 rounded-md border px-4 text-sm hover:bg-muted">
          Apply
        </button>

        <Link
          href="/crm/leads/new"
          className="ml-auto inline-flex h-10 items-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Add Lead
        </Link>
      </form>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUS_ORDER.map((s) => {
          const t = totalsMap.get(s)
          const count = t?.count ?? 0
          const sum = t?.sum ? GBP.format(Number(t.sum)) : GBP.format(0)
          return (
            <div key={s} className="rounded-xl border bg-card p-4 text-card-foreground">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm capitalize text-muted-foreground">{s.toLowerCase().replace("_", " ")}</div>
              <div className="mt-1 text-xs text-muted-foreground">{sum}</div>
            </div>
          )
        })}
      </div>

      {/* Leads list */}
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b text-sm text-muted-foreground">Leads ({leads.length})</div>

        <div className="divide-y">
          {leads.map((l) => (
            <div key={l.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{l.name}</div>
                  {l.company && <div className="text-xs text-muted-foreground">{l.company}</div>}
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {l.email && <span>📧 {l.email}</span>}
                    {l.phone && <span>📞 {l.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={l.status} />
                  <Link
                    href={`/crm/leads/${l.id}`}
                    className="inline-flex h-8 items-center rounded-md border px-3 text-xs hover:bg-muted"
                    title="View"
                  >
                    View
                  </Link>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {l.service && <span className="rounded-full bg-muted px-2 py-0.5">{l.service}</span>}
                {typeof l.amount === "object" || typeof l.amount === "number" ? (
                  <span className="rounded-full bg-muted px-2 py-0.5">{GBP.format(Number(l.amount ?? 0))}</span>
                ) : null}
                {l.source && <span className="rounded-full bg-muted px-2 py-0.5">Source: {l.source}</span>}
              </div>

              {l.notes && (
                <div className="mt-3 text-sm rounded-md bg-muted/50 p-3">
                  <span className="font-medium">Notes: </span>
                  {l.notes}
                </div>
              )}
            </div>
          ))}

          {leads.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No leads found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
