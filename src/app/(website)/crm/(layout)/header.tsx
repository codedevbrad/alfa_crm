import HeaderLogo from '@/components/app/app'
import Profile from "../authflow/profile/profile"
import DarkModeToggle from '@/components/custom/darkmode'


export default function Header() {
  return (
    <header className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
      
      <div className="relative mx-auto px-6 py-4">
        <div className="flex flex-row items-center justify-between">

          {/* Left */}
           <div className="flex items-center gap-3">
                   <HeaderLogo url="/" />
                   <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                     Alfa <span className="font-normal">CRM</span>
                   </h1>
                 </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Profile />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </header>
  )
}