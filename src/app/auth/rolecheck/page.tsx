import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/generated/prisma"

export const dynamic = "force-dynamic"

export default async function RoleRedirect() {
    const session = await auth()
    console.log("Session in role redirect:", session)
    if (!session?.user) {
      redirect("/auth/login")
    }
    if (session.user.role === UserRole.TUTOR) redirect("/tutorhub")
    redirect("/platform")
}
