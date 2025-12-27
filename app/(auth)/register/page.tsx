"use client";

import Image from "next/image";
import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      {/* LEFT SIDE: BRANDING (Matches Login) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#0052FF] p-16 lg:flex overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-black text-white tracking-tighter">
            Learn<span className="text-blue-200">Mentor</span>
          </Link>
        </div>
        <div className="relative z-10">
          <div className="group relative h-125 w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
              alt="Join Community"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/30 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Get Started</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Join LearnMentor</h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-100/80">
                Create your account and start your journey with expert tutors today.
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-xs font-medium text-blue-200/50">
          © 2025 LEARNMENTOR LTD.
        </div>
      </div>

      {/* RIGHT SIDE: REGISTER SECTION */}
      <div className="relative flex w-full flex-col justify-center px-8 lg:w-1/2 xl:px-32 bg-slate-50 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-125 w-125 bg-blue-100/30 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 mx-auto w-full max-w-120">
          <div className="w-full bg-white p-10 lg:p-14 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,80,0.06)] border border-white backdrop-blur-sm">
            
            <div className="mb-10 text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/my_logo.png" 
                  alt="LearnMentor Logo"
                  width={90}
                  height={90}
                  className="rounded-md"
                />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create account</h1>
              <p className="text-slate-500 font-medium text-sm">Join the community</p>
            </div>

            <RegisterForm />

            <div className="mt-10 text-center pt-6 border-t border-slate-50">
                <p className="text-sm text-slate-500 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}