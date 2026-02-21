'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService, AdminStats, AdminUser } from '@/services/admin.service';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import {
    Users, GraduationCap, Activity, UserCog,
    TrendingUp, Loader2, AlertCircle, RefreshCw,
    TrendingDown, ArrowUpRight, ArrowDownRight,
    Zap, Megaphone, ShieldCheck, DollarSign,
    CreditCard, TrendingUpDown, PiggyBank
} from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, icon: Icon, color, sub, trend, prefix = '' }: {
    label: string; value: number; icon: React.ElementType; color: string; sub: string; trend?: number; prefix?: string;
}) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 hover:scale-[1.02] transition-all duration-500 shadow-2xl">
            <div className={cn("absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", color)} />
            <div className="relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform group-hover:rotate-6 transition-transform", color)}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white mb-1 tabular-nums">{prefix}{value.toLocaleString()}</p>
                    {trend && (
                        <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1",
                            trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-500"
                        )}>
                            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-600">
                    <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                    {sub}
                </div>
            </div>
        </div>
    );
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuthStore();

    const fetchStats = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const data = await adminService.getPlatformStats();
            setStats(data);
        } catch (err) {
            setError('Failed to load platform overview');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center py-40">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    const cards = [
        { label: 'Total Base Users', value: stats?.total ?? 0, icon: Users, color: 'bg-gradient-to-br from-blue-500 to-indigo-600', sub: 'Verified & Pending Accounts', trend: 12 },
        { label: 'Academic Tutors', value: stats?.tutors ?? 0, icon: GraduationCap, color: 'bg-gradient-to-br from-purple-500 to-pink-600', sub: 'Subject Matter Experts', trend: 8 },
        { label: 'Active Students', value: stats?.students ?? 0, icon: Activity, color: 'bg-gradient-to-br from-emerald-500 to-teal-600', sub: 'Enrolled in Sessions', trend: 24 },
        { label: 'Operators', value: stats?.admins ?? 0, icon: UserCog, color: 'bg-gradient-to-br from-amber-500 to-orange-500', sub: 'System Administrators', trend: 0 },
    ];

    const earningsCards = [
        { 
            label: 'Platform Revenue', 
            value: stats?.earnings?.totalRevenue ?? 0, 
            icon: DollarSign, 
            color: 'bg-gradient-to-br from-green-500 to-emerald-600', 
            sub: 'Total Transaction Volume', 
            trend: 15,
            prefix: 'Rs. '
        },
        { 
            label: 'Admin Earnings', 
            value: stats?.earnings?.adminEarnings ?? 0, 
            icon: PiggyBank, 
            color: 'bg-gradient-to-br from-violet-500 to-purple-600', 
            sub: 'Commission from Bookings', 
            trend: 12,
            prefix: 'Rs. '
        },
        { 
            label: 'Total Transactions', 
            value: stats?.earnings?.totalTransactions ?? 0, 
            icon: CreditCard, 
            color: 'bg-gradient-to-br from-rose-500 to-pink-600', 
            sub: 'Completed Payments', 
            trend: 8
        },
        { 
            label: 'Avg Commission', 
            value: parseFloat(stats?.earnings?.averageCommission?.toString() ?? '0'), 
            icon: TrendingUpDown, 
            color: 'bg-gradient-to-br from-cyan-500 to-blue-600', 
            sub: 'Per Transaction', 
            trend: 5,
            prefix: 'Rs. '
        },
    ];

    return (
        <div className="p-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Platform <span className="text-purple-500 underline decoration-purple-500/30 underline-offset-8">Overview</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Real-time pulse of your tutoring ecosystem.</p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all shadow-xl"
                >
                    <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                    Refresh Analytics
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => <StatCard key={i} {...card} />)}
            </div>

            {/* Admin Earnings Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            Revenue <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Analytics</span>
                        </h2>
                        <p className="text-slate-400 mt-1 font-medium">Platform earnings and transaction insights.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {earningsCards.map((card, i) => <StatCard key={`earnings-${i}`} {...card} />)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-48 h-48 text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Engagement Activity</h2>
                        <p className="text-slate-400 font-medium">Platform growth and retention trends over the last 30 days.</p>
                    </div>
                    <div className="h-64 flex items-end gap-2 px-4">
                        {[40, 65, 45, 90, 65, 80, 50, 75, 40, 95, 60, 45].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/5 rounded-t-xl group/bar relative">
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-xl transition-all duration-1000"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded pointer-events-none">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">
                        <span>January</span>
                        <span>February</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-10 flex flex-col justify-between text-white shadow-2xl shadow-purple-600/20 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-20 transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700">
                        <Zap className="w-64 h-64" />
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-xl border border-white/20">
                            <Megaphone className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Quick Broadcast</h2>
                        <p className="text-purple-100 font-medium text-sm leading-relaxed">Need to alert all users about scheduled maintenance or new features?</p>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <Link
                            href="/admin/announcements"
                            className="w-full py-4 bg-white text-purple-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-xl"
                        >
                            Open Broadcast Center <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <p className="text-[9px] font-black text-purple-200/50 uppercase tracking-[0.2em] text-center">Managed by {user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
