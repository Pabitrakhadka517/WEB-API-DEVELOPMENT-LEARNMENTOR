'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService, AdminApiError, AdminUser } from '@/services/admin.service';
import { cn } from '@/lib/utils';
import {
    Users, Loader2, Search,
    RefreshCw, CheckCircle2, XCircle, Clock,
    Filter, Trash2, Edit3, AlertCircle
} from 'lucide-react';

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
    const r = role?.toUpperCase();
    const display = r === 'USER' ? 'STUDENT' : r;
    const styles: Record<string, string> = {
        ADMIN: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        TUTOR: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        STUDENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border", styles[r] || 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700')}>
            {display}
        </span>
    );
}

// ─── Verification Badge ───────────────────────────────────────────────────────
function VerifBadge({ status }: { status?: string }) {
    if (!status) return null;
    const s = status.toUpperCase();
    if (s === 'VERIFIED') return <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-lg"><CheckCircle2 className="w-2.5 h-2.5" />VERIFIED</span>;
    if (s === 'PENDING') return <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-lg"><Clock className="w-2.5 h-2.5" />PENDING</span>;
    if (s === 'REJECTED') return <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-lg"><XCircle className="w-2.5 h-2.5" />REJECTED</span>;
    return null;
}

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'TUTOR' | 'ADMIN'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Inactive'>('ALL');
    const [page, setPage] = useState(1);
    const [editUser, setEditUser] = useState<AdminUser | null>(null);
    const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'STUDENT' as 'STUDENT' | 'TUTOR' | 'ADMIN',
        status: 'Active' as 'Active' | 'Inactive',
    });

    const usersQuery = useQuery({
        queryKey: ['admin-users', page, roleFilter, statusFilter],
        queryFn: () =>
            adminService.getAllUsers(
                page,
                10,
                roleFilter === 'ALL' ? undefined : roleFilter,
                statusFilter === 'ALL' ? undefined : statusFilter
            ),
        placeholderData: (previousData) => previousData,
    });

    const updateMutation = useMutation({
        mutationFn: (payload: { id: string; data: typeof editForm }) =>
            adminService.updateUser(payload.id, {
                ...payload.data,
                fullName: payload.data.name,
                isActive: payload.data.status === 'Active',
            }),
        onSuccess: async () => {
            setEditUser(null);
            await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => adminService.deleteUser(userId),
        onSuccess: async () => {
            setDeleteUser(null);
            await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });

    const users = usersQuery.data?.users ?? [];
    const pagination = usersQuery.data?.pagination ?? { total: 0, totalPages: 0, limit: 10, page: 1 };
    const loading = usersQuery.isLoading;
    const refreshing = usersQuery.isRefetching;
    const queryError = usersQuery.error as AdminApiError | null;

    const filteredUsers = useMemo(
        () =>
            users.filter((u) =>
                !searchTerm ||
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [users, searchTerm]
    );

    const openEditModal = (user: AdminUser) => {
        setEditUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone === 'N/A' ? '' : user.phone || '',
            address: user.address || '',
            role: (user.role?.toUpperCase() as 'STUDENT' | 'TUTOR' | 'ADMIN') || 'STUDENT',
            status: user.status === 'Inactive' ? 'Inactive' : 'Active',
        });
    };

    const submitEdit = async () => {
        if (!editUser) return;
        await updateMutation.mutateAsync({
            id: editUser.id,
            data: editForm,
        });
    };

    const submitDelete = async () => {
        if (!deleteUser) return;
        await deleteMutation.mutateAsync(deleteUser.id);
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-500" />
                        User Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage student, tutor, and admin accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => usersQuery.refetch()}
                        disabled={refreshing}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-lg"
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
                            className="pl-11 pr-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {queryError && (
                <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {queryError.message}
                </div>
            )}

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Filter className="w-3 h-3" /> Role:
                    </span>
                    <div className="flex bg-black/20 rounded-xl p-1 gap-1 border border-slate-100 dark:border-slate-700">
                        {(['ALL', 'STUDENT', 'TUTOR', 'ADMIN'] as const).map(r => (
                            <button
                                key={r}
                                onClick={() => { setRoleFilter(r); setPage(1); }}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider",
                                    roleFilter === r ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-6 w-px bg-slate-100 dark:bg-slate-700 hidden md:block" />

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status:</span>
                    <div className="flex bg-black/20 rounded-xl p-1 gap-1 border border-slate-100 dark:border-slate-700">
                        {(['ALL', 'Active', 'Inactive'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider",
                                    statusFilter === s ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ml-auto">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3">
                        Total {pagination.total} Users Found
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-700">
                                <th className="px-8 py-5">Profile</th>
                                <th className="px-8 py-5">Role & Verification</th>
                                <th className="px-8 py-5">Contact</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Account Age</th>
                                <th className="px-8 py-5 text-right">Managemnt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                            <p className="font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center gap-3 opacity-50">
                                            <Users className="w-12 h-12" />
                                            <p className="font-bold text-sm tracking-widest uppercase">No matching users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-white/4 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg border border-slate-100 dark:border-slate-700 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                                                {u.profileImage
                                                    ? <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                                                    : (u.name?.[0] || u.email[0]).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-bold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{u.name || 'Anonymous'}</p>
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
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-tight">{u.phone && u.phone !== 'N/A' ? u.phone : '—'}</p>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Contact Number</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-lg",
                                            u.status === 'Active'
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                                                : "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", u.status === 'Active' ? "bg-emerald-500" : "bg-red-500")} />
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                                            {u.joined ? new Date(u.joined).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </p>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Joined Date</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <button
                                                onClick={() => openEditModal(u)}
                                                className="p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-200 dark:border-blue-800 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                                            >
                                                <Edit3 className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteUser(u)}
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
                <div className="p-8 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between bg-black/10">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Page <span className="text-slate-900 dark:text-white">{page}</span> of <span className="text-slate-900 dark:text-white">{pagination.totalPages || 1}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all text-slate-600 dark:text-slate-300"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all text-white shadow-lg shadow-blue-600/20"
                        >
                            Next Page
                        </button>
                    </div>
                </div>
            </div>

            {editUser && (
                <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit User</h3>
                            <button onClick={() => setEditUser(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">✕</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={editForm.name} onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                            <input value={editForm.email} onChange={(e) => setEditForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                            <input value={editForm.phone} onChange={(e) => setEditForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                            <input value={editForm.address} onChange={(e) => setEditForm((s) => ({ ...s, address: e.target.value }))} placeholder="Address" className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                            <select value={editForm.role} onChange={(e) => setEditForm((s) => ({ ...s, role: e.target.value as 'STUDENT' | 'TUTOR' | 'ADMIN' }))} className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <option value="STUDENT">STUDENT</option>
                                <option value="TUTOR">TUTOR</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <select value={editForm.status} onChange={(e) => setEditForm((s) => ({ ...s, status: e.target.value as 'Active' | 'Inactive' }))} className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        {updateMutation.error && (
                            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                {(updateMutation.error as AdminApiError).message}
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-3">
                            <button onClick={() => setEditUser(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={submitEdit}
                                disabled={updateMutation.isPending}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 flex items-center gap-2"
                            >
                                {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteUser && (
                <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete User</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">{deleteUser.name}</span>? This action cannot be undone.
                        </p>
                        {deleteMutation.error && (
                            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                {(deleteMutation.error as AdminApiError).message}
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-3">
                            <button onClick={() => setDeleteUser(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={submitDelete}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
