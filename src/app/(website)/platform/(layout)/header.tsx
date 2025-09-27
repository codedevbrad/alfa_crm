import { bootcampLogoRedirect } from "@/flows"
import HeaderLogo from '@/components/app/app'
import Profile from "../authflow/profile/profile"
import SubscriptionModal from "../authflow/subscription/subscription.modal"

export default function Header() {
  return (
    <header className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
      
      <div className="relative mx-auto px-6 py-4">
        <div className="flex flex-row items-center justify-between">

          {/* Left */}
          <div className="flex flex-row items-center gap-6">
              <div className="relative">
                <HeaderLogo url={bootcampLogoRedirect} />
              </div>

              <nav className="hidden lg:flex items-center space-x-8">
                {/* links… */}
                <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group">
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                </a>
                <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group">
                  Courses
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                </a>
                <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group">
                  Tutoring
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                </a>
              </nav>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
              <SubscriptionModal />
              <Profile />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </header>
  )
}