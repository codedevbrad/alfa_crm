"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"


export default function DarkModeToggle ( ) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = (theme ?? resolvedTheme) === "dark"

  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}