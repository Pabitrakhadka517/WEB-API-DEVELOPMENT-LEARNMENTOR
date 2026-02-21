'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, AlertCircle, Loader2, MailCheck, ExternalLink } from 'lucide-react';
import { ForgotPasswordSchema, type ForgotPasswordFormData } from '../schema';
import { authService } from '@/services/auth.service';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(data.email);
      // Capture dev-mode links for easy testing
      if (response.devResetLink) setDevResetLink(response.devResetLink);
      if (response.emailPreviewUrl) setEmailPreviewUrl(response.emailPreviewUrl);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
            <MailCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Check Your Email</h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            If an account exists for that email, we&apos;ve sent instructions to reset your password. Please check your inbox and spam folder.
          </p>
        </div>

        {/* Dev-mode links (only shown in development) */}
        {(devResetLink || emailPreviewUrl) && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Dev Mode Links
            </p>
            {devResetLink && (
              <a
                href={devResetLink}
                className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors break-all"
              >
                <ExternalLink className="w-4 h-4 shrink-0" /> Reset Password Link
              </a>
            )}
            {emailPreviewUrl && (
              <a
                href={emailPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors break-all"
              >
                <ExternalLink className="w-4 h-4 shrink-0" /> Preview Email (Ethereal)
              </a>
            )}
          </div>
        )}

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
        <p className="text-slate-500 dark:text-slate-400">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm font-bold text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              {...register('email')}
              type="email"
              className={cn(
                "block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all",
                errors.email && "border-red-400/50 focus:ring-red-400/30"
              )}
              placeholder="Enter your registered email"
            />
          </div>
          {errors.email && (
            <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Reset Link
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-400 hover:underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
}
