const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
  }

  initialize(server) {
    // Define allowed origins for Socket.IO
    const allowedOrigins = [
      'http://localhost:3000',  // React dev server
      'https://pmajay.vercel.app'  // Production frontend
    ];

    this.io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        // Only allow GP and PACC users to connect to messaging
        if (!['gram_panchayat_user', 'district_pacc_admin'].includes(user.role)) {
          return next(new Error('Authorization error: Access restricted to GP and PACC users'));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.userData = user;
        
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userData.name} (${socket.userRole}) - Socket ID: ${socket.id}`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, socket.id);

      // Join user to their personal room for direct messaging
      socket.join(`user_${socket.userId}`);

      // Handle joining conversation rooms
      socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`User ${socket.userData.name} joined conversation: ${conversationId}`);
      });

      // Handle leaving conversation rooms
      socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`);
        console.log(`User ${socket.userData.name} left conversation: ${conversationId}`);
      });

      // Handle new message events (for real-time typing indicators, etc.)
      socket.on('typing_start', (data) => {
        socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
          userId: socket.userId,
          userName: socket.userData.name,
          conversationId: data.conversationId
        });
      });

      socket.on('typing_stop', (data) => {
        socket.to(`conversation_${data.conversationId}`).emit('user_stopped_typing', {
          userId: socket.userId,
          conversationId: data.conversationId
        });
      });

      // Handle user status updates
      socket.on('user_online', () => {
        socket.broadcast.emit('user_status_change', {
          userId: socket.userId,
          status: 'online'
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userData.name} - Socket ID: ${socket.id}`);
        
        // Remove user from connected users
        this.connectedUsers.delete(socket.userId);
        
        // Broadcast user offline status
        socket.broadcast.emit('user_status_change', {
          userId: socket.userId,
          status: 'offline'
        });
      });
    });

    console.log('Socket.IO server initialized for messaging');
  }

  // Send message to specific user
  sendMessageToUser(userId, eventName, data) {
    const socketId = this.connectedUsers.get(userId.toString());
    if (socketId) {
      this.io.to(socketId).emit(eventName, data);
      return true;
    }
    return false;
  }

  // Send message to conversation room
  sendMessageToConversation(conversationId, eventName, data, excludeUserId = null) {
    const room = `conversation_${conversationId}`;
    if (excludeUserId) {
      this.io.to(room).except(`user_${excludeUserId}`).emit(eventName, data);
    } else {
      this.io.to(room).emit(eventName, data);
    }
  }

  // Notify about new message
  notifyNewMessage(message) {
    // Send to receiver
    this.sendMessageToUser(message.receiverId, 'new_message', {
      message,
      conversationId: message.conversationId
    });

    // Send to conversation room (for real-time updates)
    this.sendMessageToConversation(message.conversationId, 'message_received', {
      message
    });
  }

  // Notify about project rejection
  notifyProjectRejection(projectId, gpUserId, paccUserId, rejectionData) {
    const notificationData = {
      type: 'project_rejection',
      projectId,
      rejectionData,
      timestamp: new Date()
    };

    // Notify GP user
    this.sendMessageToUser(gpUserId, 'project_rejected', notificationData);
  }

  // Notify about project approval
  notifyProjectApproval(projectId, gpUserId, approvalData) {
    const notificationData = {
      type: 'project_approval',
      projectId,
      approvalData,
      timestamp: new Date()
    };

    // Notify GP user
    this.sendMessageToUser(gpUserId, 'project_approved', notificationData);
  }

  // Get online users
  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId.toString());
  }
}

// Export singleton instance
module.exports = new SocketService();