'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';
import { chatService, Chat, Message, authService } from '@/services';
import { Loader2, Send, Search, ArrowLeft, MoreVertical, Paperclip, CheckCheck, Check, MessageCircle, FileIcon, Download, X, ImageIcon, FileText, Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const getSocketUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return apiUrl.replace(/\/api\/?$/, ''); // Remove trailing /api
};

const SOCKET_URL = getSocketUrl();

const dedupeMessagesById = (items: Message[]): Message[] => {
    const seen = new Set<string>();
    const unique: Message[] = [];

    for (const item of items) {
        if (!item?._id || seen.has(item._id)) continue;
        seen.add(item._id);
        unique.push(item);
    }

    return unique;
};

export default function MessagesPage() {
    const { user, accessToken } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryChatId = searchParams.get('chatId');

    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [editContent, setEditContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize Socket with token refresh support
    useEffect(() => {
        if (!user || !accessToken) return;

        let cancelled = false;
        let refreshingToken = false;

        const connectSocket = async () => {
            let token = useAuthStore.getState().accessToken;
            if (!token) return;

            const newSocket = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket', 'polling'],
                reconnection: false, // We handle reconnection manually on auth errors
            });

            newSocket.on('connect', () => {
                console.log('Socket connected at', SOCKET_URL);
            });

            newSocket.on('connect_error', async (err: any) => {
                const isAuthError = err?.message?.includes('Authentication error');
                if (isAuthError && !refreshingToken) {
                    refreshingToken = true;
                    const refreshToken = useAuthStore.getState().refreshToken;
                    if (refreshToken) {
                        try {
                            const res = await authService.refresh({ refreshToken });
                            const currentUser = useAuthStore.getState().user;
                            if (currentUser && res.accessToken && !cancelled) {
                                useAuthStore.getState().setAuth(currentUser, res.accessToken, refreshToken);
                                // Update socket auth and reconnect with fresh token
                                (newSocket as any).auth = { token: res.accessToken };
                                newSocket.connect();
                            }
                        } catch {
                            // Token refresh failed — do NOT logout, just log a warning.
                            // The user can still browse; chat will work once they re-login.
                            console.warn('⚠️ Socket token refresh failed. Real-time messaging unavailable.');
                        } finally {
                            refreshingToken = false;
                        }
                        return;
                    }
                }
                console.warn('⚠️ Socket connection error:', err?.message || err);
            });

            newSocket.on('receive_message', (message: Message) => {
                setMessages((prev) => {
                    // Check if message belongs to current chat
                    if (selectedChat && ((message as any).chatRoom === selectedChat._id)) {
                        return dedupeMessagesById([...prev, message]);
                    }
                    return prev;
                });

                // Update last message in chat list
                setChats(prev => prev.map(c => {
                    if (c._id === (message as any).chatRoom) {
                        let displayMsg = message.message;
                        if (message.messageType === 'image') displayMsg = '📷 Image';
                        else if (message.messageType === 'file') displayMsg = '📄 Attachment';

                        return {
                            ...c,
                            lastMessage: displayMsg,
                            lastMessageAt: message.createdAt,
                            unreadCount: (selectedChat?._id === c._id) ? 0 : (c.unreadCount || 0) + 1,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return c;
                }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
            });

            newSocket.on('message_edited', (data: { messageId: string, newContent: string, updatedAt: string }) => {
                setMessages(prev => prev.map(m => m._id === data.messageId ? { ...m, message: data.newContent, isEdited: true, updatedAt: data.updatedAt } : m));
            });

            newSocket.on('message_deleted', (data: { messageId: string }) => {
                setMessages(prev => prev.map(m => m._id === data.messageId ? { ...m, isDeleted: true, message: 'This message was deleted' } : m));
            });

            if (!cancelled) {
                setSocket(newSocket);
            } else {
                newSocket.disconnect();
            }
        };

        connectSocket();

        return () => {
            cancelled = true;
            setSocket(prev => {
                prev?.disconnect();
                return null;
            });
        };
    }, [user, accessToken, selectedChat]);

    // Fetch Chats
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await chatService.getChats();
                if (data.success) {
                    setChats(data.chats);

                    if (queryChatId) {
                        const targetChat = data.chats.find(c => c._id === queryChatId);
                        if (targetChat) setSelectedChat(targetChat);
                    }
                }
            } catch (err) {
                console.warn('⚠️ Failed to fetch chats:', err);
            } finally {
                setLoadingChats(false);
            }
        };

        fetchChats();
    }, [queryChatId]);

    // Fetch Messages when chat selected
    useEffect(() => {
        if (!selectedChat || !socket) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                // Join room
                socket.emit('join_room', { chatId: selectedChat._id });

                const data = await chatService.getMessages(selectedChat._id);
                if (data.success) {
                    setMessages(dedupeMessagesById(data.messages));
                }
            } catch (err) {
                console.warn('⚠️ Failed to fetch messages:', err);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [selectedChat, socket]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size limit validation (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit.');
            return;
        }

        setSelectedFile(file);

        // Generate preview for images
        if (file.mimetype?.startsWith('image/') || file.type?.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedChat) return;

        const msgContent = newMessage;
        const fileToSend = selectedFile;
        
        setNewMessage(''); // Clear input immediately
        removeSelectedFile();
        setUploading(true);

        try {
            const message = await chatService.sendMessage(selectedChat._id, msgContent, fileToSend as File);
            setMessages(prev => dedupeMessagesById([...prev, message]));

            // Update chat list snippet
            setChats(prev => prev.map(c => {
                if (c._id === selectedChat._id) {
                    const lastSnippet = fileToSend 
                        ? (fileToSend.type.startsWith('image/') ? '📷 Image' : `📄 ${fileToSend.name}`)
                        : msgContent;
                    return { ...c, lastMessage: lastSnippet, lastMessageAt: new Date().toISOString() };
                }
                return c;
            }));
        } catch (err) {
            console.warn('⚠️ Failed to send message:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleEditMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMessage || !editContent.trim()) return;

        try {
            const updated = await chatService.editMessage(editingMessage._id, editContent);
            setMessages(prev => prev.map(m => m._id === updated._id ? { ...m, ...updated } : m));
            setEditingMessage(null);
            setEditContent('');
        } catch (err) {
            console.warn('⚠️ Failed to edit message:', err);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await chatService.deleteMessage(messageId);
            setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted: true, message: 'This message was deleted' } : m));
        } catch (err) {
            console.warn('⚠️ Failed to delete message:', err);
        }
    };

    const handleDeleteConversation = async () => {
        if (!selectedChat) return;
        if (!confirm('Delete this conversation? It will be hidden from your active list.')) return;

        try {
            await chatService.deleteConversation(selectedChat._id);
            setChats(prev => prev.filter(c => c._id !== selectedChat._id));
            setSelectedChat(null);
        } catch (err) {
            console.warn('⚠️ Failed to delete conversation:', err);
        }
    };

    const getOtherParticipant = (chat: Chat) => {
        if (!user || !chat || !chat.participants) return { fullName: 'Unknown User', profileImage: undefined };

        const currentUserId = user.id || (user as any)._id;

        // Safe access to nested participants
        const student = chat.participants.student;
        const tutor = chat.participants.tutor;

        // If participants are just IDs (strings), we can't show name. Fallback.
        if (typeof student === 'string' || typeof tutor === 'string') {
            return { fullName: 'User', profileImage: undefined };
        }

        if (user.role === 'STUDENT') {
            return tutor || { fullName: 'Tutor', profileImage: undefined };
        }

        // If current user is the student in this chat (e.g. admin testing as student)
        if (student?._id === currentUserId) return tutor;

        return student || { fullName: 'Student', profileImage: undefined };
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return ''; }
    };

    const filteredChats = chats.filter(chat => {
        const other = getOtherParticipant(chat);
        return other.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            {/* Sidebar / Chat List */}
            <div className={cn(
                "w-full md:w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-900",
                selectedChat ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingChats ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                            No conversations found.
                        </div>
                    ) : (
                        filteredChats.map(chat => {
                            const other = getOtherParticipant(chat);
                            const lastMsg = chat.lastMessage || 'Start a conversation';
                            const isActive = selectedChat?._id === chat._id;

                            return (
                                <button
                                    key={chat._id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={cn(
                                        "w-full p-4 flex items-start space-x-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left",
                                        isActive && "bg-slate-100 dark:bg-slate-800 border-l-2 border-blue-500"
                                    )}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden">
                                            {other.profileImage ? (
                                                <img src={other.profileImage} alt={other.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                other.fullName?.[0] || '?'
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{other.fullName}</h3>
                                            {chat.lastMessageAt && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{formatTime(chat.lastMessageAt)}</span>
                                            )}
                                        </div>
                                        <p className={cn(
                                            "text-sm truncate",
                                            isActive ? "text-slate-600 dark:text-slate-300" : "text-slate-500 dark:text-slate-400",
                                            chat.unreadCount > 0 && "font-semibold text-slate-900 dark:text-white"
                                        )}>
                                            {lastMsg}
                                        </p>
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                            {chat.unreadCount}
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-white dark:bg-slate-900",
                !selectedChat ? "hidden md:flex" : "flex"
            )}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setSelectedChat(null)}
                                    className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                {(() => {
                                    const other = getOtherParticipant(selectedChat);
                                    return (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden">
                                                {other.profileImage ? (
                                                    <img src={other.profileImage} alt={other.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    other.fullName?.[0] || '?'
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white">{other.fullName}</h3>
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5"></span>
                                                    Online
                                                </span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={handleDeleteConversation}
                                    title="Delete Conversation"
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loadingMessages ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 opacity-50">
                                    <MessageCircle className="w-16 h-16 mb-4" />
                                    <p>No messages yet. Say hello!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const currentUserId = user?.id || (user as any)?._id;
                                    const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
                                    const isMe = senderId === currentUserId;
                                    const messageKey = msg._id ? `${msg._id}-${idx}` : `msg-${idx}-${msg.createdAt}`;

                                    return (
                                        <div key={messageKey} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[75%] rounded-2xl overflow-hidden",
                                                isMe ? "rounded-tr-none" : "rounded-tl-none"
                                            )}>
                                                <div className={cn(
                                                    "px-4 py-3 text-sm relative group/msg",
                                                    isMe
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                                                )}>
                                                    {isMe && !msg.isDeleted && (
                                                        <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity bg-black/20 rounded-lg p-1">
                                                            {msg.messageType === 'text' && (
                                                                <button onClick={() => { setEditingMessage(msg); setEditContent(msg.message); }} className="p-1 hover:text-blue-300">
                                                                    <Edit3 className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDeleteMessage(msg._id)} className="p-1 hover:text-red-400">
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {msg.messageType === 'image' && msg.fileUrl && !msg.isDeleted && (
                                                        <div className="mb-2 -mx-1 -mt-1 rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
                                                            <img 
                                                                src={msg.fileUrl} 
                                                                alt="Attachment" 
                                                                className="max-w-full h-auto object-cover hover:scale-[1.02] transition-transform cursor-pointer" 
                                                                onClick={() => window.open(msg.fileUrl, '_blank')}
                                                            />
                                                        </div>
                                                    )}

                                                    {msg.messageType === 'file' && msg.fileUrl && !msg.isDeleted && (
                                                        <div className={cn(
                                                            "mb-2 p-3 rounded-xl flex items-center justify-between gap-4 border",
                                                            isMe ? "bg-blue-700/50 border-blue-400/30" : "bg-white/10 border-slate-300 dark:border-slate-600"
                                                        )}>
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="p-2 rounded-lg bg-white/20">
                                                                    <FileText className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-xs truncate max-w-[150px]">{msg.fileName || 'Document'}</p>
                                                                    <p className="text-[10px] opacity-60 uppercase">Attachment</p>
                                                                </div>
                                                            </div>
                                                            <a 
                                                                href={msg.fileUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                                                title="Download"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    )}

                                                    <p className={cn(msg.isDeleted && "italic opacity-60")}>
                                                        {msg.message}
                                                    </p>

                                                    <div className={cn(
                                                        "text-[10px] mt-1 flex items-center justify-end opacity-70",
                                                        isMe ? "text-blue-200" : "text-slate-500 dark:text-slate-400"
                                                    )}>
                                                        {msg.isEdited && <span className="mr-1 italic">(edited)</span>}
                                                        {formatTime(msg.createdAt)}
                                                        {isMe && (
                                                            msg.isRead ? <CheckCheck className="w-3 h-3 ml-1" /> : <Check className="w-3 h-3 ml-1" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur-sm relative">
                            {/* File Upload Preview */}
                            {selectedFile && !editingMessage && (
                                <div className="absolute bottom-full left-4 mb-4 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                                    {filePreview ? (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                                            <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 pr-8">
                                        <p className="text-sm font-bold truncate max-w-[150px]">{selectedFile.name}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">Ready to send</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={removeSelectedFile}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Message Editing Overlay */}
                            {editingMessage && (
                                <div className="absolute bottom-full left-0 w-full p-4 bg-blue-50 dark:bg-slate-800 border-t border-blue-200 dark:border-slate-700 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                                            <Edit3 className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-blue-600 uppercase">Editing Message</p>
                                            <p className="text-sm truncate text-slate-600 dark:text-slate-400">{editingMessage.message}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setEditingMessage(null); setEditContent(''); }}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={editingMessage ? handleEditMessage : handleSendMessage} className="flex items-center space-x-2">
                                {!editingMessage && (
                                    <>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            onChange={handleFileChange}
                                            accept="image/*, application/pdf, .doc, .docx, .ppt, .pptx, .zip"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-all",
                                                selectedFile ? "bg-blue-600/10 text-blue-600" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                                            )}
                                        >
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                                <input
                                    type="text"
                                    value={editingMessage ? editContent : newMessage}
                                    onChange={(e) => editingMessage ? setEditContent(e.target.value) : setNewMessage(e.target.value)}
                                    placeholder={editingMessage ? "Edit your message..." : (selectedFile ? "Add a caption..." : "Type a message...")}
                                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button
                                    type="submit"
                                    disabled={editingMessage ? !editContent.trim() : ((!newMessage.trim() && !selectedFile) || uploading)}
                                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        editingMessage ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                            <MessageCircle className="w-10 h-10 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select a conversation</h3>
                        <p className="max-w-xs text-center">Refer to the list on the left to view your messages or start a new chat.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
