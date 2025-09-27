"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Calendar, Settings, Link as LinkIcon } from "lucide-react"

export default function TutorRequirements() {
  const [open, setOpen] = React.useState(false)

  const items = [
    {
      id: "add-calendar-api-keys",
      label: "Add Calendar API keys",
      hint: "Store provider credentials securely (env vars / secrets).",
      href: "/docs/calendar/keys",
    },
    {
      id: "setup-calendar",
      label: "Setup calendar",
      hint: "Choose provider, scopes and redirect URIs.",
      href: "/docs/calendar/setup",
    },
    {
      id: "set-availability",
      label: "Set weekly availability",
      hint: "Define slots, buffers, and lead time.",
      href: "/dashboard/availability",
    }
  ];

  const [state, setState] = React.useState<Record<string, boolean>>(() => Object.fromEntries(items.map((i) => [i.id, false])));

  const toggle = (id: string) => setState((prev) => ({ ...prev, [id]: !prev[id] }))

  const completed = Object.values(state).filter(Boolean).length
  const total = items.length
  const pct = Math.round((completed / Math.max(total, 1)) * 100)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Requirements
          <Badge
            variant={completed === total && total > 0 ? "default" : "secondary"}
            className="ml-1"
          >
            {completed}/{total}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" className="w-96 p-0">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Tutor Requirements</h3>
          </div>

          <div className="mt-3">
            <Progress value={pct} aria-label="Requirements progress" />
            <div className="mt-1 text-xs text-muted-foreground">
              {pct}% complete
            </div>
          </div>
        </div>

        <Separator />

        <div className="max-h-80 overflow-auto p-2">
          {items.map((item) => {
            const done = state[item.id]
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    toggle(item.id)
                  }
                }}
                className="w-full rounded-md p-2 text-left hover:bg-accent hover:text-accent-foreground outline-none"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={done}
                    onCheckedChange={() => toggle(item.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      {done && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                      {item.href && (
                        <a
                          href={item.href}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <LinkIcon className="h-3 w-3" />
                          Guide
                        </a>
                      )}
                    </div>
                    {item.hint && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.hint}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

        <div className="flex items-center justify-between p-3">
          <div className="text-xs text-muted-foreground">
            {completed === total ? "All set! ✅" : `${total - completed} remaining`}
          </div>
          <Button
            size="sm"
            onClick={() => setOpen(false)}
            variant={completed === total ? "default" : "secondary"}
          >
            {completed === total ? "Done" : "Close"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
