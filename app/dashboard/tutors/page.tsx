'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { tutorService, chatService, bookingService, Tutor, TutorFilter } from '@/services';
import {
    Loader2, Search, MapPin, Star, MessageCircle, DollarSign,
    BookOpen, CheckCircle2, Filter, X, ChevronDown, SlidersHorizontal,
    Globe, Monitor, Users, CalendarCheck2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science', 'Economics', 'Music', 'Art'];
const LANGUAGES = ['English', 'Nepali', 'Hindi', 'Maithili'];
const SORT_OPTIONS = [
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'createdAt-desc', label: 'Newest First' },
];

export default function TutorsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<TutorFilter>({ page: 1, limit: 12 });
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
    const [bookedTutorIds, setBookedTutorIds] = useState<Set<string>>(new Set());

    // Filter state
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedSort, setSelectedSort] = useState('rating-desc');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [minRating, setMinRating] = useState(0);
    const [mode, setMode] = useState<'all' | 'online' | 'physical'>('all');
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    const buildFilters = useCallback((): TutorFilter => {
        const [sortBy, order] = selectedSort.split('-') as [any, 'asc' | 'desc'];

        let backendSortBy: any = sortBy;
        if (sortBy === 'price') {
            backendSortBy = order === 'asc' ? 'price_asc' : 'price_desc';
        } else if (sortBy === 'createdAt') {
            backendSortBy = 'newest';
        } else if (sortBy === 'rating') {
            backendSortBy = 'rating';
        }

        return {
            page: filters.page,
            limit: 12,
            search: searchTerm || undefined,
            subject: selectedSubject || undefined,
            minPrice: priceMin ? Number(priceMin) : undefined,
            maxPrice: priceMax ? Number(priceMax) : undefined,
            language: selectedLanguage || undefined,
            sortBy: backendSortBy,
            verifiedOnly: verifiedOnly || undefined,
        };
    }, [searchTerm, selectedSubject, selectedSort, filters.page, verifiedOnly, priceMin, priceMax, selectedLanguage]);

    const fetchTutors = useCallback(async () => {
        setLoading(true);
        try {
            const data = await tutorService.getTutors(buildFilters());
            setTutors(data.tutors);
            if (data.pagination) {
                setPagination({
                    total: data.pagination.total,
                    page: data.pagination.page,
                    totalPages: data.pagination.totalPages
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tutors');
        } finally {
            setLoading(false);
        }
    }, [buildFilters]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user?.role === 'STUDENT') {
                try {
                    const res = await bookingService.getBookings({ limit: 100 });
                    if (res.success) {
                        const ids = new Set(res.bookings.map(b =>
                            typeof b.tutor === 'string' ? b.tutor : b.tutor._id
                        ));
                        setBookedTutorIds(ids);
                    }
                } catch (e) {
                    console.error('Failed to fetch bookings:', e);
                }
            }
        };
        fetchBookings();
        const debounce = setTimeout(() => { fetchTutors(); }, 400);
        return () => clearTimeout(debounce);
    }, [fetchTutors, user]);

    const handleMessage = async (tutorId: string) => {
        if (!user) { router.push('/login'); return; }
        try {
            const response = await chatService.createChat(tutorId);
            if (response.success && response.chat) {
                router.push(`/dashboard/messages?chatId=${response.chat._id}`);
            }
        } catch (err: any) {
            console.error('Failed to start chat:', err);
            const msg = err.response?.data?.message || 'You must have a paid booking with this tutor to start chatting.';
            alert(msg);
        }
    };

    const clearFilters = () => {
        setSelectedSubject('');
        setSelectedLanguage('');
        setSelectedSort('rating-desc');
        setPriceMin('');
        setPriceMax('');
        setMinRating(0);
        setMode('all');
        setVerifiedOnly(false);
        setSearchTerm('');
        setFilters({ page: 1, limit: 12 });
    };

    const hasActiveFilters = Boolean(
        selectedSubject || selectedLanguage || priceMin || priceMax || minRating > 0 || mode !== 'all' || verifiedOnly
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Discovery</p>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Find a Tutor</h1>
                <p className="text-slate-500 dark:text-slate-400">Discover expert tutors to help you master any subject.</p>
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="Search by name, subject, or skill..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2">
                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={selectedSort}
                            onChange={e => setSelectedSort(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-white dark:bg-slate-900">{o.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all border",
                            showFilters || hasActiveFilters
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                        )}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-5 h-5 bg-white text-blue-600 rounded-full text-[10px] font-bold flex items-center justify-center">
                                {[selectedSubject, selectedLanguage, priceMin || priceMax, minRating > 0, mode !== 'all'].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">Advanced Filters</h3>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 flex items-center gap-1">
                                <X className="w-3 h-3" /> Clear All
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Subject */}
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-2 block">Subject</label>
                            <select
                                value={selectedSubject}
                                onChange={e => setSelectedSubject(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="" className="bg-white dark:bg-slate-900">All Subjects</option>
                                {SUBJECTS.map(s => <option key={s} value={s} className="bg-white dark:bg-slate-900">{s}</option>)}
                            </select>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-2 block">Language</label>
                            <select
                                value={selectedLanguage}
                                onChange={e => setSelectedLanguage(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="" className="bg-white dark:bg-slate-900">Any Language</option>
                                {LANGUAGES.map(l => <option key={l} value={l} className="bg-white dark:bg-slate-900">{l}</option>)}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-2 block">Price Range (Rs/hr)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceMin}
                                    onChange={e => setPriceMin(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <span className="text-slate-500 dark:text-slate-400">–</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceMax}
                                    onChange={e => setPriceMax(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        {/* Min Rating */}
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-2 block">Min Rating</label>
                            <div className="flex items-center gap-1">
                                {[0, 1, 2, 3, 4, 5].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setMinRating(r)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                            minRating === r ? "bg-amber-500 text-black" : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        )}
                                    >
                                        {r === 0 ? 'Any' : `${r}★`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mode & Verification */}
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-2 block">Session Mode</label>
                            <div className="flex gap-2">
                                {[
                                    { value: 'all', label: 'All Modes', icon: Users },
                                    { value: 'online', label: 'Online', icon: Monitor },
                                    { value: 'physical', label: 'In-Person', icon: MapPin },
                                ].map(m => (
                                    <button
                                        key={m.value}
                                        onClick={() => setMode(m.value as any)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                                            mode === m.value
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        )}
                                    >
                                        <m.icon className="w-4 h-4" /> {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-2 block">Verification</label>
                            <button
                                onClick={() => setVerifiedOnly(!verifiedOnly)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                                    verifiedOnly
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                                )}
                            >
                                <CheckCircle2 className={cn("w-4 h-4", verifiedOnly ? "text-white" : "text-emerald-500")} />
                                Verified Tutors Only
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {loading ? 'Searching...' : `${tutors.length} tutor${tutors.length !== 1 ? 's' : ''} found`}
                </p>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 flex items-center gap-1">
                        <X className="w-3 h-3" /> Clear filters
                    </button>
                )}
            </div>

            {/* Tutor Grid */}
            {loading && tutors.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-400">
                    <p>{error}</p>
                    <button onClick={fetchTutors} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">Try Again</button>
                </div>
            ) : tutors.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                    <Search className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-4 opacity-40" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tutors found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your search or filters.</p>
                    <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tutors.map((tutor) => (
                        <div key={tutor._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-all group hover:shadow-xl hover:shadow-blue-500/5">
                            {/* Card Header */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl overflow-hidden shrink-0">
                                            {tutor.profileImage ? (
                                                <img src={tutor.profileImage} alt={tutor.fullName} className="w-full h-full object-cover" />
                                            ) : tutor.fullName[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <h3 className="font-bold text-slate-900 dark:text-white">{tutor.fullName}</h3>
                                                {tutor.verificationStatus === 'VERIFIED' && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-900/30" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{tutor.speciality || 'Tutor'}</p>
                                            {tutor.experienceYears && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tutor.experienceYears}y experience</p>
                                            )}
                                        </div>
                                    </div>
                                    {tutor.rating > 0 && (
                                        <div className="flex items-center space-x-1 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
                                            <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{tutor.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    {bookedTutorIds.has(tutor._id) && (
                                        <div className="flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                                            <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Booked</span>
                                        </div>
                                    )}
                                </div>

                                {/* Subjects */}
                                {tutor.subjects && tutor.subjects.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {tutor.subjects.slice(0, 3).map(s => (
                                            <span key={s} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold border border-blue-100 dark:border-blue-800">{s}</span>
                                        ))}
                                        {tutor.subjects.length > 3 && (
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold self-center">+{tutor.subjects.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                {/* Bio */}
                                {tutor.bio && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 italic">"{tutor.bio}"</p>
                                )}

                                {/* Price & Reviews */}
                                <div className="flex items-center justify-between text-sm mb-4">
                                    {tutor.hourlyRate ? (
                                        <div className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold">
                                            <span>Rs. {tutor.hourlyRate}/hr</span>
                                        </div>
                                    ) : <div />}
                                    {tutor.reviewCount > 0 && (
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{tutor.reviewCount} review{tutor.reviewCount !== 1 ? 's' : ''}</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        {!bookedTutorIds.has(tutor._id) ? (
                                            <button
                                                onClick={() => router.push(`/dashboard/book/${tutor._id}`)}
                                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                                            >
                                                <BookOpen className="w-4 h-4" /> Book Now
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => router.push('/dashboard/bookings')}
                                                className="flex-1 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <CalendarCheck2 className="w-4 h-4" /> View Schedule
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleMessage(tutor._id)}
                                            className="py-2.5 px-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-sm font-bold transition-all border border-slate-200 dark:border-slate-600"
                                            title="Message"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/dashboard/tutors/${tutor._id}`)}
                                        className="w-full py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                    >
                                        View Full Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-200 dark:border-slate-700 text-sm font-bold"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                                    className={cn(
                                        "w-9 h-9 rounded-xl text-sm font-bold transition-all",
                                        pagination.page === p ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    )}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.totalPages, (prev.page || 1) + 1) }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-200 dark:border-slate-700 text-sm font-bold"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
