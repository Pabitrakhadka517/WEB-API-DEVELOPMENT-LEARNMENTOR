'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import {
    Shield, Upload, CheckCircle2, Clock, XCircle,
    FileText, GraduationCap, CreditCard, User, ChevronRight,
    AlertCircle, Star, Loader2
} from 'lucide-react';

interface VerificationStep {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    status: 'completed' | 'pending' | 'rejected' | 'not_started';
    required: boolean;
}

import { tutorService } from '@/services/tutor.service';

export default function TutorVerificationPage() {
    const { user } = useAuthStore();
    const [uploading, setUploading] = useState<string | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    if (user?.role !== 'TUTOR') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
            </div>
        );
    }

    const isVerified = user?.verificationStatus === 'VERIFIED';
    const isPending = user?.verificationStatus === 'PENDING';

    const steps: VerificationStep[] = [
        {
            id: 'profile',
            title: 'Basic Profile',
            description: 'Complete your name, bio, and profile photo',
            icon: User,
            status: (user?.name && user?.phone) ? 'completed' : 'not_started',
            required: true
        },
        {
            id: 'id',
            title: 'Government ID',
            description: 'Upload a valid national ID, passport, or driving license',
            icon: CreditCard,
            status: isPending || isVerified || uploadedDocs.includes('id') ? 'completed' : 'not_started',
            required: true
        },
        {
            id: 'education',
            title: 'Education Certificates',
            description: 'Upload your degree, diploma, or relevant certifications',
            icon: GraduationCap,
            status: isPending || isVerified || uploadedDocs.includes('education') ? 'completed' : 'not_started',
            required: true
        },
        {
            id: 'skills',
            title: 'Skill Documents',
            description: 'Upload any additional skill certificates or awards',
            icon: FileText,
            status: uploadedDocs.includes('skills') ? 'completed' : 'not_started',
            required: false
        },
    ];

    const completedSteps = steps.filter(s => s.status === 'completed').length;
    const completionPercent = Math.round((completedSteps / steps.length) * 100);
    const canSubmit = completedSteps >= steps.filter(s => s.required).length && !isPending && !isVerified;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
            case 'pending': return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            default: return <div className="w-5 h-5 rounded-full border-2 border-slate-400 dark:border-slate-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 uppercase">Done</span>;
            case 'pending': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 uppercase">Pending</span>;
            case 'rejected': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20 uppercase">Rejected</span>;
            default: return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-slate-500 dark:text-slate-400 bg-slate-400/10 border-slate-400/20 uppercase">Required</span>;
        }
    };

    const handleUpload = async (stepId: string) => {
        setUploading(stepId);
        // Simulate upload
        await new Promise(r => setTimeout(r, 1000));
        setUploadedDocs(prev => [...prev, stepId]);
        setUploading(null);
    };

    const handleSubmitForReview = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            const res = await tutorService.submitVerification();
            if (res.success) {
                alert('Success! Your profile has been submitted for review.');
                window.location.reload();
            }
        } catch (e: any) {
            alert('Failed to submit: ' + (e.response?.data?.message || e.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Trust & Safety</p>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Profile Verification</h1>
                    <p className="text-slate-500 dark:text-slate-400">Complete verification to build trust and attract more students.</p>
                </div>
                {canSubmit && (
                    <button
                        onClick={handleSubmitForReview}
                        disabled={submitting}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                        Submit for Review
                    </button>
                )}
            </div>

            {/* Verification Status Banner */}
            {isVerified ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">✅ You're Verified!</h2>
                        <p className="text-emerald-800 dark:text-emerald-200/70 text-sm mt-1">Your profile is verified. Students can see your verified badge and trust your credentials.</p>
                    </div>
                </div>
            ) : isPending ? (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                        <Clock className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">⏳ Under Review</h2>
                        <p className="text-blue-800 dark:text-blue-200/70 text-sm mt-1">Your documents are being reviewed by our team. This usually takes 1-2 business days.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-amber-700 dark:text-amber-400">⚠️ Verification Required</h2>
                        <p className="text-amber-800 dark:text-amber-200/70 text-sm mt-1">Complete the steps below to get verified and unlock full platform features.</p>
                    </div>
                </div>
            )}

            {/* Profile Completion Meter */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Completion</h2>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{completionPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-3">
                    <div
                        className={cn(
                            "h-3 rounded-full transition-all duration-700",
                            completionPercent === 100 ? "bg-emerald-500" : completionPercent >= 50 ? "bg-blue-500" : "bg-amber-500"
                        )}
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{completedSteps} of {steps.length} steps completed</p>
            </div>

            {/* Verification Steps */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verification Steps</h2>
                {steps.map((step, i) => (
                    <div
                        key={step.id}
                        className={cn(
                            "bg-white dark:bg-slate-800 border rounded-2xl p-5 transition-all",
                            step.status === 'completed' ? "border-emerald-500/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                step.status === 'completed' ? "bg-emerald-500/20" : "bg-white dark:bg-slate-800"
                            )}>
                                <step.icon className={cn("w-5 h-5", step.status === 'completed' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400")} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{step.title}</h3>
                                    {getStatusBadge(step.status)}
                                    {!step.required && <span className="text-[10px] font-bold text-slate-600 uppercase">Optional</span>}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{step.description}</p>
                                {step.status !== 'completed' && (
                                    <button
                                        onClick={() => handleUpload(step.id)}
                                        disabled={uploading === step.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                    >
                                        {uploading === step.id ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                        ) : (
                                            <><Upload className="w-4 h-4" /> Upload Document</>
                                        )}
                                    </button>
                                )}
                            </div>
                            <div className="shrink-0">
                                {getStatusIcon(step.status)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Benefits of Verification */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Benefits of Getting Verified</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { icon: '✅', text: 'Verified badge on your profile' },
                        { icon: '📈', text: '3x more profile views from students' },
                        { icon: '💰', text: 'Higher earning potential' },
                        { icon: '🔍', text: 'Priority in search results' },
                        { icon: '🛡️', text: 'Increased student trust' },
                        { icon: '⭐', text: 'Access to premium features' },
                    ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl">
                            <span className="text-lg">{benefit.icon}</span>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{benefit.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
