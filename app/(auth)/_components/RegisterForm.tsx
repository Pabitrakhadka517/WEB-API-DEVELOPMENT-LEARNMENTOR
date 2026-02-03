"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schema";
import Link from "next/link";

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: unknown) => console.log("Login Data:", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">Join LearnMentor</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input {...register("name")} className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">I am a...</label>
        <select {...register("role")} className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input {...register("email")} className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" {...register("password")} className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
      </div>
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">Get Started</button>
      <p className="text-center text-sm text-gray-600 mt-4">Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link></p>
    </form>
  );
};