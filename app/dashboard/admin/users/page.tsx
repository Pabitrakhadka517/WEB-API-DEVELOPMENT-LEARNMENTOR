'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, MoreVertical, Shield, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/users');
                setUsers(response.data);
            } catch (err: any) {
                console.error('Failed to fetch users:', err);
                setError(err.response?.data?.error || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchUsers();
        }
    }, [user?.role]);

    if (user?.role !== 'admin') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-white">Access Denied</h1>
                <p className="text-slate-400 max-w-md mt-2">
                    You do not have the necessary permissions to view this page.
                </p>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-slate-400">View and monitor all registered users on the platform.</p>
                </div>
            </div>


            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-white/5">
                                <th className="px-6 py-4 font-bold">User Information</th>
                                <th className="px-6 py-4 font-bold">Contact</th>
                                <th className="px-6 py-4 font-bold">Role</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                                                {u.name?.[0] || u.email?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold text-sm">{u.name || 'No Name'}</p>
                                                <p className="text-slate-500 text-xs flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" /> Joined {u.joined ? new Date(u.joined).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-slate-300 text-xs flex items-center">
                                                <Mail className="w-3 h-3 mr-2 text-slate-500" /> {u.email}
                                            </p>
                                            <p className="text-slate-300 text-xs flex items-center">
                                                <Phone className="w-3 h-3 mr-2 text-slate-500" /> {u.phone || 'N/A'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            u.role === 'tutor' ? "bg-purple-500/10 text-purple-400" :
                                                u.role === 'admin' ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
                                        )}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full mr-2",
                                                u.status === 'Active' ? "bg-emerald-500" : u.status === 'Pending' ? "bg-orange-500" : "bg-slate-500"
                                            )} />
                                            <span className={cn(
                                                "text-sm font-medium",
                                                u.status === 'Active' ? "text-emerald-400" : u.status === 'Pending' ? "text-orange-400" : "text-slate-400"
                                            )}>
                                                {u.status}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center">
                        <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">No users found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
