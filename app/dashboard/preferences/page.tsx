'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import ThemeToggle from '@/components/ThemeToggle';
import {
    User,
    Settings,
    Bell,
    Shield,
    Moon,
    Monitor,
    Palette,
    Save,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

interface UserPreferences {
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        bookingReminders: boolean;
        messageAlerts: boolean;
        weeklyReports: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'private' | 'tutorsOnly';
        showOnlineStatus: boolean;
        allowDirectMessages: boolean;
    };
    accessibility: {
        reduceAnimations: boolean;
        highContrast: boolean;
        largeText: boolean;
    };
}

const PreferencesSettings: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const [preferences, setPreferences] = useState<UserPreferences>({
        notifications: {
            email: true,
            push: true,
            sms: false,
            bookingReminders: true,
            messageAlerts: true,
            weeklyReports: false,
        },
        privacy: {
            profileVisibility: 'public',
            showOnlineStatus: true,
            allowDirectMessages: true,
        },
        accessibility: {
            reduceAnimations: false,
            highContrast: false,
            largeText: false,
        },
    });
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handlePreferenceChange = (
        section: keyof UserPreferences,
        key: string,
        value: any
    ) => {
        setPreferences(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const savePreferences = async () => {
        setLoading(true);
        setSaveStatus('saving');
        
        try {
            // In a real app, you'd save these to the backend
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const isAdmin = user.role === 'ADMIN';
    const isTutor = user.role === 'TUTOR';

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto p-6 lg:p-10">
                {/* Header */}
                <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                Preferences & Settings
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Customize your experience and manage your preferences
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Theme Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <ThemeToggle variant="settings" />
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2 mb-6">
                            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                Notification Preferences
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(preferences.notifications).map(([key, value]) => (
                                <label key={key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2 mb-6">
                            <Shield className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                Privacy Settings
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Profile Visibility
                                </label>
                                <select
                                    value={preferences.privacy.profileVisibility}
                                    onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="public">Public - Visible to everyone</option>
                                    <option value="tutorsOnly">Tutors Only - Only tutors can see your profile</option>
                                    <option value="private">Private - Hidden from search</option>
                                </select>
                            </div>
                            
                            {(['showOnlineStatus', 'allowDirectMessages'] as const).map((key) => (
                                <label key={key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={preferences.privacy[key]}
                                        onChange={(e) => handlePreferenceChange('privacy', key, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Accessibility Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2 mb-6">
                            <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                Accessibility Options
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(preferences.accessibility).map(([key, value]) => (
                                <label key={key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handlePreferenceChange('accessibility', key, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Admin/Tutor Specific Settings */}
                    {(isAdmin || isTutor) && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center space-x-2 mb-6">
                                {isAdmin ? (
                                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                ) : (
                                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                )}
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    {isAdmin ? 'Admin Settings' : 'Tutor Settings'}
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                {isAdmin && (
                                    <>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                                System-wide Theme Control
                                            </h4>
                                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                                Set the default theme for new users and override individual preferences if needed.
                                            </p>
                                            <div className="flex items-center space-x-3">
                                                <label className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    Default Theme:
                                                </label>
                                                <select className="px-3 py-1 text-sm border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-blue-900/50 text-blue-900 dark:text-blue-100">
                                                    <option value="system">System Preference</option>
                                                    <option value="light">Light Mode</option>
                                                    <option value="dark">Dark Mode</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Allow users to override theme settings
                                            </span>
                                            <input
                                                type="checkbox"
                                                defaultChecked={true}
                                                className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                            />
                                        </label>
                                    </>
                                )}
                                
                                {isTutor && (
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Auto-accept bookings
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Show availability in student searches
                                            </span>
                                            <input
                                                type="checkbox"
                                                defaultChecked={true}
                                                className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex items-center justify-end space-x-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        {saveStatus === 'success' && (
                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm">Settings saved successfully!</span>
                            </div>
                        )}
                        
                        {saveStatus === 'error' && (
                            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">Failed to save settings. Please try again.</span>
                            </div>
                        )}
                        
                        <button
                            onClick={savePreferences}
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreferencesSettings;