/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
declare module "next-auth" {
  // Extend the session object returned by `auth()` / `useSession()`
  interface Session {
    user: {
      id?: string
      role?: string
    } & DefaultSession["user"]

    provider?: string
    accessToken?: string
  }

  // Extend the user type if you want to save things in the DB
  interface User {
    id: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  // Extend the JWT payload
  interface JWT {
    id?: string
    role?: string
    provider?: string
    accessToken?: string
  }
}
