'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { transactionService, Transaction } from '@/services/transaction.service';
import { dashboardService, TutorStats } from '@/services/dashboard.service';
import { cn } from '@/lib/utils';
import {
    DollarSign, TrendingUp, ArrowDownLeft, Loader2, Shield,
    CheckCircle, XCircle, Clock, BarChart2, Wallet, ChevronRight,
    Calendar, ArrowUpRight
} from 'lucide-react';

// Simple bar chart
const BarChart = ({ data, maxVal }: { data: { label: string; value: number }[]; maxVal: number }) => (
    <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Rs.{d.value > 999 ? `${(d.value / 1000).toFixed(1)}k` : d.value}</span>
                <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                    <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-500 hover:to-blue-300 transition-all duration-300"
                        style={{ height: `${maxVal > 0 ? (d.value / maxVal) * 80 : 0}px`, minHeight: d.value > 0 ? '4px' : '0' }}
                    />
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{d.label}</span>
            </div>
        ))}
    </div>
);

export default function TutorEarningsPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<TutorStats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

    useEffect(() => {
        if (user?.role !== 'TUTOR') return;
        const load = async () => {
            try {
                const [statsRes, txRes] = await Promise.allSettled([
                    dashboardService.getTutorStats(),
                    transactionService.getReceivedTransactions()
                ]);
                if (statsRes.status === 'fulfilled' && statsRes.value.success) setStats(statsRes.value.stats);
                if (txRes.status === 'fulfilled' && txRes.value.success) setTransactions(txRes.value.transactions);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    if (user?.role !== 'TUTOR') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
            </div>
        );
    }

    const completedTx = transactions.filter(t => t.status === 'completed');
    const pendingTx = transactions.filter(t => t.status === 'pending');
    const totalEarnings = completedTx.reduce((sum, t) => sum + t.amount, 0);
    const pendingEarnings = pendingTx.reduce((sum, t) => sum + t.amount, 0);

    // Generate weekly data from transactions
    const weeklyData = (() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const now = new Date();
        return days.map((label, i) => {
            const dayDate = new Date(now);
            dayDate.setDate(now.getDate() - (6 - i));
            const value = completedTx
                .filter(t => new Date(t.createdAt).toDateString() === dayDate.toDateString())
                .reduce((sum, t) => sum + t.amount, 0);
            return { label, value };
        });
    })();

    // Generate monthly data
    const monthlyData = (() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((label, i) => {
            const value = completedTx
                .filter(t => new Date(t.createdAt).getMonth() === i)
                .reduce((sum, t) => sum + t.amount, 0);
            return { label, value };
        });
    })();

    const chartData = activeTab === 'weekly' ? weeklyData : monthlyData;
    const maxVal = Math.max(...chartData.map(d => d.value), 1);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'failed': return 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-widest mb-1">Tutor Finance</p>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Earnings Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Track your income, pending payments, and withdrawals.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Earnings', value: `Rs. ${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', sub: 'All time' },
                    { label: 'Pending Payout', value: `Rs. ${pendingEarnings.toLocaleString()}`, icon: Clock, color: 'from-amber-500 to-orange-500', sub: 'Processing' },
                    { label: 'Completed', value: completedTx.length.toString(), icon: CheckCircle, color: 'from-blue-500 to-blue-600', sub: 'Transactions' },
                    { label: 'Avg per Session', value: completedTx.length > 0 ? `Rs. ${Math.round(totalEarnings / completedTx.length)}` : 'Rs. 0', icon: TrendingUp, color: 'from-blue-500 to-blue-600', sub: 'Per booking' },
                ].map((card, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className={cn("absolute top-0 right-0 w-28 h-28 bg-gradient-to-br opacity-10 blur-2xl -mr-8 -mt-8 group-hover:opacity-20 transition-opacity", card.color)} />
                        <div className="relative z-10">
                            <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg", card.color)}>
                                <card.icon className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{loading ? '...' : card.value}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{card.label}</p>
                            <p className="text-xs text-slate-600 mt-1">{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Earnings Chart */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Earnings Overview</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Your income breakdown</p>
                    </div>
                    <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                        {(['weekly', 'monthly'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all capitalize",
                                    activeTab === tab ? "bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                {loading ? (
                    <div className="h-32 bg-white dark:bg-slate-800 rounded-xl animate-pulse" />
                ) : (
                    <BarChart data={chartData} maxVal={maxVal} />
                )}
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment History</h2>
                </div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-40" />
                        <p className="font-medium text-slate-900 dark:text-white mb-1">No earnings yet</p>
                        <p className="text-sm">Complete sessions to start earning.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <div key={tx._id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                                        Payment from {tx.sender?.name || 'Student'}
                                    </p>
                                    <p className="text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
                                    {tx.transactionId && (
                                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">ID: {tx.transactionId}</p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-emerald-700 dark:text-emerald-400">+Rs. {tx.amount.toLocaleString()}</p>
                                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase", getStatusColor(tx.status))}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
