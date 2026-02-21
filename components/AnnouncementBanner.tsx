'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, X, Info, AlertTriangle, Zap, ChevronRight } from 'lucide-react';
import { announcementService, Announcement } from '@/services/announcement.service';
import { cn } from '@/lib/utils';

export function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dismissed, setDismissed] = useState<string[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await announcementService.getAll();
                setAnnouncements(data);
            } catch (err) {
                console.error('Failed to fetch announcements');
            }
        };
        fetch();

        // Load dismissed from localStorage
        const saved = localStorage.getItem('dismissed_announcements');
        if (saved) setDismissed(JSON.parse(saved));
    }, []);

    const activeAnnouncements = announcements.filter(a => !dismissed.includes(a._id));

    if (activeAnnouncements.length === 0) return null;

    const current = activeAnnouncements[currentIndex];

    const dismissCurrent = () => {
        const newDismissed = [...dismissed, current._id];
        setDismissed(newDismissed);
        localStorage.setItem('dismissed_announcements', JSON.stringify(newDismissed));
        if (currentIndex >= activeAnnouncements.length - 1) {
            setCurrentIndex(0);
        }
    };

    return (
        <div className={cn(
            "relative w-full overflow-hidden transition-all duration-500 animate-in slide-in-from-top",
            current.type === 'URGENT' ? "bg-red-600" :
                current.type === 'WARNING' ? "bg-amber-500" : "bg-blue-600"
        )}>
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="w-0 flex-1 flex items-center">
                        <span className="flex p-2 rounded-lg bg-black/20">
                            {current.type === 'URGENT' ? <Zap className="h-5 w-5 text-white" /> :
                                current.type === 'WARNING' ? <AlertTriangle className="h-5 w-5 text-white" /> :
                                    <Megaphone className="h-5 w-5 text-white" />}
                        </span>
                        <p className="ml-3 font-bold text-white truncate">
                            <span className="md:hidden">{current.title}</span>
                            <span className="hidden md:inline">
                                <span className="font-bold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded mr-2">
                                    {current.type}
                                </span>
                                {current.title}: {current.content}
                            </span>
                        </p>
                    </div>
                    <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3 flex items-center gap-2">
                        {activeAnnouncements.length > 1 && (
                            <button
                                onClick={() => setCurrentIndex((currentIndex + 1) % activeAnnouncements.length)}
                                className="flex items-center gap-1 text-[10px] font-bold text-white/80 hover:text-white uppercase tracking-widest px-2 py-1 rounded bg-white/10"
                            >
                                Next ({currentIndex + 1}/{activeAnnouncements.length}) <ChevronRight className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={dismissCurrent}
                            className="-mr-1 flex p-2 rounded-md hover:bg-black/10 focus:outline-none transition-colors"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
