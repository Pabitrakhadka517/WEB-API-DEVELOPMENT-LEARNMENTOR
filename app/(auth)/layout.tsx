'use client';

import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Left Side: Visual/Marketing */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 text-white overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-slate-900">
        {/* Decorative shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-3 mb-10">
            <Logo 
              containerClassName="w-16 h-16 md:w-20 md:h-20" 
              textClassName="text-white text-3xl md:text-5xl" 
            />
          </div>

          <h2 className="text-5xl font-extrabold mb-6 leading-tight text-white">
            Empowering Minds, <br />
            <span className="text-blue-200 text-4xl">One Lesson at a Time.</span>
          </h2>

          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Join our community of elite tutors and ambitious students.
            Experience a new way of learning with our smart platform.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-12">
            {[
              { label: 'Expert Tutors', value: '500+' },
              { label: 'Active Students', value: '10k+' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-blue-200 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-white dark:bg-slate-900">
        {/* Theme toggle in top-right corner */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle variant="button" size="sm" />
        </div>
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}