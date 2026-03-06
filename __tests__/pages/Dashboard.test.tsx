import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

// Mock dependencies
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseAuthStore = jest.fn();
jest.mock("../../store/auth-store", () => ({
  useAuthStore: (selector: any) => mockUseAuthStore(selector),
}));

jest.mock("../../services/dashboard.service", () => ({
  dashboardService: {
    getStudentStats: jest.fn(),
  },
}));

jest.mock("../../services/booking.service", () => ({
  bookingService: {
    getUpcomingBookings: jest.fn(),
    getBookings: jest.fn(),
  },
}));

jest.mock("../../services/tutor.service", () => ({
  tutorService: {
    getRecommendedTutors: jest.fn(),
    getTutors: jest.fn(),
  },
}));

import StudentDashboard from "../../app/dashboard/student/page";
import { dashboardService } from "../../services/dashboard.service";
import { bookingService } from "../../services/booking.service";
import { tutorService } from "../../services/tutor.service";

const mockDashboardService = dashboardService as jest.Mocked<typeof dashboardService>;
const mockBookingService = bookingService as jest.Mocked<typeof bookingService>;
const mockTutorService = tutorService as jest.Mocked<typeof tutorService>;

describe("Student Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, email: "student@example.com", role: "STUDENT", name: "Student User", fullName: "Student User" },
    });
    // Default mock returns to prevent undefined errors
    mockDashboardService.getStudentStats.mockResolvedValue({
      success: true,
      stats: { totalBookings: 0, completedBookings: 0, upcomingBookings: 0, totalSpent: 0 }
    });
    mockBookingService.getBookings.mockResolvedValue({
      success: true,
      bookings: []
    });
    mockTutorService.getTutors.mockResolvedValue({
      success: true,
      tutors: []
    });
  });

  test("renders dashboard correctly", async () => {
    render(<StudentDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome Back, Student/i)).toBeInTheDocument();
    });
  });

  test("displays stats correctly", async () => {
    mockDashboardService.getStudentStats.mockResolvedValueOnce({
      success: true,
      stats: {
        totalBookings: 5,
        completedBookings: 3,
        upcomingBookings: 2,
        totalSpent: 150,
      }
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      // Use getAllByText and pick the one that is likely the stat label (usually the one in the stat card)
      // Or better, search for the text and then filter by class to be more specific
      const labels = screen.getAllByText(/COMPLETED/i);
      const completedLabel = labels.find(el => el.className.includes('tracking-widest'));
      const completedCard = completedLabel?.closest('.bg-white');

      const totalBookingsLabels = screen.getAllByText(/TOTAL BOOKINGS/i);
      const totalBookingsLabel = totalBookingsLabels.find(el => el.className.includes('tracking-widest'));
      const totalBookingsCard = totalBookingsLabel?.closest('.bg-white');

      const totalSpentLabels = screen.getAllByText(/TOTAL SPENT/i);
      const totalSpentLabel = totalSpentLabels.find(el => el.className.includes('tracking-widest'));
      const totalSpentCard = totalSpentLabel?.closest('.bg-white');

      expect(totalBookingsCard).toHaveTextContent("5");
      expect(completedCard).toHaveTextContent("3");
      expect(totalSpentCard).toHaveTextContent(/Rs\. 150/i);
    });
  });

  test("shows upcoming bookings", async () => {
    mockBookingService.getBookings.mockResolvedValueOnce({
      success: true,
      bookings: [
        { 
          _id: "1", 
          tutor: { name: "Tutor One" }, 
          subject: "Math", 
          date: "2024-01-01", 
          startTime: "2024-01-01T10:00:00Z", 
          endTime: "2024-01-01T11:00:00Z", 
          status: "CONFIRMED" 
        },
      ]
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Session with Tutor One/i)).toBeInTheDocument();
    });
  });

  test("displays recommended tutors", async () => {
    mockTutorService.getTutors.mockResolvedValueOnce({
      success: true,
      tutors: [
        { _id: "1", name: "Recommended Tutor", fullName: "Recommended Tutor", speciality: "Science", rating: 4.8 },
      ]
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Recommended Tutor")).toBeInTheDocument();
      expect(screen.getByText("Science")).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    mockDashboardService.getStudentStats.mockRejectedValueOnce(new Error("API Error"));

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });
  });
});
