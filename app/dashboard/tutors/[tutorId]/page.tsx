'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tutorService, bookingService, reviewService, chatService, Tutor, Review } from '@/services';
import {
    Loader2, Star, MessageCircle, DollarSign, BookOpen,
    CheckCircle2, Globe, Shield, Calendar, ArrowLeft,
    Clock, Award, Book, Heart, Share2, MapPin, Zap, Users,
    ChevronRight, Monitor, Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

export default function TutorProfilePage() {
    const router = useRouter();
    const params = useParams();
    const tutorId = params.tutorId as string;
    const { user } = useAuthStore();

    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tutorId) return;
        const fetchTutorData = async () => {
            try {
                const response = await tutorService.getTutorById(tutorId);
                if (response.success) {
                    setTutor(response.tutor);
                } else {
                    setError('Tutor not found');
                }

                // Fetch Reviews
                const reviewRes = await reviewService.getTutorReviews(tutorId);
                if (reviewRes.success) {
                    setReviews(reviewRes.reviews);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load tutor details');
            } finally {
                setLoading(false);
                setReviewsLoading(false);
            }
        };
        fetchTutorData();
    }, [tutorId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="text-center py-20 px-4">
                <Shield className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-white mb-2">Tutor Profile Unavailable</h1>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">{error || "The profile you're looking for could not be found."}</p>
                <button
                    onClick={() => router.push('/dashboard/tutors')}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
                >
                    Return to Discovery
                </button>
            </div>
        );
    }

    const ratingsCount = tutor.reviewCount || 0;
    const avgRating = tutor.rating || 0;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Discovery
                </button>
                <div className="flex gap-2">
                    <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-pink-400 transition-all">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar - Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden sticky top-8 shadow-2xl">
                        {/* Profile Cover/Accent */}
                        <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20" />

                        <div className="px-8 pb-8 -mt-12 text-center">
                            <div className="w-32 h-32 rounded-[2rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-4xl overflow-hidden mx-auto mb-4 border-4 border-[#0f172a] shadow-2xl relative group">
                                {tutor.profileImage ? (
                                    <img src={tutor.profileImage} alt={tutor.fullName} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                ) : (
                                    tutor.fullName?.[0] || 'T'
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-1">
                                <h1 className="text-2xl font-black text-white">{tutor.fullName}</h1>
                                {tutor.verificationStatus === 'VERIFIED' && (
                                    <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
                                )}
                            </div>
                            <p className="text-indigo-400 font-bold text-sm mb-6 uppercase tracking-wider">{tutor.speciality || 'Certified Educator'}</p>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Rating</p>
                                    <div className="flex items-center justify-center text-amber-400 font-black">
                                        <Star className="w-4 h-4 mr-1 fill-amber-400" />
                                        {avgRating.toFixed(1)}
                                    </div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Students</p>
                                    <div className="flex items-center justify-center text-white font-black">
                                        <Users className="w-4 h-4 mr-1 text-indigo-400" />
                                        {ratingsCount > 0 ? `${ratingsCount}+` : '0'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push(`/dashboard/book/${tutor._id}`)}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    <Calendar className="w-5 h-5" /> Book a Session
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await chatService.createChat(tutor._id);
                                            if (res.success && res.chat) {
                                                router.push(`/dashboard/messages?chatId=${res.chat._id}`);
                                            }
                                        } catch (err: any) {
                                            alert(err.response?.data?.message || 'Failed to start chat. Ensure you have a paid booking.');
                                        }
                                    }}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-bold transition-all border border-white/10 flex items-center justify-center gap-3"
                                >
                                    <MessageCircle className="w-5 h-5" /> Send Message
                                </button>
                            </div>
                        </div>

                        {/* Basic Stats Footer */}
                        <div className="px-8 py-6 bg-white/5 border-t border-white/5 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Hourly Rate</p>
                                <p className="text-lg font-black text-emerald-400">Rs. {tutor.hourlyRate}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Experience</p>
                                <p className="text-lg font-black text-white">{tutor.experienceYears || '3'}+ Years</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* About Section */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 opacity-5 blur-[100px] -mr-32 -mt-32" />
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Award className="w-6 h-6 text-indigo-400" /> About the Tutor
                        </h2>
                        <div className="text-slate-300 leading-relaxed space-y-4">
                            {tutor.bio ? (
                                <p className="text-lg opacity-90">{tutor.bio}</p>
                            ) : (
                                <p className="italic opacity-60">This tutor hasn't provided a bio yet.</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/5">
                            <div>
                                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Subjects Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.subjects && tutor.subjects.length > 0 ? tutor.subjects.map(subject => (
                                        <div key={subject} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm font-bold text-white flex items-center gap-2">
                                            < Book className="w-3.5 h-3.5 text-indigo-400" /> {subject}
                                        </div>
                                    )) : <span className="text-slate-500 text-sm">General Education</span>}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Languages Spoken</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.languages && tutor.languages.length > 0 ? tutor.languages.map(lang => (
                                        <div key={lang} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-bold text-white flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-emerald-400" /> {lang}
                                        </div>
                                    )) : <span className="text-slate-500 text-sm">English, Nepali</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features/Trust Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                            <div className="bg-blue-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-5 h-5 text-blue-400" />
                            </div>
                            <h4 className="font-bold text-white mb-1">Verified Identity</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">This tutor has completed rigorous background checks and ID verification.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                            <div className="bg-purple-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-purple-400" />
                            </div>
                            <h4 className="font-bold text-white mb-1">Fast Response</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Average response time is under 1 hour for new booking requests.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                            <div className="bg-emerald-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                <Monitor className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h4 className="font-bold text-white mb-1">Virtual Classroom</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Equipped with interactive whiteboards and screen sharing tools.</p>
                        </div>
                    </div>

                    {/* Student Reviews Section */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <Star className="w-6 h-6 text-amber-400" /> Student Reviews
                            </h2>
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <span className="text-lg font-black text-amber-400">{avgRating.toFixed(1)}</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={cn("w-3 h-3 h-3 transition-colors", i <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-600")} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {reviewsLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-[#0b0f1a] border border-white/5 p-6 rounded-3xl space-y-4 hover:border-indigo-500/20 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold overflow-hidden">
                                                    {review.student.profileImage ? (
                                                        <img src={review.student.profileImage} alt={review.student.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        review.student.fullName?.[0] || 'S'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{review.student.fullName}</p>
                                                    <p className="text-[10px] text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                <span className="text-xs font-bold text-white">{review.rating}</span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Quote className="w-8 h-8 text-indigo-500/10 absolute -top-2 -left-2" />
                                            <p className="text-sm text-slate-400 leading-relaxed italic relative z-10">"{review.comment || 'No comment provided.'}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-[#0b0f1a] border border-dashed border-white/10 rounded-3xl">
                                <MessageCircle className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-40" />
                                <p className="text-slate-500 font-medium">No reviews yet. Be the first to study with {tutor.fullName}!</p>
                            </div>
                        )}
                    </div>

                    {/* Schedule Overview */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <Clock className="w-6 h-6 text-indigo-400" /> Availability Preview
                            </h2>
                            <button onClick={() => router.push(`/dashboard/book/${tutor._id}`)} className="text-sm font-bold text-indigo-400 hover:underline">View Full Calendar</button>
                        </div>

                        {tutor.availableSlots && tutor.availableSlots.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {tutor.availableSlots.slice(0, 4).map((slot) => {
                                    const start = new Date(slot.startTime);
                                    return (
                                        <div key={slot._id} className="bg-[#0b0f1a] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex flex-col items-center justify-center text-center">
                                                    <span className="text-[10px] font-black uppercase text-indigo-400 leading-none mb-1">{start.toLocaleDateString([], { month: 'short' })}</span>
                                                    <span className="text-lg font-black text-white leading-none">{start.getDate()}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-wider">{start.toLocaleDateString([], { weekday: 'long' })}</p>
                                                    <p className="text-xs text-slate-500">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/dashboard/book/${tutor._id}?slot=${slot._id}`)}
                                                className="p-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-[#0b0f1a] border border-dashed border-white/10 rounded-2xl">
                                <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-40" />
                                <p className="text-slate-500 font-medium">No public slots listed. Request a Custom Time by messaging.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

