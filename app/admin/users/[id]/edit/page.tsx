'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    ArrowLeft, Save, Loader2, User, Mail,
    Phone, MapPin, Shield, CheckCircle2, AlertCircle
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { cn } from '@/lib/utils';

const editUserSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['STUDENT', 'TUTOR', 'ADMIN']),
    status: z.enum(['Active', 'Inactive']),
});

type EditUserForm = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EditUserForm>({
        resolver: zodResolver(editUserSchema),
    });

    const currentStatus = watch('status');

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const data = await adminService.getUserById(id as string);
            const user = data.user;
            reset({
                name: user.name,
                email: user.email,
                phone: user.phone === 'N/A' ? '' : user.phone,
                address: user.address === 'N/A' || !user.address ? '' : user.address,
                role: user.role as any,
                status: (user.status as any) || 'Active',
            });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: EditUserForm) => {
        setSaving(true);
        setError(null);
        try {
            const payload = {
                ...data,
                fullName: data.name,
                isActive: data.status === 'Active'
            };
            await adminService.updateUser(id as string, payload);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-8">
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className="group flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">Cancel Edit</span>
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edit User Account</h1>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-sm font-bold text-red-500">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <p className="text-sm font-bold text-emerald-500">Account updated successfully!</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input {...register('name')} className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40" placeholder="Full Name" />
                                </div>
                                {errors.name && <p className="text-xs font-bold text-red-500 ml-1">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input {...register('email')} className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40" placeholder="Email" />
                                </div>
                                {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Contact & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input {...register('phone')} className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40" placeholder="Phone" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input {...register('address')} className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40" placeholder="Address" />
                                </div>
                            </div>
                        </div>

                        {/* Status & Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Account Role</label>
                                <select {...register('role')} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none">
                                    <option value="STUDENT" className="bg-white dark:bg-slate-900">STUDENT</option>
                                    <option value="TUTOR" className="bg-white dark:bg-slate-900">TUTOR</option>
                                    <option value="ADMIN" className="bg-white dark:bg-slate-900">ADMIN</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">User Status</label>
                                <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 gap-1">
                                    {['Active', 'Inactive'].map((st) => (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => setValue('status', st as any)}
                                            className={cn(
                                                "flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                                currentStatus === st
                                                    ? (st === 'Active' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30")
                                                    : "text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                            )}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Update Account
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
