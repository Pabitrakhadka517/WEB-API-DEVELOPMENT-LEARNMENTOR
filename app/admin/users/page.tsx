'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService, AdminUser } from '@/services/admin.service';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    Users, GraduationCap, UserCog, Loader2, Search,
    RefreshCw, CheckCircle2, XCircle, Clock, ChevronRight,
    Filter, MoreVertical, Trash2, Edit3, UserCheck, UserX
} from 'lucide-react';

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
    const r = role?.toUpperCase();
    const display = r === 'USER' ? 'STUDENT' : r;
    const styles: Record<string, string> = {
        ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        TUTOR: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        STUDENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border", styles[r] || 'bg-white/10 text-slate-400 border-white/10')}>
            {display}
        </span>
    );
}

// ─── Verification Badge ───────────────────────────────────────────────────────
function VerifBadge({ status }: { status?: string }) {
    if (!status) return null;
    const s = status.toUpperCase();
    if (s === 'VERIFIED') return <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-lg"><CheckCircle2 className="w-2.5 h-2.5" />VERIFIED</span>;
    if (s === 'PENDING') return <span className="flex items-center gap-1 text-[9px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-lg"><Clock className="w-2.5 h-2.5" />PENDING</span>;
    if (s === 'REJECTED') return <span className="flex items-center gap-1 text-[9px] font-black text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-lg"><XCircle className="w-2.5 h-2.5" />REJECTED</span>;
    return null;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'TUTOR' | 'ADMIN'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Inactive'>('ALL');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0, limit: 10 });

    const fetchUsers = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await adminService.getAllUsers(
                page,
                10,
                roleFilter === 'ALL' ? undefined : roleFilter as any,
                statusFilter === 'ALL' ? undefined : statusFilter
            );
            setUsers(res.users);
            setPagination(res.pagination);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, roleFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (userId: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await adminService.deleteUser(userId);
            fetchUsers(true);
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        !searchTerm ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-purple-500" />
                        User Management
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">Manage student, tutor, and admin accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchUsers(true)}
                        disabled={refreshing}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"
                    >
                        <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-wrap items-center gap-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Filter className="w-3 h-3" /> Role:
                    </span>
                    <div className="flex bg-black/20 rounded-xl p-1 gap-1 border border-white/5">
                        {(['ALL', 'STUDENT', 'TUTOR', 'ADMIN'] as const).map(r => (
                            <button
                                key={r}
                                onClick={() => { setRoleFilter(r); setPage(1); }}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider",
                                    roleFilter === r ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-6 w-px bg-white/10 hidden md:block" />

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status:</span>
                    <div className="flex bg-black/20 rounded-xl p-1 gap-1 border border-white/5">
                        {(['ALL', 'Active', 'Inactive'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider",
                                    statusFilter === s ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ml-auto">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3">
                        Total {pagination.total} Users Found
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-white/5">
                                <th className="px-8 py-5">Profile</th>
                                <th className="px-8 py-5">Role & Verification</th>
                                <th className="px-8 py-5">Contact</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Account Age</th>
                                <th className="px-8 py-5 text-right">Managemnt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                                            <p className="font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3 opacity-50">
                                            <Users className="w-12 h-12" />
                                            <p className="font-bold text-sm tracking-widest uppercase">No matching users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-white/[0.04] transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-lg border border-white/5 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                                                {u.profileImage
                                                    ? <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                                                    : (u.name?.[0] || u.email[0]).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-sm group-hover:text-purple-400 transition-colors uppercase tracking-tight">{u.name || 'Anonymous'}</p>
                                                <p className="text-slate-500 text-xs font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-2">
                                            <RoleBadge role={u.role} />
                                            {u.role === 'TUTOR' && <VerifBadge status={u.verificationStatus} />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-slate-400 text-sm font-bold tracking-tight">{u.phone && u.phone !== 'N/A' ? u.phone : '—'}</p>
                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5">Contact Number</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg",
                                            u.status === 'Active'
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                                                : "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", u.status === 'Active' ? "bg-emerald-500" : "bg-red-500")} />
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-slate-400 text-sm font-bold">
                                            {u.joined ? new Date(u.joined).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </p>
                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5">Joined Date</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <Link
                                                href={`/admin/users/${u.id}`}
                                                className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all"
                                                title="Full Profile"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/users/${u.id}/edit`}
                                                className="p-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/20 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                            >
                                                <Edit3 className="w-4 h-4" /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteUser(u.id, u.name || '')}
                                                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl border border-red-500/20 transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/10">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                        Page <span className="text-white">{page}</span> of <span className="text-white">{pagination.totalPages || 1}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-300"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-lg shadow-purple-600/20"
                        >
                            Next Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
