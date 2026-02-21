'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';

export default function ProfileUpdateExample() {
    const { profile, loading, error, fetchProfile, updateProfile, deleteProfileImage } = useProfile();
    const user = useAuthStore((state) => state.user);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        speciality: '',
        address: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Update form when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                speciality: profile.speciality || '',
                address: profile.address || '',
            });
        }
    }, [profile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed');
                return;
            }

            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const updateData: any = { ...formData };

            // Add image if selected
            if (selectedFile) {
                updateData.profileImage = selectedFile;
            }

            // Add password change if provided
            if (showPasswordChange && passwordData.oldPassword && passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    alert('New passwords do not match');
                    return;
                }

                if (passwordData.newPassword.length < 6) {
                    alert('New password must be at least 6 characters');
                    return;
                }

                updateData.oldPassword = passwordData.oldPassword;
                updateData.newPassword = passwordData.newPassword;
            }

            await updateProfile(updateData);

            alert('Profile updated successfully!');

            // Reset password fields
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordChange(false);

            // Clear file selection
            setSelectedFile(null);
            setPreview(null);
        } catch (err: any) {
            alert(err.message || 'Failed to update profile');
        }
    };

    const handleDeleteImage = async () => {
        if (confirm('Are you sure you want to delete your profile image?')) {
            try {
                await deleteProfileImage();
                alert('Profile image deleted successfully!');
            } catch (err: any) {
                alert(err.message || 'Failed to delete profile image');
            }
        }
    };

    if (loading && !profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Profile Image</h2>

                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            {(preview || profile?.profileImage) ? (
                                <Image
                                    src={preview || profile?.profileImage || ''}
                                    alt="Profile"
                                    width={120}
                                    height={120}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-[120px] h-[120px] rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-4xl text-blue-600 font-bold">
                                        {user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Max file size: 5MB. Supported formats: JPG, PNG, GIF
                            </p>

                            {profile?.profileImage && (
                                <button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Delete current image
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Email (cannot be changed)
                            </label>
                            <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Role
                            </label>
                            <input
                                type="text"
                                value={profile?.role || ''}
                                disabled
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 capitalize"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="9841234567"
                            />
                        </div>

                        {user?.role === 'TUTOR' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Speciality
                                </label>
                                <input
                                    type="text"
                                    value={formData.speciality}
                                    onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Mathematics, Physics"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Address
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your address"
                            />
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Change Password</h2>
                        <button
                            type="button"
                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {showPasswordChange ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>

                    {showPasswordChange && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter new password (min 6 characters)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
