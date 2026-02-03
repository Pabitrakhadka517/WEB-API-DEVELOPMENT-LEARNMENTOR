'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Loader2, User, Phone, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'tutor'], { message: 'Please select a role' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // The backend has specific routes for /register/user and /register/tutor
      const endpoint = `/auth/register/${data.role}`;
      const response = await api.post(endpoint, {
        email: data.email,
        password: data.password,
        name: data.name
      });

      // Backend returns { message, user } on registration
      // We usually proceed to login or automatically log them in
      // For now, let's redirect to login with a success message or handle it
      router.push('/login?registered=true');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-slate-400">Join the LearnMentor community today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <label className={cn(
            "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer group",
            selectedRole === 'user'
              ? "bg-indigo-600/10 border-indigo-600 text-white"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}>
            <input type="radio" {...register('role')} value="user" className="absolute opacity-0" />
            <GraduationCap className={cn("w-8 h-8 mb-2", selectedRole === 'user' ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400")} />
            <span className="text-sm font-bold">Student</span>
          </label>

          <label className={cn(
            "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer group",
            selectedRole === 'tutor'
              ? "bg-indigo-600/10 border-indigo-600 text-white"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}>
            <input type="radio" {...register('role')} value="tutor" className="absolute opacity-0" />
            <Briefcase className={cn("w-8 h-8 mb-2", selectedRole === 'tutor' ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400")} />
            <span className="text-sm font-bold">Tutor</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              {...register('name')}
              type="text"
              className={cn(
                "block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                errors.name && "border-red-500/50"
              )}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              {...register('email')}
              type="email"
              className={cn(
                "block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                errors.email && "border-red-500/50"
              )}
              placeholder="name@example.com"
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              {...register('password')}
              type="password"
              className={cn(
                "block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                errors.password && "border-red-500/50"
              )}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1 ml-1">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 text-center animate-in shake duration-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-white font-bold bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:pointer-events-none group"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-slate-400 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}
