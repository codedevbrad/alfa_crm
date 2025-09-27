'use client'

import { TutorProfile, User } from '@/generated/prisma'
import { useState } from 'react'
import { Calendar, Users, TrendingUp, Settings, DollarSign, BarChart3 } from 'lucide-react' 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import OverviewTab from './dash.overview'
import ProfileTab from './dash.profiletab'
import SessionsTab from './dash.sessions'
import StudentsTab from './dash.students'

interface TutorDashboardProps {
  tutor: User & {
    tutorProfile: TutorProfile | null;
    accounts: any[];
  };
  tutorProfile: TutorProfile;
}

function EarningsTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
        Earnings
      </h3>
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-lg font-medium">Earnings tracking will be implemented here</p>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-gray-600" />
        Settings
      </h3>
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="h-8 w-8 text-gray-500" />
        </div>
        <p className="text-lg font-medium">Settings panel will be implemented here</p>
      </div>
    </div>
  );
}


export default function TutorDashboard({ tutor, tutorProfile }: TutorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getInitials = (name: string | null) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="relative bg-card border border-border rounded-xl shadow-lg mb-8 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>

          <div className="relative px-6 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={tutor.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
                      {getInitials(tutor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-background"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome back, {tutor.name?.split(' ')[0] || 'Tutor'}! 👋
                  </h1>
                  <p className="text-muted-foreground text-lg">Tutor Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center">
                    <DollarSign className="h-6 w-6 mr-1" />
                    {tutorProfile.hourlyRate || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}

          <div className="relative px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'profile' , label: 'Profile', icon: Users },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'earnings', label: 'Earnings', icon: TrendingUp },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab tutor={tutor} tutorProfile={tutorProfile} />}
          {activeTab === 'profile' && <ProfileTab tutor={tutor} tutorProfile={tutorProfile} />}
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'sessions' && <SessionsTab />}
          {activeTab === 'earnings' && <EarningsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}