import api from './api';

export interface Announcement {
    _id: string;
    title: string;
    content: string;
    targetRole: 'ALL' | 'STUDENT' | 'TUTOR';
    type: 'INFO' | 'WARNING' | 'URGENT';
    createdAt: string;
}

export const announcementService = {
    create: async (data: any): Promise<any> => {
        const response = await api.post('/admin/announcements', data);
        return response.data;
    },

    getAll: async (): Promise<Announcement[]> => {
        const response = await api.get('/admin/announcements');
        return response.data.announcements || [];
    },

    delete: async (id: string): Promise<any> => {
        const response = await api.delete(`/admin/announcements/${id}`);
        return response.data;
    }
};
