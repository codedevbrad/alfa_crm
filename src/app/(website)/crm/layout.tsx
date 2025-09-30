import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./(layout)/sidebar"

import Header from "./(layout)/header"

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
    </SidebarProvider>
  )
}