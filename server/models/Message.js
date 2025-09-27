const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    required: true,
    enum: ['gram_panchayat_user', 'district_pacc_admin']
  },
  receiverRole: {
    type: String,
    required: true,
    enum: ['gram_panchayat_user', 'district_pacc_admin']
  },
  messageType: {
    type: String,
    enum: ['text', 'query', 'response', 'rejection_reason', 'clarification_request', 'file'],
    default: 'text'
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  relatedAction: {
    type: String,
    enum: ['project_rejection', 'clarification_needed', 'approval_query', 'general_inquiry'],
    required: false
  },
  metadata: {
    projectStatus: String,
    rejectionReason: String,
    queryType: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ projectId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ isRead: 1, receiverId: 1 });

// Virtual for conversation partner
messageSchema.virtual('conversationPartner').get(function() {
  return this.senderRole === 'gram_panchayat_user' ? 'district_pacc_admin' : 'gram_panchayat_user';
});

// Method to generate conversation ID
messageSchema.statics.generateConversationId = function(projectId, gpUserId, paccUserId) {
  // Create consistent conversation ID regardless of who initiates
  const sortedIds = [gpUserId, paccUserId].sort();
  return `CONV-${projectId}-${sortedIds[0]}-${sortedIds[1]}`;
};

// Method to mark message as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;