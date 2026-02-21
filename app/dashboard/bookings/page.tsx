'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookingService, Booking, chatService, paymentService } from '@/services';
import { Loader2, Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, DollarSign, MessageCircle, Star, CreditCard, Info, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ReviewModal } from '@/components/ReviewModal';

export default function BookingsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Modal State
    const [reviewModalData, setReviewModalData] = useState<{ bookingId: string; tutorName: string } | null>(null);
    const [editModalData, setEditModalData] = useState<Booking | null>(null);
    const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const isStudent = user?.role?.toLowerCase() === 'user' || user?.role?.toLowerCase() === 'student';

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getBookings({
                status: filterStatus === 'all' ? undefined : filterStatus
            });
            setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [filterStatus]);

    const handleStatusUpdate = async (bookingId: string, status: 'CONFIRMED' | 'REJECTED') => {
        try {
            await bookingService.updateBookingStatus(bookingId, status);
            fetchBookings(); // Refresh list
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const handleComplete = async (bookingId: string) => {
        try {
            await bookingService.completeBooking(bookingId);
            if (confirm('✅ Session marked as COMPLETED! Would you like to head to the Library to review materials?')) {
                router.push('/dashboard/study');
            } else {
                fetchBookings();
            }
        } catch (err) {
            console.error('Failed to complete booking', err);
        }
    };

    const handleCancel = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancelBooking(bookingId, 'User cancelled');
            alert('✅ Booking cancelled successfully');
            fetchBookings();
        } catch (err: any) {
            alert('❌ Failed to cancel: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editModalData) return;

        setIsEditing(true);
        try {
            await bookingService.updateBooking(editModalData._id, {
                startTime: new Date(editModalData.startTime).toISOString(),
                endTime: new Date(editModalData.endTime).toISOString(),
                notes: editModalData.notes
            });
            alert('✅ Booking updated successfully!');
            setEditModalData(null);
            fetchBookings();
        } catch (err: any) {
            alert('❌ Failed to update: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsEditing(false);
        }
    };

    const handleChat = async (targetId: string) => {
        try {
            const response = await chatService.createChat(targetId);
            if (response.success && response.chat) {
                router.push(`/dashboard/messages?chatId=${response.chat._id}`);
            }
        } catch (err: any) {
            console.error('Failed to start chat', err);
            alert(err.response?.data?.message || 'Failed to start chat. Ensure you have a paid booking.');
        }
    };

    const handlePayment = async (bookingId: string) => {
        setPaymentLoading(bookingId);
        try {
            const data = await paymentService.initBookingTransaction(bookingId);
            console.log('eSewa Init Data:', data);
            // data contains: transactionId, amount, product_code, transaction_uuid, success_url, failure_url

            // Generate signature
            const signature = paymentService.generateSignature(
                data.amount,
                data.transaction_uuid,
                data.product_code,
                process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY ?? "8gBm/:&EnhH.1/q"
            );

            // Create eSewa form and submit it
            const form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

            const fields = {
                amount: data.amount,
                tax_amount: 0,
                total_amount: data.amount,
                transaction_uuid: data.transaction_uuid,
                product_code: data.product_code,
                product_service_charge: 0,
                product_delivery_charge: 0,
                success_url: data.success_url,
                failure_url: data.failure_url,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature: signature
            };

            for (const key in fields) {
                const hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('value', (fields as any)[key]);
                form.appendChild(hiddenField);
            }

            document.body.appendChild(form);
            form.submit();
        } catch (err: any) {
            console.error('Payment initialization failed', err);
            alert('Failed to initialize payment: ' + (err.response?.data?.message || err.message));
        } finally {
            setPaymentLoading(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString([], {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const safeDate = (dateStr: string | undefined | null): Date | null => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    };

    const formatTime = (dateStr: string) => {
        const d = safeDate(dateStr);
        return d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'PAID': return 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'COMPLETED': return 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'PENDING': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'CANCELLED':
            case 'REJECTED': return 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-600 dark:text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Bookings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your upcoming and past sessions.</p>
                </div>

                <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar">
                    {['all', 'PENDING', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap",
                                filterStatus === status
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            {status.toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No bookings found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">You don't have any bookings with this status.</p>
                    {user?.role === 'STUDENT' && (
                        <button
                            onClick={() => router.push('/dashboard/tutors')}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors"
                        >
                            Find a Tutor
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {/* Test Credentials Info for Demo */}
                    {isStudent && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-3 mb-2 animate-in slide-in-from-top-2">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                <p className="font-bold text-blue-600 dark:text-blue-300 mb-1">Testing Payments?</p>
                                <p>To pay via eSewa Sandbox, use these test credentials on the payment page:</p>
                                <ul className="list-disc list-inside mt-1 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                    <li>eSewa ID: <span className="text-slate-900 dark:text-white">9806800001</span></li>
                                    <li>Password: <span className="text-slate-900 dark:text-white">testuser</span></li>
                                    <li>MPIN: <span className="text-slate-900 dark:text-white">1122</span></li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {bookings.map((booking) => {
                        const otherUser = isStudent ? booking.tutor : booking.student;
                        const otherUserName = otherUser?.fullName || otherUser?.name || 'Unknown User';

                        return (
                            <div key={booking._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex flex-col md:flex-row gap-6">
                                {/* Date/Time Column */}
                                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl min-w-[120px] text-center border border-slate-100 dark:border-slate-700">
                                    <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 mb-1">{safeDate(booking.startTime)?.toLocaleDateString([], { month: 'short' }) ?? '---'}</span>
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{safeDate(booking.startTime)?.getDate() ?? '--'}</span>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{safeDate(booking.startTime)?.toLocaleDateString([], { weekday: 'long' }) ?? '---'}</span>
                                </div>

                                {/* Details Column */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest", getStatusColor(booking.status))}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center font-medium">
                                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                Session with {isStudent ? (
                                                    <button
                                                        onClick={() => router.push(`/dashboard/tutors/${booking.tutor._id}`)}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-all"
                                                    >
                                                        {otherUserName}
                                                    </button>
                                                ) : otherUserName}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        {booking.price && (
                                            <div className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                <span>
                                                    {!isStudent ? `Net Earning: Rs. ${Math.round(booking.price * 0.9)}` : `Price: Rs. ${booking.price}`}
                                                </span>
                                            </div>
                                        )}
                                        {otherUser?.email && (
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                <span>{otherUser.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {booking.notes && (
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                            <span className="font-bold text-slate-500 dark:text-slate-400 block text-[10px] mb-2 uppercase tracking-widest">Notes for Session</span>
                                            {booking.notes}
                                        </div>
                                    )}
                                </div>

                                {/* Actions Column */}
                                <div className="flex flex-col gap-2 min-w-[160px] justify-center">
                                    {booking.status === 'PENDING' && user?.role?.toLowerCase() === 'tutor' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'CONFIRMED')}
                                                className="flex items-center justify-center px-4 py-3 bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Accept Request
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'REJECTED')}
                                                className="flex items-center justify-center px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Decline
                                            </button>
                                        </>
                                    )}

                                    {['CONFIRMED', 'PAID'].includes(booking.status) && (
                                        <button
                                            onClick={() => handleComplete(booking._id)}
                                            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Complete Session
                                        </button>
                                    )}

                                    {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            className="flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Cancel
                                        </button>
                                    )}

                                    {booking.status === 'PENDING' && isStudent && (
                                        <button
                                            onClick={() => setEditModalData(booking)}
                                            className="flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Edit Request
                                        </button>
                                    )}

                                    {/* Payment Button for Students */}
                                    {booking.status === 'CONFIRMED' && isStudent && booking.paymentStatus !== 'DONE' && (
                                        <button
                                            onClick={() => handlePayment(booking._id)}
                                            disabled={paymentLoading === booking._id}
                                            className="flex items-center justify-center px-4 py-3 bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                        >
                                            {paymentLoading === booking._id ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <CreditCard className="w-4 h-4 mr-2" />
                                            )}
                                            {paymentLoading === booking._id ? 'Processing...' : 'Pay with eSewa'}
                                        </button>
                                    )}

                                    {['PAID', 'COMPLETED'].includes(booking.status) && (
                                        <button
                                            onClick={() => handleChat(otherUser?._id || '')}
                                            className="flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Message
                                        </button>
                                    )}

                                    {booking.status === 'COMPLETED' && (
                                        <button
                                            onClick={() => router.push('/dashboard/study')}
                                            className="flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Study Materials
                                        </button>
                                    )}

                                    {/* Review Button for Students */}
                                    {booking.status === 'COMPLETED' && isStudent && (
                                        <button
                                            onClick={() => setReviewModalData({ bookingId: booking._id, tutorName: otherUserName })}
                                            className="flex items-center justify-center px-4 py-3 bg-amber-500 text-black hover:bg-amber-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20"
                                        >
                                            <Star className="w-4 h-4 mr-2" />
                                            Leave Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {reviewModalData && (
                <ReviewModal
                    isOpen={!!reviewModalData}
                    bookingId={reviewModalData.bookingId}
                    tutorName={reviewModalData.tutorName}
                    onClose={() => setReviewModalData(null)}
                    onSuccess={() => {
                        setReviewModalData(null);
                        fetchBookings();
                    }}
                />
            )}

            {/* Edit Booking Modal */}
            {editModalData && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-blue-50 dark:bg-blue-900/10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Session Request</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Change date, time or notes for your booking.</p>
                            </div>
                            <button onClick={() => setEditModalData(null)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                                        value={new Date(new Date(editModalData.startTime).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                                        onChange={e => setEditModalData({ ...editModalData, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                                        value={new Date(new Date(editModalData.endTime).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                                        onChange={e => setEditModalData({ ...editModalData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Message for Tutor</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
                                    placeholder="Add any specific topics you want to cover..."
                                    value={editModalData.notes || ''}
                                    onChange={e => setEditModalData({ ...editModalData, notes: e.target.value })}
                                />
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                <p className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed">
                                    Note: Changing the time will require the tutor to re-review your request. This action cannot be undone once saved.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditModalData(null)}
                                    className="flex-1 py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isEditing}
                                    className="flex-2 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 px-8"
                                >
                                    {isEditing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    {isEditing ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
