'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Settings,
    LogOut,
    ChevronRight,
    Shield,
    Users,
    Menu,
    X,
    BookOpen,
    Search,
    MessageCircle,
    Calendar,
    Bell,
    CheckCircle2,
    ShieldCheck,
    DollarSign,
    Star,
    TrendingUp,
    FileCheck,
    Wallet,
    GraduationCap
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import ThemeToggle from '@/components/ThemeToggle';

interface SidebarItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    active: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => (
    <Link
        href={href}
        className={cn(
            "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
            active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
    >
        <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-400 group-hover:text-white")} />
        <span className="font-medium">{label}</span>
        {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (mounted && !user) {
            router.push('/login');
        }
    }, [user, router, mounted]);

    if (!mounted || !user) return null;

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            
            // Call logout API endpoint if needed
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (error) {
                    console.warn('Logout API call failed:', error);
                    // Continue with local logout even if API fails
                }
            }

            // Clear local storage and state
            logout();
            
            // Redirect to login page
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if there's an error
            logout();
            router.push('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const userLinks = [
        { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/tutors', icon: Search, label: 'Find a Tutor' },
        { href: '/dashboard/bookings', icon: Calendar, label: 'My Bookings' },
        { href: '/dashboard/study', icon: BookOpen, label: 'Library' },
        { href: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
        { href: '/dashboard/wallet', icon: Wallet, label: 'Wallet & Payments' },
        { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
        { href: '/dashboard/preferences', icon: Settings, label: 'Preferences' },
        { href: '/dashboard/profile', icon: Settings, label: 'Profile / Settings' },
    ];

    const tutorLinks = [
        { href: '/dashboard/tutor', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/tutor/availability', icon: Calendar, label: 'Availability' },
        { href: '/dashboard/bookings', icon: BookOpen, label: 'Sessions' },
        { href: '/dashboard/study', icon: FileCheck, label: 'Library' },
        { href: '/dashboard/tutor/students', icon: Users, label: 'My Students' },
        { href: '/dashboard/tutor/earnings', icon: TrendingUp, label: 'Earnings' },
        { href: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
        { href: '/dashboard/tutor/reviews', icon: Star, label: 'Reviews' },
        { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
        { href: '/dashboard/profile', icon: Settings, label: 'Profile Settings' },
    ];

    const adminLinks = [
        { href: '/admin', icon: Shield, label: 'Admin Panel' },
        { href: '/dashboard/student', icon: Users, label: 'Student View' },
        { href: '/dashboard/tutor', icon: GraduationCap, label: 'Tutor View' },
        { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
        { href: '/dashboard/preferences', icon: Settings, label: 'Preferences' },
        { href: '/dashboard/profile', icon: Settings, label: 'Profile Settings' },
    ];

    const getLinks = () => {
        if (user.role === 'TUTOR') return tutorLinks;
        if (user.role === 'ADMIN') return adminLinks;
        return userLinks;
    };

    const links = getLinks();

    return (
        <div className="min-h-screen bg-[#0b0f1a] dark:bg-gray-900 text-white dark:text-gray-100 flex transition-colors duration-300">
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a]/50 dark:bg-gray-800/90 backdrop-blur-2xl border-r border-white/5 dark:border-gray-700/50 transition-transform duration-300 lg:translate-x-0 overflow-hidden",
                    !isSidebarOpen && "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-10 px-8 pt-6 flex-shrink-0">
                        <div className="bg-indigo-600 p-2 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">LearnMentor</span>
                    </div>

                    <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 px-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-4">
                            Menu
                        </p>
                        <div className="space-y-2 pb-4">
                            {links.map((link) => (
                                <SidebarItem
                                    key={link.href}
                                    href={link.href}
                                    icon={link.icon}
                                    label={link.label}
                                    active={pathname === link.href}
                                />
                            ))}
                        </div>

                        {/* Theme Toggle */}
                        <div className="mt-4 mb-4">
                            <ThemeToggle variant="dropdown" showLabel={true} size="md" />
                        </div>
                    </nav>

                    {/* Enhanced Bottom Section with Logout */}
                    <div className="flex-shrink-0 space-y-4 px-6 pb-6">
                        {/* Visual Separator */}
                        <div className="border-t border-white/10 dark:border-gray-700/50 pt-4">
                            {/* Enhanced Logout Button */}
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-2xl transition-all duration-200 group ${
                                    isLoggingOut 
                                        ? 'bg-red-500/20 text-red-300 cursor-not-allowed' 
                                        : 'text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50'
                                }`}
                                aria-label="Logout from your account"
                            >
                                <LogOut className={`w-5 h-5 transition-colors ${
                                    isLoggingOut ? 'animate-pulse text-red-300' : 'group-hover:text-red-300'
                                }`} />
                                <span className="font-medium">
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </span>
                                {isLoggingOut && (
                                    <div className="ml-auto w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                )}
                            </button>
                        </div>

                        {/* User Profile Section */}
                        <div className="bg-white/5 dark:bg-gray-700/30 rounded-2xl p-4 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                                {user.fullName?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-bold truncate text-white">{user.fullName || 'User'}</p>
                                    {user.role === 'TUTOR' && user.verificationStatus === 'VERIFIED' && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10" />
                                    )}
                                </div>
                                <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={cn(
                "flex-1 transition-all duration-300 lg:ml-72",
                !isSidebarOpen && "ml-0"
            )}>
                <AnnouncementBanner />
                <header className="lg:hidden h-16 bg-[#0f172a]/50 dark:bg-gray-800/90 backdrop-blur-md border-b border-white/5 dark:border-gray-700/50 flex items-center justify-between px-6 sticky top-0 z-40">
                    <span className="font-bold">LearnMentor</span>
                    <div className="flex items-center space-x-3">
                        <ThemeToggle variant="button" size="sm" />
                        
                        {/* Mobile Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="p-2 text-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-lg lg:hidden"
                            aria-label="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                        
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 dark:text-gray-400">
                            {isSidebarOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
