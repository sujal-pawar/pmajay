const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    messageType: {
      type: String,
      required: true,
      enum: ['Query', 'Update', 'Alert', 'Approval', 'Notification', 'Escalation']
    },
    subject: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    attachments: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
      fileSize: Number
    }],
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    readStatus: {
      type: Boolean,
      default: false
    },
    readTimestamp: Date,
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    category: {
      type: String,
      enum: ['Technical', 'Financial', 'Administrative', 'Compliance', 'General']
    },
    relatedDocuments: [{
      documentType: String,
      documentId: String,
      documentUrl: String
    }],
    actionRequired: {
      type: Boolean,
      default: false
    },
    actionDeadline: Date,
    responseRequired: {
      type: Boolean,
      default: false
    },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Communication'
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Communication'
    }],
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Closed', 'Escalated'],
      default: 'Active'
    },
    escalationLevel: {
      type: Number,
      default: 0
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

// Compound indexes
communicationSchema.index({ fromUser: 1, timestamp: -1 });
communicationSchema.index({ toUser: 1, readStatus: 1, timestamp: -1 });
communicationSchema.index({ projectId: 1, timestamp: -1 });
communicationSchema.index({ messageType: 1, priority: 1 });

// Method to mark as read
communicationSchema.methods.markAsRead = function() {
  this.readStatus = true;
  this.readTimestamp = new Date();
  return this.save();
};

// Method to escalate message
communicationSchema.methods.escalate = function() {
  this.escalationLevel += 1;
  this.status = 'Escalated';
  this.priority = 'High';
  return this.save();
};

// Static method to get unread count for user
communicationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ toUser: userId, readStatus: false });
};

// Static method to get high priority messages
communicationSchema.statics.getHighPriorityMessages = function(userId) {
  return this.find({ 
    toUser: userId, 
    priority: 'High', 
    status: { $in: ['Active', 'Escalated'] }
  }).sort({ timestamp: -1 });
};

const Communication = mongoose.model('Communication', communicationSchema);

module.exports = Communication;