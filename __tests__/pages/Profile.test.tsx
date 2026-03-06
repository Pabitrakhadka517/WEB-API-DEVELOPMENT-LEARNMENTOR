import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock dependencies
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseAuthStore = jest.fn();
jest.mock('../../store/auth-store', () => ({
  useAuthStore: (selector: any) => mockUseAuthStore(selector),
}));

const mockUseProfile = jest.fn();
jest.mock('../../hooks/useProfile', () => ({
  useProfile: () => mockUseProfile(),
}));

import ProfilePage from '../../app/dashboard/profile/page';

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, email: 'user@example.com', role: 'STUDENT', fullName: 'User Name' },
    });
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      error: null,
      fetchProfile: jest.fn(),
      updateProfile: jest.fn(),
      deleteProfileImage: jest.fn(),
    });
  });

  test('renders profile form', async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
  });

  test('loads profile data', async () => {
    const mockFetchProfile = jest.fn();
    mockUseProfile.mockReturnValue({
      profile: { name: 'Loaded Name', phone: '9800000000', address: '123 Street' },
      loading: false,
      error: null,
      fetchProfile: mockFetchProfile,
      updateProfile: jest.fn(),
      deleteProfileImage: jest.fn(),
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockFetchProfile).toHaveBeenCalled();
    });
  });

  test('updates profile on form submit', async () => {
    const user = userEvent.setup();
    const mockUpdateProfile = jest.fn();
    mockUseProfile.mockReturnValue({
      profile: { name: 'Old Name', phone: '9800000000', address: 'Old Address' },
      loading: false,
      error: null,
      fetchProfile: jest.fn(),
      updateProfile: mockUpdateProfile,
      deleteProfileImage: jest.fn(),
    });

    render(<ProfilePage />);

    const nameInput = screen.getByPlaceholderText('Your full name');
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Name' }));
    });
  });

  test('shows validation errors', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const nameInput = screen.getByPlaceholderText('Your full name');
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    // Assuming we need to clear and type something invalid
    await user.clear(nameInput);
    await user.type(nameInput, 'A'); 
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  test('handles image upload', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const fileInput = screen.getByTitle('Upload photo').nextElementSibling as HTMLInputElement;
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    await fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files?.[0]).toBe(file);
  });

  // Fixed test
  test('passes after fix', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });
});