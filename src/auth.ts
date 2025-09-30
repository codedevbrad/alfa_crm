/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.ts (NextAuth v5 config)

export const runtime = "nodejs"; // <-- Important for Prisma

import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import type { UserRole } from "@prisma/client";

// ---- Module augmentation ----
declare module "next-auth" {
  interface Session {
    provider?: string;
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    role?: UserRole;
  }
}

// ---- Diagnostics (optional) ----
console.log("🔧 Auth.ts: Initializing NextAuth configuration");
console.log("🔧 Environment check:", {
  hasAuthSecret: !!process.env.AUTH_SECRET,
  hasGithubId: !!process.env.AUTH_GITHUB_ID,
  hasGithubSecret: !!process.env.AUTH_GITHUB_SECRET,
  hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
  hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
});

// ---- Config ----
const config: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          response_type: "code",
          access_type: "offline",
        },
      },
    }),
  ],

  callbacks: {
    // Keep JWT.role in sync with DB; also carry provider/accessToken
    async jwt({ token, user, account }) {
      const userId = user?.id ?? token.sub ?? null;

      try {
        if (userId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
          });
          token.role = dbUser?.role ?? (token.role as UserRole | undefined);
        }
      } catch (err) {
        console.error("🎫 JWT role refresh failed:", err);
        // keep previous token.role unchanged if DB is down
      }

      if (account) {
        token.provider = account.provider;
        if (account.access_token) token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      // Ensure session.user exists before mutation (it always should with NextAuth)
      if (!session.user) {
        session.user = { id: token.sub ?? "" } as any;
      }

      session.provider = token.provider as string | undefined;
      session.accessToken = token.accessToken as string | undefined;
      session.user.id = token.sub ?? session.user.id;
      session.user.role = token.role as UserRole | undefined;

      return session;
    },
  },

  events: {
    async signIn(message) {
      console.log("📧 Event: signIn", JSON.stringify(message, null, 2));
    },
    async signOut(message) {
      console.log("📧 Event: signOut", JSON.stringify(message, null, 2));
    },
    async createUser({ user }) {
      console.log("📧 Event: createUser", user.id);
    },
    async updateUser(message) {
      console.log("📧 Event: updateUser", JSON.stringify(message, null, 2));
    },
    async linkAccount(message) {
      console.log("📧 Event: linkAccount", JSON.stringify(message, null, 2));
    },
    async session() {
      console.log("📧 Event: session");
    },
  },

  debug: process.env.NODE_ENV === "development",
};

// Export handlers & helpers
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);

console.log("✅ Auth.ts: NextAuth configuration complete");