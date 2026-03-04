'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
    Shield, BarChart2, Users, Megaphone, LogOut, ChevronRight, GraduationCap, LineChart, Menu, X
} from 'lucide-react';

import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

interface AdminSidebarProps {
    userName: string;
}

export default function AdminSidebar({ userName }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthStore();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileOpen]);

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

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-500/40 dark:border-slate-700">
                <Link href="/" className="mb-2">
                    <Logo 
                        showText={false} 
                        containerClassName="w-11 h-11 sm:w-14 sm:h-14" 
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">LearnMentor</p>
                    <p className="text-[10px] font-semibold text-blue-200 dark:text-blue-400 uppercase tracking-widest">Admin Panel</p>
                </div>
                {/* Mobile close button */}
                <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
                <p className="text-[10px] font-semibold text-blue-200 dark:text-slate-400 uppercase tracking-widest px-3 mb-3">Management</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl transition-all",
                                isActive
                                    ? "bg-white/20 dark:bg-blue-500/10 text-white dark:text-blue-400 border border-white/20 dark:border-blue-500/20 font-semibold"
                                    : "text-blue-100 dark:text-slate-400 hover:text-white dark:hover:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-700/50"
                            )}>
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="text-sm font-bold truncate">{item.label}</span>
                            {isActive && <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" />}
                        </Link>
                    );
                })}

                {/* Theme Toggle - Mobile */}
                <div className="mt-4 lg:mt-6">
                    <ThemeToggle variant="dropdown" showLabel={true} size="md" />
                </div>
            </nav>

            <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-blue-500/40 dark:border-slate-700 space-y-2 flex-shrink-0">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-white/10 dark:bg-slate-700/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-blue-500/20 flex items-center justify-center text-white dark:text-blue-400 font-bold text-sm flex-shrink-0">
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
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shadow-sm">
                <Link href="/">
                    <Logo showText={false} containerClassName="w-10 h-10" />
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle variant="button" size="sm" />
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar - Desktop: fixed, Mobile: slide-in drawer */}
            <aside 
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[280px] sm:w-72 bg-gradient-to-b from-blue-700 to-blue-800 dark:from-slate-800 dark:to-slate-800 border-r border-blue-600 dark:border-slate-700 flex flex-col shadow-lg transition-transform duration-300 ease-in-out",
                    // Mobile: slide in/out
                    isMobileOpen ? "translate-x-0" : "-translate-x-full",
                    // Desktop: always visible
                    "lg:translate-x-0"
                )}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
