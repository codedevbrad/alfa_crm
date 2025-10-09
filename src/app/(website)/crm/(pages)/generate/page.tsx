"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, Wrench } from "lucide-react";

export default function Page() {
  const reports = [
    {
      title: "Risk Assessment and Method Statement (RAMS)",
      desc: "Auto-generate a detailed safety and risk assessment for your project site.",
      icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
      href: "/crm/generate/health/new",
      btn: "Generate Safety Report",
    },
    {
      title: "Pipefitting RAMS",
      desc: "Method Statement and Risk Assessment for pipe installation and welding.",
      icon: <Wrench className="w-10 h-10 text-blue-600" />,
      href: "/crm/generate/rams/456",
      btn: "View RAMS Template",
    },
    {
      title: "Hot Work Permit",
      desc: "Generate a hot work permit checklist and fire safety form for welding operations.",
      icon: <FileText className="w-10 h-10 text-orange-500" />,
      href: "/crm/generate/hotwork/789",
      btn: "Create Hot Work Form",
    },
  ];

  return (
    <section className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Generate Site Reports</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-col items-center text-center space-y-3">
              {r.icon}
              <CardTitle>{r.title}</CardTitle>
              <CardDescription>{r.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href={r.href}>
                <Button className="mt-2" variant="default">
                  {r.btn}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
