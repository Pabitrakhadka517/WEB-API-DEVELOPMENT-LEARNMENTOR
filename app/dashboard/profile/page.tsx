'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User,
    Phone,
    MapPin,
    Briefcase,
    Camera,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[0-9]{10,15}$/, 'Phone must be 10-15 digits'),
    speciality: z.string().optional(),
    address: z.string().min(5, 'Address must be at least 5 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profileImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                const profileData = response.data;
                reset({
                    name: profileData.name || '',
                    phone: profileData.phone || '',
                    speciality: profileData.speciality || '',
                    address: profileData.address || '',
                });
                setPreviewImage(profileData.profileImage);
                updateUser(profileData);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setMessage({ type: 'error', text: 'Failed to load profile data' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [reset, updateUser]);

    const onSubmit = async (data: ProfileFormValues) => {
        setSaving(true);
        setMessage(null);

        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            if (fileInputRef.current?.files?.[0]) {
                formData.append('profileImage', fileInputRef.current.files[0]);
            }

            const response = await api.put('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });


            const updatedProfile = response.data.profile || response.data; // Handle different API responses
            updateUser(updatedProfile);
            setPreviewImage(updatedProfile.profileImage);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            reset(data);
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { error?: string } } };
            const errorMessage = axiosError.response?.data?.error || 'Failed to update profile';
            setMessage({
                type: 'error',
                text: errorMessage,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-slate-400">Update your personal information and profile picture.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center sticky top-8">
                        <div className="relative inline-block group">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-indigo-500/10 border-2 border-indigo-500/20 mx-auto">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-indigo-400">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl shadow-lg transition-all active:scale-90"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <div className="mt-6">
                            <h3 className="font-bold text-white text-lg truncate px-2">{user?.name}</h3>
                            <p className="text-slate-400 text-sm mb-4 truncate px-2">{user?.email}</p>
                            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                                {user?.role}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                            {message && (
                                <div className={cn(
                                    "p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium",
                                    message.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                )}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1 flex items-center">
                                        <User className="w-4 h-4 mr-2" /> Full Name
                                    </label>
                                    <input
                                        {...register('name')}
                                        placeholder="Enter full name"
                                        className={cn(
                                            "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                                            errors.name && "border-red-400/50"
                                        )}
                                    />
                                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1 flex items-center">
                                        <Phone className="w-4 h-4 mr-2" /> Phone Number
                                    </label>
                                    <input
                                        {...register('phone')}
                                        placeholder="9876543210"
                                        className={cn(
                                            "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                                            errors.phone && "border-red-400/50"
                                        )}
                                    />
                                    {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                                </div>

                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1 flex items-center">
                                        <Briefcase className="w-4 h-4 mr-2" />
                                        {user?.role === 'user' ? 'Current Grade / Subjects' :
                                            user?.role === 'tutor' ? 'Teaching Expertise' : 'Designation'}
                                    </label>
                                    <input
                                        {...register('speciality')}
                                        placeholder={user?.role === 'user' ? 'e.g. Grade 12 - Physics' : 'e.g. Senior Mathematics Specialist'}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>


                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" /> Address
                                    </label>
                                    <textarea
                                        {...register('address')}
                                        rows={3}
                                        placeholder="Your primary address"
                                        className={cn(
                                            "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none",
                                            errors.address && "border-red-400/50"
                                        )}
                                    />
                                    {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <button
                                type="submit"
                                disabled={saving || !isDirty}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
