'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues & { role?: string }>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'user'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;

      setAuth(user, accessToken, refreshToken);

      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError.response?.data?.error || 'Invalid credentials. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400">Please select your role and enter your details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'user', label: 'Student', icon: ShieldCheck },
            { id: 'tutor', label: 'Teacher', icon: Briefcase },
            { id: 'admin', label: 'Admin', icon: ShieldCheck },
          ].map((role) => (
            <label
              key={role.id}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer group",
                selectedRole === role.id
                  ? "bg-indigo-600/10 border-indigo-600 text-white"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
              )}
            >
              <input type="radio" {...register('role')} value={role.id} className="absolute opacity-0" />
              <role.icon className={cn("w-6 h-6 mb-1.5", selectedRole === role.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{role.label}</span>
            </label>
          ))}
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
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <Link href="/forgot-password" title="Forgot password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>
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
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>


      <p className="text-center text-slate-400 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
          Join LearnMentor
        </Link>
      </p>
    </div>
  );
}
