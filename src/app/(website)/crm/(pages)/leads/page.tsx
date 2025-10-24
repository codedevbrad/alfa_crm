// app/crm/leads/page.tsx
export const runtime = "nodejs";

import { prisma } from "@/lib/db/prisma";
import { LeadStatus, Prisma, LeadFrom } from "@prisma/client";
import Link from "next/link";

const GBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const DTF = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "QUOTED",
  "WON",
  "IN_PROGRESS",
  "COMPLETED",
  "LOST",
];

function isLeadStatus(val: string): val is LeadStatus {
  return (STATUS_ORDER as string[]).includes(val);
}
const TYPE_ORDER: LeadFrom[] = ["MONTON", "LASER"];
function isLeadFrom(val: string): val is LeadFrom {
  return (TYPE_ORDER as string[]).includes(val);
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, string> = {
    NEW: "bg-blue-100 text-blue-700",
    QUOTED: "bg-yellow-100 text-yellow-800",
    WON: "bg-emerald-100 text-emerald-700",
    IN_PROGRESS: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-slate-100 text-slate-700",
    LOST: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${map[status]}`}>
      {status.toLowerCase().replace("_", " ")}
    </span>
  );
}
function TypeBadge({ type }: { type: LeadFrom }) {
  const map: Record<LeadFrom, string> = {
    MONTON: "bg-black text-white",
    LASER: "bg-sky-100 text-sky-800",
  };
  return <span className={`px-2 py-0.5 text-xs rounded-full ${map[type]}`}>{type}</span>;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const statusParam = typeof sp.status === "string" ? sp.status : undefined;
  const status = statusParam && isLeadStatus(statusParam) ? statusParam : undefined;
  const service = typeof sp.service === "string" ? sp.service : undefined;
  const typeParam = typeof sp.type === "string" ? sp.type : undefined;
  const type = typeParam && isLeadFrom(typeParam) ? typeParam : undefined;

  // Single WHERE used for both the list and analytics (scoped to current filters)
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
    ...(type && { type }),
  };

  // ONE FETCH ONLY
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    // remove take limit so analytics are complete for the filtered set
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
      updatedAt: true,
      type: true,
    },
  });

  // Derive services list from fetched set
  const services = Array.from(new Set(leads.map((l) => l.service).filter(Boolean) as string[])).sort();

  // Status KPIs from the fetched set
  const totalsMap = new Map<LeadStatus, { count: number; sum: number }>();
  for (const s of STATUS_ORDER) totalsMap.set(s, { count: 0, sum: 0 });
  for (const l of leads) {
    const t = totalsMap.get(l.status)!;
    t.count += 1;
    if (l.amount != null) t.sum += Number(l.amount);
  }

  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const d7 = new Date(now); d7.setDate(now.getDate() - 7);
  const d30 = new Date(now); d30.setDate(now.getDate() - 30);

  // Quotes analytics (status === QUOTED)
  const quoted = leads.filter((l) => l.status === "QUOTED");
  const quotedAllCount = quoted.length;
  const quotedAllAvg =
    quotedAllCount > 0
      ? quoted.reduce((acc, l) => acc + Number(l.amount ?? 0), 0) / quotedAllCount
      : 0;

  // Use updatedAt windows so a lead quoted *today* shows up even if created earlier
  const quoted7Count = quoted.filter((l) => l.updatedAt >= d7).length;
  const quoted30Count = quoted.filter((l) => l.updatedAt >= d30).length;

  // New incoming analytics (createdAt windows)
  const newTodayCount = leads.filter((l) => l.createdAt >= startOfToday).length;
  const new7Count = leads.filter((l) => l.createdAt >= d7).length;
  const new30Count = leads.filter((l) => l.createdAt >= d30).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CRM &amp; Leads</h1>
        <p className="text-sm text-muted-foreground">
          Manage your sales pipeline and customer relationships
        </p>
      </div>

      {/* Filters */}
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

        <select name="type" defaultValue={type ?? ""} className="h-10 rounded-md border px-3 text-sm">
          <option value="">All Types</option>
          {TYPE_ORDER.map((t) => (
            <option key={t} value={t}>
              {t}
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

      {/* KPI cards (from one fetch) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUS_ORDER.map((s) => {
          const t = totalsMap.get(s)!;
          return (
            <div key={s} className="rounded-xl border bg-card p-4 text-card-foreground">
              <div className="text-2xl font-bold">{t.count}</div>
              <div className="text-sm capitalize text-muted-foreground">
                {s.toLowerCase().replace("_", " ")}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {GBP.format(t.sum)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics — Quotes + New Incoming (derived from same array) */}
      <div className="rounded-xl border bg-card p-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold mb-2">Quotes</div>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-xs text-muted-foreground">QUOTED (all time)</div>
              <div className="text-lg font-semibold">{quotedAllCount}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">QUOTED (last 7d)</div>
              <div className="text-lg font-semibold">{quoted7Count}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">QUOTED (last 30d)</div>
              <div className="text-lg font-semibold">{quoted30Count}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg Quoted Amount</div>
              <div className="text-lg font-semibold">{GBP.format(quotedAllAvg || 0)}</div>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            * QUOTED windows use <code>updatedAt</code> so status changes today are included.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold mb-2">New Incoming</div>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-xs text-muted-foreground">Today</div>
              <div className="text-lg font-semibold">{newTodayCount}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last 7d</div>
              <div className="text-lg font-semibold">{new7Count}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last 30d</div>
              <div className="text-lg font-semibold">{new30Count}</div>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            * New incoming uses <code>createdAt</code>.
          </p>
        </div>
      </div>

      {/* Leads list */}
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b text-sm text-muted-foreground">Leads ({leads.length})</div>

        <div className="divide-y">
          {leads.map((l) => (
            <div key={l.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{l.name}</div>
                    <TypeBadge type={l.type} />
                  </div>
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

              <div className="mt-2 text-xs text-muted-foreground">
                Received: {DTF.format(new Date(l.createdAt))}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {l.service && <span className="rounded-full bg-muted px-2 py-0.5">{l.service}</span>}
                {l.amount != null && (
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    {GBP.format(Number(l.amount))}
                  </span>
                )}
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
  );
}
