'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Mail, Phone, MapPin, Calendar,
    Shield, Briefcase, DollarSign, CheckCircle2,
    XCircle, Clock, Loader2, UserCog, Trash2
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { cn } from '@/lib/utils';

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const data = await adminService.getUserById(id as string);
            setUser(data.user);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) return;
        try {
            await adminService.deleteUser(id as string);
            alert('User deleted successfully');
            router.push('/admin');
        } catch (err: any) {
            alert('Failed to delete user: ' + (err?.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 p-8">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Not Found</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">{error || "The user you're looking for doesn't exist."}</p>
                    </div>
                    <button onClick={() => router.push('/admin')} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <button onClick={() => router.push('/admin')} className="group flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Back to Users</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push(`/admin/users/${id}/edit`)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                            <UserCog className="w-4 h-4" /> Edit Profile
                        </button>
                        <button onClick={handleDelete} className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center space-y-6">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-3xl bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400 overflow-hidden mx-auto shadow-md">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                    ) : user.name[0].toUpperCase()}
                                </div>
                                <div className={cn(
                                    "absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-md",
                                    user.status === 'Active' ? "bg-emerald-500 border-emerald-400 text-white" : "bg-red-500 border-red-400 text-white"
                                )}>
                                    {user.status}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest mt-1">{user.role}</p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Primary Address</h3>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{user.address || 'Not provided'}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Account Created</h3>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{new Date(user.joined).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Role Specific Info */}
                        {user.role === 'TUTOR' && (
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tutor Profile Settings</h3>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                        user.tutorProfile?.verificationStatus === 'VERIFIED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                            user.tutorProfile?.verificationStatus === 'REJECTED' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                                "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    )}>
                                        {user.tutorProfile?.verificationStatus || 'PENDING'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Specialization</span>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{user.speciality}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Hourly Rate</span>
                                        </div>
                                        <p className="text-lg font-bold text-emerald-400">Rs. {user.tutorProfile?.hourlyRate || 0}/hr</p>
                                    </div>
                                </div>
                                {user.tutorProfile?.bio && (
                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2 text-slate-500 mb-3">
                                            <Shield className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Professional Bio</span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic">"{user.tutorProfile.bio}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Platform Activity Placeholder */}
                        <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/10 border border-slate-200 dark:border-slate-700 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity Log</h3>
                                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline uppercase tracking-widest">Full History</button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { action: 'Updated profile information', time: '2 hours ago', icon: UserCog, color: 'text-blue-400' },
                                    { action: 'Logged in from Kathmandu, NP', time: '5 hours ago', icon: Clock, color: 'text-slate-400' },
                                    { action: 'Changed account password', time: 'Yesterday', icon: Shield, color: 'text-amber-400' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center", item.color)}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.action}</p>
                                                <p className="text-xs text-slate-500">{item.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
