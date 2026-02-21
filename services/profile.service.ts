import api from './api';

export interface ProfileData {
    id: string;
    email: string;
    role: 'STUDENT' | 'TUTOR' | 'ADMIN' | 'user' | 'tutor' | 'admin';
    name?: string;
    fullName?: string;
    phone?: string;
    speciality?: string;
    address?: string;
    profileImage?: string;
    // Tutor specific fields
    bio?: string;
    hourlyRate?: number;
    experienceYears?: number;
    subjects?: string[];
    languages?: string[];
    verificationStatus?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    name?: string;
    fullName?: string;
    phone?: string;
    speciality?: string;
    address?: string;
    bio?: string;
    hourlyRate?: number;
    experienceYears?: number;
    subjects?: string[];
    languages?: string[];
    oldPassword?: string;
    newPassword?: string;
    profileImage?: File;
}

export interface UpdateProfileResponse {
    message: string;
    profile: ProfileData;
}

export const profileService = {
    /**
     * Get current user's profile
     */
    getProfile: async (): Promise<ProfileData> => {
        const response = await api.get('/profile');
        return response.data;
    },

    /**
     * Update user profile (supports both JSON and FormData)
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        // Check if we have a file to upload
        const hasFile = data.profileImage instanceof File;

        if (hasFile) {
            // Use FormData for file upload
            const formData = new FormData();

            if (data.name) formData.append('name', data.name);
            if (data.fullName) formData.append('name', data.fullName);
            if (data.phone) formData.append('phone', data.phone);
            if (data.speciality) formData.append('speciality', data.speciality);
            if (data.address) formData.append('address', data.address);
            if (data.bio) formData.append('bio', data.bio);
            if (data.hourlyRate !== undefined) formData.append('hourlyRate', data.hourlyRate.toString());
            if (data.experienceYears !== undefined) formData.append('experienceYears', data.experienceYears.toString());
            if (data.subjects) formData.append('subjects', JSON.stringify(data.subjects));
            if (data.languages) formData.append('languages', JSON.stringify(data.languages));
            if (data.oldPassword) formData.append('oldPassword', data.oldPassword);
            if (data.newPassword) formData.append('newPassword', data.newPassword);
            if (data.profileImage) formData.append('profileImage', data.profileImage);

            const response = await api.put('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Use JSON for text-only updates
            const { profileImage, ...jsonData } = data;
            const response = await api.put('/profile', jsonData);
            return response.data;
        }
    },

    /**
     * Delete profile image
     */
    deleteProfileImage: async (): Promise<{ message: string }> => {
        const response = await api.delete('/profile/image');
        return response.data;
    },
};
