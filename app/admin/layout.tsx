'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!user || user.role !== 'ADMIN') {
            router.push('/login');
        }
    }, [user, mounted, router]);

    if (!mounted || !user || user.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex">
            <AdminSidebar userName={user.fullName || user.email} />
            <div className="flex-1 ml-64">
                {children}
            </div>
        </div>
    );
}
