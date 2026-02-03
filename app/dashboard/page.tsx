'use client';

import React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function DashboardHome() {
  const { user } = useAuthStore();

  const getStatsByRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Total Users', value: '1,280', change: '+12%', color: 'from-indigo-500 to-purple-500' },
          { label: 'Platform Revenue', value: '$4,250', change: '+8%', color: 'from-emerald-500 to-teal-500' },
          { label: 'Active Sessions', value: '42', change: '+5', color: 'from-orange-500 to-red-500' },
        ];
      case 'tutor':
        return [
          { label: 'Total Students', value: '18', change: '+2', color: 'from-blue-500 to-indigo-500' },
          { label: 'Teaching Hours', value: '124h', change: '+15h', color: 'from-purple-500 to-pink-500' },
          { label: 'Rating', value: '4.9/5', change: '+0.1', color: 'from-amber-500 to-orange-500' },
        ];
      default: // student / user
        return [
          { label: 'Active Courses', value: '4', change: '+1', color: 'from-blue-500 to-indigo-500' },
          { label: 'Reward Points', value: '850', change: '+50', color: 'from-purple-500 to-pink-500' },
          { label: 'Next Class', value: '2h 15m', change: 'Today', color: 'from-orange-500 to-red-500' },
        ];
    }
  };

  const getActivitiesByRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { action: 'New Tutor Application: Sarah Johnson', time: '10 mins ago', type: 'application' },
          { action: 'System Backup Completed', time: '2 hours ago', type: 'system' },
          { action: 'Payout Processed for 12 Tutors', time: '5 hours ago', type: 'finance' },
        ];
      case 'tutor':
        return [
          { action: 'New Message from James (Student)', time: '5 mins ago', type: 'message' },
          { action: 'Math Class Scheduled for Tomorrow', time: '1 hour ago', type: 'class' },
          { action: 'Profile Review Completed', time: '1 day ago', type: 'profile' },
        ];
      default:
        return [
          { action: 'Physics Homework Deadline Tomorrow', time: '30 mins ago', type: 'homework' },
          { action: 'Tutor accepted your request', time: '2 hours ago', type: 'request' },
          { action: 'Earned 50 Achievement Points', time: '4 hours ago', type: 'achievement' },
        ];
    }
  };

  const stats = getStatsByRole();
  const activities = getActivitiesByRole();

  const isProfileIncomplete = !user?.phone || !user?.address;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {isProfileIncomplete && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between text-amber-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <p className="font-bold">Your profile is incomplete</p>
              <p className="text-sm opacity-80 text-amber-200/70">Add your phone and address to get better recommendations.</p>
            </div>
          </div>
          <a href="/dashboard/profile" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-xl text-sm hover:bg-amber-400 transition-colors">
            Fix Now
          </a>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Hello, {user?.name || 'User'}! <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Welcome to your <span className="text-indigo-400 font-bold capitalize">{user?.role}</span> dashboard.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/dashboard/profile" className="hidden md:flex px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-slate-300 font-bold transition-all text-sm">
            Edit Profile
          </a>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center space-x-2 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Platform Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className={cn("absolute top-0 right-0 w-40 h-40 bg-gradient-to-br opacity-10 blur-3xl -mr-20 -mt-20 group-hover:opacity-20 transition-opacity duration-500", stat.color)} />
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-baseline space-x-3">
                <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
            <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
          </div>
          <div className="space-y-6">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:border-indigo-600/30 transition-all duration-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-base group-hover:text-white transition-colors">{activity.action}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{activity.time}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    <div className="w-1 h-1 rounded-full bg-slate-400 mx-0.5" />
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20 group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-2xl font-black mb-4 leading-tight">Ready to excel further?</h2>
            <p className="text-indigo-100 text-sm font-medium mb-8 leading-relaxed opacity-90">
              {user?.role === 'admin'
                ? 'Check the system health and performance reports to ensure everything is running smoothly.'
                : user?.role === 'tutor'
                  ? 'Update your teaching availability and browse new requests from students in your area.'
                  : 'Complete your pending assignments to earn more reward points and unlock new achievements.'}
            </p>
            <div className="mt-auto space-y-3">
              <a href="/dashboard/profile" className="flex items-center justify-center w-full py-3 bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]">
                Update Profile
              </a>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-[0.98] shadow-xl">
                {user?.role === 'admin' ? 'Open Reports' : user?.role === 'tutor' ? 'Set Availability' : 'Start Learning'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
