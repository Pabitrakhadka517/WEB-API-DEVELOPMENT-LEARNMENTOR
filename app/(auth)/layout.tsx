'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0b0f1a] overflow-hidden">
      {/* Left Side: Visual/Marketing */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 text-white overflow-hidden border-r border-white/5">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">LearnMentor</span>
          </div>

          <h2 className="text-5xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
            Empowering Minds, <br />
            <span className="text-indigo-400 text-4xl">One Lesson at a Time.</span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Join our community of elite tutors and ambitious students.
            Experience a new way of learning with our smart platform.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-12">
            {[
              { label: 'Expert Tutors', value: '500+' },
              { label: 'Active Students', value: '10k+' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md bg-indigo-500/5 blur-[100px] pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}