'use client';

import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Download,
    ExternalLink,
    Search,
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

// Curated default resources for each category
const DEFAULT_RESOURCES: StudyResource[] = [
    // ── Math ──
    {
        _id: 'default-math-1',
        title: 'Algebra Fundamentals',
        category: 'Math',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/math/algebra',
        duration: '40+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-math-2',
        title: 'Calculus I – Limits & Derivatives',
        category: 'Math',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-math-3',
        title: 'Geometry – Shapes, Angles & Proofs',
        category: 'Math',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/math/geometry',
        duration: '30+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-math-4',
        title: 'Statistics & Probability Essentials',
        category: 'Math',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/math/statistics-probability',
        duration: '50+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-math-5',
        title: 'Linear Algebra – Vectors & Matrices',
        category: 'Math',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-math-6',
        title: 'Trigonometry – Functions & Identities',
        category: 'Math',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/math/trigonometry',
        duration: '25+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },

    // ── Science ──
    {
        _id: 'default-sci-1',
        title: 'Physics – Mechanics & Motion',
        category: 'Science',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/science/physics',
        duration: '60+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-sci-2',
        title: 'Chemistry – Atoms, Bonding & Reactions',
        category: 'Science',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/science/chemistry',
        duration: '45+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-sci-3',
        title: 'Biology – Cells, Genetics & Evolution',
        category: 'Science',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/science/biology',
        duration: '70+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-sci-4',
        title: 'Introduction to Astronomy',
        category: 'Science',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/8-282j-introduction-to-astronomy-spring-2006/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-sci-5',
        title: 'Environmental Science & Ecology',
        category: 'Science',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/science/ap-biology/ecology-ap',
        duration: '20+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-sci-6',
        title: 'Organic Chemistry Fundamentals',
        category: 'Science',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/science/organic-chemistry',
        duration: '35+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },

    // ── Language ──
    {
        _id: 'default-lang-1',
        title: 'English Grammar & Composition',
        category: 'Language',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/humanities/grammar',
        duration: '35+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-lang-2',
        title: 'Creative Writing Workshop',
        category: 'Language',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/21w-750-writing-and-reading-the-essay-fall-2016/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-lang-3',
        title: 'Urdu Language – Reading & Writing',
        category: 'Language',
        type: 'MODULE',
        url: 'https://www.rekhta.org/',
        duration: 'Self-paced',
        tutor: { _id: '', fullName: 'Rekhta', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-lang-4',
        title: 'Vocabulary Builder – Word Power',
        category: 'Language',
        type: 'MODULE',
        url: 'https://www.vocabulary.com/',
        duration: 'Self-paced',
        tutor: { _id: '', fullName: 'Vocabulary.com', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-lang-5',
        title: 'Public Speaking & Presentation Skills',
        category: 'Language',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/21w-747-2-rhetoric-spring-2006/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-lang-6',
        title: 'Essay Writing & Critical Reading',
        category: 'Language',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/ela',
        duration: '30+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },

    // ── Computer ──
    {
        _id: 'default-cs-1',
        title: 'Intro to Programming (Python)',
        category: 'Computer',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-cs-2',
        title: 'Web Development – HTML, CSS & JS',
        category: 'Computer',
        type: 'MODULE',
        url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
        duration: '300 hours',
        tutor: { _id: '', fullName: 'freeCodeCamp', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-cs-3',
        title: 'Data Structures & Algorithms',
        category: 'Computer',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/computing/computer-science/algorithms',
        duration: '40+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-cs-4',
        title: 'JavaScript Algorithms & Projects',
        category: 'Computer',
        type: 'MODULE',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        duration: '300 hours',
        tutor: { _id: '', fullName: 'freeCodeCamp', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-cs-5',
        title: 'Database Design & SQL Basics',
        category: 'Computer',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/computing/computer-programming/sql',
        duration: '20+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-cs-6',
        title: 'Cybersecurity Fundamentals',
        category: 'Computer',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },

    // ── History ──
    {
        _id: 'default-hist-1',
        title: 'World History – Ancient Civilizations',
        category: 'History',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/humanities/world-history',
        duration: '80+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-hist-2',
        title: 'History of Science & Technology',
        category: 'History',
        type: 'MODULE',
        url: 'https://ocw.mit.edu/courses/sts-050-the-history-of-mit-spring-2016/',
        duration: 'Full course',
        tutor: { _id: '', fullName: 'MIT OCW', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-hist-3',
        title: 'Islamic Golden Age & Mughal Empire',
        category: 'History',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/humanities/world-history/medieval-times',
        duration: '25+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-hist-4',
        title: 'Modern World History – 1900 to Present',
        category: 'History',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/humanities/whp-origins',
        duration: '50+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-hist-5',
        title: 'Ancient Greece & Rome',
        category: 'History',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/humanities/world-history/ancient-medieval',
        duration: '40+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'default-hist-6',
        title: 'History of Pakistan – Independence to Today',
        category: 'History',
        type: 'MODULE',
        url: 'https://www.khanacademy.org/humanities/world-history/euro-hist',
        duration: '20+ lessons',
        tutor: { _id: '', fullName: 'Khan Academy', profileImage: '' },
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
];

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
        type: 'MODULE' as any,
        isPublic: true
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await studyService.getResources(activeTab === 'All' ? undefined : activeTab);
            const backendResources: StudyResource[] = (data.resources || [])
                .filter((r: StudyResource) => r.type === 'MODULE'); // Only keep MODULE type

            // Merge backend resources with curated defaults (defaults go after uploaded)
            const defaultsForTab = activeTab === 'All'
                ? DEFAULT_RESOURCES
                : DEFAULT_RESOURCES.filter(r => r.category === activeTab);

            // Avoid duplicates if backend already has a resource with the same title
            const backendTitles = new Set(backendResources.map(r => r.title.toLowerCase()));
            const filteredDefaults = defaultsForTab.filter(r => !backendTitles.has(r.title.toLowerCase()));

            setResources([...backendResources, ...filteredDefaults]);
        } catch (err: any) {
            console.error('Failed to fetch resources', err);
            // Even if backend fails, show curated defaults
            const defaultsForTab = activeTab === 'All'
                ? DEFAULT_RESOURCES
                : DEFAULT_RESOURCES.filter(r => r.category === activeTab);
            setResources(defaultsForTab);
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
            case 'MODULE': return BookOpen;
            default: return BookOpen;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* Resources Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResources.map((res, i) => {
                        const Icon = getIcon(res.type);
                        return (
                            <div key={res._id || i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:scale-[1.02] transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400")}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">
                                        MODULE
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-400 transition-colors uppercase truncate">{res.title}</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-1">{res.category}</p>
                                        <p className="text-[10px] text-slate-600">{res.size || res.duration || 'N/A'}</p>
                                    </div>
                                    {res.tutor && res.tutor._id ? (
                                        <button
                                            onClick={() => router.push(`/dashboard/tutors/${res.tutor._id}`)}
                                            className="flex items-center gap-2 group/tutor hover:bg-white dark:hover:bg-slate-800 p-1 px-2 rounded-lg transition-all"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] text-blue-400 font-bold overflow-hidden border border-slate-100 dark:border-slate-700">
                                                {res.tutor.profileImage ? (
                                                    <img src={res.tutor.profileImage} alt={res.tutor.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    res.tutor.fullName?.[0] || 'T'
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 group-hover/tutor:text-blue-400 transition-colors">By {res.tutor.fullName.split(' ')[0]}</span>
                                        </button>
                                    ) : res.tutor ? (
                                        <div className="flex items-center gap-2 p-1 px-2 rounded-lg">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] text-blue-600 dark:text-blue-400 font-bold border border-slate-100 dark:border-slate-700">
                                                {res.tutor.fullName?.[0] || 'R'}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">{res.tutor.fullName}</span>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-600/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        {res._id.startsWith('default-') ? (
                                            <><ExternalLink className="w-3 h-3" /> Open Resource</>
                                        ) : (
                                            <><Download className="w-3 h-3" /> View / Download</>
                                        )}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {filteredResources.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Search className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-40" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No matching resources found</p>
                    <p className="text-sm text-slate-500">Try adjusting your filters or search term.</p>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-blue-600/5">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Study Material</h2>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Quantum Physics 101"
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    value={uploadData.title}
                                    onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                        value={uploadData.category}
                                        onChange={e => setUploadData({ ...uploadData, category: e.target.value })}
                                    >
                                        {['Math', 'Science', 'Language', 'Computer', 'History', 'Other'].map(c => (
                                            <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                        value={uploadData.type}
                                        onChange={e => setUploadData({ ...uploadData, type: e.target.value as any })}
                                    >
                                        {['MODULE'].map(t => (
                                            <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">File</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        required
                                        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="resource-file"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                    />
                                    <label
                                        htmlFor="resource-file"
                                        className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                                    >
                                        {selectedFile ? (
                                            <div className="flex items-center gap-3">
                                                <FileCheck className="w-8 h-8 text-emerald-400" />
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{selectedFile.name}</p>
                                                    <p className="text-[10px] text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-blue-400 transition-colors" />
                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Click to Browse</p>
                                                <p className="text-[10px] text-slate-600 mt-1">Upload study module (Max 50MB)</p>
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
                                    className="w-4 h-4 rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="isPublic" className="text-sm font-bold text-slate-500 dark:text-slate-400">Make this public (visible to everyone)</label>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !selectedFile}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-3"
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
