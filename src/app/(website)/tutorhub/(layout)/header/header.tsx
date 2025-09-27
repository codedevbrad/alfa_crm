'use client';

import { Calendar, Users,  MessageSquare, BookOpen, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import DarkModeToggle from "@/components/custom/darkmode"

import { useCurrentTime } from '../../hooks/hook.usetime'

import { getInitials , getGreeting , getGreetingEmoji } from '../../utils'

import ProfileDropdown from './sub.dropdown'
import TutorSetupChecklist from '../../components/setup.requirements'


// Action Buttons Component
const ActionButtons = () => (
  <div className="flex items-center space-x-2">
    <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
      <Calendar className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
      <MessageSquare className="h-5 w-5" />
    </Button>
  </div>
);


// Background Component
const HeaderBackground = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10">
      <div 
        className="absolute inset-0 opacity-50 dark:opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
    </div>
  </>
);


// Logo Component
const TutorLogo = () => (
  <div className="flex items-center space-x-4">
    <div className="relative">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
        <BookOpen className="h-7 w-7 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
    </div>
    <div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        CodeBootcamp 
      </h1>
    </div>
  </div>
);


// Status Section Component
interface StatusSectionProps {
  currentTime: Date | null;
  isClient: boolean;
}

const StatusSection = ({ currentTime, isClient }: StatusSectionProps) => (
  <div className="flex items-center space-x-8">
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-sm font-medium text-foreground">Online & Ready</span>
    </div>
    
    {isClient && currentTime && (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
      </div>
    )}
    
    <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
      <Calendar className="h-4 w-4" />
      <span>Next: <strong className="text-foreground">Physics Tutoring</strong> at 3:00 PM</span>
    </div>
  </div>
);

// Quick Actions Component
const QuickActions = () => (
  <div className="flex items-center space-x-3">
    <Button 
      size="sm" 
      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
    >
      <Users className="mr-2 h-4 w-4" />
      Start New Session
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      className="border-2 hover:bg-accent transition-all duration-300"
    >
      <Calendar className="mr-2 h-4 w-4" />
      Schedule
    </Button>
  </div>
);

// Secondary Bar Component
interface SecondaryBarProps {
  currentTime: Date | null;
  isClient: boolean;
}

const SecondaryBar = ({ currentTime, isClient }: SecondaryBarProps) => (
  <div className="relative bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-14">
        <StatusSection currentTime={currentTime} isClient={isClient} />
        <QuickActions />
      </div>
    </div>
  </div>
);

// Main Header Content Component

const MainHeader = () => (
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-20">
      <div className="flex items-center space-x-6">
        <TutorLogo />
      </div>

      <div className="flex items-center space-x-3">
        <TutorSetupChecklist />
        <ActionButtons />
        <ProfileDropdown />
        <DarkModeToggle />
      </div>
    </div>
  </div>
);


// Main Component
export default function AnimatedTutorHeader({  }) {
  const { currentTime, isClient } = useCurrentTime();

  return (
    <header className="relative bg-background border-b border-border shadow-lg overflow-hidden">
      <HeaderBackground />
      <MainHeader  />
      <SecondaryBar currentTime={currentTime} isClient={isClient} />
    </header>
  );
}


// Export individual components for reuse
export {
  HeaderBackground,
  TutorLogo,
  ActionButtons,
  ProfileDropdown,
  StatusSection,
  QuickActions,
  SecondaryBar,
  MainHeader,
  useCurrentTime,
  getInitials,
  getGreeting,
  getGreetingEmoji
};