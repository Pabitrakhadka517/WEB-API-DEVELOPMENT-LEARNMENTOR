import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

console.log('🔧 API Service Configuration:', { API_URL });

// Test backend connectivity on service initialization
const testBackendConnection = async () => {
    try {
        const response = await axios.get('http://localhost:4000/health', { timeout: 5000 });
        console.log('✅ Backend connectivity test passed:', response.data);
    } catch (error: any) {
        console.error('❌ Backend connectivity test failed:', {
            message: error?.message,
            code: error?.code,
            status: error?.response?.status
        });
        console.error('🚨 Frontend cannot reach backend. Please ensure:');
        console.error('   1. Backend server is running on port 4000');
        console.error('   2. No firewall is blocking the connection');
        console.error('   3. Check CORS configuration');
    }
};

// Run connectivity test (only in browser)
if (typeof window !== 'undefined') {
    testBackendConnection();
}

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    console.log('🔄 Making request to:', config.url, 'with method:', config.method);
    if (typeof window !== 'undefined') {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        console.log('✅ Response received:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        // Use console.warn instead of console.error to avoid triggering Next.js dev error overlay
        // for API errors that may be handled gracefully by calling code (e.g. Promise.allSettled)
        if (error?.message || error?.response || error?.code) {
            const errorInfo: Record<string, any> = {
                url: error?.config?.url || 'unknown',
                method: error?.config?.method || 'unknown',
                status: error?.response?.status || 'no response',
                message: error?.response?.data?.message || error?.message || 'unknown error',
                code: error?.code || 'unknown'
            };
            
            // Only include data if it exists and has content
            if (error?.response?.data && Object.keys(error.response.data).length > 0) {
                errorInfo.data = error.response.data;
            }
            
            console.warn('⚠️ API Error:', errorInfo);
        } else {
            console.warn('⚠️ Unknown API Error:', error);
        }

        const originalRequest = error.config;
        
        // Only attempt token refresh if we have a proper request config and it's a 401 error
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = useAuthStore.getState().refreshToken;

            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

                    const { accessToken } = response.data;

                    if (typeof window !== 'undefined') {
                        const currentUser = useAuthStore.getState().user;
                        if (currentUser) {
                            useAuthStore.getState().setAuth(currentUser, accessToken, refreshToken);
                        }
                    }

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    if (typeof window !== 'undefined') {
                        useAuthStore.getState().logout();
                    }
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
