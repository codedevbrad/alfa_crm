"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  Calculator,
  Boxes,
  CreditCard,
  FileText,
  CalendarClock,
  BarChart3,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { title: "Dashboard",          url: "/crm",             icon: LayoutDashboard },
  { title: "CRM & Leads",        url: "/crm/leads",       icon: Users },
  { title: "Projects & Jobs",    url: "/crm/projects",    icon: Briefcase },
  { title: "Timesheets",         url: "/crm/timesheets",  icon: Clock },
  { title: "Cost Estimator",     url: "/crm/estimator",   icon: Calculator },
  { title: "Products",           url: "/crm/products",    icon: Boxes },
  { title: "Finance & Payments", url: "/crm/finance",     icon: CreditCard },
  { title: "Quoting",            url: "/crm/quoting",     icon: FileText },
  { title: "Scheduling",         url: "/crm/scheduling",  icon: CalendarClock },
  { title: "Analytics",          url: "/crm/analytics",   icon: BarChart3 },
  { title: "Admin",              url: "/crm/admin",       icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-2 text-sm font-semibold tracking-tight">
          Alfa CRM
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, url, icon: Icon }) => {
                const active = pathname === url || pathname.startsWith(url + "/")
                return (
                  <SidebarMenuItem key={url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={url} className={cn(active && "text-primary")}>
                        <Icon className="h-4 w-4" />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground">
          v0.1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
