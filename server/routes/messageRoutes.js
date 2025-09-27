const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  createRejectionMessage,
  initiateConversation
} = require('../controllers/messageController');

// Middleware to check if user is GP or PACC
const checkMessagingAccess = (req, res, next) => {
  if (!req.user || !['gram_panchayat_user', 'district_pacc_admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to Gram Panchayat and District PACC users'
    });
  }
  next();
};

// Get all conversations for current user
router.get('/conversations', protect, checkMessagingAccess, getConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId', protect, checkMessagingAccess, getConversationMessages);

// Send a message
router.post('/send', protect, checkMessagingAccess, sendMessage);

// Mark messages as read
router.put('/mark-read/:conversationId', protect, checkMessagingAccess, markMessagesAsRead);

// Get unread message count
router.get('/unread-count', protect, checkMessagingAccess, getUnreadCount);

// Create rejection message (PACC only)
router.post('/project-rejection', protect, createRejectionMessage);

// Initiate conversation with District PACC (GP only)
router.post('/initiate-conversation', protect, checkMessagingAccess, initiateConversation);

module.exports = router;