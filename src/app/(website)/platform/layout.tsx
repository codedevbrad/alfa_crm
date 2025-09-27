import type { Metadata } from "next"
import Header from "./(layout)/header"

export const metadata: Metadata = {
  title: "The Code Bootcamp",
  description: "Student platform",
}

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div>{children}</div>
    </div>
  )
}
