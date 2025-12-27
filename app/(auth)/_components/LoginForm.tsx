"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { LoginData, loginSchema } from "../schema";
import { useRouter } from "next/navigation"; // 1. Import useRouter

export default function LoginForm() {
    const router = useRouter(); // 2. Initialize the router
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });
    const [pending, setTransition] = useTransition();

    const submit = async (values: LoginData) => {
        setTransition(async () => {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            console.log("login success:", values);
            
            // 3. Redirect to the dashboard page
            router.push("/dashboard");
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700" htmlFor="email">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    {...register("email")}
                    placeholder="learnmentor@company.com"
                />
                {errors.email?.message && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    {...register("password")}
                    placeholder="••••••••"
                />
                {errors.password?.message && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.password.message}</p>
                )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pr-1">
                <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot password?
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-12 w-full rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
            >
                {isSubmitting || pending ? "Signing in..." : "Sign in to account"}
            </button>
        </form>
    );
}