import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
    name?: string;
    phone?: string;
    address?: string;
    speciality?: string;
    profileImage?: string;
    isVerified?: boolean;
    verificationStatus?: string;
    theme?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            setAuth: (user, accessToken, refreshToken) => 
                set({ 
                    user, 
                    accessToken, 
                    refreshToken, 
                    isAuthenticated: true 
                }),
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
            logout: () => {
                set({ 
                    user: null, 
                    accessToken: null, 
                    refreshToken: null, 
                    isAuthenticated: false 
                });
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage');
                    // Clear the role cookie used by middleware
                    document.cookie = 'user-role=; path=/; max-age=0; SameSite=Lax';
                }
            },
            clearAuth: () => set({ 
                user: null, 
                accessToken: null, 
                refreshToken: null, 
                isAuthenticated: false 
            }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
