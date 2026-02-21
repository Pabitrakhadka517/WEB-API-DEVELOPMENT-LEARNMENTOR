'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tutorService, bookingService, Tutor } from '@/services';
import { Loader2, Calendar, Clock, ArrowLeft, DollarSign, Info, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function BookingCreationPage() {
    const router = useRouter();
    const params = useParams();
    const tutorId = params.tutorId as string;
    const { user } = useAuthStore();

    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form State
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('1'); // hours
    const [notes, setNotes] = useState('');
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    useEffect(() => {
        if (!tutorId) return;
        const fetchTutor = async () => {
            try {
                const response = await tutorService.getTutorById(tutorId);
                if (response.success) {
                    setTutor(response.tutor);
                } else {
                    setError('Tutor not found');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load tutor details');
            } finally {
                setLoading(false);
            }
        };
        fetchTutor();
    }, [tutorId]);

    const handleSlotSelect = (slot: any) => {
        const startDate = new Date(slot.startTime);
        setDate(startDate.toISOString().split('T')[0]);
        setTime(startDate.toTimeString().split(' ')[0].substring(0, 5));

        // Calculate duration based on slot start/end
        const endDate = new Date(slot.endTime);
        const dur = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        setDuration(dur.toString());
        setSelectedSlotId(slot._id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time || !tutor) return;

        setSubmitting(true);
        setError(null);

        try {
            // Construct ISO strings
            const startDateTime = new Date(`${date}T${time}`);
            const endDateTime = new Date(startDateTime.getTime() + parseFloat(duration) * 60 * 60 * 1000);

            // Simple validation
            // Strict future validation
            const now = new Date();
            if (startDateTime.getTime() <= now.getTime()) {
                throw new Error('You cannot book a session in the past. Please select a future date and time.');
            }

            // Buffer: Session must start at least 15 minutes from now
            const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);
            if (startDateTime < fifteenMinutesFromNow) {
                throw new Error('Sessions must be booked at least 15 minutes in advance.');
            }

            await bookingService.createBooking({
                tutorId: tutor._id,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                notes
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/bookings');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create booking');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (user?.role?.toUpperCase() === 'TUTOR') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-white">Students Only</h1>
                <p className="text-slate-400 max-w-md mt-2">
                    Tutors cannot book sessions. Please log in as a student to book a tutor.
                </p>
                <button onClick={() => router.back()} className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white">Go Back</button>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="text-center py-20 text-slate-400">
                <p>Tutor not found or profile is unavailable.</p>
                <button onClick={() => router.back()} className="mt-4 text-indigo-400 hover:underline">Go Back</button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-md mx-auto py-20 text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Booking Sent!</h2>
                <p className="text-slate-400 mb-8">Your request has been sent to {tutor.fullName}. You'll be notified once they accept.</p>
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
            </div>
        );
    }

    const hourlyRate = tutor.hourlyRate || 0;
    const totalPrice = hourlyRate * parseFloat(duration);

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Discovery
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tutor Info & Available Slots */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-3xl overflow-hidden mx-auto mb-4 border-2 border-indigo-500/30">
                            {tutor.profileImage ? (
                                <img src={tutor.profileImage} alt={tutor.fullName} className="w-full h-full object-cover" />
                            ) : (
                                tutor.fullName?.[0] || 'T'
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{tutor.fullName}</h3>
                        <p className="text-sm text-slate-400 mb-4">{tutor.speciality || 'Professional Tutor'}</p>
                        <div className="flex items-center justify-center text-emerald-400 font-bold text-lg mb-4">
                            Rs. {tutor.hourlyRate}/hr
                        </div>
                        <div className="pt-4 border-t border-white/5 text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Expertise</p>
                            <div className="flex flex-wrap gap-2">
                                {tutor.subjects && tutor.subjects.length > 0 ? tutor.subjects.map(s => (
                                    <span key={s} className="px-2 py-1 bg-indigo-500/10 rounded-md text-[10px] text-indigo-300 border border-indigo-500/20">{s}</span>
                                )) : (
                                    <span className="text-xs text-slate-500 italic">No subjects listed</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {tutor.availableSlots && tutor.availableSlots.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h4 className="font-bold text-white mb-4 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                Recommended Slots
                            </h4>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {tutor.availableSlots
                                    .filter(slot => new Date(slot.startTime) > new Date())
                                    .map((slot) => (
                                        <button
                                            key={slot._id}
                                            type="button"
                                            onClick={() => handleSlotSelect(slot)}
                                            className={cn(
                                                "w-full text-left p-3 rounded-2xl border transition-all text-sm",
                                                selectedSlotId === slot._id
                                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                                    : "bg-[#0b0f1a] border-white/5 text-slate-300 hover:border-white/20"
                                            )}
                                        >
                                            <div className="font-bold">
                                                {formatDate(new Date(slot.startTime), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="text-xs opacity-70">
                                                {formatDate(new Date(slot.startTime), 'hh:mm a')} - {formatDate(new Date(slot.endTime), 'hh:mm a')}
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Booking Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/10 bg-indigo-600/5">
                            <h2 className="text-2xl font-bold text-white">Setup Your Session</h2>
                            <p className="text-slate-400 text-sm mt-1">Pick your preferred time and tell the tutor about your goals.</p>
                        </div>

                        <div className="p-8">
                            {error && (
                                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-start animate-in shake duration-300">
                                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Session Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toLocaleDateString('en-CA')}
                                                className="w-full pl-12 pr-4 py-3.5 bg-[#0b0f1a] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                                value={date}
                                                onChange={(e) => {
                                                    setDate(e.target.value);
                                                    setSelectedSlotId(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Start Time</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="time"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-[#0b0f1a] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                                value={time}
                                                onChange={(e) => {
                                                    setTime(e.target.value);
                                                    setSelectedSlotId(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 ml-1">Session Duration</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['0.5', '1', '1.5', '2'].map((dur) => (
                                            <button
                                                key={dur}
                                                type="button"
                                                onClick={() => {
                                                    setDuration(dur);
                                                    setSelectedSlotId(null);
                                                }}
                                                className={cn(
                                                    "py-3 rounded-2xl border transition-all text-sm font-bold",
                                                    duration === dur
                                                        ? "bg-white/10 border-indigo-600 text-white"
                                                        : "bg-[#0b0f1a] border-white/10 text-slate-400 hover:border-white/20"
                                                )}
                                            >
                                                {dur === '0.5' ? '30m' : `${dur}h`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 ml-1">Notes for the Tutor</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3.5 bg-[#0b0f1a] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 resize-none"
                                        placeholder="E.g. I need help with Algebra 2 equations..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-3xl p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Investment</p>
                                        <div className="flex items-center text-3xl font-black text-white">
                                            <span className="text-indigo-400 mr-1 text-xl">Rs.</span>
                                            {totalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 italic">Rate: Rs. {hourlyRate}/hr</p>
                                        <p className="text-xs text-slate-500 italic">Duration: {duration}h</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center active:scale-[0.98]"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                            Booking...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatDate(date: Date, pattern: string) {
    if (pattern === 'MMM dd, yyyy') {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
    }
    if (pattern === 'hh:mm a') {
        return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
    }
    return date.toLocaleString();
}
