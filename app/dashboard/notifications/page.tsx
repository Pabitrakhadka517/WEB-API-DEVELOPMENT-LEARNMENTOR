'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { notificationService, Notification } from '@/services/notification.service';
import { Loader2, Bell, Check, Trash2, Mail, Calendar, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useSocket, SocketNotification } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';

// Helper for time ago
const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

export default function NotificationsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const { connect, onNotification, disconnect } = useSocket();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications);
            updateUnreadCount(data.notifications);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const updateUnreadCount = (list: Notification[]) => {
        const count = list.filter(n => !n.isRead).length;
        setUnreadCount(count);
    };

    // Handle incoming real-time notification
    const handleNewNotification = useCallback((socketNotif: SocketNotification) => {
        // Only add if it's for the current user and doesn't already exist
        if (user?.id && socketNotif.recipient === user.id) {
            setNotifications(prev => {
                // Check for duplicates
                if (prev.some(n => n._id === socketNotif._id)) {
                    return prev;
                }
                // Add new notification at the top
                const newNotif: Notification = {
                    _id: socketNotif._id,
                    message: socketNotif.message,
                    type: socketNotif.type,
                    isRead: socketNotif.isRead,
                    createdAt: socketNotif.createdAt,
                    relatedId: socketNotif.relatedId,
                };
                return [newNotif, ...prev];
            });
            setUnreadCount(prev => prev + 1);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchNotifications();

        // Connect to socket for real-time updates
        connect();
        const unsubscribe = onNotification(handleNewNotification);

        return () => {
            unsubscribe();
            disconnect();
        };
    }, [connect, disconnect, onNotification, handleNewNotification]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent navigation if row clickable
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'BOOKING_REQUEST':
            case 'BOOKING_CONFIRMED': return <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            case 'NEW_MESSAGE': return <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            case 'REVIEW': return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h1>
                    <p className="text-slate-500 dark:text-slate-400">Stay updated with your latest activities.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        <span>Mark all as read</span>
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <Bell className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notifications</h3>
                    <p className="text-slate-500 dark:text-slate-400">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                            className={cn(
                                "flex items-start p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
                                notification.isRead
                                    ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-700"
                                    : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            )}
                        >
                            {!notification.isRead && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                            )}

                            <div className="bg-white dark:bg-slate-800 p-3 rounded-full mr-4 border border-slate-100 dark:border-slate-700">
                                {getIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0 pr-8">
                                <p className={cn("text-sm mb-1", notification.isRead ? "text-slate-600 dark:text-slate-300" : "text-slate-900 dark:text-white font-medium")}>
                                    {notification.message}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {timeAgo(notification.createdAt)}
                                </p>
                            </div>

                            <button
                                onClick={(e) => handleDelete(notification._id, e)}
                                className="absolute top-4 right-4 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-2 bg-white dark:bg-slate-900 rounded-lg backdrop-blur-sm"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
