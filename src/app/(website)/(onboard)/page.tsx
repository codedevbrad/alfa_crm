'use client'
import React from 'react'

export default function AlfaCRMHero() {
  return (
    <div className="relative pt-9 min-h-screen bg-gradient-to-br from-indigo-300 via-sky-200 to-cyan-200">

      {/* Hero Section */}
      <main className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
            <div className="mb-4">
              <span className="text-black">Run </span>
              <span className="bg-black text-white px-4 py-2 rounded-lg italic transform -rotate-1 inline-block">
                projects & teams
              </span>
            </div>
            <div className="mb-4">
              <span className="text-black">with </span>
              <span className="underline underline-offset-8 decoration-4 decoration-black">clarity</span>
              <span className="ml-4 text-4xl">📊</span>
              <span className="text-black ml-4">using</span>
            </div>
            <div>
              <span className="text-black">Alfa </span>
              <span className="italic">CRM</span>
            </div>
          </h1>

          <p className="text-lg md:text-2xl text-gray-800 max-w-3xl mx-auto mb-12 leading-relaxed">
            A unified workspace for **projects, workers, timesheets, quotes, invoices, and scheduling**.
            Track jobs end-to-end, automate busywork, and get real-time profitability—without the spreadsheet chaos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="Start free trial"
            >
              Start Free Trial
            </button>
            <button
              className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300"
              aria-label="Book a live demo"
            >
              Book a Live Demo
            </button>
            <button
              className="hidden sm:inline-block border-2 border-transparent underline underline-offset-4 decoration-black/60 px-2 py-4 text-lg font-semibold hover:decoration-black transition-all"
              aria-label="View pricing"
            >
              View Pricing →
            </button>
          </div>

          {/* Trust / Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="px-3 py-1 rounded-full bg-white/70 border border-black/10 text-sm font-medium">
              🔒 GDPR-ready
            </span>
            <span className="px-3 py-1 rounded-full bg-white/70 border border-black/10 text-sm font-medium">
              ⚙️ Zapier & Webhooks
            </span>
            <span className="px-3 py-1 rounded-full bg-white/70 border border-black/10 text-sm font-medium">
              🧾 Xero/QuickBooks friendly
            </span>
            <span className="px-3 py-1 rounded-full bg-white/70 border border-black/10 text-sm font-medium">
              🧑‍🔧 Field teams & subbies
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-black">2,400+</div>
              <div className="text-gray-700">Projects Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black">18%</div>
              <div className="text-gray-700">Avg. Margin Lift</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black">120K+</div>
              <div className="text-gray-700">Invoices Sent</div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-8 left-1/4 w-16 h-16 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/40 rounded-full animate-bounce" />
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-white/25 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
