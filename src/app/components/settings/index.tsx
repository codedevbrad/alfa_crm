'use client'

import React, { useState } from "react"
import { 
  Settings, 
  Globe, 
  Database, 
  Key, 
  Server, 
  Users, 
  BookOpen,
  Code,
  Activity,
  RefreshCw,
  Trash2,
  Play,
  Bug
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function BootcampSettings ( ) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Environment checks
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const nodeEnv = process.env.NODE_ENV
  const hasDatabase = !!process.env.DATABASE_URL
  const hasAuthSecret = !!process.env.AUTH_SECRET
  const hasGithubAuth = !!(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)
  
  // Calculate setup completion
  const setupChecks = [
    { name: 'Site URL', status: !!siteUrl },
    { name: 'Database', status: hasDatabase },
    { name: 'Auth Secret', status: hasAuthSecret },
    { name: 'GitHub OAuth', status: hasGithubAuth },
  ]
  const completionPercentage = (setupChecks.filter(check => check.status).length / setupChecks.length) * 100

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                       hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 
                       text-white border-0 transition-all duration-300 hover:scale-110 group"
          >
            <Settings className="h-7 w-7 group-hover:rotate-90 transition-transform duration-300" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-96 p-0 mr-4 mb-4" 
          side="top" 
          align="end"
          sideOffset={15}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Bootcamp Hub</h3>
                <p className="text-sm text-muted-foreground">Development environment controls</p>
              </div>
            </div>

            {/* Setup Progress */}
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Setup Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <Tabs defaultValue="status" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="status" className="text-xs">Status</TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
                <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
              </TabsList>

              {/* Status Tab */}
              <TabsContent value="status" className="space-y-3 mt-4">
                {/* Site URL */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Site URL</span>
                      {siteUrl ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          ✓ Set
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Missing</Badge>
                      )}
                    </div>
                    {siteUrl && (
                      <a
                        href={siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 break-all"
                      >
                        {siteUrl}
                      </a>
                    )}
                  </div>
                </div>

                {/* Environment & Database */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Server className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Environment</span>
                    </div>
                    <Badge 
                      variant={nodeEnv === 'production' ? 'default' : 'secondary'}
                      className={nodeEnv === 'production' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
                    >
                      {nodeEnv || 'development'}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Database</span>
                    </div>
                    {hasDatabase ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        ✓ Connected
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Not configured</Badge>
                    )}
                  </div>
                </div>

                {/* Auth Status */}
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Authentication</span>
                    {hasAuthSecret && hasGithubAuth ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 ml-auto">
                        ✓ Ready
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="ml-auto">Incomplete</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Auth Secret:</span>
                      <span className={hasAuthSecret ? 'text-green-600' : 'text-red-600'}>
                        {hasAuthSecret ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GitHub OAuth:</span>
                      <span className={hasGithubAuth ? 'text-green-600' : 'text-red-600'}>
                        {hasGithubAuth ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-2">
                    <Activity className="h-3 w-3" />
                    View Logs
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-2">
                    <RefreshCw className="h-3 w-3" />
                    Clear Cache
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-2">
                    <Database className="h-3 w-3" />
                    Test DB
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-2">
                    <Play className="h-3 w-3" />
                    Restart
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-2">
                    <Code className="h-3 w-3" />
                    API Test
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-2">
                    <Bug className="h-3 w-3" />
                    Debug Mode
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Scripts</h4>
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      npm run test:cascade
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      npm run setup:tutor
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      npm run scrub:students
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Data Tab */}
              <TabsContent value="data" className="space-y-3 mt-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Users className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                    <div className="text-lg font-bold text-blue-700">0</div>
                    <div className="text-xs text-blue-600">Students</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <BookOpen className="h-5 w-5 mx-auto text-green-500 mb-1" />
                    <div className="text-lg font-bold text-green-700">0</div>
                    <div className="text-xs text-green-600">Tutors</div>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Settings className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                    <div className="text-lg font-bold text-purple-700">0</div>
                    <div className="text-xs text-purple-600">Admins</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-600">Danger Zone</h4>
                  <div className="space-y-1">
                    <Button variant="outline" size="sm" className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-3 w-3 mr-2" />
                      Scrub Test Users
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-3 w-3 mr-2" />
                      Reset Database
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t text-center">
              <p className="text-xs text-muted-foreground">
                🎓 Bootcamp Development Environment
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}