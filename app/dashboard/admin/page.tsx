'use client';

import React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Shield, Users, Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPage() {
    const { user } = useAuthStore();

    if (user?.role !== 'admin') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-white">Access Denied</h1>
                <p className="text-slate-400 max-w-md mt-2">
                    You do not have the necessary permissions to view this page. This area is restricted to administrators only.
                </p>
            </div>
        );
    }

    const stats = [
        { label: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'System Load', value: '12%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Revenue Growth', value: '+14%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Control Panel</h1>
                <p className="text-slate-400">Manage system-wide settings and monitor user activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center space-x-4">
                        <div className={cn("p-4 rounded-2xl", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Role</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { name: 'John Doe', email: 'john@example.com', role: 'Tutor', status: 'Active', joined: 'Oct 24, 2025' },
                                { name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'Pending', joined: 'Oct 25, 2025' },
                                { name: 'Mike Johnson', email: 'mike@example.com', role: 'Tutor', status: 'Active', joined: 'Oct 26, 2025' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{row.name}</p>
                                        <p className="text-slate-500 text-xs">{row.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{row.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                            row.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                                        )}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{row.joined}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
