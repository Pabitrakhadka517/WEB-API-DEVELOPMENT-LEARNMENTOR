
import api from './api';

export interface AvailabilitySlot {
    _id: string;
    tutorId: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Tutor {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    speciality: string;
    profileImage?: string;
    rating: number;
    reviewCount: number;
    hourlyRate?: number;
    bio?: string;
    experienceYears?: number;
    subjects?: string[];
    languages?: string[];
    isVerified: boolean;
    verificationStatus?: VerificationStatus;
    availableSlots?: AvailabilitySlot[];
}

export interface TutorFilter {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
    minPrice?: number;
    maxPrice?: number;
    language?: string;
    sortBy?: 'rating' | 'price' | 'createdAt' | 'price_asc' | 'price_desc';
    order?: 'asc' | 'desc';
    verifiedOnly?: boolean;
}

export interface TutorResponse {
    success: boolean;
    tutors: Tutor[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const tutorService = {
    /**
     * Get list of tutors with optional filters
     */
    getTutors: async (params: TutorFilter = {}): Promise<TutorResponse> => {
        const response = await api.get('/tutors', { params });
        return response.data;
    },

    /**
     * Get tutor details by ID
     */
    getTutorById: async (id: string): Promise<{ success: boolean; tutor: Tutor }> => {
        const response = await api.get(`/tutors/${id}`);
        return response.data;
    },

    /**
     * Get public tutor availability (future + unbooked)
     */
    getTutorAvailability: async (id: string, startDate?: string, endDate?: string): Promise<{ success: boolean; slots: AvailabilitySlot[] }> => {
        const response = await api.get(`/tutors/${id}/availability`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    /**
     * Get authenticated tutor's availability
     */
    getMyAvailability: async (startDate?: string, endDate?: string): Promise<{ success: boolean; slots: AvailabilitySlot[] }> => {
        const response = await api.get('/tutors/my/availability', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    /**
     * Update authenticated tutor's availability
     */
    updateMyAvailability: async (slots: { startTime: string; endTime: string }[]): Promise<{ success: boolean; message: string }> => {
        const response = await api.post('/tutors/my/availability', { slots });
        return response.data;
    },

    /**
     * Submit profile for verification
     */
    submitVerification: async (): Promise<{ success: boolean; message: string }> => {
        const response = await api.post('/tutors/my/verify/submit');
        return response.data;
    }
};
