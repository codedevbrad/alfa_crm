'use client'

import React from "react"

export default function SiteUrlDisplay() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    return (
      <div className="mt-2 w-full flex justify-center">
        <div className="px-6 py-3 rounded-md bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium shadow-md">
          ⚠️ NEXT_PUBLIC_SITE_URL not set
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2 w-full flex justify-center">
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                   text-white font-semibold text-sm shadow-xl hover:opacity-90 transition"
      >
        🌐 Current Site: {siteUrl}
      </a>
    </div>
  )
}
