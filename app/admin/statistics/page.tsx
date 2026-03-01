'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService, AdminApiError } from '@/services/admin.service';
import {
    Loader2,
    Users,
    GraduationCap,
    Shield,
    Activity,
    Banknote,
    PiggyBank,
    CreditCard,
    TrendingUp,
    AlertCircle,
} from 'lucide-react';

function StatItem({
    title,
    value,
    icon: Icon,
    prefix = '',
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    prefix?: string;
}) {
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{prefix}{value}</p>
        </div>
    );
}

export default function AdminStatisticsPage() {
    const statsQuery = useQuery({
        queryKey: ['admin-stats'],
        queryFn: () => adminService.getPlatformStats(),
    });

    const error = statsQuery.error as AdminApiError | null;

    if (statsQuery.isLoading) {
        return (
            <div className="h-full flex items-center justify-center py-40">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-semibold uppercase tracking-[0.2em] text-xs">Loading Statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error.message}
                </div>
            </div>
        );
    }

    const stats = statsQuery.data;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    Platform Statistics
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time administrative metrics and earnings overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatItem title="Total Users" value={stats?.total ?? 0} icon={Users} />
                <StatItem title="Tutors" value={stats?.tutors ?? 0} icon={GraduationCap} />
                <StatItem title="Students" value={stats?.students ?? 0} icon={Activity} />
                <StatItem title="Admins" value={stats?.admins ?? 0} icon={Shield} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatItem title="Total Revenue" value={(stats?.earnings?.totalRevenue ?? 0).toLocaleString()} prefix="Rs. " icon={Banknote} />
                <StatItem title="Admin Earnings" value={(stats?.earnings?.adminEarnings ?? 0).toLocaleString()} prefix="Rs. " icon={PiggyBank} />
                <StatItem title="Transactions" value={stats?.earnings?.totalTransactions ?? 0} icon={CreditCard} />
                <StatItem title="Avg Commission" value={stats?.earnings?.averageCommission ?? 0} prefix="Rs. " icon={TrendingUp} />
            </div>
        </div>
    );
}
