"use client";


// This is Home Page

import Link from "next/link";
import { ArrowRight, BookOpen, Users, ShieldCheck, Sparkles, Star, Globe, Zap } from "lucide-react";
import Image from "next/image"; 

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      
      {/* 1. DYNAMIC HERO SECTION */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] h-125 w-125 bg-blue-100/50 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] h-125 w-125 bg-indigo-100/50 blur-[120px] rounded-full"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 mb-6 border border-blue-100">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">The Future of Tutoring</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.05]">
                Master any skill with <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">1-on-1</span> coaching.
              </h1>
              
              <p className="max-w-lg text-lg text-slate-600 mb-10 leading-relaxed">
                Skip the generic courses. Connect with industry experts and certified teachers for personalized growth that actually sticks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  Find Your Mentor <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-4 px-4">
                   <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                     ))}
                   </div>
                   <div className="text-sm">
                      <div className="flex text-yellow-500 w-4 h-4"><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/></div>
                      <p className="font-semibold text-slate-700">Top rated by students</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Visual Element / Feature Grid */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-full max-w-lg h-100 rounded-[3rem] shadow-2xl shadow-blue-300/50 overflow-hidden border-4 border-white">
                <Image
                  src="/onlineclass.png" 
                  alt="Students learning with a tutor"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-[2.75rem]"
                />
              </div>

              {/* Floating Benefit Cards (Stats removed) */}
              <div className="absolute -top-8 -left-8 bg-white p-4 rounded-3xl shadow-lg border border-slate-100 flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Diverse Subjects</p>
                  <p className="text-xs text-slate-500">Available now</p>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-3xl shadow-lg border border-slate-100 flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Expert Tutors</p>
                  <p className="text-xs text-slate-500">Global network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by students from</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            <span className="text-2xl font-black">UNIVERSITY</span>
            <span className="text-2xl font-black">ACADEMY</span>
            <span className="text-2xl font-black">GLOBAL ED</span>
            <span className="text-2xl font-black">TECH INSTITUTE</span>
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to start your journey?</h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto">Join students who have already accelerated their careers and education with LearnMentor.</p>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
              Get Started Now
            </button>
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600 blur-[100px] opacity-20"></div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
            <div className="max-w-xs">
              <div className="text-2xl font-black text-blue-600 mb-4">LearnMentor</div>
              <p className="text-slate-500 text-sm leading-relaxed">Connecting the world's best minds with the students who need them most.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link href="#">Find Tutors</Link></li>
                  <li><Link href="#">How it works</Link></li>
                  <li><Link href="#">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link href="#">About Us</Link></li>
                  <li><Link href="#">Careers</Link></li>
                  <li><Link href="#">Blog</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <p>© 2025 LearnMentor Inc.</p>
            <div className="flex gap-8">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}