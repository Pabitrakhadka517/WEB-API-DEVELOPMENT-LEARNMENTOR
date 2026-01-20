"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { useRegisterUserMutation, useRegisterAdminMutation, useRegisterTutorMutation } from "../../../auth/queries";

export default function RegisterForm() {
    const router = useRouter();
    const [pending, setTransition] = useTransition();

    const registerUser = useRegisterUserMutation();
    const registerAdmin = useRegisterAdminMutation();
    const registerTutor = useRegisterTutorMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const selectedRole = watch("role");

    const submit = async (values: RegisterData) => {
        setTransition(async () => {
            let mutation;
            switch (values.role) {
                case "admin":
                    mutation = registerAdmin;
                    break;
                case "tutor":
                    mutation = registerTutor;
                    break;
                default:
                    mutation = registerUser;
            }

            try {
                await mutation.mutateAsync({ email: values.email, password: values.password });
                router.push("/login");
            } catch (error) {
                // Error is handled in the mutation
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
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

            {/* Role */}
            <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800 ml-1 uppercase tracking-wider" htmlFor="role">
                    Role
                </label>
                <select
                    id="role"
                    className="h-12 w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                    {...register("role")}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="tutor">Tutor</option>
                </select>
                {errors.role?.message && (
                    <p className="text-xs font-semibold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">
                        {errors.role.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || pending || registerUser.isPending || registerAdmin.isPending || registerTutor.isPending}
                className="group relative h-14 w-full overflow-hidden rounded-2xl bg-blue-600 font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 mt-4"
            >
                <span className="relative z-10">
                    {isSubmitting || pending || registerUser.isPending || registerAdmin.isPending || registerTutor.isPending ? "Creating Account..." : "Signup"}
                </span>
            </button>
        </form>
    );
}