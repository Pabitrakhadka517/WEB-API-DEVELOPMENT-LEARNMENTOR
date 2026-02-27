'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentService } from '@/services';
import { Loader2, CheckCircle, AlertCircle, ArrowRight, MessageCircle } from 'lucide-react';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verify = async (retries = 2) => {
            const dataParam = searchParams.get('data');
            if (!dataParam) {
                setStatus('error');
                setMessage('No payment data received from eSewa.');
                return;
            }

            try {
                // 1. Decode payload
                const decodedData = JSON.parse(atob(dataParam));
                console.log('Decoded eSewa Data:', decodedData);

                const { transaction_code, transaction_uuid, status: esewaStatus } = decodedData;

                if (esewaStatus !== 'COMPLETE') {
                    setStatus('error');
                    setMessage(`Payment status: ${esewaStatus}`);
                    return;
                }

                // 2. Call backend to verify and update DB
                // Send full eSewa callback data for server-side signature verification
                await paymentService.verifyPayment(transaction_uuid, decodedData);

                setStatus('success');
                setMessage('Payment successful! Your booking is now confirmed and chatting is enabled.');

            } catch (err: any) {
                console.error('Verification error:', err);
                const statusCode = err.response?.status;
                const errorMessage = err.response?.data?.message || err.message || 'Failed to verify payment.';

                // Retry on 502 (eSewa gateway issues) or network errors
                if (retries > 0 && (statusCode === 502 || !err.response)) {
                    console.log(`Retrying verification... (${retries} attempts left)`);
                    setMessage('Verifying payment... retrying...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return verify(retries - 1);
                }

                setStatus('error');
                setMessage(errorMessage);
            }
        };

        verify();
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 shadow-lg">
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifying Payment</h2>
                            <p className="text-slate-500 dark:text-slate-400">{message}</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Complete!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">{message}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => router.push('/dashboard/messages')}
                                    className="flex items-center justify-center w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/25"
                                >
                                    Open Chat with Tutor
                                    <MessageCircle className="w-5 h-5 ml-2" />
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/bookings')}
                                    className="flex items-center justify-center w-full py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all border border-slate-200 dark:border-slate-700"
                                >
                                    View My Bookings
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h2>
                            <p className="text-red-600 dark:text-red-400 mb-8">{message}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold transition-all border border-slate-200 dark:border-slate-700"
                                >
                                    Retry Verification
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/bookings')}
                                    className="py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center"
                                >
                                    Return to My Bookings
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
