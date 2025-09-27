// src/app/tutorHub/layout.tsx
import type { Metadata } from "next"
import TutorHubHeader from "./(layout)/header/header"

export const metadata: Metadata = {
  title: "TutorHub - The Code Bootcamp",
  description: "Tutor Dashboard - Learning Application",
}

export default async function TutorHubLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHubHeader /> 
      <div>{children}</div>
    </div>
  )
}
