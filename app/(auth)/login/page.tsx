// pages/login.tsx
import React from "react";
import Link from "next/link";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 shadow-lg rounded-lg border border-green-200">
        <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Welcome Back
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-green-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-green-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-green-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center text-green-700 mt-4">
          Don't have an account?{" "}
          <Link href="/auth/register" className="underline font-semibold hover:text-green-900">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
