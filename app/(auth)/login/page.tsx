'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2, GraduationCap, Sparkles, Star } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore, type User } from '@/store/auth-store';
import { LoginSchema, type LoginFormData } from '../schema';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const registered = searchParams?.get('registered');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      
      // Normalize role to uppercase format expected by store
      const roleMap: Record<string, 'STUDENT' | 'TUTOR' | 'ADMIN'> = {
        user: 'STUDENT', student: 'STUDENT', STUDENT: 'STUDENT',
        tutor: 'TUTOR', TUTOR: 'TUTOR',
        admin: 'ADMIN', ADMIN: 'ADMIN',
      };
      const normalizedRole = roleMap[response.user.role] || 'STUDENT';
      const normalizedUser: User = {
        id: response.user.id,
        email: response.user.email,
        role: normalizedRole,
        fullName: response.user.fullName || response.user.name || '',
      };

      // Update auth store with user data
      setAuth(normalizedUser, response.accessToken, response.refreshToken);
      
      // Set role cookie for middleware-based route protection
      document.cookie = `user-role=${normalizedRole}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      
      // Role-based redirect
      if (normalizedRole === 'STUDENT') {
        router.push('/dashboard/student');
      } else if (normalizedRole === 'TUTOR') {
        router.push('/dashboard/tutor');
      } else if (normalizedRole === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2 sm:p-4 relative">
      <div className="w-full max-w-sm sm:max-w-md relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 sm:mt-2">Sign in to continue your learning journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm">
          {registered && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">Account created successfully! Please sign in.</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  className={cn(
                    "w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-11",
                    errors.email && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                  )}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-semibold ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    "w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-11",
                    errors.password && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-semibold ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 sm:my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-[10px] sm:text-xs">
              <span className="px-2 sm:px-3 bg-white dark:bg-slate-800 text-slate-400 font-medium">New to LearnMentor?</span>
            </div>
          </div>
          
          <Link
            href="/register"
            className="w-full py-3 sm:py-3.5 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/60 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-lg sm:rounded-xl transition-all min-h-11 flex items-center justify-center"
          >
            Create an Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-4 sm:mt-6 px-4">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
