'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import {
    ChevronLeft, ChevronRight, Shield, Plus, X, Clock,
    Calendar, CheckCircle, Loader2, Save, Trash2
} from 'lucide-react';

interface TimeSlot {
    id: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string;
    isBooked: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return [`${h}:00`, `${h}:30`];
}).flat();

import { tutorService, AvailabilitySlot } from '@/services/tutor.service';

const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatLocalTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return NaN;
    }
    return hours * 60 + minutes;
};

export default function TutorAvailabilityPage() {
    const { user } = useAuthStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [slots, setSlots] = useState<any[]>([]);
    const [showAddSlot, setShowAddSlot] = useState(false);
    const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '10:00' });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [blockedDays, setBlockedDays] = useState<string[]>([]);

    useEffect(() => {
        if (user?.role === 'TUTOR') {
            fetchSlots();
        }
    }, [user]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const res = await tutorService.getMyAvailability();
            if (res.success) {
                // Map backend slots to frontend format
                const mapped: TimeSlot[] = res.slots.map(s => ({
                    id: s._id,
                    date: toLocalDateKey(new Date(s.startTime)),
                    startTime: formatLocalTime(new Date(s.startTime)),
                    endTime: formatLocalTime(new Date(s.endTime)),
                    isBooked: s.isBooked
                }));
                setSlots(mapped);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'TUTOR') {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
            </div>
        );
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = toLocalDateKey(new Date());

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const formatDate = (y: number, m: number, d: number) =>
        `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

    const selectedSlots = slots.filter(s => s.date === selectedDate);
    const isBlocked = selectedDate ? blockedDays.includes(selectedDate) : false;

    const addSlot = () => {
        if (!selectedDate) return;

        const newStart = timeToMinutes(newSlot.startTime);
        const newEnd = timeToMinutes(newSlot.endTime);

        if (!Number.isFinite(newStart) || !Number.isFinite(newEnd) || newStart >= newEnd) {
            alert('End time must be after start time.');
            return;
        }

        const duplicate = slots.some(slot =>
            slot.date === selectedDate &&
            slot.startTime === newSlot.startTime &&
            slot.endTime === newSlot.endTime
        );

        if (duplicate) {
            alert('This time slot already exists for the selected date.');
            return;
        }

        const hasOverlap = slots.some(slot => {
            if (slot.date !== selectedDate) {
                return false;
            }

            const slotStart = timeToMinutes(slot.startTime);
            const slotEnd = timeToMinutes(slot.endTime);

            if (!Number.isFinite(slotStart) || !Number.isFinite(slotEnd)) {
                return false;
            }

            return newStart < slotEnd && newEnd > slotStart;
        });

        if (hasOverlap) {
            alert('Availability slots cannot overlap. Please choose another time range.');
            return;
        }

        const slot: TimeSlot = {
            id: Date.now().toString(),
            date: selectedDate,
            startTime: newSlot.startTime,
            endTime: newSlot.endTime,
            isBooked: false
        };
        setSlots(prev => [...prev, slot]);
        setShowAddSlot(false);
    };

    const removeSlot = (id: string) => {
        const target = slots.find(s => s.id === id);
        if (target?.isBooked) {
            alert('Booked slots cannot be removed.');
            return;
        }
        setSlots(prev => prev.filter(s => s.id !== id));
    };

    const toggleBlockDay = () => {
        if (!selectedDate) return;
        setBlockedDays(prev =>
            prev.includes(selectedDate)
                ? prev.filter(d => d !== selectedDate)
                : [...prev, selectedDate]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const now = new Date();

            // Convert slots to ISO format for backend
            const formattedSlots = slots
                .filter(s => s?.date && s?.startTime && s?.endTime && !s.isBooked)
                .map(s => {
                    const combinedStart = `${s.date}T${s.startTime}:00`;
                    const combinedEnd = `${s.date}T${s.endTime}:00`;
                    const startDate = new Date(combinedStart);
                    const endDate = new Date(combinedEnd);

                    return {
                        startDate,
                        endDate
                    };
                })
                .filter(item => {
                    if (isNaN(item.startDate.getTime()) || isNaN(item.endDate.getTime())) {
                        return false;
                    }

                    if (item.startDate >= item.endDate) {
                        return false;
                    }

                    return item.startDate > now;
                })
                .map(item => ({
                    startTime: item.startDate.toISOString(),
                    endTime: item.endDate.toISOString()
                }));

            const res = await tutorService.updateMyAvailability(formattedSlots);
            if (res.success) {
                if (res.slots) {
                    const mapped: TimeSlot[] = res.slots.map(s => ({
                        id: s._id,
                        date: toLocalDateKey(new Date(s.startTime)),
                        startTime: formatLocalTime(new Date(s.startTime)),
                        endTime: formatLocalTime(new Date(s.endTime)),
                        isBooked: s.isBooked
                    }));
                    setSlots(mapped);
                }
                alert('✅ Availability updated successfully!');
                fetchSlots();
            }
        } catch (e: any) {
            alert('❌ Failed to save: ' + (e.response?.data?.message || e.message));
        } finally {
            setSaving(false);
        }
    };

    const getDaySlotCount = (dateStr: string) => slots.filter(s => s.date === dateStr).length;
    const isDayBlocked = (dateStr: string) => blockedDays.includes(dateStr);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Schedule</p>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Availability Calendar</h1>
                    <p className="text-slate-500 dark:text-slate-400">Set your available time slots and block days off.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Availability'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{MONTHS[month]} {year}</h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                            <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest py-2">{d}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for first week */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {/* Day cells */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = formatDate(year, month, day);
                            const isToday = dateStr === today;
                            const isSelected = dateStr === selectedDate;
                            const slotCount = getDaySlotCount(dateStr);
                            const blocked = isDayBlocked(dateStr);
                            const isPast = new Date(dateStr) < new Date(today);

                            return (
                                <button
                                    key={day}
                                    onClick={() => !isPast && setSelectedDate(dateStr)}
                                    disabled={isPast}
                                    className={cn(
                                        "relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all",
                                        isPast && "opacity-30 cursor-not-allowed",
                                        isSelected && "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
                                        isToday && !isSelected && "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-blue-500/50",
                                        blocked && !isSelected && "bg-red-500/10 text-red-400",
                                        !isSelected && !isToday && !blocked && !isPast && "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    )}
                                >
                                    {day}
                                    {slotCount > 0 && !blocked && (
                                        <div className={cn(
                                            "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                                            isSelected ? "bg-white" : "bg-blue-400"
                                        )} />
                                    )}
                                    {blocked && (
                                        <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
                        {[
                            { color: 'bg-blue-400', label: 'Has slots' },
                            { color: 'bg-red-400', label: 'Blocked' },
                            { color: 'bg-slate-200 dark:bg-white/30', label: 'Today' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                                <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slot Manager */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    {!selectedDate ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
                            <Calendar className="w-12 h-12 mb-4 opacity-40" />
                            <p className="font-medium text-center">Select a date to manage time slots</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{selectedSlots.length} slot(s) set</p>
                                </div>
                                <button
                                    onClick={toggleBlockDay}
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                                        isBlocked
                                            ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                                            : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    )}
                                >
                                    {isBlocked ? '🔓 Unblock Day' : '🚫 Block Day'}
                                </button>
                            </div>

                            {isBlocked ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                                    <p className="text-red-400 font-bold text-sm">This day is blocked</p>
                                    <p className="text-red-400/60 text-xs mt-1">No bookings will be accepted</p>
                                </div>
                            ) : (
                                <>
                                    {/* Existing Slots */}
                                    <div className="space-y-2">
                                        {selectedSlots.map(slot => (
                                            <div key={slot.id} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                                <span className="text-sm font-bold text-slate-900 dark:text-white flex-1">
                                                    {slot.startTime} – {slot.endTime}
                                                </span>
                                                {slot.isBooked && (
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                                        Booked
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => removeSlot(slot.id)}
                                                    disabled={slot.isBooked}
                                                    className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Slot Form */}
                                    {showAddSlot ? (
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Add Time Slot</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Start</label>
                                                    <select
                                                        value={newSlot.startTime}
                                                        onChange={e => setNewSlot(p => ({ ...p, startTime: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    >
                                                        {TIME_OPTIONS.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">End</label>
                                                    <select
                                                        value={newSlot.endTime}
                                                        onChange={e => setNewSlot(p => ({ ...p, endTime: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    >
                                                        {TIME_OPTIONS.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={addSlot} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all">
                                                    Add Slot
                                                </button>
                                                <button onClick={() => setShowAddSlot(false)} className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-all">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowAddSlot(true)}
                                            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400/40 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add Time Slot
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Schedule Summary */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">This Week's Schedule</h2>
                <div className="grid grid-cols-7 gap-2">
                    {DAYS.map((day, i) => {
                        const now = new Date();
                        const dayDate = new Date(now);
                        dayDate.setDate(now.getDate() - now.getDay() + i);
                        const dateStr = toLocalDateKey(dayDate);
                        const daySlots = slots.filter(s => s.date === dateStr);
                        const blocked = isDayBlocked(dateStr);

                        return (
                            <div key={day} className={cn(
                                "rounded-xl p-3 text-center",
                                blocked ? "bg-red-500/10 border border-red-500/20" : daySlots.length > 0 ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                            )}>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">{day}</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{dayDate.getDate()}</p>
                                {blocked ? (
                                    <p className="text-[10px] text-red-400 mt-1">Blocked</p>
                                ) : daySlots.length > 0 ? (
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">{daySlots.length} slot{daySlots.length > 1 ? 's' : ''}</p>
                                ) : (
                                    <p className="text-[10px] text-slate-600 mt-1">Free</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
