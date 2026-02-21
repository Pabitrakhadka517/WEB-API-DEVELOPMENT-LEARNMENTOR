import api from './api';

export interface StudyResource {
    _id: string;
    title: string;
    category: string;
    type: 'PDF' | 'VIDEO' | 'MODULE' | 'OTHER';
    url: string;
    size?: string;
    duration?: string;
    tutor: {
        _id: string;
        fullName: string;
        profileImage?: string;
    };
    isPublic: boolean;
    createdAt: string;
}

export const studyService = {
    getResources: async (category?: string) => {
        const response = await api.get('/study', { params: { category } });
        return response.data;
    },

    getMyResources: async () => {
        const response = await api.get('/study/my');
        return response.data;
    },

    uploadResource: async (formData: FormData) => {
        const response = await api.post('/study/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteResource: async (id: string) => {
        const response = await api.delete(`/study/${id}`);
        return response.data;
    }
};
