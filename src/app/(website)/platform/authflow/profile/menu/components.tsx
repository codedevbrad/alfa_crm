"use client"
import { User } from "lucide-react"
import { LogOut } from "lucide-react"
import { signOutAction } from "./actions"
import Image from "next/image"

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex items-center gap-2 rounded-md bg-gray-500 px-3 py-1 text-white hover:bg-gray-600 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </form>
  )
}


interface UserAvatarProps {
  image?: string | null
  name?: string | null
}


export function UserAvatar({ image, name }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      {image ? (
        <Image 
          src={image} 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
          width={30}
          height={30}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}