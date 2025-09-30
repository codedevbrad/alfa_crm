// app/(layout)/auth-page.tsx
import BackToHome from "@/app/(website)/crm/authflow/back"
import LoginProviders from "./loginproviders"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 text-white relative">
      <BackToHome />

      {/* Left side — Value prop */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
        <div className="max-w-lg">
          <h1 className="text-4xl font-extrabold mb-6 leading-tight">
            Make <span className="text-sky-300">operations</span> our problem,
            <br />
            not yours.
          </h1>

          <p className="text-lg mb-8 text-indigo-100/90">
            Alfa CRM unifies projects, workers, timesheets, quotes, invoices, and scheduling—so you can run jobs end-to-end without spreadsheets or chaos.
          </p>

          <ul className="space-y-4 text-indigo-100">
            {[
              "Project tracking with costs, margins & change orders",
              "Worker scheduling, permissions & timesheets",
              "Quoting → Invoicing pipeline with approvals",
              "Integrations: Calendar, accounting, Zapier & webhooks",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 01.006 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3-3a1 1 0 111.415-1.415l2.293 2.293 6.793-6.793a1 1 0 011.408 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <p className="text-xs tracking-wider text-sky-300/90 uppercase mb-3">Works with</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-80">
              {["Google Calendar", "Xero", "QuickBooks", "Zapier", "Webhooks"].map((s) => (
                <span key={s} className="text-sm font-medium">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side — Auth card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 relative">
            <h2 className="text-2xl font-bold mb-2 text-center">Sign in to Alfa CRM</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Use your company email or a connected provider.
            </p>

            <LoginProviders />

            {/* Terms */}
            <p className="text-xs text-gray-500 mt-6 text-center">
              By continuing, you agree to the{" "}
              <a href="/terms" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* Small reassurance badges */}
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-indigo-100/80">
            <span className="px-2 py-1 rounded-full border border-white/10 bg-white/10">GDPR-ready</span>
            <span className="px-2 py-1 rounded-full border border-white/10 bg-white/10">SSO providers</span>
            <span className="px-2 py-1 rounded-full border border-white/10 bg-white/10">Role-based access</span>
          </div>
        </div>
      </div>
    </div>
  )
}
