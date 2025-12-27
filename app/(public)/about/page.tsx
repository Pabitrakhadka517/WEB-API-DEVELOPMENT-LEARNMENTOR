"use client";

import { Users, Target, Rocket, Heart, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 pt-20">
      {/* 1. MINI HERO SECTION */}
      <section className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-125 h-125 bg-blue-100/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            We're on a mission to <br />
            <span className="text-[#0052FF]">Democratize Learning</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 font-medium">
            LearnMentor was founded on the belief that everyone deserves access to 
            world-class 1-on-1 mentorship, regardless of where they are in the world.
          </p>
        </div>
      </section>

      {/* 2. OUR VALUES GRID */}
      <section className="py-24 mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard 
            icon={<Target className="text-blue-600" />}
            title="Our Mission"
            text="To bridge the gap between students and expert knowledge through technology."
          />
          <ValueCard 
            icon={<Heart className="text-pink-500" />}
            title="User Centric"
            text="We build tools that prioritize the student's progress and the tutor's growth."
          />
          <ValueCard 
            icon={<Rocket className="text-orange-500" />}
            title="Innovation"
            text="Leveraging AI to match you with the perfect mentor in seconds, not hours."
          />
          <ValueCard 
            icon={<Users className="text-purple-600" />}
            title="Community"
            text="Fostering a global network of lifelong learners and professional educators."
          />
        </div>
      </section>

      {/* 3. THE "WHY" SECTION */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden rounded-[3rem] mx-4 mb-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">The LearnMentor Standard</h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-blue-400">For the Learners</h3>
              <ul className="space-y-4">
                <ListItem text="Vetted experts from Ivy League and top tech firms." />
                <ListItem text="Flexible scheduling that fits your timezone." />
                <ListItem text="Risk-free first sessions with a satisfaction guarantee." />
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-blue-400">For the Tutors</h3>
              <ul className="space-y-4">
                <ListItem text="Low commission rates—you keep what you earn." />
                <ListItem text="Powerful dashboard to manage your student base." />
                <ListItem text="Global exposure to thousands of eager students." />
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Reusable Value Card
function ValueCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

// Reusable List Item
function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
      <span className="text-slate-300 font-medium">{text}</span>
    </li>
  );
}