'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
    Shield, BarChart2, Users, Megaphone, LogOut, ChevronRight, GraduationCap, LineChart
} from 'lucide-react';

import Logo from '@/components/Logo';

export default function AdminSidebar({ userName }: { userName: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const navItems = [
        { icon: BarChart2, label: 'Overview & Stats', href: '/admin' },
        { icon: LineChart, label: 'Statistics', href: '/admin/statistics' },
        { icon: Users, label: 'All Users', href: '/admin/users' },
        { icon: GraduationCap, label: 'Tutors', href: '/admin/tutors' },
        { icon: Megaphone, label: 'Announcements', href: '/admin/announcements' },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-blue-700 to-blue-800 dark:bg-slate-800 dark:from-slate-800 dark:to-slate-800 border-r border-blue-600 dark:border-slate-700 flex flex-col shadow-lg">
            <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-500/40 dark:border-slate-700">
                <Link href="/" className="mb-2">
                    <Logo 
                        showText={false} 
                        containerClassName="w-14 h-14" 
                    />
                </Link>
                <div>
                    <p className="font-bold text-white text-sm">LearnMentor</p>
                    <p className="text-[10px] font-semibold text-blue-200 dark:text-blue-400 uppercase tracking-widest">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                <p className="text-[10px] font-semibold text-blue-200 dark:text-slate-400 uppercase tracking-widest px-3 mb-3">Management</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                isActive
                                    ? "bg-white/20 dark:bg-blue-500/10 text-white dark:text-blue-400 border border-white/20 dark:border-blue-500/20 font-semibold"
                                    : "text-blue-100 dark:text-slate-400 hover:text-white dark:hover:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-700/50"
                            )}>
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-bold">{item.label}</span>
                            {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 py-4 border-t border-blue-500/40 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-white/10 dark:bg-slate-700/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-blue-500/20 flex items-center justify-center text-white dark:text-blue-400 font-bold text-sm">
                        {userName[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{userName}</p>
                        <p className="text-[10px] font-semibold text-blue-200 dark:text-blue-400 uppercase tracking-widest">Administrator</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-red-200 dark:text-slate-500 hover:text-red-100 dark:hover:text-red-500 hover:bg-red-400/20 dark:hover:bg-red-500/10 rounded-xl transition-all text-sm font-semibold"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </aside>
    );
}
