// middleware.ts
import { NextResponse } from "next/server"
import { auth } from "@/auth" // your re-export from NextAuth config
import type { NextRequest } from "next/server"

export default auth(async (req: NextRequest) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const session = req.auth // session decoded by Auth.js

  const isStudentArea = pathname.startsWith("/platform")
  const isTutorArea   = pathname.startsWith("/tutorHub")

  // If not signed in, bounce to sign-in with a callbackUrl
  if (!session?.user) {
    const signInUrl = new URL("/api/auth/signin", nextUrl)
    signInUrl.searchParams.set("callbackUrl", nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  const role = session.user.role

    // middleware.ts (excerpt)
    if (isStudentArea && role !== "STUDENT") {
    const errorUrl = new URL("/auth/unauthorized", nextUrl)
    errorUrl.searchParams.set("reason", "student-access-required")
    return NextResponse.redirect(errorUrl)
    }

    if (isTutorArea && role !== "TUTOR") {
    const errorUrl = new URL("/auth/unauthorized", nextUrl)
    errorUrl.searchParams.set("reason", "tutor-access-required")
    return NextResponse.redirect(errorUrl)
    }


  // Everything else → allow...
  return NextResponse.next()
})

// Configure which routes middleware applies to....
export const config = {
  matcher: [
    "/platform/:path*",
    "/tutorHub/:path*",
  ],
}