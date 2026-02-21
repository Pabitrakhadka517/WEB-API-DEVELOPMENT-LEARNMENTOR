'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { reviewService, Review } from '@/services/review.service';
import { cn } from '@/lib/utils';
import {
    Star, Shield, Loader2, ThumbsUp, TrendingUp,
    MessageSquare, Award, ChevronRight, AlertCircle
} from 'lucide-react';

// Star Rating Display
const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
    const s = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    className={cn(s, i <= rating ? 'text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400' : 'text-slate-300 dark:text-slate-600')}
                />
            ))}
        </div>
    );
};

// Rating Distribution Bar
const RatingBar = ({ rating, count, total }: { rating: number; count: number; total: number }) => (
    <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold w-4">{rating}</span>
        <Star className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 shrink-0" />
        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
            <div
                className="h-2 rounded-full bg-amber-400 transition-all duration-700"
                style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
            />
        </div>
        <span className="text-xs text-slate-500 font-bold w-6 text-right">{count}</span>
    </div>
);

export default function TutorReviewsPage() {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!user || user.role !== 'TUTOR') return;
        const load = async () => {
            try {
                const res = await reviewService.getTutorReviews(user.id || (user as any)._id, page, 10);
                if (res.success) {
                    setReviews(res.reviews);
                    setAvgRating(res.averageRating);
                    setTotalReviews(res.totalReviews);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user, page]);

    if (user?.role !== 'TUTOR') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
            </div>
        );
    }

    // Rating distribution
    const distribution = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: reviews.filter(rev => rev.rating === r).length
    }));

    const formatDate = (d: string) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    const tips = [
        'Respond to student questions promptly',
        'Keep your profile bio updated and detailed',
        'Upload your qualifications and certificates',
        'Offer a free trial session to new students',
        'Ask students for feedback after each session',
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-bold uppercase tracking-widest mb-1">Feedback</p>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Reviews & Ratings</h1>
                <p className="text-slate-500 dark:text-slate-400">See what your students say about you.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Overview */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Rating Overview</h2>
                    <div className="text-center mb-6">
                        <p className="text-6xl font-bold text-slate-900 dark:text-white mb-2">{avgRating.toFixed(1)}</p>
                        <StarRating rating={Math.round(avgRating)} size="lg" />
                        <p className="text-slate-500 text-sm mt-2">{totalReviews} reviews</p>
                    </div>
                    <div className="space-y-2">
                        {distribution.map(d => (
                            <RatingBar key={d.rating} rating={d.rating} count={d.count} total={totalReviews} />
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                            <Star className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-40" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No reviews yet</h3>
                            <p className="text-slate-500 dark:text-slate-400">Complete sessions to start receiving student reviews.</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden shrink-0">
                                        {review.student.profileImage ? (
                                            <img src={review.student.profileImage} alt={review.student.fullName} className="w-full h-full object-cover" />
                                        ) : review.student.fullName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{review.student.fullName}</h3>
                                            <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pl-14">"{review.comment}"</p>
                                )}
                                <div className="flex items-center gap-3 mt-3 pl-14">
                                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                        <ThumbsUp className="w-3 h-3" /> Helpful
                                    </button>
                                    <button className="flex items-center gap-1 text-xs text-red-500/60 hover:text-red-400 transition-colors">
                                        <AlertCircle className="w-3 h-3" /> Report
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Profile Improvement Tips */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tips to Improve Your Profile</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Follow these to attract more students</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0 mt-0.5">
                                {i + 1}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
