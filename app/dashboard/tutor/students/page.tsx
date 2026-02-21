'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { bookingService, Booking } from '@/services/booking.service';
import { chatService } from '@/services/chat.service';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
    Users, MessageCircle, Clock, CheckCircle2, Shield,
    Loader2, Search, ChevronRight, Star, Calendar, BookOpen
} from 'lucide-react';

interface StudentInfo {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    totalSessions: number;
    completedSessions: number;
    lastSession: string;
    subjects: string[];
}

export default function TutorStudentsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.role !== 'TUTOR') return;
        const load = async () => {
            try {
                const res = await bookingService.getBookings({ limit: 100 });
                if (res.success) setBookings(res.bookings);
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

    // Aggregate students from bookings
    const studentMap = new Map<string, StudentInfo>();
    bookings.forEach(booking => {
        const student = booking.student as any;
        const id = student?._id;
        if (!id) return;
        if (!studentMap.has(id)) {
            studentMap.set(id, {
                _id: id,
                name: student.fullName || student.name || 'Unknown',
                email: student.email || '',
                profileImage: student.profileImage,
                totalSessions: 0,
                completedSessions: 0,
                lastSession: booking.startTime,
                subjects: []
            });
        }
        const info = studentMap.get(id)!;
        info.totalSessions++;
        if (booking.status === 'COMPLETED') info.completedSessions++;
        if (new Date(booking.startTime) > new Date(info.lastSession)) {
            info.lastSession = booking.startTime;
        }
    });

    const students = Array.from(studentMap.values()).filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMessage = async (studentId: string) => {
        try {
            const res = await chatService.createChat(studentId);
            if (res.success && res.chat) {
                router.push(`/dashboard/messages?chatId=${res.chat._id}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">My Students</p>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Student List</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track your active students.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{students.length}</span>
                        <span className="text-xs text-slate-500 ml-1">total students</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                    { label: 'Total Students', value: students.length, icon: Users, color: 'from-blue-500 to-blue-600' },
                    { label: 'Active Students', value: students.filter(s => s.totalSessions > 0).length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
                    { label: 'Total Sessions', value: bookings.length, icon: Calendar, color: 'from-blue-500 to-blue-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0", stat.color)}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
            </div>

            {/* Student List */}
            {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : students.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                    <Users className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-40" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No students yet</h3>
                    <p className="text-slate-500 dark:text-slate-400">Students will appear here once they book sessions with you.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {students.map((student) => (
                        <div key={student._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all group">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg overflow-hidden shrink-0">
                                    {student.profileImage ? (
                                        <img src={student.profileImage} alt={student.name} className="w-full h-full object-cover" />
                                    ) : student.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{student.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{student.email}</p>
                                    <p className="text-xs text-slate-500 mt-1">Last session: {formatDate(student.lastSession)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{student.totalSessions}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Total Sessions</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{student.completedSessions}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Completed</p>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-slate-500 dark:text-slate-400">Completion Rate</span>
                                    <span className="text-slate-900 dark:text-white font-bold">
                                        {student.totalSessions > 0 ? Math.round((student.completedSessions / student.totalSessions) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                    <div
                                        className="h-1.5 rounded-full bg-blue-500 transition-all duration-700"
                                        style={{ width: `${student.totalSessions > 0 ? (student.completedSessions / student.totalSessions) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => handleMessage(student._id)}
                                className="w-full py-2.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" /> Send Message
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
