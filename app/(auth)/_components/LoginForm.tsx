"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schema";
import Link from "next/link";

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: unknown) => console.log("Login Data:", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Welcome Back</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input {...register("email")} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="tutor@learnmentor.com" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" {...register("password")} className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">Sign In</button>
      <p className="text-center text-sm text-gray-600 mt-4">New to LearnMentor? <Link href="/register" className="text-blue-600 hover:underline">Create account</Link></p>
    </form>
  );
};