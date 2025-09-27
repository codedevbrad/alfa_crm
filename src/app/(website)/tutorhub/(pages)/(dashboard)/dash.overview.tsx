// Overview Tab Component
import { Calendar, BookOpen, Clock, DollarSign, Star, Activity, Eye, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button";

export default function OverviewTab({ }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Enhanced Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-xs text-green-600 font-medium">+0% from last month</p>
            </div>
          </div>
        </div>

        <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-3xl font-bold text-foreground">$0</p>
              <p className="text-xs text-green-600 font-medium">Ready to start!</p>
            </div>
          </div>
        </div>

        <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10"></div>
          <div className="relative flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Rating</p>
              <p className="text-3xl font-bold text-foreground">5.0</p>
              <p className="text-xs text-yellow-600 font-medium">Perfect start!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
        <div className="relative">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
            <Button variant="outline" className="w-full border-2 hover:bg-accent transition-all duration-300">
              <Clock className="mr-2 h-4 w-4" />
              Update Availability
            </Button>
            <Button variant="outline" className="w-full border-2 hover:bg-accent transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Recent Activity
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-lg font-medium">No recent activity</p>
          <p className="text-sm">Your sessions and updates will appear here</p>
        </div>
      </div>
    </div>
  );
}
