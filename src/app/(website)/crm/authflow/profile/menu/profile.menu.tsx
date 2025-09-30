// components/auth/profile.menu.tsx
'use client'

import { LogOut, UserCircle} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { signInWithGithub, signOutAction } from "./actions"
import { User } from "@prisma/client"




function ProfileAvatar ( { user } : { user: User } ) {
    
  // Signed in → Avatar + ShadCN dropdown ...
  const initials = user.name?.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "U"

  return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-primary/15">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Name (hide on small screens) */}
          <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
          <span className="hidden sm:inline text-sm font-medium bg-blue-600 text-white py-1.5 px-3 rounded-md">
            {user.role.toLocaleLowerCase()}
          </span>
        </div>
  )
}



export default function ProfileMenu({ user }: { user: User }) {
  
  // Signed in → Avatar + ShadCN dropdown ...
  const initials = user.name?.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "U";

  if (!user) {
    return (
      <form action={signInWithGithub}>
        <Button type="submit" className="gap-2">
          <Github className="h-4 w-4" />
          Sign in with GitHub
        </Button>
      </form>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 px-2 data-[state=open]:bg-accent"
        >
            <ProfileAvatar user={ user } />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name ?? "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign out via server action, inside the menu */}
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full flex items-center text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
