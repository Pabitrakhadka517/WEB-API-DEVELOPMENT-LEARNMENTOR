'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import {
    Users, Clock, Star, MessageSquare, Calendar, TrendingUp,
    CheckCircle2, Shield, Banknote, ChevronRight, BookOpen,
    BarChart2, Award, Zap, ArrowUpRight, AlertCircle, FileCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { dashboardService, TutorStats } from '@/services/dashboard.service';
import { bookingService, Booking } from '@/services/booking.service';
import { transactionService, Transaction } from '@/services/transaction.service';
import Link from 'next/link';
import Logo from '@/components/Logo';

// Donut chart for earnings
const DonutChart = ({ percentage, color = '#2563eb' }: { percentage: number; color?: string }) => {
    const r = 36, cx = 44, cy = 44;
    const circ = 2 * Math.PI * r;
    const dash = (percentage / 100) * circ;
    return (
        <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="10" />
            <circle
                cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <text x={cx} y={cy + 5} textAnchor="middle" fill="currentColor" className="text-slate-900 dark:text-white" fontSize="13" fontWeight="bold">{percentage}%</text>
        </svg>
    );
};

// Bar chart for weekly earnings
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex items-end gap-1.5 h-20">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className="w-full bg-blue-500/70 hover:bg-blue-500 rounded-t-sm transition-all duration-500"
                        style={{ height: `${(d.value / max) * 64}px`, minHeight: d.value > 0 ? '4px' : '0' }}
                    />
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

export default function TutorDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState<TutorStats | null>(null);
    const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
    const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'TUTOR') return;
        const load = async () => {
            try {
                const [statsRes, bookingsRes, txRes] = await Promise.allSettled([
                    dashboardService.getTutorStats(),
                    bookingService.getBookings({ limit: 20 }),
                    transactionService.getReceivedTransactions()
                ]);
                if (statsRes.status === 'fulfilled' && statsRes.value.success) {
                    setStats(statsRes.value.stats);
                }
                if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success) {
                    const all = bookingsRes.value.bookings;
                    setPendingBookings(all.filter(b => b.status === 'PENDING').slice(0, 5));
                    setConfirmedBookings(all.filter(b => ['CONFIRMED', 'PAID'].includes(b.status)).slice(0, 5));
                }
                if (txRes.status === 'fulfilled' && txRes.value.success) {
                    setTransactions(txRes.value.transactions.slice(0, 5));
                }
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
                <p className="text-slate-500 dark:text-slate-400 max-w-md mt-2">
                    This area is restricted to Tutors only. Your account role is <strong>{user?.role}</strong>.
                </p>
                <button
                    onClick={() => router.replace(user?.role === 'STUDENT' ? '/dashboard/student' : '/login')}
                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                    {user?.role === 'STUDENT' ? 'Go to Student Dashboard' : 'Back to Login'}
                </button>
            </div>
        );
    }

    const isProfileIncomplete = !user?.phone || !user?.address;
    const isVerified = user?.verificationStatus === 'VERIFIED';
    const isPending = user?.verificationStatus === 'PENDING';

    const statCards = [
        { label: 'Total Students', value: stats?.totalBookings ?? '—', icon: Users, color: 'from-blue-500 to-blue-600', change: '+2 this week' },
        { label: 'Pending Requests', value: stats?.pendingBookings ?? '—', icon: AlertCircle, color: 'from-amber-500 to-orange-500', change: 'Needs action' },
        { label: 'Sessions Done', value: stats?.completedBookings ?? '—', icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', change: 'All time' },
        { label: 'Avg Rating', value: stats?.averageRating ? `${stats.averageRating.toFixed(1)}★` : '—', icon: Star, color: 'from-amber-400 to-yellow-500', change: 'From reviews' },
    ];

    const weeklyData = [
        { label: 'Mon', value: 1200 },
        { label: 'Tue', value: 2400 },
        { label: 'Wed', value: 1800 },
        { label: 'Thu', value: 3200 },
        { label: 'Fri', value: 2800 },
        { label: 'Sat', value: 4000 },
        { label: 'Sun', value: 3600 },
    ];

    const handleUpdateBooking = async (bookingId: string, status: 'CONFIRMED' | 'REJECTED') => {
        try {
            await bookingService.updateBookingStatus(bookingId, status);
            alert(`✅ Session ${status === 'CONFIRMED' ? 'accepted' : 'declined'} successfully!`);
            refreshData();
        } catch (err: any) {
            alert('❌ Failed to update: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCompleteBooking = async (bookingId: string) => {
        try {
            await bookingService.completeBooking(bookingId);
            if (confirm('✅ Session marked as COMPLETED! Would you like to head to the Library to review materials?')) {
                router.push('/dashboard/study');
            } else {
                refreshData();
            }
        } catch (err: any) {
            alert('❌ Failed to complete: ' + (err.response?.data?.message || err.message));
        }
    };

    const refreshData = async () => {
        const [statsRes, bookingsRes] = await Promise.allSettled([
            dashboardService.getTutorStats(),
            bookingService.getBookings({ limit: 20 })
        ]);
        if (statsRes.status === 'fulfilled' && statsRes.value.success) setStats(statsRes.value.stats);
        if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success) {
            const all = bookingsRes.value.bookings;
            setPendingBookings(all.filter(b => b.status === 'PENDING').slice(0, 5));
            setConfirmedBookings(all.filter(b => ['CONFIRMED', 'PAID'].includes(b.status)).slice(0, 5));
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Logo 
                            showText={false} 
                            containerClassName="w-12 h-12 shadow-sm" 
                        />
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-[0.2em]">Tutor Dashboard</p>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Welcome, {user?.name?.split(' ')[0] || 'Teacher'}! <span className="animate-bounce inline-block">👨‍🏫</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Manage your students, sessions, and earnings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/tutor/availability" className="hidden md:flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all text-sm shadow-lg shadow-blue-600/20 items-center gap-2">
                        <Calendar className="w-4 h-4" /> Set Availability
                    </Link>
                    <div className={cn("border rounded-xl px-4 py-2 flex items-center space-x-2", isVerified ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20")}>
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", isVerified ? "bg-emerald-500" : "bg-amber-500")} />
                        <span className={cn("text-xs font-bold uppercase tracking-widest", isVerified ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400")}>
                            {isVerified ? 'Verified' : isPending ? 'Pending' : 'Unverified'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Verification Banner */}
            {!isVerified && (
                <div className={cn("border rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4",
                    isPending ? "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-200" : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-200"
                )}>
                    <div className="flex items-center space-x-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl", isPending ? "bg-blue-500/20" : "bg-amber-500/20")}>
                            {isPending ? '⏳' : '⚠️'}
                        </div>
                        <div>
                            <p className="font-bold">{isPending ? 'Verification Under Review' : 'Complete Your Verification'}</p>
                            <p className="text-sm opacity-80">{isPending ? 'Your documents are being reviewed. This usually takes 1-2 business days.' : 'Upload your ID and certificates to get verified and attract more students.'}</p>
                        </div>
                    </div>
                    {!isPending && (
                        <Link href="/dashboard/tutor/verification" className="shrink-0 px-6 py-2.5 bg-amber-500 text-black font-bold rounded-xl text-sm hover:bg-amber-400 transition-all">
                            Verify Now
                        </Link>
                    )}
                </div>
            )}

            {/* Profile Warning */}
            {isProfileIncomplete && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl">📝</div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Complete Your Tutor Profile</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Students are 5x more likely to book tutors with complete profiles.</p>
                        </div>
                    </div>
                    <Link href="/dashboard/profile" className="shrink-0 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-500 transition-all">
                        Complete Now
                    </Link>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                        <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity", stat.color)} />
                        <div className="relative z-10">
                            <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg", stat.color)}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{loading ? '...' : stat.value}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">{stat.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Incoming Requests</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Students waiting for your response</p>
                            </div>
                            <Link href="/dashboard/bookings?status=PENDING" className="text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        {loading ? (
                            <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}</div>
                        ) : pendingBookings.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">No pending requests</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingBookings.map((booking) => {
                                    const studentName = (booking.student as any)?.fullName || (booking.student as any)?.name || 'Student';
                                    return (
                                        <div key={booking._id} className="flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold shrink-0">
                                                {studentName[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{studentName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(booking.startTime)} · {formatTime(booking.startTime)}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleUpdateBooking(booking._id, 'CONFIRMED')}
                                                    className="px-3 py-1.5 bg-emerald-500 text-black rounded-lg text-xs font-bold hover:bg-emerald-400 transition-all"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateBooking(booking._id, 'REJECTED')}
                                                    className="px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Confirmed Sessions */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Sessions</h2>
                            <Link href="/dashboard/bookings?status=CONFIRMED" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        {loading ? (
                            <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}</div>
                        ) : confirmedBookings.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">No confirmed sessions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {confirmedBookings.map((booking) => {
                                    const studentName = (booking.student as any)?.fullName || (booking.student as any)?.name || 'Student';
                                    return (
                                        <div key={booking._id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                                                {studentName[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{studentName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(booking.startTime)} · {formatTime(booking.startTime)} – {formatTime(booking.endTime)}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Rs. {booking.price}</p>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 uppercase">
                                                        {booking.status === 'PAID' ? 'Paid' : 'Confirmed'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleCompleteBooking(booking._id)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-1"
                                                >
                                                    <CheckCircle2 className="w-3 h-3" /> Complete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Earnings Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-blue-600/20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Total Earnings</p>
                                <TrendingUp className="w-5 h-5 text-blue-300" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">
                                Rs. {stats?.totalEarnings?.toLocaleString() || '0'}
                            </p>
                            <p className="text-blue-200 text-xs mb-5">All time earnings</p>
                            <BarChart data={weeklyData} />
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Link href="/dashboard/tutor/earnings" className="w-full py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                    <BarChart2 className="w-4 h-4" /> Full Analytics
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-4">Quick Actions</p>
                        <div className="space-y-2">
                            {[
                                { href: '/dashboard/tutor/availability', icon: Calendar, label: 'Manage Availability', color: 'text-blue-600 dark:text-blue-400' },
                                { href: '/dashboard/study', icon: BookOpen, label: 'Study Materials', color: 'text-blue-600 dark:text-blue-400' },
                                { href: '/dashboard/tutor/students', icon: Users, label: 'My Students', color: 'text-blue-600 dark:text-blue-400' },
                                { href: '/dashboard/tutor/earnings', icon: Banknote, label: 'Earnings & Payouts', color: 'text-emerald-700 dark:text-emerald-400' },
                                { href: '/dashboard/tutor/reviews', icon: Star, label: 'Reviews & Ratings', color: 'text-amber-600 dark:text-amber-400' },
                                { href: '/dashboard/tutor/verification', icon: FileCheck, label: 'Verification Panel', color: 'text-blue-600 dark:text-blue-400' },
                            ].map((item) => (
                                <Link key={item.href} href={item.href} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 rounded-xl transition-all group">
                                    <div className={cn("flex items-center gap-2 font-bold text-sm", item.color)}>
                                        <item.icon className="w-4 h-4" /> {item.label}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
