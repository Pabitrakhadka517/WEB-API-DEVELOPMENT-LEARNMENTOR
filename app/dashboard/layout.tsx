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
    BookOpen
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

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

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const userLinks = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Home' },
        { href: '/dashboard/profile', icon: Settings, label: 'Profile / Settings' },
    ];

    const tutorLinks = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Tutor Dashboard' },
        { href: '/dashboard/profile', icon: Settings, label: 'Update Profile' },
    ];

    const adminLinks = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Admin Overview' },
        { href: '/dashboard/admin', icon: Shield, label: 'Admin Panel' },
        { href: '/dashboard/admin/users', icon: Users, label: 'Manage Users' },
        { href: '/dashboard/profile', icon: Settings, label: 'Profile Settings' },
    ];

    const getLinks = () => {
        if (user.role === 'admin') return adminLinks;
        if (user.role === 'tutor') return tutorLinks;
        return userLinks;
    };

    const links = getLinks();


    return (
        <div className="min-h-screen bg-[#0b0f1a] text-white flex">
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a]/50 backdrop-blur-2xl border-r border-white/5 transition-transform duration-300 lg:translate-x-0",
                    !isSidebarOpen && "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center space-x-3 mb-10 px-2">
                        <div className="bg-indigo-600 p-2 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">LearnMentor</span>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-4">
                            Menu
                        </p>
                        {links.map((link) => (
                            <SidebarItem
                                key={link.href}
                                href={link.href}
                                icon={link.icon}
                                label={link.label}
                                active={pathname === link.href}
                            />
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                                {user.name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user.name || 'User'}</p>
                                <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 w-full rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            <main className={cn(
                "flex-1 transition-all duration-300 lg:ml-72",
                !isSidebarOpen && "ml-0"
            )}>
                <header className="lg:hidden h-16 bg-[#0f172a]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
                    <span className="font-bold">LearnMentor</span>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
