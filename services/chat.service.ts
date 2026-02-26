
import api from './api';

export interface Message {
    _id: string;
    chatRoom: string;
    sender: {
        _id: string;
        fullName: string;
        profileImage?: string;
    };
    receiver: string;
    messageType: 'text' | 'image' | 'file';
    message: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
    isRead: boolean;
    isEdited?: boolean;
    isDeleted?: boolean;
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
     * Send a message (Supports optional file attachment)
     */
    sendMessage: async (chatId: string, content: string, file?: File): Promise<Message> => {
        let response;
        
        if (file) {
            const formData = new FormData();
            formData.append('content', content || '');
            formData.append('file', file);
            
            response = await api.post(`/chats/${chatId}/messages`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            response = await api.post(`/chats/${chatId}/messages`, { content });
        }
        
        // Backend returns { success: true, message: { ... } }
        return response.data.message;
    },

    /**
     * Edit a message
     */
    editMessage: async (messageId: string, content: string): Promise<Message> => {
        const response = await api.patch(`/chats/messages/${messageId}`, { content });
        return response.data.message;
    },

    /**
     * Delete a message
     */
    deleteMessage: async (messageId: string): Promise<{ success: boolean }> => {
        const response = await api.delete(`/chats/messages/${messageId}`);
        return response.data;
    },

    /**
     * Delete an entire conversation
     */
    deleteConversation: async (chatId: string): Promise<{ success: boolean }> => {
        const response = await api.delete(`/chats/${chatId}`);
        return response.data;
    },

    /**
     * Mark messages as read
     */
    markRead: async (chatId: string): Promise<{ success: boolean }> => {
        const response = await api.post(`/chats/${chatId}/read`);
        return response.data;
    }
};
