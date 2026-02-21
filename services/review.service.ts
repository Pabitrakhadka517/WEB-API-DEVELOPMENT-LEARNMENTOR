
import api from './api';

export interface Review {
    _id: string;
    student: {
        _id: string;
        fullName: string;
        profileImage?: string;
    };
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface CreateReviewData {
    rating: number;
    comment: string;
}

export interface ReviewListResponse {
    success: boolean;
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export const reviewService = {
    /**
     * Create a review for a completed booking
     */
    createReview: async (bookingId: string, data: CreateReviewData): Promise<{ success: boolean; review: Review }> => {
        const response = await api.post(`/reviews/${bookingId}`, data);
        return response.data;
    },

    /**
     * Get reviews for a specific tutor
     */
    getTutorReviews: async (tutorId: string, page: number = 1, limit: number = 10): Promise<ReviewListResponse> => {
        const response = await api.get(`/reviews/tutor/${tutorId}`, {
            params: { page, limit }
        });
        return response.data;
    }
};
