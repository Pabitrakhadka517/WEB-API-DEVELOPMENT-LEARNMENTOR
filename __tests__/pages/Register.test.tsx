import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock dependencies
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockAuthService = {
  register: jest.fn(),
};

jest.mock("../../services/auth.service", () => ({
  authService: {
    register: jest.fn(),
  },
}));

import RegisterPage from "../../app/(auth)/register/page";
import { authService } from "../../services/auth.service";

const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe("Register Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form correctly", async () => {
    render(<RegisterPage />);
    await waitFor(() => {
      expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText("Enter your full name")).toBeInTheDocument();
  });

  test("allows selecting role", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    
    // The role labels are "Student" and "Tutor"
    const studentRole = screen.getByText("Student");
    const tutorRole = screen.getByText("Tutor");
    
    expect(studentRole).toBeInTheDocument();
    expect(tutorRole).toBeInTheDocument();

    const tutorRadio = screen.getByDisplayValue("TUTOR");
    await user.click(tutorRadio);
    expect(tutorRadio).toBeChecked();
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Min. 8 characters")).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText("Min. 8 characters");
    // Find the toggle button using its container/role or icon
    // It's the first button without text in the form (Eye icon)
    const toggleButtons = screen.getAllByRole("button").filter(btn => !btn.textContent);

    expect(passwordInput).toHaveAttribute("type", "password");
    if (toggleButtons.length > 0) {
        await user.click(toggleButtons[0]);
        expect(passwordInput).toHaveAttribute("type", "text");
    }
  });
});
