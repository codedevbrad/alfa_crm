import { auth } from "@/auth" 
import ProfileMenu from "./menu/profile.menu"

export default async function Profile ( ) {
  
  const session = await auth()
  const user = session?.user ?? null

  return (
   <ProfileMenu
    user={
      user
        ? {
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
            role: user.role, // may be undefined; ok per type
          }
        : null
    }
  />
  )
}
