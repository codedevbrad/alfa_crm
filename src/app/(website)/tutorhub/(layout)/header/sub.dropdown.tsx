"use client"
import { useState } from 'react' 
import { 
  Users, 
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  Award,
  KeyRound,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from '../../utils'

import { APIKeysModal } from '../../features/keys/keyDisplay'


export default function ProfileDropdown() {
  const [apiKeysOpen, setApiKeysOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-3 h-12 cursor-pointer hover:bg-accent transition-colors"
          >
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={ undefined} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                  {getInitials('John Doe')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-background" />
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-2">
          
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:bg-blue-50 dark:hover:bg-blue-950/50"
            onSelect={() => setApiKeysOpen(true)}
          >
            <KeyRound className="mr-3 h-4 w-4" />
            <span>API Keys</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-950/50">
            <Settings className="mr-3 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-green-50 dark:hover:bg-green-950/50">
            <TrendingUp className="mr-3 h-4 w-4" />
            <span>Performance Analytics</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-950/50">
            <Users className="mr-3 h-4 w-4" />
            <span>My Students</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-yellow-50 dark:hover:bg-yellow-950/50">
            <Award className="mr-3 h-4 w-4" />
            <span>Achievements</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50">
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mounted outside the dropdown so it stays up after the menu closes */}
      <APIKeysModal open={apiKeysOpen} onOpenChange={setApiKeysOpen} />
    </>
  )
}
