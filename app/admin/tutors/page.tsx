'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    adminService,
    AdminApiError,
    AdminUser,
    TutorVerificationStatus,
} from '@/services/admin.service';
import { cn } from '@/lib/utils';
import {
    GraduationCap,
    Loader2,
    Search,
    RefreshCw,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    UserCheck,
    FlaskConical,
} from 'lucide-react';

function VerificationBadge({ status }: { status?: TutorVerificationStatus }) {
    if (status === 'VERIFIED') {
        return <span className="px-2 py-1 text-[10px] font-bold rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">VERIFIED</span>;
    }
    if (status === 'REJECTED') {
        return <span className="px-2 py-1 text-[10px] font-bold rounded-full border bg-red-500/10 text-red-400 border-red-500/20">REJECTED</span>;
    }
    return <span className="px-2 py-1 text-[10px] font-bold rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">PENDING</span>;
}

export default function AdminTutorsPage() {
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | TutorVerificationStatus>('ALL');
    const [selectedTutor, setSelectedTutor] = useState<AdminUser | null>(null);
    const [nextStatus, setNextStatus] = useState<TutorVerificationStatus>('VERIFIED');
    const [seedCount, setSeedCount] = useState(5);
    const [showSeedModal, setShowSeedModal] = useState(false);

    const tutorsQuery = useQuery({
        queryKey: ['admin-tutors', page, statusFilter],
        queryFn: () => adminService.getTutors(page, 10, statusFilter === 'ALL' ? undefined : statusFilter),
        placeholderData: (previousData) => previousData,
    });

    const verifyMutation = useMutation({
        mutationFn: (payload: { tutorId: string; status: TutorVerificationStatus }) =>
            adminService.verifyTutor(payload.tutorId, payload.status),
        onSuccess: async () => {
            setSelectedTutor(null);
            await queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
            await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });

    const seedMutation = useMutation({
        mutationFn: (count: number) => adminService.seedTutors(count),
        onSuccess: async () => {
            setShowSeedModal(false);
            await queryClient.invalidateQueries({ queryKey: ['admin-tutors'] });
            await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });

    const tutors = tutorsQuery.data?.users ?? [];
    const pagination = tutorsQuery.data?.pagination ?? { total: 0, totalPages: 1 };
    const filteredTutors = useMemo(
        () =>
            tutors.filter((t) =>
                !searchTerm ||
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.email.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [tutors, searchTerm]
    );

    const error = tutorsQuery.error as AdminApiError | null;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-blue-500" />
                        Tutor Verification
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Review tutor profiles and verification status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => tutorsQuery.refetch()}
                        disabled={tutorsQuery.isRefetching}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                    >
                        <RefreshCw className={cn('w-5 h-5', tutorsQuery.isRefetching && 'animate-spin')} />
                    </button>
                    <button
                        onClick={() => setShowSeedModal(true)}
                        className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2"
                    >
                        <FlaskConical className="w-4 h-4" />
                        Seed Tutors
                    </button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tutors..."
                            className="pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error.message}
                </div>
            )}

            <div className="flex items-center gap-3">
                {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => {
                            setStatusFilter(status);
                            setPage(1);
                        }}
                        className={cn(
                            'px-4 py-2 rounded-xl text-xs font-bold border transition-all',
                            statusFilter === status
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        )}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700">
                                <th className="px-8 py-5">Tutor</th>
                                <th className="px-8 py-5">Speciality</th>
                                <th className="px-8 py-5">Verification</th>
                                <th className="px-8 py-5">Joined</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {tutorsQuery.isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                            Loading tutors...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTutors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-500">No tutors found.</td>
                                </tr>
                            ) : (
                                filteredTutors.map((tutor) => (
                                    <tr key={tutor.id}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                    {(tutor.name?.[0] || tutor.email[0]).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{tutor.name}</p>
                                                    <p className="text-xs text-slate-500">{tutor.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">{tutor.speciality || 'Not specified'}</td>
                                        <td className="px-8 py-5">
                                            <VerificationBadge status={tutor.verificationStatus} />
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                                            {tutor.joined ? new Date(tutor.joined).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedTutor(tutor);
                                                    setNextStatus('VERIFIED');
                                                }}
                                                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                                Verify
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Page {page} of {pagination.totalPages || 1}</p>
                    <div className="flex gap-3">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-30"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= (pagination.totalPages || 1)}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {selectedTutor && (
                <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Verification</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Update verification status for <span className="font-semibold text-slate-900 dark:text-white">{selectedTutor.name}</span>.
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {(['VERIFIED', 'REJECTED', 'PENDING'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setNextStatus(status)}
                                    className={cn(
                                        'py-2 rounded-lg text-xs font-bold border',
                                        nextStatus === status
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        {verifyMutation.error && (
                            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                {(verifyMutation.error as AdminApiError).message}
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setSelectedTutor(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                Cancel
                            </button>
                            <button
                                onClick={() => verifyMutation.mutate({ tutorId: selectedTutor.id, status: nextStatus })}
                                disabled={verifyMutation.isPending}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {verifyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSeedModal && (
                <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Seed Tutors</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Generate tutor demo data for testing.</p>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={seedCount}
                            onChange={(e) => setSeedCount(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                        {seedMutation.error && (
                            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                {(seedMutation.error as AdminApiError).message}
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowSeedModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                Cancel
                            </button>
                            <button
                                onClick={() => seedMutation.mutate(seedCount)}
                                disabled={seedMutation.isPending}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {seedMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Seed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
