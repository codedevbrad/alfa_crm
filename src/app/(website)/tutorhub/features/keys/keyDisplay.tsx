// features/keys/keyDisplay.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings, Calendar, Video, Github, Zap, MessageSquare, Database, Mail,
  CheckCircle2, AlertCircle, ChevronRight, X
} from 'lucide-react'
import { cn } from "@/lib/utils"
import CapturingCalendarKey from './calendar/calendar.ui'

type ServiceStatus = { service: string; hasKeys: boolean; metadata?: any }

const AVAILABLE_SERVICES = [
  { id: 'calendar', name: 'Google Calendar', description: 'Sync and manage your calendar events',
    icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-950/20',
    component: CapturingCalendarKey },
  { id: 'zoom', name: 'Zoom', description: 'Create and manage video meetings',
    icon: Video, color: 'text-blue-500', bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-950/20',
    component: null },
  { id: 'github', name: 'GitHub', description: 'Access repositories and code',
    icon: Github, color: 'text-gray-800', bgColor: 'bg-gray-50', darkBgColor: 'dark:bg-gray-800/20',
    component: null },
  { id: 'openai', name: 'OpenAI', description: 'AI completions and embeddings',
    icon: Zap, color: 'text-green-600', bgColor: 'bg-green-50', darkBgColor: 'dark:bg-green-950/20',
    component: null },
  { id: 'slack', name: 'Slack', description: 'Send messages and notifications',
    icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-50', darkBgColor: 'dark:bg-purple-950/20',
    component: null },
  { id: 'notion', name: 'Notion', description: 'Access and update databases',
    icon: Database, color: 'text-gray-700', bgColor: 'bg-gray-50', darkBgColor: 'dark:bg-gray-800/20',
    component: null },
  { id: 'sendgrid', name: 'SendGrid', description: 'Send transactional emails',
    icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-950/20',
    component: null },
];

export function APIKeysModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [selectedService, setSelectedService] = useState('calendar')
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  // esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  // body scroll lock
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // mock statuses
  useEffect(() => {
    if (!open) return
    setServiceStatuses([
      { service: 'calendar', hasKeys: true },
      { service: 'zoom', hasKeys: false },
      { service: 'github', hasKeys: false },
      { service: 'openai', hasKeys: false },
      { service: 'slack', hasKeys: false },
      { service: 'notion', hasKeys: false },
      { service: 'sendgrid', hasKeys: false },
    ])
  }, [open])

  if (!open) return null

  const selectedServiceConfig = AVAILABLE_SERVICES.find(s => s.id === selectedService)

  const ComingSoonComponent = ({ serviceName }: { serviceName: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{serviceName} Integration</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
        This integration is coming soon. We&apos;re working on adding support for {serviceName} API keys.
      </p>
      <Button variant="outline" className="mt-4" disabled>Coming Soon</Button>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center"
      // close when clicking the backdrop
      onMouseDown={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        ref={panelRef}
        className="relative bg-white dark:bg-gray-950 rounded-lg shadow-xl max-w-5xl w-full mx-4 h-[80vh] flex flex-col border border-gray-200 dark:border-gray-800"
        // stop backdrop close when clicking inside panel
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Keys Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure and manage your API integrations securely
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* body */}
        <div className="flex flex-1 overflow-hidden">
          {/* left */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-sm font-medium mb-3">Available Services</h3>
                <div className="space-y-1">
                  {AVAILABLE_SERVICES.map((service) => {
                    const Icon = service.icon
                    const status = serviceStatuses.find(s => s.service === service.id)
                    const isSelected = selectedService === service.id
                    const hasKeys = !!status?.hasKeys
                    return (
                      <Button
                        key={service.id}
                        variant={isSelected ? "secondary" : "ghost"}
                        className={cn("w-full justify-start h-auto p-3 text-left", isSelected && "bg-white dark:bg-gray-800 shadow-sm")}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", service.bgColor, service.darkBgColor)}>
                            <Icon className={cn("w-4 h-4", service.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">{service.name}</p>
                              {hasKeys ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{service.description}</p>
                          </div>
                          {isSelected && <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status Overview</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span>Connected</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {serviceStatuses.filter(s => s.hasKeys).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Available</span>
                    <Badge variant="outline">{AVAILABLE_SERVICES.length}</Badge>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* right */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {selectedServiceConfig?.component
                  ? <selectedServiceConfig.component />
                  : <ComingSoonComponent serviceName={selectedServiceConfig?.name || 'This Service'} />}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
