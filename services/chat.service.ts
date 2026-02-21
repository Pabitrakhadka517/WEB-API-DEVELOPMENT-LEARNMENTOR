
import api from './api';

export interface Message {
    _id: string;
    sender: {
        _id: string;
        fullName: string;
        profileImage?: string;
    };
    message: string;
    createdAt: string;
    isRead: boolean;
}

export interface Chat {
    _id: string;
    participants: {
        student: { _id: string; fullName: string; profileImage?: string };
        tutor: { _id: string; fullName: string; profileImage?: string };
    };
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
    updatedAt: string;
}

export const chatService = {
    /**
     * Get user's active chats
     */
    getChats: async (): Promise<{ success: boolean; chats: Chat[] }> => {
        const response = await api.get('/chats');
        return response.data;
    },

    /**
     * Get messages for a specific chat
     */
    getMessages: async (chatId: string, page = 1, limit = 50): Promise<{ success: boolean; messages: Message[] }> => {
        const response = await api.get(`/chats/${chatId}/messages`, { params: { page, limit } });
        return response.data;
    },

    /**
     * Create or get existing chat with a user
     */
    createChat: async (targetId: string): Promise<{ success: boolean; chat: Chat }> => {
        const response = await api.post('/chats', { targetId });
        return response.data;
    },

    /**
     * Send a message
     */
    sendMessage: async (chatId: string, content: string): Promise<Message> => {
        const response = await api.post(`/chats/${chatId}/messages`, { content });
        // Backend returns { success: true, message: { ... } }
        return response.data.message;
    },

    /**
     * Mark messages as read
     */
    markRead: async (chatId: string): Promise<{ success: boolean }> => {
        const response = await api.post(`/chats/${chatId}/read`);
        return response.data;
    }
};
