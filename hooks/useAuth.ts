import { useState } from 'react';
import { useAuthStore, type User, type UserRole } from '@/store/auth-store';
import { authService, LoginRequest, RegisterRequest, type AuthResponse } from '@/services';

const normalizeUser = (responseUser: AuthResponse['user']): User => {
    const roleMap: Record<string, UserRole> = {
        user: 'STUDENT', student: 'STUDENT', STUDENT: 'STUDENT',
        tutor: 'TUTOR', TUTOR: 'TUTOR',
        admin: 'ADMIN', ADMIN: 'ADMIN',
    };
    return {
        id: responseUser.id,
        email: responseUser.email,
        role: roleMap[responseUser.role] || 'STUDENT',
        fullName: responseUser.fullName || responseUser.name || '',
        name: responseUser.name || responseUser.fullName,
        phone: responseUser.phone,
        address: responseUser.address,
        speciality: responseUser.speciality,
        profileImage: responseUser.profileImage,
    };
};

export const useAuth = () => {
    const { user, accessToken, setAuth, logout: logoutStore } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Attempting login for:', credentials.email);
            const response = await authService.login(credentials);
            console.log('✅ Login successful:', response.user.email);
            setAuth(normalizeUser(response.user), response.accessToken, response.refreshToken);
            return response;
        } catch (err: any) {
            console.error('❌ Login failed:', err);
            
            // Handle different types of errors
            let errorMessage = 'Login failed';
            
            if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network Error')) {
                errorMessage = 'Cannot connect to server. Please ensure the backend server is running on port 4000.';
                console.error('🚨 Network connectivity issue detected. Backend may not be running.');
            } else if (err?.response?.status === 401) {
                errorMessage = 'Invalid email or password';
            } else if (err?.response?.status === 429) {
                errorMessage = 'Too many login attempts. Please try again later.';
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest, role: 'user' | 'tutor' | 'admin' = 'user') => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Attempting registration for:', data.email, 'as', role);
            let response;
            switch (role) {
                case 'admin':
                    response = await authService.registerAdmin(data);
                    break;
                case 'tutor':
                    response = await authService.registerTutor(data);
                    break;
                default:
                    response = await authService.registerUser(data);
            }
            console.log('✅ Registration successful:', response.user.email);
            setAuth(normalizeUser(response.user), response.accessToken, response.refreshToken);
            return response;
        } catch (err: any) {
            console.error('❌ Registration failed:', err);
            
            // Handle different types of errors
            let errorMessage = 'Registration failed';
            
            if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network Error')) {
                errorMessage = 'Cannot connect to server. Please ensure the backend server is running on port 4000.';
                console.error('🚨 Network connectivity issue detected. Backend may not be running.');
            } else if (err?.response?.status === 400 && err?.response?.data?.message?.includes('Email already exists')) {
                errorMessage = 'Email address is already registered. Please try logging in instead.';
            } else if (err?.response?.status === 429) {
                errorMessage = 'Too many registration attempts. Please try again later.';
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.logout();
            logoutStore();
        } catch (err: any) {
            // Even if logout fails on backend, clear local state
            logoutStore();
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        loading,
        error,
        login,
        register,
        logout,
    };
};
