import Link from 'next/link';
import { BookOpen, Target, Heart, Globe, Users, Award, Lightbulb, ArrowRight, GraduationCap, Rocket, Shield, CheckCircle } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We believe quality education should be accessible to everyone, everywhere.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Heart,
    title: 'Student-First',
    description: 'Every feature we build starts with one question: how does this help our students learn better?',
    color: 'from-rose-500 to-pink-400',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage AI and modern technology to create the smartest tutoring experience possible.',
    color: 'from-amber-500 to-orange-400',
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Every tutor is verified, every transaction is secure, and every session is protected.',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Learn from anywhere in the world with our platform that works across all devices.',
    color: 'from-violet-500 to-purple-400',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'More than a platform — we are building a community of lifelong learners and educators.',
    color: 'from-sky-500 to-blue-400',
  },
];

const milestones = [
  { year: '2024', title: 'Founded', description: 'LearnMentor was born from a simple idea: make great tutoring accessible to all.' },
  { year: '2024', title: 'First 100 Tutors', description: 'Onboarded our first batch of verified, expert tutors across multiple subjects.' },
  { year: '2025', title: '1,000+ Students', description: 'Crossed a major milestone with students joining from across the country.' },
  { year: '2025', title: 'AI Matching Launch', description: 'Rolled out intelligent tutor-student matching powered by machine learning.' },
  { year: '2026', title: '10,000+ Users', description: 'Growing strong with thousands of successful sessions completed every month.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* ======= NAVBAR ======= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-1.5 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">LearnMentor</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-medium text-blue-600 dark:text-blue-400">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-md shadow-blue-600/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ======= HERO ======= */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-[-15%] w-[500px] h-[500px] bg-violet-400/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-blue-400/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 rounded-full mb-8">
            <Rocket className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">Our Story</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
            Empowering Minds,{' '}
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
              One Lesson at a Time
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            LearnMentor was founded with a bold vision: to make world-class tutoring accessible to every student,
            regardless of location or background. We use technology to bridge the gap between talented educators and eager learners.
          </p>
        </div>
      </section>

      {/* ======= MISSION & VISION ======= */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To democratize education by connecting students with the best tutors through intelligent technology.
                We aim to make personalized learning affordable, flexible, and effective for everyone.
              </p>
            </div>
            <div className="p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center mb-6 shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                A world where every student has access to a great mentor. Where learning is personalized, engaging,
                and breaks through the barriers of geography and economics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======= VALUES ======= */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full mb-4">
              <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">What We Believe</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Our Core{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="group p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TIMELINE ======= */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full mb-4">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Our Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Key{' '}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Milestones</span>
            </h2>
          </div>

          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="shrink-0 w-16 flex flex-col items-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{m.year}</span>
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100 dark:border-blue-900 mt-2 group-hover:scale-125 transition-transform" />
                  {i < milestones.length - 1 && <div className="w-0.5 h-16 bg-blue-200 dark:bg-blue-800 mt-1" />}
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex-1 group-hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{m.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700" />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Join the LearnMentor Community
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you're a student looking to excel or a tutor ready to inspire — there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="group px-10 py-4 bg-white text-blue-600 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/" className="px-10 py-4 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1.5 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">LearnMentor</span>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} LearnMentor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
