// app/components/layout/Header.tsx (server component)

import Link from "next/link"
import DarkModeToggle from "@/components/custom/darkmode"
import { Button } from "@/components/ui/button"
import HeaderLogo from "@/components/app/app"

export default async function Header() {

  return (
    <header className="w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <HeaderLogo url="/" />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Alfa <span className="font-normal">CRM</span>
          </h1>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
         
          <Button asChild size="sm">
            <Link href="/auth/rolecheck" aria-label="Go to platform">
              Go to CRM
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
