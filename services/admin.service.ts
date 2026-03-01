import { AxiosError } from 'axios';
import api from './api';
import { useAuthStore } from '@/store/auth-store';

export type UserRole = 'ALL' | 'STUDENT' | 'TUTOR' | 'ADMIN';
export type TutorVerificationStatus = 'VERIFIED' | 'REJECTED' | 'PENDING';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    joined: string;
    profileImage?: string;
    speciality?: string;
    address?: string;
    hourlyRate?: number;
    verificationStatus?: TutorVerificationStatus;
}

export interface PaginationMeta {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}

export interface UsersListResponse {
    users: AdminUser[];
    pagination: PaginationMeta;
}

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

export interface UpdateUserPayload {
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: Exclude<UserRole, 'ALL'>;
    status?: 'Active' | 'Inactive';
    isActive?: boolean;
}

export class AdminApiError extends Error {
    status?: number;
    code?: string;

    constructor(message: string, status?: number, code?: string) {
        super(message);
        this.name = 'AdminApiError';
        this.status = status;
        this.code = code;
    }
}

const normalizeUser = (raw: any): AdminUser => {
    const tutorProfile = raw?.tutorProfile;
    return {
        id: raw?.id || raw?._id || '',
        name: raw?.name || raw?.fullName || 'Anonymous',
        email: raw?.email || '',
        phone: raw?.phone || 'N/A',
        role: raw?.role || 'STUDENT',
        status: raw?.status || (raw?.isActive === false ? 'Inactive' : 'Active'),
        joined: raw?.joined || raw?.createdAt || '',
        profileImage: raw?.profileImage,
        speciality: raw?.speciality || tutorProfile?.speciality,
        address: raw?.address,
        hourlyRate: raw?.hourlyRate || tutorProfile?.hourlyRate,
        verificationStatus: raw?.verificationStatus || tutorProfile?.verificationStatus,
    };
};

const assertAdminAccess = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const { accessToken, user } = useAuthStore.getState();
    if (!accessToken || !user) {
        throw new AdminApiError('Authentication required. Please log in again.', 401, 'UNAUTHENTICATED');
    }

    if (user.role !== 'ADMIN') {
        throw new AdminApiError('Admin privileges are required to perform this action.', 403, 'FORBIDDEN');
    }
};

const toAdminError = (error: unknown): never => {
    if (error instanceof AdminApiError) {
        throw error;
    }

    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const status = axiosError?.response?.status;
    const message =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message ||
        'Unexpected admin API error';

    throw new AdminApiError(message, status, axiosError?.code);
};

export const adminService = {
    async getAllUsers(page: number = 1, limit: number = 10, role?: UserRole, status?: string): Promise<UsersListResponse> {
        assertAdminAccess();
        try {
            const response = await api.get('/admin/users', {
                params: { page, limit, role: role === 'ALL' ? undefined : role, status },
            });

            const payload = response.data;
            const users = Array.isArray(payload?.users) ? payload.users.map(normalizeUser) : [];
            const pagination = {
                total: payload?.pagination?.total ?? users.length,
                page: payload?.pagination?.page ?? page,
                totalPages: payload?.pagination?.totalPages ?? 1,
                limit: payload?.pagination?.limit ?? limit,
            };

            return { users, pagination };
        } catch (error) {
            return toAdminError(error);
        }
    },

    async getTutors(page: number = 1, limit: number = 10, verificationStatus?: TutorVerificationStatus): Promise<UsersListResponse> {
        const result = await this.getAllUsers(page, limit, 'TUTOR');
        if (!verificationStatus) {
            return result;
        }

        const tutors = result.users.filter((user) => user.verificationStatus === verificationStatus);
        return {
            users: tutors,
            pagination: {
                ...result.pagination,
                total: tutors.length,
                totalPages: 1,
            },
        };
    },

    async getUserById(id: string): Promise<{ user: AdminUser }> {
        assertAdminAccess();
        try {
            const response = await api.get(`/admin/users/${id}`);
            return { user: normalizeUser(response.data?.user || response.data) };
        } catch (error) {
            return toAdminError(error);
        }
    },

    async updateUser(id: string, data: UpdateUserPayload): Promise<{ success: boolean; message?: string }> {
        assertAdminAccess();
        try {
            const response = await api.put(`/admin/users/${id}`, data);
            return response.data;
        } catch (error) {
            return toAdminError(error);
        }
    },

    async deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
        assertAdminAccess();
        try {
            const response = await api.delete(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            return toAdminError(error);
        }
    },

    async getPlatformStats(): Promise<AdminStats> {
        assertAdminAccess();
        try {
            const response = await api.get('/admin/stats');
            const data = response.data?.stats ? response.data.stats : response.data;
            return data as AdminStats;
        } catch (error) {
            return toAdminError(error);
        }
    },

    async seedTutors(count: number = 5): Promise<{ success: boolean; message: string }> {
        assertAdminAccess();
        try {
            const response = await api.post('/admin/seed/tutors', undefined, {
                params: { count },
            });
            return response.data;
        } catch (error) {
            return toAdminError(error);
        }
    },

    async verifyTutor(tutorId: string, status: TutorVerificationStatus): Promise<{ success: boolean; message?: string }> {
        assertAdminAccess();
        try {
            const response = await api.patch(`/admin/tutors/${tutorId}/verify`, { status });
            return response.data;
        } catch (error) {
            return toAdminError(error);
        }
    },
};
