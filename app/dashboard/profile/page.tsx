'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Camera, User, Phone, MapPin, Briefcase, Banknote, Award,
    CheckCircle2, AlertCircle, Clock, Loader2, Save, X
} from 'lucide-react';
import { useProfile } from '@/hooks';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[0-9+]{10,15}$/, 'Phone must be 10-15 digits'),
    speciality: z.string().optional(),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    bio: z.string().optional(),
    hourlyRate: z.union([z.string(), z.number()]).transform((val) => val === '' ? undefined : Number(val)).optional(),
    experienceYears: z.union([z.string(), z.number()]).transform((val) => val === '' ? undefined : Number(val)).optional(),
    subjects: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user } = useAuthStore();
    const { profile, loading, error, fetchProfile, updateProfile, deleteProfileImage } = useProfile();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDeletingImage, setIsDeletingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema) as any,
    });

    const watchedSubjects = watch('subjects') || [];
    const watchedLanguages = watch('languages') || [];

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Update form when profile loads
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || profile.fullName || '',
                phone: profile.phone || '',
                speciality: profile.speciality || '',
                address: profile.address || '',
                bio: profile.bio || '',
                hourlyRate: profile.hourlyRate,
                experienceYears: profile.experienceYears,
                subjects: profile.subjects || [],
                languages: profile.languages || [],
            });
            setPreviewImage(profile.profileImage || null);
        }
    }, [profile, reset]);

    // Show error from hook
    useEffect(() => {
        if (error) {
            setMessage({ type: 'error', text: error });
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Auto-dismiss success message
    useEffect(() => {
        if (message?.type === 'success') {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const onSubmit = async (data: ProfileFormValues) => {
        setMessage(null);
        try {
            await updateProfile({
                ...data,
                profileImage: selectedFile || undefined,
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setSelectedFile(null);
            fetchProfile();
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.message || 'Failed to update profile',
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 5MB' });
                return;
            }
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'error', text: 'Only image files are allowed' });
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = async () => {
        setIsDeletingImage(true);
        try {
            await deleteProfileImage();
            setPreviewImage(null);
            setSelectedFile(null);
            setMessage({ type: 'success', text: 'Profile image removed.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete image' });
        } finally {
            setIsDeletingImage(false);
        }
    };

    const addTag = (field: 'subjects' | 'languages', value: string) => {
        const current = field === 'subjects' ? watchedSubjects : watchedLanguages;
        if (value && !current.includes(value)) {
            setValue(field, [...current, value], { shouldDirty: true });
        }
    };

    const removeTag = (field: 'subjects' | 'languages', index: number) => {
        const current = field === 'subjects' ? watchedSubjects : watchedLanguages;
        setValue(field, current.filter((_, i) => i !== index), { shouldDirty: true });
    };

    if (loading && !profile) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                    <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="mb-8">
                <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Settings</p>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your personal details and public profile.</p>
            </div>

            {/* Notification */}
            {message && (
                <div className={cn(
                    "mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300",
                    message.type === 'success'
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300"
                )}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="text-sm font-medium flex-1">{message.text}</p>
                    <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white/80 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Image + Basic Info Card */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-20 -mt-20" />

                    <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center space-y-4 lg:w-44 shrink-0">
                            <div className="relative group">
                                <div className="w-36 h-36 rounded-2xl overflow-hidden bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500/20 shadow-md transition-transform group-hover:scale-[1.02] duration-300">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-blue-600 dark:text-blue-400">
                                            {user?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-90 hover:rotate-3"
                                    title="Upload photo"
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

                            {/* Image actions */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Upload
                                </button>
                                {(previewImage || profile?.profileImage) && (
                                    <>
                                        <span className="text-slate-600 dark:text-slate-400">|</span>
                                        <button
                                            type="button"
                                            onClick={handleDeleteImage}
                                            disabled={isDeletingImage}
                                            className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors disabled:opacity-50"
                                        >
                                            {isDeletingImage ? 'Removing...' : 'Remove'}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Role Badge + Status */}
                            <div className="text-center space-y-2">
                                <div className="inline-flex px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                                    {user?.role}
                                </div>
                                {user?.role === 'TUTOR' && (
                                    <div>
                                        {profile?.verificationStatus === 'VERIFIED' ? (
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                            </div>
                                        ) : profile?.verificationStatus === 'REJECTED' ? (
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 text-[10px] font-bold border border-red-500/20">
                                                <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20">
                                                <Clock className="w-3 h-3 mr-1" /> Pending
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name + Contact Fields */}
                        <div className="flex-1 space-y-5 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            {...register('name')}
                                            placeholder="Your full name"
                                            className={cn(
                                                "w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400",
                                                errors.name && "border-red-400/50 focus:ring-red-400/30"
                                            )}
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-400 font-semibold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                        Phone Number
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            {...register('phone')}
                                            placeholder="98XXXXXXXX"
                                            className={cn(
                                                "w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400",
                                                errors.phone && "border-red-400/50 focus:ring-red-400/30"
                                            )}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-xs text-red-400 font-semibold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone.message}</p>}
                                </div>
                            </div>

                            {/* Email (read-only) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    Email Address
                                </label>
                                <div className="px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium text-sm">
                                    {user?.email || 'Not available'}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    Address
                                </label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <textarea
                                        {...register('address')}
                                        rows={2}
                                        placeholder="Your full address"
                                        className={cn(
                                            "w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-400",
                                            errors.address && "border-red-400/50 focus:ring-red-400/30"
                                        )}
                                    />
                                </div>
                                {errors.address && <p className="text-xs text-red-400 font-semibold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.address.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Details (Tutor-specific) */}
                {user?.role === 'TUTOR' && (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] -ml-20 -mb-20" />
                        
                        <div className="relative z-10 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Professional Details
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">These details are visible to students browsing your profile.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Speciality */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                        Primary Expertise
                                    </label>
                                    <div className="relative group">
                                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            {...register('speciality')}
                                            placeholder="e.g. Mathematics Tutor"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Hourly Rate */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 ml-1">
                                        Hourly Rate (Rs.)
                                    </label>
                                    <div className="relative group">
                                        <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="number"
                                            {...register('hourlyRate')}
                                            placeholder="500"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                        Experience (Years)
                                    </label>
                                    <input
                                        type="number"
                                        {...register('experienceYears')}
                                        placeholder="5"
                                        className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Subjects */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    Teaching Subjects
                                </label>
                                <div className="flex flex-wrap gap-2 min-h-11 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    {watchedSubjects.length === 0 && <span className="text-slate-600 dark:text-slate-400 text-sm">No subjects added yet</span>}
                                    {watchedSubjects.map((subject, index) => (
                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold border border-blue-500/20">
                                            {subject}
                                            <button
                                                type="button"
                                                onClick={() => removeTag('subjects', index)}
                                                className="ml-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag('subjects', e.currentTarget.value.trim());
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                    placeholder="Type a subject and press Enter..."
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 text-sm"
                                />
                            </div>

                            {/* Languages */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    Languages
                                </label>
                                <div className="flex flex-wrap gap-2 min-h-11 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    {watchedLanguages.length === 0 && <span className="text-slate-600 dark:text-slate-400 text-sm">No languages added yet</span>}
                                    {watchedLanguages.map((lang, index) => (
                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-sm font-semibold border border-emerald-500/20">
                                            {lang}
                                            <button
                                                type="button"
                                                onClick={() => removeTag('languages', index)}
                                                className="ml-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag('languages', e.currentTarget.value.trim());
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                    placeholder="Type a language and press Enter..."
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 text-sm"
                                />
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    Bio / Introduction
                                </label>
                                <textarea
                                    {...register('bio')}
                                    rows={4}
                                    placeholder="Write a compelling bio for students to see..."
                                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Student Bio */}
                {user?.role === 'STUDENT' && (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    Speciality / Interest
                                </label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        {...register('speciality')}
                                        placeholder="e.g. Science Student, Engineering Aspirant"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                    About You
                                </label>
                                <textarea
                                    {...register('bio')}
                                    rows={3}
                                    placeholder="Tell us about yourself and your learning goals..."
                                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        {selectedFile && <span className="text-blue-600 dark:text-blue-400 font-semibold">New image selected. </span>}
                        {isDirty && <span className="text-amber-600 dark:text-amber-400 font-semibold">You have unsaved changes.</span>}
                    </p>
                    <button
                        type="submit"
                        disabled={loading || (!isDirty && !selectedFile)}
                        className="px-10 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
