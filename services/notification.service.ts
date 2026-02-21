
import api from './api';

export interface Notification {
    _id: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    relatedId?: string;
}

export const notificationService = {
    getNotifications: async (page: number = 1, limit: number = 20): Promise<{ success: boolean; notifications: Notification[] }> => {
        const response = await api.get('/notifications', { params: { page, limit } });
        return response.data;
    },

    getUnreadCount: async (): Promise<{ success: boolean; unreadCount: number }> => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (id: string): Promise<void> => {
        await api.patch(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch('/notifications/read-all');
    },

    deleteNotification: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    }
};
