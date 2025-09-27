'use client'
import React from 'react'

export default function CodeBootcampHero() {
  return (
    <div className="pt-9 min-h-screen bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-200">

      {/* Hero Section */}
      <main className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
            <div className="mb-4">
              <span className="text-black">Launch </span>
              <span className="bg-black text-white px-4 py-2 rounded-lg italic transform -rotate-1 inline-block">
                tech-career
              </span>
            </div>
            <div className="mb-4">
              <span className="text-black">bootcamp </span>
              <span className="text-black italic">faster</span>
              <span className="ml-4 text-4xl">💻</span>
              <span className="text-black ml-4">with</span>
            </div>
            <div>
              <span className="text-black">industry-ready </span>
              <span className="underline underline-offset-8 decoration-4 decoration-black">skills</span>
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform your future in 16 weeks. Master full-stack development, 
            land your dream job, and join thousands of successful graduates 
            working at top tech companies.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Apply Now - Next Cohort Starts Feb 2025
            </button>
            <button className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300">
              Download Curriculum
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-black">94%</div>
              <div className="text-gray-600">Job Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black">$85K</div>
              <div className="text-gray-600">Average Starting Salary</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black">500+</div>
              <div className="text-gray-600">Hiring Partners</div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/30 rounded-full animate-bounce"></div>
      <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-white/25 rounded-full animate-pulse"></div>
    </div>
  )
}