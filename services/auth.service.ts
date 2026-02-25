import api from './api';

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
    fullName?: string; // Align with backend
    phone?: string;
    address?: string;
    speciality?: string;
    role?: 'STUDENT' | 'TUTOR' | 'ADMIN' | 'user' | 'tutor';
}

export interface LoginRequest {
    email: string;
    password: string;
    expectedRole?: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: 'STUDENT' | 'TUTOR' | 'ADMIN' | 'user' | 'tutor' | 'admin';
        name?: string;
        fullName?: string;
        phone?: string;
        speciality?: string;
        address?: string;
        profileImage?: string;
    };
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export const authService = {
    /**
     * Register a new user (unified endpoint)
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        // Map frontend role to backend role
        let role = data.role;
        if (role === 'user') role = 'STUDENT';
        if (role === 'tutor') role = 'TUTOR';

        const payload = {
            ...data,
            fullName: data.fullName || data.name,
            role: role
        };

        try {
            const response = await api.post('/auth/register', payload);
            return response.data;
        } catch (error: any) {
            // Use console.warn instead of console.error to avoid triggering Next.js dev error overlay
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Registration failed. Please try again.';
            const status = error?.response?.status;
            const code = error?.code;

            console.warn('⚠️ Register service error:', { message, status, code });
            throw error;
        }
    },

    /**
     * Register a new admin user (Note: Backend might restrict this)
     */
    registerAdmin: async (data: RegisterRequest): Promise<AuthResponse> => {
        return authService.register({ ...data, role: 'ADMIN' });
    },

    /**
     * Register a new regular user
     */
    registerUser: async (data: RegisterRequest): Promise<AuthResponse> => {
        return authService.register({ ...data, role: 'STUDENT' });
    },

    /**
     * Register a new tutor
     */
    registerTutor: async (data: RegisterRequest): Promise<AuthResponse> => {
        return authService.register({ ...data, role: 'TUTOR' });
    },

    /**
     * Login user
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/login', data);
            return response.data;
        } catch (error: any) {
            // Use console.warn instead of console.error to avoid triggering Next.js dev error overlay
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Login failed. Please try again.';
            const status = error?.response?.status;
            const code = error?.code;

            console.warn('⚠️ Login service error:', { message, status, code });
            throw error;
        }
    },

    /**
     * Refresh access token
     */
    refresh: async (data: RefreshTokenRequest): Promise<{ accessToken: string }> => {
        const response = await api.post('/auth/refresh', data);
        return response.data;
    },

    /**
     * Forgot password - request reset token
     * In development, the response includes devResetLink and emailPreviewUrl
     */
    forgotPassword: async (email: string): Promise<{
        message: string;
        devResetLink?: string;
        emailPreviewUrl?: string;
    }> => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    /**
     * Reset password using token
     */
    resetPassword: async (data: { token: string; newPassword: string }): Promise<{ message: string }> => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },
};
