// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth" // NextAuth v5 helper

export default auth(async (req: NextRequest) => {
  const { nextUrl } = req
  const session = req.auth

  // If not signed in, redirect to login with callback
  if (!session?.user) {
    const signInUrl = new URL("/auth/login", nextUrl)
    signInUrl.searchParams.set("callbackUrl", nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  // Signed in → allow access
  return NextResponse.next()
})

// Apply only to /crm
export const config = {
  matcher: ["/crm/:path*"],
}
