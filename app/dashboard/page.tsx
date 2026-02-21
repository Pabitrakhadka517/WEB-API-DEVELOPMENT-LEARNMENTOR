'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const role = user.role;
      if (role === 'ADMIN') {
        router.replace('/admin');
      } else if (role === 'TUTOR') {
        router.replace('/dashboard/tutor');
      } else {
        router.replace('/dashboard/student');
      }
    }
  }, [user, router]);

  return (
    <div className="flex h-[60vh] items-center justify-center flex-col space-y-4">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      <p className="text-slate-400 font-medium animate-pulse">Redirecting to your dashboard...</p>
    </div>
  );
}
