
import api from './api';

export interface StudentStats {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    totalSpent: number;
}

export interface TutorStats {
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalEarnings: number;
    averageRating: number;
}

export interface DashboardAdminStats {
    totalUsers: number;
    totalStudents: number;
    totalTutors: number;
    totalBookings: number;
    totalRevenue: number;
    pendingVerifications: number;
}

export const dashboardService = {
    /**
     * Get student dashboard stats
     */
    getStudentStats: async (): Promise<{ success: boolean; stats: StudentStats }> => {
        const response = await api.get('/dashboard/student');
        return response.data;
    },

    /**
     * Get tutor dashboard stats
     */
    getTutorStats: async (): Promise<{ success: boolean; stats: TutorStats }> => {
        const response = await api.get('/dashboard/tutor');
        return response.data;
    },

    /**
     * Get admin dashboard stats
     */
    getAdminStats: async (): Promise<{ success: boolean; stats: DashboardAdminStats }> => {
        const response = await api.get('/dashboard/admin');
        return response.data;
    }
};
