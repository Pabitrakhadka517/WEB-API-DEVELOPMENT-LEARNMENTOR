"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";

export default function RegisterForm() {
    const router = useRouter();
    const [pending, setTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const submit = async (values: RegisterData) => {
        setTransition(async () => {
            // 1. Simulate API Delay (Replace with your actual backend call)
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            console.log("Registration Successful:", values);
            
            // 2. Redirect to Login Page
            router.push("/login");
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800 ml-1 uppercase tracking-wider" htmlFor="name">
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    className="h-12 w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                    {...register("name")}
                    placeholder="Thomas Anderson"
                />
                {errors.name?.message && (
                    <p className="text-xs font-semibold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800 ml-1 uppercase tracking-wider" htmlFor="email">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    className="h-12 w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                    {...register("email")}
                    placeholder="thomas@gmail.com"
                />
                {errors.email?.message && (
                    <p className="text-xs font-semibold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800 ml-1 uppercase tracking-wider" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    className="h-12 w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                    {...register("password")}
                    placeholder="••••••••"
                />
                {errors.password?.message && (
                    <p className="text-xs font-semibold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800 ml-1 uppercase tracking-wider" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    className="h-12 w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                    {...register("confirmPassword")}
                    placeholder="••••••••"
                />
                {errors.confirmPassword?.message && (
                    <p className="text-xs font-semibold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="group relative h-14 w-full overflow-hidden rounded-2xl bg-blue-600 font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 mt-4"
            >
                <span className="relative z-10">
                    {isSubmitting || pending ? "Creating Account..." : "Signup"}
                </span>
            </button>
        </form>
    );
}