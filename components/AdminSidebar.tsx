'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
    Shield, BarChart2, Users, Megaphone, LogOut, ChevronRight
} from 'lucide-react';

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
        { icon: Users, label: 'All Users', href: '/admin/users' },
        { icon: Megaphone, label: 'Announcements', href: '/admin/announcements' },
        { icon: Shield, label: 'Audit Logs', href: '#' },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#080c18] border-r border-white/5 flex flex-col">
            <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="font-black text-white text-sm">LearnMentor</p>
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 mb-3">Management</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                isActive
                                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/20"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}>
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-bold">{item.label}</span>
                            {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 py-4 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-white/5 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-sm">
                        {userName[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{userName}</p>
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Administrator</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </aside>
    );
}
