import { useState, useCallback } from 'react';
import { useAuthStore, type User } from '@/store/auth-store';
import { profileService, ProfileData, UpdateProfileRequest } from '@/services';

const toPartialUser = (data: ProfileData): Partial<User> => {
    const roleMap: Record<string, 'STUDENT' | 'TUTOR' | 'ADMIN'> = {
        user: 'STUDENT', student: 'STUDENT', STUDENT: 'STUDENT',
        tutor: 'TUTOR', TUTOR: 'TUTOR',
        admin: 'ADMIN', ADMIN: 'ADMIN',
    };
    return {
        ...data,
        role: data.role ? roleMap[data.role] || 'STUDENT' : undefined,
        fullName: data.fullName || data.name || '',
    };
};

export const useProfile = () => {
    const { updateUser } = useAuthStore();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await profileService.getProfile();
            setProfile(data);
            // Update auth store with latest profile data
            updateUser(toPartialUser(data));
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [updateUser]);

    const updateProfile = async (data: UpdateProfileRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await profileService.updateProfile(data);
            setProfile(response.profile);
            // Update auth store with latest profile data
            updateUser(toPartialUser(response.profile));
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteProfileImage = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await profileService.deleteProfileImage();
            // Refresh profile after deletion
            await fetchProfile();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete profile image';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        deleteProfileImage,
    };
};
