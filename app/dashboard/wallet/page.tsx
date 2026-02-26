'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { transactionService, Transaction } from '@/services/transaction.service';
import { cn } from '@/lib/utils';
import {
    Banknote, TrendingUp, ArrowDownLeft, ArrowUpRight,
    Loader2, RefreshCw, CreditCard, Wallet, ChevronRight,
    CheckCircle, XCircle, Clock, Shield
} from 'lucide-react';

export default function WalletPage() {
    const { user } = useAuthStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTx = async () => {
            try {
                const res = await transactionService.getSentTransactions();
                if (res.success) setTransactions(res.transactions);
            } catch (e: any) {
                setError(e.message || 'Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };
        fetchTx();
    }, []);

    if (user?.role !== 'STUDENT') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mt-2">This area is restricted to Students only.</p>
            </div>
        );
    }

    const totalSpent = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
    const refundedAmount = transactions.filter(t => t.status === 'failed').reduce((sum, t) => sum + t.amount, 0);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
            case 'failed': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
            default: return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'failed': return 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Finance</p>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Wallet & Payments</h1>
                <p className="text-slate-500 dark:text-slate-400">Track your spending and payment history.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-blue-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Total Spent</p>
                            <Banknote className="w-5 h-5 text-blue-300" />
                        </div>
                        <p className="text-3xl font-bold text-white">Rs. {totalSpent.toLocaleString()}</p>
                        <p className="text-blue-200 text-xs mt-1">{transactions.filter(t => t.status === 'completed').length} completed payments</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-8 -mt-8 blur-xl" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">Pending</p>
                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">Rs. {pendingAmount.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs mt-1">{transactions.filter(t => t.status === 'pending').length} pending transactions</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-8 -mt-8 blur-xl" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">Failed/Refunds</p>
                            <RefreshCw className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">Rs. {refundedAmount.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs mt-1">{transactions.filter(t => t.status === 'failed').length} failed transactions</p>
                    </div>
                </div>
            </div>

            {/* Payment Methods Info */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Payment Methods</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-xl">🟢</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">eSewa</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Digital wallet payment</p>
                        </div>
                        <span className="ml-auto text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">Active</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl opacity-50">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Bank Transfer</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Coming soon</p>
                        </div>
                        <span className="ml-auto text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">Soon</span>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transaction History</h2>
                        <p className="text-xs text-slate-500 mt-0.5">All your payment records</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-400">
                        <XCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>{error}</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-40" />
                        <p className="font-medium text-slate-900 dark:text-white mb-1">No transactions yet</p>
                        <p className="text-sm">Your payment history will appear here after you book sessions.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <div key={tx._id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                                        Payment to {tx.receiver?.name || 'Tutor'}
                                    </p>
                                    <p className="text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
                                    {tx.transactionId && (
                                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">ID: {tx.transactionId}</p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-slate-900 dark:text-white">Rs. {tx.amount.toLocaleString()}</p>
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
