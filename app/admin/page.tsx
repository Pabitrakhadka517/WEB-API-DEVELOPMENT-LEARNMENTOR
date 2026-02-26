'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService, AdminStats, AdminUser } from '@/services/admin.service';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import {
    Users, GraduationCap, Activity, UserCog,
    TrendingUp, Loader2, AlertCircle, RefreshCw,
    TrendingDown, ArrowUpRight, ArrowDownRight,
    Zap, Megaphone, ShieldCheck, Banknote,
    CreditCard, TrendingUpDown, PiggyBank
} from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, icon: Icon, color, sub, trend, prefix = '' }: {
    label: string; value: number; icon: React.ElementType; color: string; sub: string; trend?: number; prefix?: string;
}) {
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all duration-300">
            <div className={cn("absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity", color)} />
            <div className="relative z-10">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm", color)}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tabular-nums">{prefix}{value.toLocaleString()}</p>
                    {trend !== undefined && trend !== 0 && (
                        <span className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                            trend > 0 ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                        )}>
                            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
                <div className="flex items-center gap-2 mt-3 text-[10px] font-medium text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-green-500/50" />
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
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-semibold uppercase tracking-[0.2em] text-xs">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    const cards = [
        { label: 'Total Base Users', value: stats?.total ?? 0, icon: Users, color: 'bg-gradient-to-br from-blue-500 to-blue-600', sub: 'Verified & Pending Accounts', trend: 12 },
        { label: 'Academic Tutors', value: stats?.tutors ?? 0, icon: GraduationCap, color: 'bg-gradient-to-br from-blue-400 to-cyan-500', sub: 'Subject Matter Experts', trend: 8 },
        { label: 'Active Students', value: stats?.students ?? 0, icon: Activity, color: 'bg-gradient-to-br from-emerald-500 to-teal-600', sub: 'Enrolled in Sessions', trend: 24 },
        { label: 'Operators', value: stats?.admins ?? 0, icon: UserCog, color: 'bg-gradient-to-br from-amber-500 to-orange-500', sub: 'System Administrators', trend: 0 },
    ];

    const earningsCards = [
        {
            label: 'Platform Revenue',
            value: stats?.earnings?.totalRevenue ?? 0,
            icon: Banknote,
            color: 'bg-gradient-to-br from-green-500 to-emerald-600',
            sub: 'Total Transaction Volume',
            trend: 15,
            prefix: 'Rs. '
        },
        {
            label: 'Admin Earnings',
            value: stats?.earnings?.adminEarnings ?? 0,
            icon: PiggyBank,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
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
        <div className="p-10 space-y-10 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Platform <span className="text-blue-600">Overview</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 mt-1 font-medium">Real-time pulse of your tutoring ecosystem.</p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all shadow-sm"
                >
                    <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                    Refresh Analytics
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => <StatCard key={i} {...card} />)}
            </div>

            {/* Admin Earnings Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                        <Banknote className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Revenue <span className="text-green-600 dark:text-emerald-400">Analytics</span>
                        </h2>
                        <p className="text-slate-500 mt-0.5 font-medium text-sm">Platform earnings and transaction insights.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {earningsCards.map((card, i) => <StatCard key={`earnings-${i}`} {...card} />)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-48 h-48 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Engagement Activity</h2>
                        <p className="text-slate-500 font-medium text-sm">Platform growth and retention trends over the last 30 days.</p>
                    </div>
                    <div className="h-64 flex items-end gap-2 px-4">
                        {[40, 65, 45, 90, 65, 80, 50, 75, 40, 95, 60, 45].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-t-lg group/bar relative">
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded pointer-events-none">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] px-2">
                        <span>January</span>
                        <span>February</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 flex flex-col justify-between text-white shadow-md group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-20 transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700">
                        <Zap className="w-64 h-64" />
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-xl border border-white/20">
                            <Megaphone className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Quick Broadcast</h2>
                        <p className="text-blue-100 font-medium text-sm leading-relaxed">Need to alert all users about scheduled maintenance or new features?</p>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <Link
                            href="/admin/announcements"
                            className="w-full py-3.5 bg-white text-blue-700 rounded-xl font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            Open Broadcast Center <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <p className="text-[9px] font-semibold text-blue-200/60 uppercase tracking-[0.2em] text-center">Managed by {user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
