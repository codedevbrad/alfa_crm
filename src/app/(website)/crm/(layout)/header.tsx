import { platformLogoRedirect } from "@/flows"
import HeaderLogo from '@/components/app/app'
import Profile from "../authflow/profile/profile"

function Link ( { link , label } : { link : string } & { label : string } ) {
  return (
    <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group">
      { label }
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
    </a>  
  )
}


function Nav ( ) {
  return (
        <nav className="hidden lg:flex items-center space-x-8">
          <Link link="/dashboard" label="Dashboard" />
        </nav>
  )
}


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
              <Profile />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </header>
  )
}