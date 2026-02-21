'use client';

import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    FileText,
    Video,
    Download,
    ExternalLink,
    Search,
    Filter,
    Clock,
    Award,
    TrendingUp,
    CheckCircle2,
    ChevronRight,
    Loader2,
    X,
    Upload,
    Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { studyService, StudyResource } from '@/services/study.service';
import { useAuthStore } from '@/store/auth-store';

const toast = {
    success: (msg: string) => alert('✅ ' + msg),
    error: (msg: string) => alert('❌ ' + msg)
};

// Remote resources are fetched from studyService.getResources()

export default function StudyPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [resources, setResources] = useState<StudyResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    // Upload State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadData, setUploadData] = useState({
        title: '',
        category: 'Math',
        type: 'PDF' as any,
        isPublic: true
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await studyService.getResources(activeTab === 'All' ? undefined : activeTab);
            setResources(data.resources || []);
        } catch (err: any) {
            console.error('Failed to fetch resources', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [activeTab]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !uploadData.title) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('resource', selectedFile);
            formData.append('title', uploadData.title);
            formData.append('category', uploadData.category);
            formData.append('type', uploadData.type);
            formData.append('isPublic', String(uploadData.isPublic));

            await studyService.uploadResource(formData);
            toast.success('Resource uploaded successfully!');
            setShowUploadModal(false);
            fetchResources();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isTutor = user?.role === 'TUTOR' || user?.role === 'ADMIN';

    const getIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return Video;
            case 'PDF': return FileText;
            case 'MODULE': return BookOpen;
            default: return FileText;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-1">Learning Center</p>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Study Materials</h1>
                    <p className="text-slate-400 text-lg">Access your curriculum, shared resources, and learning tools.</p>
                </div>
                {isTutor && (
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                        <BookOpen className="w-5 h-5" /> Upload Material
                    </button>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { label: 'Courses Completed', value: '12', icon: Award, color: 'bg-emerald-500/10 text-emerald-400' },
                    { label: 'Study Hours', value: '48h', icon: Clock, color: 'bg-blue-500/10 text-blue-400' },
                    { label: 'Current Progress', value: '85%', icon: TrendingUp, color: 'bg-indigo-500/10 text-indigo-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg", stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 overflow-x-auto">
                    {['All', 'Math', 'Science', 'Language', 'Computer', 'History'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                activeTab === tab ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-3 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
            </div>

            {/* Resources Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResources.map((res, i) => {
                        const Icon = getIcon(res.type);
                        return (
                            <div key={res._id || i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400")}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg text-slate-400">
                                        {res.type}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors uppercase truncate">{res.title}</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-1">{res.category}</p>
                                        <p className="text-[10px] text-slate-600">{res.size || res.duration || 'N/A'}</p>
                                    </div>
                                    {res.tutor && (
                                        <button
                                            onClick={() => router.push(`/dashboard/tutors/${res.tutor._id}`)}
                                            className="flex items-center gap-2 group/tutor hover:bg-white/5 p-1 px-2 rounded-lg transition-all"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 font-bold overflow-hidden border border-white/5">
                                                {res.tutor.profileImage ? (
                                                    <img src={res.tutor.profileImage} alt={res.tutor.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    res.tutor.fullName?.[0] || 'T'
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 group-hover/tutor:text-indigo-400 transition-colors">By {res.tutor.fullName.split(' ')[0]}</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-600/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-3 h-3" /> View / Download
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {filteredResources.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <Search className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-40" />
                    <p className="text-slate-400 font-medium text-lg">No matching resources found</p>
                    <p className="text-sm text-slate-500">Try adjusting your filters or search term.</p>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-indigo-600/5">
                            <h2 className="text-xl font-bold text-white">Upload Study Material</h2>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Quantum Physics 101"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    value={uploadData.title}
                                    onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 ml-1">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        value={uploadData.category}
                                        onChange={e => setUploadData({ ...uploadData, category: e.target.value })}
                                    >
                                        {['Math', 'Science', 'Language', 'Computer', 'History', 'Other'].map(c => (
                                            <option key={c} value={c} className="bg-slate-900">{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 ml-1">Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        value={uploadData.type}
                                        onChange={e => setUploadData({ ...uploadData, type: e.target.value as any })}
                                    >
                                        {['PDF', 'VIDEO', 'MODULE', 'OTHER'].map(t => (
                                            <option key={t} value={t} className="bg-slate-900">{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1">File</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        required
                                        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="resource-file"
                                        accept={uploadData.type === 'VIDEO' ? 'video/*' : '.pdf,.doc,.docx,.ppt,.pptx'}
                                    />
                                    <label
                                        htmlFor="resource-file"
                                        className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                                    >
                                        {selectedFile ? (
                                            <div className="flex items-center gap-3">
                                                <FileCheck className="w-8 h-8 text-emerald-400" />
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-white truncate max-w-[200px]">{selectedFile.name}</p>
                                                    <p className="text-[10px] text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                                                <p className="text-sm font-bold text-slate-400">Click to Browse</p>
                                                <p className="text-[10px] text-slate-600 mt-1">PDF, Word, or Video (Max 50MB)</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-1">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={uploadData.isPublic}
                                    onChange={e => setUploadData({ ...uploadData, isPublic: e.target.checked })}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="isPublic" className="text-sm font-bold text-slate-400">Make this public (visible to everyone)</label>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !selectedFile}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                {uploading ? 'Uploading...' : 'Publish Material'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Fixed missing icon import
function FileCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 11 3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
    )
}
