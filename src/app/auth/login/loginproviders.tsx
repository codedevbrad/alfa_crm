import { signIn } from "@/auth"
import { Github } from "lucide-react"

function GoogleLogo() {
  // Tiny inline Google "G" so you don't need another icon lib
  return (
    <svg className="h-4 w-4" viewBox="0 0 533.5 544.3" aria-hidden="true">
      <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.7-37-5-54.8H272v103.7h146.9c-6.3 34-25 62.7-53.4 82v68.2h86.2c50.4-46.4 81.8-114.8 81.8-199.1z"/>
      <path fill="#34A853" d="M272 544.3c73.9 0 135.9-24.4 181.2-66.8l-86.2-68.2c-24 16.2-54.6 25.8-95 25.8-72.9 0-134.7-49.2-156.8-115.3H25.7v72.5C70.6 484.6 164.9 544.3 272 544.3z"/>
      <path fill="#FBBC05" d="M115.2 319.8c-10.9-32.8-10.9-68.1 0-100.9V146.4H25.7c-41.8 83.5-41.8 183.9 0 267.4l89.5-94z"/>
      <path fill="#EA4335" d="M272 106.1c40.2-.6 79 14.8 108.6 42.8l81.1-81.1C407.7 23 345.8-.3 272 0 164.9 0 70.6 59.7 25.7 146.4l89.5 72.5C137.8 155.6 199.1 106.1 272 106.1z"/>
    </svg>
  )
}

export default function LoginProviders ( ) {
    return (
        <div className="space-y-3">
            {/* GitHub */}
            <form
              action={async () => {
                  "use server"
                  return signIn("github", { redirectTo: "/auth/rolecheck" })
                }}
            >
              <button
                type="submit"
                className="w-full cursor-pointer bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>Continue with GitHub</span>
              </button>
            </form>

            {/* Google */}
            <form
             action={async () => {
                "use server"
                return signIn("google", {
                  prompt: "select_account",
                  redirectTo: "/auth/rolecheck",
                })
              }}
            >
              <button
                type="submit"
                className="cursor-pointer w-full bg-white text-gray-800 border border-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <GoogleLogo />
                <span>Continue with Google</span>
              </button>
            </form>
          </div>
    )
}