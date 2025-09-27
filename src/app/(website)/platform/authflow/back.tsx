"use client"

import { ArrowLeft } from "lucide-react"

export default function BackToHome ( ) {
    return (
          <div
            onClick={() => window.history.back()}
            className="cursor-pointer absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </div>
    )
}