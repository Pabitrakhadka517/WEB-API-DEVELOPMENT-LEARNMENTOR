'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  User, Mail, Lock, Eye, EyeOff, GraduationCap, Users,
  ArrowRight, AlertCircle, Loader2, CheckCircle2
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { RegisterSchema, type RegisterFormData } from '../schema';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
    },
  });

  const selectedRole = watch('role');
  const passwordVal = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (data.role === 'TUTOR') {
        await authService.registerTutor(data);
      } else {
        await authService.registerUser(data);
      }
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength(passwordVal || '');

  return (
    <div className="flex items-center justify-center p-4 relative">
      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <Logo 
              showText={false} 
              containerClassName="w-20 h-20 shadow-2xl" 
            />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Your Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join LearnMentor and start your learning adventure</p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={cn(
                  "relative border-2 rounded-2xl p-5 cursor-pointer transition-all group",
                  selectedRole === 'STUDENT'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600/50'
                )}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="STUDENT"
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      selectedRole === 'STUDENT'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-600 text-slate-400 dark:text-slate-300'
                    )}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={cn(
                        "font-bold text-sm transition-colors",
                        selectedRole === 'STUDENT' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                      )}>Student</p>
                      <p className="text-xs text-slate-400 mt-0.5">Find tutors & learn</p>
                    </div>
                  </div>
                  {selectedRole === 'STUDENT' && (
                    <div className="absolute top-2.5 right-2.5">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                </label>

                <label className={cn(
                  "relative border-2 rounded-2xl p-5 cursor-pointer transition-all group",
                  selectedRole === 'TUTOR'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600/50'
                )}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="TUTOR"
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      selectedRole === 'TUTOR'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-600 text-slate-400 dark:text-slate-300'
                    )}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={cn(
                        "font-bold text-sm transition-colors",
                        selectedRole === 'TUTOR' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                      )}>Tutor</p>
                      <p className="text-xs text-slate-400 mt-0.5">Teach & earn</p>
                    </div>
                  </div>
                  {selectedRole === 'TUTOR' && (
                    <div className="absolute top-2.5 right-2.5">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                </label>
              </div>
              {errors.role && (
                <p className="text-xs text-red-400 font-semibold ml-1">{errors.role.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('fullName')}
                  type="text"
                  className={cn(
                    "w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.fullName && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                  )}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-400 font-semibold ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  className={cn(
                    "w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.email && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                  )}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-semibold ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    "w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.password && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                  )}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength Bar */}
              {passwordVal && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500", strength.color)} style={{ width: strength.width }} />
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest",
                    strength.label === 'Weak' ? 'text-red-400' :
                    strength.label === 'Fair' ? 'text-amber-400' :
                    strength.label === 'Good' ? 'text-blue-400' : 'text-emerald-400'
                  )}>
                    {strength.label}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-400 font-semibold ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  className={cn(
                    "w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.confirmPassword && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                  )}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 font-semibold ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {selectedRole === 'TUTOR' ? 'Creating Tutor Account...' : 'Creating Student Account...'}
                </>
              ) : (
                <>
                  {selectedRole === 'TUTOR' ? 'Create Tutor Account' : 'Create Student Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-slate-800 text-slate-400 font-medium">Already have an account?</span>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full py-3.5 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/60 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-xl transition-all"
          >
            Sign In Instead
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
