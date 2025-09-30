// app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs"            // Prisma needs Node
export { GET, POST } from "@/auth"         // re-export from your auth.t