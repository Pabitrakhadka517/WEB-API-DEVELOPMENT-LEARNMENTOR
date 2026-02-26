
import api from './api';
import { Tutor } from './tutor.service';

interface User {
    _id: string;
    name?: string;
    fullName?: string;
    email: string;
    profileImage?: string;
}

export interface Booking {
    _id: string;
    student: User;
    tutor: User;
    startTime: string; // ISO date string
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
    sessionStatus?: 'booked' | 'confirmed' | 'completed' | 'cancelled';
    paymentStatus?: 'pending' | 'paid' | 'failed';
    notes?: string;
    createdAt: string;
    price: number;
}

/**
 * Filter bookings by status or page
 */
export interface BookingFilter {
    status?: string | 'active' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
}

/**
 * Request payload for creating a booking
 */
export interface CreateBookingRequest {
    tutorId: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export const bookingService = {
    /**
     * Create a new booking
     */
    createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
        const response = await api.post('/bookings/book', data);
        return response.data;
    },

    /**
     * Get bookings (Student or Tutor)
     */
    getBookings: async (params: BookingFilter = {}): Promise<{ success: boolean; bookings: Booking[] }> => {
        const response = await api.get('/bookings', { params });
        return response.data;
    },

    /**
     * Update booking status (Tutor accepts/rejects)
     */
    updateBookingStatus: async (bookingId: string, status: 'CONFIRMED' | 'REJECTED'): Promise<Booking> => {
        const response = await api.patch(`/bookings/${bookingId}/status`, { status });
        return response.data;
    },

    /**
     * Complete a booking (Tutor only)
     */
    completeBooking: async (bookingId: string): Promise<Booking> => {
        const response = await api.patch(`/bookings/${bookingId}/complete`);
        return response.data;
    },

    /**
     * Cancel a booking (Student or Tutor)
     */
    cancelBooking: async (id: string, reason?: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.patch(`/bookings/${id}/cancel`, { reason });
        return response.data;
    },

    /**
     * Update booking details (for students, pending only)
     */
    updateBooking: async (id: string, data: { startTime: string; endTime: string; notes?: string }): Promise<{ success: boolean; message: string; booking: Booking }> => {
        const response = await api.put(`/bookings/${id}`, data);
        return response.data;
    }
};
