import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Message {
  _id: string;
  conversationId: string;
  projectId: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  receiverId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  senderRole: string;
  receiverRole: string;
  messageType: string;
  content: string;
  priority: string;
  relatedAction?: string;
  metadata?: any;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Conversation {
  conversationId: string;
  projectId: string;
  projectName: string;
  projectStatus: string;
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderName: string;
    isFromMe: boolean;
  };
  unreadCount: number;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  unreadCount: number;
  onlineUsers: string[];
  typingUsers: { [conversationId: string]: string[] };
  
  // Actions
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (data: {
    projectId: string;
    receiverId: string;
    content: string;
    messageType?: string;
    priority?: string;
  }) => void;
  markMessagesAsRead: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  loadConversations: () => void;
  loadMessages: (conversationId: string) => void;
  initiateConversation: (projectId: string, content?: string) => Promise<any>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: string[] }>({});

  // Initialize socket connection
  useEffect(() => {
    if (user && token && ['gram_panchayat_user', 'district_pacc_admin'].includes(user.role)) {
      const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        withCredentials: true
      });

      socketInstance.on('connect', () => {
        console.log('Connected to messaging server');
        setIsConnected(true);
        socketInstance.emit('user_online');
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from messaging server');
        setIsConnected(false);
      });

      // Message events
      socketInstance.on('new_message', (data) => {
        console.log('New message received:', data);
        
        // Update conversations list
        loadConversations();
        
        // Update messages if this is the current conversation
        if (currentConversation === data.conversationId) {
          loadMessages(data.conversationId);
        }
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
      });

      socketInstance.on('message_received', (data) => {
        // Update messages in real-time
        setMessages(prev => [...prev, data.message]);
      });

      // Project events
      socketInstance.on('project_rejected', (data) => {
        console.log('Project rejected:', data);
        // Show notification
        // You can integrate with a toast notification system here
      });

      socketInstance.on('project_approved', (data) => {
        console.log('Project approved:', data);
        // Show notification
      });

      // Typing events
      socketInstance.on('user_typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.conversationId]: [...(prev[data.conversationId] || []), data.userName]
        }));
      });

      socketInstance.on('user_stopped_typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.conversationId]: (prev[data.conversationId] || []).filter(name => name !== data.userName)
        }));
      });

      // User status events
      socketInstance.on('user_status_change', (data) => {
        if (data.status === 'online') {
          setOnlineUsers(prev => [...prev, data.userId]);
        } else {
          setOnlineUsers(prev => prev.filter(id => id !== data.userId));
        }
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user, token, currentConversation]);

  // Load conversations from API
  const loadConversations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
        
        // Calculate total unread count
        const totalUnread = (data.data || []).reduce((sum: number, conv: Conversation) => sum + conv.unreadCount, 0);
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversation/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
        setCurrentConversation(conversationId);
        
        // Update unread count for this conversation
        setConversations(prev => prev.map(conv => 
          conv.conversationId === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Socket actions
  const joinConversation = (conversationId: string) => {
    socket?.emit('join_conversation', conversationId);
    loadMessages(conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    socket?.emit('leave_conversation', conversationId);
    setCurrentConversation(null);
    setMessages([]);
  };

  const sendMessage = async (data: {
    projectId: string;
    receiverId: string;
    content: string;
    messageType?: string;
    priority?: string;
  }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        // Message will be updated via socket event
        return result.data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/messages/mark-read/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const startTyping = (conversationId: string) => {
    socket?.emit('typing_start', { conversationId });
  };

  const stopTyping = (conversationId: string) => {
    socket?.emit('typing_stop', { conversationId });
  };

  const initiateConversation = async (projectId: string, content?: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/initiate-conversation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ projectId, content })
      });

      if (response.ok) {
        const result = await response.json();
        // Reload conversations to show the new one
        loadConversations();
        return result.data;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initiate conversation');
      }
    } catch (error) {
      console.error('Error initiating conversation:', error);
      throw error;
    }
  };

  // Load conversations on mount
  useEffect(() => {
    if (user && token && ['gram_panchayat_user', 'district_pacc_admin'].includes(user.role)) {
      loadConversations();
    }
  }, [user, token]);

  const value: SocketContextType = {
    socket,
    isConnected,
    conversations,
    currentConversation,
    messages,
    unreadCount,
    onlineUsers,
    typingUsers,
    
    joinConversation,
    leaveConversation,
    sendMessage,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    loadConversations,
    loadMessages,
    initiateConversation
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};