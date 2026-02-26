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
    Banknote,
    Star,
    TrendingUp,
    FileCheck,
    Wallet,
    GraduationCap,
    Play,
    BarChart2,
    Target,
    CalendarCheck2
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

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
            "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-white/20 dark:bg-blue-500/10 text-white dark:text-blue-400 font-semibold"
                : "text-blue-100 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-700/50 hover:text-white dark:hover:text-white"
        )}
    >
        <Icon className={cn("w-5 h-5", active ? "text-white dark:text-blue-400" : "text-blue-200 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white")} />
        <span className="font-medium">{label}</span>
        {active && <ChevronRight className="w-4 h-4 ml-auto text-white dark:text-blue-500" />}
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

    // Role-based route protection: redirect to the correct dashboard
    useEffect(() => {
        if (!mounted || !user) return;

        const role = user.role;
        const isTutorRoute = pathname === '/dashboard/tutor' || pathname?.startsWith('/dashboard/tutor/');
        const isStudentRoute = pathname === '/dashboard/student' || pathname?.startsWith('/dashboard/student/');

        // Student accessing tutor-only routes
        if (isTutorRoute && role === 'STUDENT') {
            router.replace('/dashboard/student');
            return;
        }
        // Tutor accessing student-only routes
        if (isStudentRoute && role === 'TUTOR') {
            router.replace('/dashboard/tutor');
            return;
        }
    }, [mounted, user, pathname, router]);

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
        { href: '/dashboard/wallet', icon: Banknote, label: 'Wallet & Payments' },
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
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-700 to-blue-800 dark:bg-slate-800 dark:from-slate-800 dark:to-slate-800 border-r border-blue-600 dark:border-slate-700 transition-transform duration-300 lg:translate-x-0 overflow-hidden shadow-lg",
                    !isSidebarOpen && "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="mb-10 px-8 pt-6 flex-shrink-0">
                        <Link href="/">
                            <Logo 
                                textClassName="text-white text-2xl" 
                                containerClassName="w-14 h-14"
                            />
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-blue-300 dark:hover:scrollbar-thumb-slate-500 px-6">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200 dark:text-slate-400 mb-4 px-4">
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
                        <div className="border-t border-blue-500/40 dark:border-slate-700 pt-4">
                            {/* Enhanced Logout Button */}
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-xl transition-all duration-200 group ${isLoggingOut
                                        ? 'bg-red-400/20 dark:bg-red-500/10 text-red-200 dark:text-red-500 cursor-not-allowed'
                                        : 'text-red-200 dark:text-red-500 hover:bg-red-400/20 dark:hover:bg-red-500/10 hover:text-red-100 dark:hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/30'
                                    }`}
                                aria-label="Logout from your account"
                            >
                                <LogOut className={`w-5 h-5 transition-colors ${isLoggingOut ? 'animate-pulse text-red-300 dark:text-red-400' : 'group-hover:text-red-100 dark:group-hover:text-red-500'
                                    }`} />
                                <span className="font-medium">
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </span>
                                {isLoggingOut && (
                                    <div className="ml-auto w-4 h-4 border-2 border-red-300 dark:border-red-400 border-t-transparent rounded-full animate-spin" />
                                )}
                            </button>
                        </div>

                        {/* User Profile Section */}
                        <div className="bg-white/10 dark:bg-slate-700/30 rounded-xl p-4 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                                {user.fullName?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-bold truncate text-white">{user.fullName || 'User'}</p>
                                    {user.role === 'TUTOR' && user.verificationStatus === 'VERIFIED' && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                                    )}
                                </div>
                                <p className="text-[10px] font-semibold tracking-widest text-blue-200 dark:text-slate-400 uppercase">{user.role}</p>
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
                <header className="lg:hidden h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
                    <Link href="/">
                        <Logo 
                            showText={false} 
                            containerClassName="w-11 h-11" 
                        />
                    </Link>
                    <div className="flex items-center space-x-3">
                        <ThemeToggle variant="button" size="sm" />

                        {/* Mobile Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="p-2 text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-lg lg:hidden"
                            aria-label="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>

                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 dark:text-slate-400">
                            {isSidebarOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto dashboard-bg min-h-[calc(100vh-4rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
