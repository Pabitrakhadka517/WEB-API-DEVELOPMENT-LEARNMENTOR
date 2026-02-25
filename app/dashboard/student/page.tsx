'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import {
    BookOpen, Award, Clock, Search, MessageCircle, CheckCircle,
    ArrowRight, Shield, TrendingUp, Star, Calendar, Zap,
    Users, DollarSign, ChevronRight, Play, BarChart2, Target,
    CalendarCheck2,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dashboardService, StudentStats } from '@/services/dashboard.service';
import { bookingService, Booking } from '@/services/booking.service';
import { tutorService, Tutor } from '@/services/tutor.service';

// Mini progress bar component
const ProgressBar = ({ value, max, color = 'bg-blue-500' }: { value: number; max: number; color?: string }) => (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
            className={cn("h-2 rounded-full transition-all duration-700", color)}
            style={{ width: `${Math.min(100, (value / Math.max(max, 1)) * 100)}%` }}
        />
    </div>
);

// Sparkline chart (simple SVG)
const SparkLine = ({ data, color = '#2563eb' }: { data: number[]; color?: string }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const w = 80, h = 32;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-70">
            <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
        </svg>
    );
};

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [recommendedTutors, setRecommendedTutors] = useState<Tutor[]>([]);
    const [bookedTutorIds, setBookedTutorIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, bookingsRes, tutorsRes] = await Promise.allSettled([
                dashboardService.getStudentStats(),
                bookingService.getBookings({ limit: 10 }),
                tutorService.getTutors({ limit: 4, sortBy: 'rating', order: 'desc' })
            ]);
            if (statsRes.status === 'fulfilled' && statsRes.value.success) {
                setStats(statsRes.value.stats);
            }
            if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success) {
                const all = bookingsRes.value.bookings;
                setUpcomingBookings(all.filter(b => ['PENDING', 'CONFIRMED', 'PAID'].includes(b.status)).slice(0, 3));
                setRecentBookings(all.filter(b => b.status === 'COMPLETED').slice(0, 4));

                const ids = new Set(all.map(b =>
                    typeof b.tutor === 'string' ? b.tutor : b.tutor._id
                ));
                setBookedTutorIds(ids);
            }
            if (tutorsRes.status === 'fulfilled') {
                setRecommendedTutors(tutorsRes.value.tutors);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role !== 'STUDENT') return;
        fetchDashboardData();
    }, [user]);

    const handleComplete = async (bookingId: string) => {
        try {
            await bookingService.completeBooking(bookingId);
            if (confirm('✅ Session marked as COMPLETED! Would you like to head to the Library to review materials?')) {
                router.push('/dashboard/study');
            } else {
                fetchDashboardData();
            }
        } catch (err) {
            console.error('Failed to complete booking', err);
        }
    };

    if (user?.role !== 'STUDENT') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mt-2">
                    This area is restricted to Students only. Your account role is <strong>{user?.role}</strong>.
                </p>
                <button
                    onClick={() => router.replace(user?.role === 'TUTOR' ? '/dashboard/tutor' : '/login')}
                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                    {user?.role === 'TUTOR' ? 'Go to Tutor Dashboard' : 'Back to Login'}
                </button>
            </div>
        );
    }

    const isProfileIncomplete = !user?.phone || !user?.address;

    const statCards = [
        {
            label: 'Total Bookings',
            value: stats?.totalBookings ?? '—',
            sub: 'All time',
            icon: BookOpen,
            color: 'from-blue-500 to-blue-600',
            glow: 'shadow-blue-500/20',
            spark: [1, 3, 2, 5, 4, 6, 5, stats?.totalBookings || 7]
        },
        {
            label: 'Upcoming Sessions',
            value: stats?.upcomingBookings ?? '—',
            sub: 'Scheduled',
            icon: Calendar,
            color: 'from-blue-500 to-blue-600',
            glow: 'shadow-blue-500/20',
            spark: [0, 1, 2, 1, 3, 2, 4, stats?.upcomingBookings || 3]
        },
        {
            label: 'Completed',
            value: stats?.completedBookings ?? '—',
            sub: 'Sessions done',
            icon: CheckCircle,
            color: 'from-emerald-500 to-teal-600',
            glow: 'shadow-emerald-500/20',
            spark: [0, 1, 1, 2, 3, 4, 5, stats?.completedBookings || 6]
        },
        {
            label: 'Total Spent',
            value: stats?.totalSpent ? `Rs. ${stats.totalSpent.toLocaleString()}` : '—',
            sub: 'Payments made',
            icon: DollarSign,
            color: 'from-amber-500 to-orange-500',
            glow: 'shadow-amber-500/20',
            spark: [100, 200, 150, 400, 300, 500, 450, stats?.totalSpent || 600]
        },
    ];

    const formatDate = (d: string) => new Date(d).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'PAID': return 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'PENDING': return 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'COMPLETED': return 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <img src="/learnmentor.png" alt="LearnMentor" className="w-5 h-5 object-contain" />
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest">Student Dashboard</p>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Welcome Back, {user?.name?.split(' ')[0] || 'Student'}! <span className="animate-bounce inline-block">🎓</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Ready to continue your learning journey today?</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/tutors" className="hidden md:flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all text-sm shadow-lg shadow-blue-600/20 items-center gap-2">
                        <Search className="w-4 h-4" /> Find Tutors
                    </Link>
                    <Link href="/dashboard/wallet" className="hidden md:flex px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold transition-all text-sm items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Wallet
                    </Link>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Online</span>
                    </div>
                </div>
            </div>

            {/* Profile Warning */}
            {isProfileIncomplete && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between text-amber-800 dark:text-amber-200 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl">⚠️</div>
                        <div>
                            <p className="font-bold">Your Profile is Incomplete</p>
                            <p className="text-sm opacity-80">Adding your details helps us match you with the best tutors.</p>
                        </div>
                    </div>
                    <Link href="/dashboard/profile" className="shrink-0 px-6 py-2.5 bg-amber-500 text-black font-bold rounded-xl text-sm hover:bg-amber-400 transition-all">
                        Fix Now
                    </Link>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                        <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity", stat.color)} />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", stat.color, stat.glow)}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                                <SparkLine data={stat.spark} />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{loading ? '...' : stat.value}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Sessions */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Sessions</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your scheduled classes</p>
                        </div>
                        <Link href="/dashboard/bookings" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}
                        </div>
                    ) : upcomingBookings.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No upcoming sessions</p>
                            <Link href="/dashboard/tutors" className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block">Find a tutor →</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingBookings.map((booking) => {
                                const tutorName = (booking.tutor as any)?.fullName || (booking.tutor as any)?.name || 'Tutor';
                                const tutorImg = (booking.tutor as any)?.profileImage;
                                return (
                                    <div key={booking._id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg overflow-hidden shrink-0">
                                            {tutorImg ? <img src={tutorImg} alt={tutorName} className="w-full h-full object-cover" /> : tutorName[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-white truncate">Session with {tutorName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(booking.startTime)} · {formatTime(booking.startTime)} – {formatTime(booking.endTime)}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase", getStatusColor(booking.status))}>
                                                {booking.status}
                                            </span>
                                            {(booking.status === 'CONFIRMED' || booking.status === 'PAID') && (
                                                <div className="flex gap-2">
                                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all">
                                                        <Play className="w-3 h-3" /> Join
                                                    </button>
                                                    <button
                                                        onClick={() => handleComplete(booking._id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                                                    >
                                                        <CheckCircle className="w-3 h-3" /> Complete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Progress Summary */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Progress</h2>
                        <BarChart2 className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Sessions Completed</span>
                                <span className="text-slate-900 dark:text-white font-bold">{stats?.completedBookings || 0}</span>
                            </div>
                            <ProgressBar value={stats?.completedBookings || 0} max={Math.max(stats?.totalBookings || 1, 1)} color="bg-blue-500" />
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-3">Quick Actions</p>
                        <div className="space-y-2">
                            <Link href="/dashboard/tutors" className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl transition-all group">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                    <Search className="w-4 h-4" /> Find Tutors
                                </div>
                                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/dashboard/bookings" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all group">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                                    <Calendar className="w-4 h-4" /> My Schedule
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/dashboard/study" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all group">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                                    <BookOpen className="w-4 h-4" /> Study Materials
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/dashboard/wallet" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all group">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                                    <DollarSign className="w-4 h-4" /> Wallet
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Tutors */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Tutors</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top-rated tutors for you</p>
                    </div>
                    <Link href="/dashboard/tutors" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline flex items-center gap-1">
                        Browse All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recommendedTutors.map((tutor) => (
                            <div key={tutor._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden shrink-0">
                                        {tutor.profileImage ? <img src={tutor.profileImage} alt={tutor.fullName} className="w-full h-full object-cover" /> : tutor.fullName[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{tutor.fullName}</p>
                                            {tutor.verificationStatus === 'VERIFIED' && (
                                                <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{tutor.speciality || 'Tutor'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{tutor.rating?.toFixed(1) || 'New'}</span>
                                    </div>
                                    {bookedTutorIds.has(tutor._id) && (
                                        <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                                            <CalendarCheck2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">Booked</span>
                                        </div>
                                    )}
                                    {tutor.hourlyRate && (
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Rs. {tutor.hourlyRate}/hr</span>
                                    )}
                                </div>
                                {!bookedTutorIds.has(tutor._id) ? (
                                    <Link href={`/dashboard/book/${tutor._id}`} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
                                        <BookOpen className="w-3 h-3" /> Book Now
                                    </Link>
                                ) : (
                                    <Link href="/dashboard/bookings" className="w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
                                        <CalendarCheck2 className="w-3 h-3" /> View Schedule
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Sessions */}
            {recentBookings.length > 0 && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Sessions</h2>
                        <Link href="/dashboard/bookings?status=COMPLETED" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline flex items-center gap-1">
                            View History <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentBookings.map((booking) => {
                            const tutorName = (booking.tutor as any)?.fullName || (booking.tutor as any)?.name || 'Tutor';
                            return (
                                <div key={booking._id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">Session with {tutorName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(booking.startTime)}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Rs. {booking.price}</p>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20 uppercase">Completed</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
