// src/app/unauthorized/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function UnauthorizedPage() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
        <p className="text-gray-700 mb-6">
          Sorry, you don’t have permission to view this page.
        </p>

        {reason && (
          <p className="text-sm text-gray-500 mb-6">
            <strong>Reason:</strong> {reason}
          </p>
        )}

        <div className="flex justify-center gap-4">
          <Link
            href="/platform"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Go to Platform
          </Link>
          <Link
            href="/tutorHub"
            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-500 transition"
          >
            Go to Tutor Hub
          </Link>
        </div>
      </div>
    </div>
  )
}
