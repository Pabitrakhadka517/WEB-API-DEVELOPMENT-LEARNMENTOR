import api from './api';

// Exact shape returned by GET /api/admin/users
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;           // 'ADMIN' | 'TUTOR' | 'STUDENT' (or 'user'/'tutor'/'admin' lowercase)
    status: string;         // 'Active' | 'Inactive'
    joined: string;         // ISO date string
    profileImage?: string;
    speciality?: string;
    address?: string;
    hourlyRate?: number;
    verificationStatus?: string;
}

// Exact shape returned by GET /api/admin/stats
export interface AdminStats {
    total: number;
    tutors: number;
    students: number;
    admins: number;
    earnings: {
        totalRevenue: number;
        adminEarnings: number;
        totalTransactions: number;
        averageCommission: string | number;
    };
}

export const adminService = {
    /**
     * GET /api/admin/users
     * Returns paginated users
     */
    getAllUsers: async (page: number = 1, limit: number = 10, role?: string, status?: string): Promise<{ users: AdminUser[]; pagination: any }> => {
        const response = await api.get('/admin/users', {
            params: { page, limit, role: role === 'ALL' ? undefined : role, status }
        });
        return response.data;
    },

    /**
     * GET /api/admin/users/:id
     */
    getUserById: async (id: string): Promise<{ user: AdminUser }> => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    /**
     * PUT /api/admin/users/:id
     */
    updateUser: async (id: string, data: Partial<AdminUser>): Promise<any> => {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data;
    },

    /**
     * DELETE /api/admin/users/:id
     */
    deleteUser: async (id: string): Promise<any> => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    /**
     * GET /api/admin/stats
     * Returns { total, tutors, students, admins }
     */
    getPlatformStats: async (): Promise<AdminStats> => {
        const response = await api.get('/admin/stats');
        const data = response.data;
        if (data?.stats) return data.stats;
        return data;
    },

    /**
     * POST /api/admin/seed/tutors?count=N
     * Returns { success: boolean, message: string }
     */
    seedTutors: async (count: number = 5): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/admin/seed/tutors?count=${count}`);
        return response.data;
    },

    /**
     * PATCH /api/admin/tutors/:tutorId/verify
     * Update tutor verification status
     */
    verifyTutor: async (tutorId: string, status: 'VERIFIED' | 'REJECTED' | 'PENDING'): Promise<any> => {
        const response = await api.patch(`/admin/tutors/${tutorId}/verify`, { status });
        return response.data;
    },
};
