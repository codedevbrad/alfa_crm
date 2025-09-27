import Link from "next/link"
import { auth , signOut } from "@/auth"
import Image from "next/image"
import DarkModeToggle from "@/components/custom/darkmode"
import { Button } from "@/components/ui/button"
import HeaderLogo from "@/components/app/app"

export default async function Header() {
  const session = await auth()

  return (
    <header className="py-3 w-full bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="text-lg font-bold flex flex-row items-center gap-2">
           <HeaderLogo url={"/"} />
           <div className="text-2xl font-bold"> <h1> Code Bootcamp </h1> </div>
        </div>

        {/* Right side */}
        <div className="flex flex-row gap-4">
          <DarkModeToggle />
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "user avatar"}
                  className="h-8 w-8 rounded-full"
                  width={30} height={30}
                />
              )}
              <span className="text-sm">{session.user?.name ?? session.user?.email}</span>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link href={`/auth/rolecheck`}>
                <Button> Go to Platform </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}