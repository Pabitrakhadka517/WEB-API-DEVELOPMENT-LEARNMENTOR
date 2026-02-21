import { useState, useCallback } from 'react';
import { adminService, AdminUser, AdminStats } from '@/services';

export const useAdmin = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data.users);
            return data.users;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch users';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPlatformStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getPlatformStats();
            setStats(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch platform stats';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const seedTutors = useCallback(async (count: number = 5) => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.seedTutors(count);
            await fetchAllUsers();
            await fetchPlatformStats();
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to seed tutors';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [fetchAllUsers, fetchPlatformStats]);

    return {
        users,
        stats,
        loading,
        error,
        fetchAllUsers,
        fetchPlatformStats,
        seedTutors
    };
};
