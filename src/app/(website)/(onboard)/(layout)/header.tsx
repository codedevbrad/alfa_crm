// app/components/layout/Header.tsx (server component)

import Link from "next/link"
import Image from "next/image"
import { auth, signOut } from "@/auth"
import DarkModeToggle from "@/components/custom/darkmode"
import { Button } from "@/components/ui/button"
import HeaderLogo from "@/components/app/app"

export default async function Header() {
  const session = await auth()

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

          {session ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name ?? session.user?.email ?? "User"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="sr-only">User</span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm">
                  {session.user?.name ?? session.user?.email ?? "Signed in"}
                </span>
              </div>

              {/* Sign out (server action) */}
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <Button type="submit" variant="destructive" size="sm" aria-label="Sign out">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/rolecheck" aria-label="Go to platform">
                Go to CRM
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
