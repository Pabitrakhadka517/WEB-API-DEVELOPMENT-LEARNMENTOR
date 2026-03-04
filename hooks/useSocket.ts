import { useEffect, useRef, useCallback, useState } from 'react';
import io from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';

const getSocketUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return apiUrl.replace(/\/api\/?$/, '');
};

export interface SocketNotification {
    _id: string;
    recipient: string;
    sender?: string;
    type: string;
    message: string;
    relatedId?: string;
    isRead: boolean;
    createdAt: string;
}

type SocketType = ReturnType<typeof io>;

export const useSocket = () => {
    const socketRef = useRef<SocketType | null>(null);
    const { user, accessToken } = useAuthStore();
    const [isConnected, setIsConnected] = useState(false);

    const connect = useCallback(() => {
        if (socketRef.current?.connected || !accessToken) return;

        socketRef.current = io(getSocketUrl(), {
            auth: { token: accessToken },
            transports: ['websocket', 'polling'],
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketRef.current.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });
    }, [accessToken]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const onNotification = useCallback((callback: (notification: SocketNotification) => void) => {
        if (!socketRef.current) return () => {};

        const handler = (data: SocketNotification) => {
            // Only process notifications for the current user
            if (user?.id && data.recipient === user.id) {
                callback(data);
            }
        };

        socketRef.current.on('new_notification', handler);

        return () => {
            socketRef.current?.off('new_notification', handler);
        };
    }, [user?.id]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        socket: socketRef.current,
        isConnected,
        connect,
        disconnect,
        onNotification,
    };
};
