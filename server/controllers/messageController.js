const Message = require('../models/Message');
const Project = require('../models/Project');
const User = require('../models/User');
const socketService = require('../utils/socketService');

// @desc    Get conversations for current user
// @route   GET /api/messages/conversations
// @access  Private (GP and PACC only)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!['gram_panchayat_user', 'district_pacc_admin'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to Gram Panchayat and District PACC users'
      });
    }

    let conversations = [];

    if (userRole === 'gram_panchayat_user') {
      // Get projects created by this GP user
      const projects = await Project.find({ 
        createdBy: userId,
        status: { $in: ['Awaiting PACC Approval', 'On Hold'] }
      }).populate('createdBy', 'name email');

      for (const project of projects) {
        // Find PACC admin for this district
        const paccAdmin = await User.findOne({
          role: 'district_pacc_admin',
          'jurisdiction.district': project.location.district,
          'jurisdiction.state': project.location.state
        });

        if (paccAdmin) {
          const conversationId = Message.generateConversationId(project._id, userId, paccAdmin._id);
          
          // Get last message and unread count
          const lastMessage = await Message.findOne({ conversationId })
            .sort({ createdAt: -1 })
            .populate('senderId', 'name');

          const unreadCount = await Message.countDocuments({
            conversationId,
            receiverId: userId,
            isRead: false
          });

          conversations.push({
            conversationId,
            projectId: project._id,
            projectName: project.projectName,
            projectStatus: project.status,
            partnerId: paccAdmin._id,
            partnerName: paccAdmin.name,
            partnerRole: 'district_pacc_admin',
            lastMessage: lastMessage ? {
              content: lastMessage.content,
              timestamp: lastMessage.createdAt,
              senderName: lastMessage.senderId.name,
              isFromMe: lastMessage.senderId._id.toString() === userId.toString()
            } : null,
            unreadCount
          });
        }
      }
    } else if (userRole === 'district_pacc_admin') {
      // Get projects in this district that are awaiting PACC approval
      const projects = await Project.find({
        'location.district': req.user.jurisdiction.district,
        'location.state': req.user.jurisdiction.state,
        status: { $in: ['Awaiting PACC Approval', 'On Hold'] }
      }).populate('createdBy', 'name email');

      for (const project of projects) {
        const conversationId = Message.generateConversationId(project._id, project.createdBy._id, userId);
        
        // Get last message and unread count
        const lastMessage = await Message.findOne({ conversationId })
          .sort({ createdAt: -1 })
          .populate('senderId', 'name');

        const unreadCount = await Message.countDocuments({
          conversationId,
          receiverId: userId,
          isRead: false
        });

        conversations.push({
          conversationId,
          projectId: project._id,
          projectName: project.projectName,
          projectStatus: project.status,
          partnerId: project.createdBy._id,
          partnerName: project.createdBy.name,
          partnerRole: 'gram_panchayat_user',
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.createdAt,
            senderName: lastMessage.senderId.name,
            isFromMe: lastMessage.senderId._id.toString() === userId.toString()
          } : null,
          unreadCount
        });
      }
    }

    res.status(200).json({
      success: true,
      data: conversations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving conversations',
      error: error.message
    });
  }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private (GP and PACC only)
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of this conversation
    const messageExists = await Message.findOne({
      conversationId,
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    if (!messageExists) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .populate('projectId', 'projectName status')
      .sort({ createdAt: 1 });

    // Mark messages as read for current user
    await Message.updateMany(
      { 
        conversationId, 
        receiverId: userId, 
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving messages',
      error: error.message
    });
  }
};

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private (GP and PACC only)
exports.sendMessage = async (req, res) => {
  try {
    const { 
      projectId, 
      receiverId, 
      content, 
      messageType = 'text', 
      priority = 'medium',
      relatedAction,
      metadata 
    } = req.body;

    const senderId = req.user._id;
    const senderRole = req.user.role;

    if (!['gram_panchayat_user', 'district_pacc_admin'].includes(senderRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to Gram Panchayat and District PACC users'
      });
    }

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify receiver exists and has correct role
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    const receiverRole = receiver.role;
    if (!['gram_panchayat_user', 'district_pacc_admin'].includes(receiverRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receiver role'
      });
    }

    // Generate conversation ID
    const conversationId = Message.generateConversationId(projectId, 
      senderRole === 'gram_panchayat_user' ? senderId : receiverId,
      senderRole === 'district_pacc_admin' ? senderId : receiverId
    );

    // Create message
    const message = new Message({
      conversationId,
      projectId,
      senderId,
      receiverId,
      senderRole,
      receiverRole,
      messageType,
      content,
      priority,
      relatedAction,
      metadata
    });

    await message.save();

    // Populate message with user details
    await message.populate([
      { path: 'senderId', select: 'name email role' },
      { path: 'receiverId', select: 'name email role' },
      { path: 'projectId', select: 'projectName status' }
    ]);

    // Send real-time notification
    socketService.notifyNewMessage(message);

    res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/mark-read/:conversationId
// @access  Private (GP and PACC only)
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const result = await Message.updateMany(
      { 
        conversationId, 
        receiverId: userId, 
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.status(200).json({
      success: true,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private (GP and PACC only)
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting unread count',
      error: error.message
    });
  }
};

// @desc    Initiate conversation with District PACC
// @route   POST /api/messages/initiate-conversation
// @access  Private (GP only)
exports.initiateConversation = async (req, res) => {
  try {
    const { projectId, content } = req.body;
    const gpUserId = req.user._id;
    const userRole = req.user.role;

    if (userRole !== 'gram_panchayat_user') {
      return res.status(403).json({
        success: false,
        message: 'Only Gram Panchayat users can initiate conversations'
      });
    }

    // Verify project exists and belongs to this GP user
    const project = await Project.findOne({ 
      _id: projectId,
      createdBy: gpUserId 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    // Find District PACC admin for this project's location
    const paccAdmin = await User.findOne({
      role: 'district_pacc_admin',
      'jurisdiction.district': project.location.district,
      'jurisdiction.state': project.location.state
    });

    if (!paccAdmin) {
      return res.status(404).json({
        success: false,
        message: 'District PACC admin not found for this location'
      });
    }

    // Generate conversation ID
    const conversationId = Message.generateConversationId(projectId, gpUserId, paccAdmin._id);

    // Check if conversation already exists
    const existingMessage = await Message.findOne({ conversationId });
    if (existingMessage) {
      return res.status(400).json({
        success: false,
        message: 'Conversation already exists for this project'
      });
    }

    // Create initial message
    const message = new Message({
      conversationId,
      projectId,
      senderId: gpUserId,
      receiverId: paccAdmin._id,
      senderRole: 'gram_panchayat_user',
      receiverRole: 'district_pacc_admin',
      messageType: 'query',
      content: content || `Hello, I would like to discuss the project "${project.projectName}". Please let me know if you need any additional information or clarification.`,
      priority: 'medium',
      relatedAction: 'general_inquiry',
      metadata: {
        projectStatus: project.status,
        queryType: 'general_inquiry'
      }
    });

    await message.save();

    // Populate message with user details
    await message.populate([
      { path: 'senderId', select: 'name email role' },
      { path: 'receiverId', select: 'name email role' },
      { path: 'projectId', select: 'projectName status' }
    ]);

    // Send real-time notification
    socketService.notifyNewMessage(message);

    res.status(201).json({
      success: true,
      data: message,
      message: 'Conversation initiated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initiating conversation',
      error: error.message
    });
  }
};

// @desc    Create initial message for project rejection
// @route   POST /api/messages/project-rejection
// @access  Private (PACC only)
exports.createRejectionMessage = async (req, res) => {
  try {
    const { projectId, rejectionReason, additionalComments } = req.body;
    const paccUserId = req.user._id;

    if (req.user.role !== 'district_pacc_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only District PACC admins can create rejection messages'
      });
    }

    // Get project and its creator
    const project = await Project.findById(projectId).populate('createdBy');
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const gpUserId = project.createdBy._id;
    const conversationId = Message.generateConversationId(projectId, gpUserId, paccUserId);

    const content = `Project "${project.projectName}" has been rejected.\n\nReason: ${rejectionReason}\n\n${additionalComments ? `Additional Comments: ${additionalComments}` : ''}\n\nPlease address the concerns mentioned above and resubmit your project proposal.`;

    const message = new Message({
      conversationId,
      projectId,
      senderId: paccUserId,
      receiverId: gpUserId,
      senderRole: 'district_pacc_admin',
      receiverRole: 'gram_panchayat_user',
      messageType: 'rejection_reason',
      content,
      priority: 'high',
      relatedAction: 'project_rejection',
      metadata: {
        projectStatus: project.status,
        rejectionReason,
        queryType: 'rejection_notification'
      }
    });

    await message.save();
    await message.populate([
      { path: 'senderId', select: 'name email role' },
      { path: 'receiverId', select: 'name email role' },
      { path: 'projectId', select: 'projectName status' }
    ]);

    res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating rejection message',
      error: error.message
    });
  }
};