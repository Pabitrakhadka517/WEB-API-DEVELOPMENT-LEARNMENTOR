'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Megaphone, Bell, Info, AlertTriangle,
    Zap, Loader2, CheckCircle2, X, Send, Eye,
    Users, Layout, Calendar, Clock, Sparkles
} from 'lucide-react';
import { announcementService, Announcement } from '@/services/announcement.service';
import { cn } from '@/lib/utils';

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetRole: 'ALL' as any,
        type: 'INFO' as any
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await announcementService.getAll();
            setAnnouncements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await announcementService.create(formData);
            setShowForm(false);
            setFormData({ title: '', content: '', targetRole: 'ALL', type: 'INFO' });
            fetchAnnouncements();
        } catch (err) {
            alert('Failed to create announcement');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this announcement?')) return;
        try {
            await announcementService.delete(id);
            fetchAnnouncements();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="p-10 space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-purple-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Announcements</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Broadcast critical updates and news to your community.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={cn(
                        "group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl",
                        showForm
                            ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-purple-600/20"
                    )}
                >
                    {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                    {showForm ? 'Close Editor' : 'Create Broadcast'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content: List or Form */}
                <div className={cn("space-y-6", showForm ? "lg:col-span-12" : "lg:col-span-12")}>

                    {showForm && (
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-top-4 duration-500 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Megaphone className="w-40 h-40 text-purple-500" />
                            </div>

                            <div className="relative z-10 flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">Broadcast Architect</h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Drafting new platform-wide message</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message Headline</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. System Maintenance, New Feature Launch"
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[1.25rem] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all text-lg font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Urgency Level</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['INFO', 'WARNING', 'URGENT'] as const).map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type })}
                                                    className={cn(
                                                        "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                        formData.type === type
                                                            ? type === 'URGENT' ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" :
                                                                type === 'WARNING' ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20" :
                                                                    "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                                            : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                                                    )}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <div className="md:col-span-3 space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Story</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.content}
                                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="What should our users know? Be clear and concise."
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[1.25rem] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none font-medium leading-relaxed"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Audience</label>
                                        <div className="space-y-2">
                                            {(['ALL', 'STUDENT', 'TUTOR'] as const).map(role => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, targetRole: role })}
                                                    className={cn(
                                                        "w-full py-4 rounded-xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all",
                                                        formData.targetRole === role
                                                            ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20"
                                                            : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                                                    )}
                                                >
                                                    {role === 'ALL' ? <Users className="w-4 h-4" /> : role === 'STUDENT' ? <Layout className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                                    {role === 'ALL' ? 'Everyone' : `${role}s Only`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <div className="p-3 bg-white/5 rounded-xl">
                                            <Eye className="w-5 h-5" />
                                        </div>
                                        <p className="text-xs font-bold leading-tight">
                                            This message will appear at the top of the <br />
                                            {formData.targetRole === 'ALL' ? 'Student and Tutor' : formData.targetRole.toLowerCase()} dashboards instantly.
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-purple-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-4"
                                    >
                                        {creating ? <Loader2 className="w-6 h-6 animate-spin text-white/50" /> : <Send className="w-6 h-6" />}
                                        {creating ? 'Broadcasting...' : 'Launch Broadcast'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {!showForm && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-sm font-black text-slate-600 uppercase tracking-[0.3em]">Historical Broadcasts</h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20 uppercase">
                                        {announcements.length} Total
                                    </span>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-32 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-[2.5rem]">
                                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Scanning frequencies...</p>
                                </div>
                            ) : announcements.length === 0 ? (
                                <div className="py-32 text-center bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                                    <Megaphone className="w-16 h-16 text-slate-800 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                                    <p className="text-slate-500 font-black uppercase tracking-widest text-sm mb-2">Radio Silence</p>
                                    <p className="text-slate-600 text-xs font-medium">Your broadcast history is currently empty.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                    {announcements.map((ann, i) => (
                                        <div
                                            key={ann._id}
                                            className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center gap-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300"
                                            style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transform group-hover:scale-110 transition-transform",
                                                ann.type === 'URGENT' ? "bg-red-500 text-white shadow-red-500/20" :
                                                    ann.type === 'WARNING' ? "bg-amber-500 text-white shadow-amber-500/20" :
                                                        "bg-indigo-600 text-white shadow-indigo-600/20"
                                            )}>
                                                {ann.type === 'URGENT' ? <Zap className="w-7 h-7" /> :
                                                    ann.type === 'WARNING' ? <AlertTriangle className="w-7 h-7" /> :
                                                        <Info className="w-7 h-7" />}
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                    <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{ann.title}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black text-slate-500 border border-white/5 uppercase tracking-widest">
                                                            {ann.targetRole}
                                                        </span>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                            ann.type === 'URGENT' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                                ann.type === 'WARNING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                        )}>
                                                            {ann.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-400 leading-relaxed text-sm font-medium line-clamp-2">{ann.content}</p>
                                                <div className="flex flex-wrap items-center gap-6 pt-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                        <Calendar className="w-3.5 h-3.5 text-purple-500/50" />
                                                        {new Date(ann.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5 text-indigo-500/50" />
                                                        {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Live on platform
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:w-auto flex items-center justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-8">
                                                <button
                                                    onClick={() => handleDelete(ann._id)}
                                                    className="p-4 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl border border-transparent hover:border-red-500/20 transition-all"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mock ShieldCheck for the button
function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className={className}
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
