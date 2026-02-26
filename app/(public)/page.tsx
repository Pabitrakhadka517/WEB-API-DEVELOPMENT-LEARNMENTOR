import Link from 'next/link';
import { BookOpen, Users, Award, Sparkles, CheckCircle, Star, ArrowRight, GraduationCap, MessageCircle, Calendar, Globe, Zap, Shield, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

const features = [
  {
    icon: Users,
    title: 'AI-Driven Matching',
    description: 'Our smart algorithm pairs you with the ideal tutor based on your learning style, goals, and schedule.',
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Book sessions at your convenience. Morning, afternoon, or evening — learn on your terms.',
    color: 'from-violet-500 to-purple-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: MessageCircle,
    title: 'Real-Time Chat',
    description: 'Communicate instantly with your tutor. Ask questions, share files, and stay connected.',
    color: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: Shield,
    title: 'Verified Tutors',
    description: 'Every tutor goes through a rigorous verification process to ensure quality education.',
    color: 'from-amber-500 to-orange-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: BookOpen,
    title: 'Study Library',
    description: 'Access shared materials, notes, and resources uploaded by your tutors anytime.',
    color: 'from-rose-500 to-pink-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and completion milestones.',
    color: 'from-sky-500 to-blue-400',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
  },
];

const steps = [
  { step: '01', title: 'Create Account', description: 'Sign up in seconds as a student or tutor.', icon: Sparkles },
  { step: '02', title: 'Find Your Match', description: 'Browse tutors or let our AI suggest the best fit.', icon: Users },
  { step: '03', title: 'Book & Learn', description: 'Schedule a session and start learning right away.', icon: Calendar },
  { step: '04', title: 'Track & Grow', description: 'See your progress and achieve your goals.', icon: TrendingUp },
];

const testimonials = [
  {
    name: 'Sarah Ahmed',
    role: 'Computer Science Student',
    quote: 'LearnMentor helped me go from struggling with algorithms to acing my exams. The tutor matching is incredible!',
    rating: 5,
    avatar: 'S',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    name: 'Ali Hassan',
    role: 'Mathematics Tutor',
    quote: 'As a tutor, this platform made it so easy to reach students. The booking system is seamless and professional.',
    rating: 5,
    avatar: 'A',
    color: 'from-violet-400 to-purple-400',
  },
  {
    name: 'Fatima Khan',
    role: 'Physics Student',
    quote: 'The real-time chat and study materials feature changed how I prepare for exams. Truly a game changer!',
    rating: 5,
    avatar: 'F',
    color: 'from-emerald-400 to-teal-400',
  },
];

const stats = [
  { value: '500+', label: 'Expert Tutors', icon: GraduationCap },
  { value: '10,000+', label: 'Active Students', icon: Users },
  { value: '50,000+', label: 'Sessions Completed', icon: CheckCircle },
  { value: '4.9/5', label: 'Average Rating', icon: Star },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* ======= NAVBAR ======= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="button" size="sm" />
            <Link href="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-md shadow-blue-600/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ======= HERO SECTION ======= */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-[-15%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-[-10%] w-[400px] h-[400px] bg-violet-400/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-[30%] w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-clip-text text-transparent">
                Mentor
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Unlock your potential with personalized 1-on-1 learning. LearnMentor connects top-tier tutors with ambitious students using intelligent matching.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="group px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                Start Learning Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Globe className="w-4 h-4" /> Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-20 max-w-5xl mx-auto relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl opacity-60" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                alt="Students collaborating and learning together"
                className="w-full h-[350px] md:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ======= STATS BAR ======= */}
      <section className="py-12 bg-gradient-to-r from-blue-600 via-blue-700 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTIgMGgydjJoLTJ2LTJ6bS0yLTR2MmgtMnYtMmgyem0yIDBoMnYyaC0ydi0yem00IDBoMnYyaC0ydi0yem0tOCAwaC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-blue-200 mx-auto mb-2" />
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FEATURES ======= */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 rounded-full mb-4">
              <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform is packed with tools designed to make your learning or teaching experience seamless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= HOW IT WORKS ======= */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-800/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              How{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">LearnMentor</span>
              {' '}Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Getting started takes less than a minute. Here's your journey from signup to success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-700" />
                )}
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-lg group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-all duration-300 group-hover:scale-105">
                  <s.icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 block">Step {s.step}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TESTIMONIALS ======= */}
      <section id="testimonials" className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full mb-4">
              <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Student Reviews</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our community has to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA SECTION ======= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTIgMGgydjJoLTJ2LTJ6bS0yLTR2MmgtMnYtMmgyem0yIDBoMnYyaC0ydi0yem00IDBoMnYyaC0ydi0yem0tOCAwaC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

        {/* Decorative blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and tutors who are already achieving their goals with LearnMentor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="group px-10 py-4 bg-white text-blue-600 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-10 py-4 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/">
                <Logo textClassName="text-white" />
              </Link>
               <div className="mt-4"></div>
              <p className="text-sm leading-relaxed">
                Empowering minds, one lesson at a time. The smartest way to connect tutors and students.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@learnmentor.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link href="/status" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} LearnMentor. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}