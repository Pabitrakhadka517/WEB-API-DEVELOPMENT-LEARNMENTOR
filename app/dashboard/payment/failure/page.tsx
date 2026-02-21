'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 shadow-lg">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Cancelled</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Your payment was not completed. If this was an error, please try again.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/dashboard/bookings')}
                        className="flex items-center justify-center w-full py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-2xl font-bold transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}
