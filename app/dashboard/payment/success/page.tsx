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
        const verify = async () => {
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

                const { transaction_code, transaction_uuid, status: esewaStatus, total_amount, purchase_order_id } = decodedData;

                if (esewaStatus !== 'COMPLETE') {
                    setStatus('error');
                    setMessage(`Payment status: ${esewaStatus}`);
                    return;
                }

                // 2. Call backend to verify and update DB
                // Note: purchase_order_id from eSewa is usually our transactionId if we passed it in transaction_uuid
                // Wait, in my init, I used transaction_uuid for the UUID and transactionId for my internal ID?
                // Actually, eSewa redirects with whatever we sent in transaction_uuid?
                // Let's check initTransaction. 
                // transaction_uuid is what eSewa returns as transaction_uuid.
                // We need to find the transaction by this UUID or by purchase_order_id if we used transactionId there.
                // In my frontend handlePayment:
                // transaction_uuid: data.transaction_uuid (which is transaction.transactionUuid)

                // My verify endpoint: /transactions/bookings/transaction/:tId/pay
                // I need the transactionId (tId). 
                // Wait, how do I get tId from eSewa redirect?
                // I can pass it in transaction_uuid or another field?
                // eSewa v2's transaction_uuid is the primary identifier we send.
                // It's capped at something. 

                // Let's modify the init to return transactionUuid as the key.
                // Or better, my verify endpoint should take transactionUuid instead of ID.

                // BUT, looking at dataParam decode logic:
                // The guide says: JSON to get transaction_code and transaction_uuid.
                // So I will update my backend verify endpoint to find by transactionUuid.

                await paymentService.verifyPayment(transaction_uuid, transaction_code);

                setStatus('success');
                setMessage('Payment successful! Your booking is now confirmed and chatting is enabled.');

            } catch (err: any) {
                console.error('Verification error:', err);
                setStatus('error');
                setMessage(err.response?.data?.message || err.message || 'Failed to verify payment.');
            }
        };

        verify();
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
                            <p className="text-slate-400">{message}</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Complete!</h2>
                            <p className="text-slate-400 mb-8">{message}</p>
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
                                    className="flex items-center justify-center w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
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
                            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                            <p className="text-red-400 mb-8">{message}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
                                >
                                    Retry Verification
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/bookings')}
                                    className="py-3 text-slate-400 hover:text-white transition-all flex items-center justify-center"
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
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
