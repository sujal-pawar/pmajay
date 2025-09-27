const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const ProgressUpdate = require('../models/ProgressUpdate');
const Message = require('../models/Message');
const socketService = require('../utils/socketService');

// Get all projects with filtering and pagination
exports.getAllProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      schemeType,
      state,
      district,
      priority,
      search
    } = req.query;

    // Build query object
    const query = {};
    
    if (status) query.status = status;
    if (schemeType) query.schemeType = schemeType;
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (priority) query.priority = priority;
    
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { projectDescription: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply role-based filtering
    if (req.user.role !== 'super_admin' && req.user.role !== 'central_admin') {
      if (req.user.jurisdiction.state) {
        query['location.state'] = req.user.jurisdiction.state;
      }
      if (req.user.jurisdiction.district) {
        query['location.district'] = req.user.jurisdiction.district;
      }
    }

    // For Gram Panchayat users, only show their own projects
    if (req.user.role === 'gram_panchayat_user') {
      query.createdBy = req.user._id;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'createdBy', select: 'name email role' }
      ]
    };

    const projects = await Project.paginate(query, options);

    res.status(200).json({
      success: true,
      data: projects,
      message: 'Projects retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving projects',
      error: error.message
    });
  }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('createdBy', 'name email role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access to this project
    if (!hasProjectAccess(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving project',
      error: error.message
    });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      projectId: req.body.projectId || `PMAJAY-${Date.now()}-${uuidv4().substr(0, 8)}`,
      createdBy: req.user._id
    };

    // Validate user permissions for project creation
    if (!canCreateProject(req.user, projectData)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create project in this location'
      });
    }

    const project = new Project(projectData);
    await project.save();

    await project.populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project ID already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!canUpdateProject(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this project'
      });
    }

    // Update project
    Object.assign(project, req.body);
    await project.save();

    await project.populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!canDeleteProject(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete this project'
      });
    }

    // Check if project has dependencies
    const milestoneCount = await Milestone.countDocuments({ projectId: project._id });
    const progressCount = await ProgressUpdate.countDocuments({ projectId: project._id });
    
    if (milestoneCount > 0 || progressCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing milestones or progress updates'
      });
    }

    await Project.findByIdAndDelete(req.params.projectId);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Get project dashboard data
exports.getProjectDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check access
    if (!hasProjectAccess(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this project'
      });
    }

    // Get aggregated data
    const [milestones, recentUpdates, fundSummary] = await Promise.all([
      Milestone.find({ projectId }).sort({ scheduledDate: 1 }),
      ProgressUpdate.find({ projectId }).sort({ updateDate: -1 }).limit(5)
        .populate('updatedBy', 'name'),
      // Add fund summary aggregation here
    ]);

    const dashboardData = {
      project,
      milestones: {
        total: milestones.length,
        completed: milestones.filter(m => m.status === 'Completed').length,
        pending: milestones.filter(m => m.status === 'Pending').length,
        overdue: milestones.filter(m => m.isOverdue()).length
      },
      recentUpdates,
      timeline: {
        startDate: project.timeline.startDate,
        endDate: project.timeline.scheduledEndDate,
        daysRemaining: project.getDaysRemaining(),
        isOverdue: project.isOverdue()
      },
      financial: {
        estimatedCost: project.financials.estimatedCost,
        sanctionedAmount: project.financials.sanctionedAmount,
        utilized: project.financials.totalUtilized,
        utilizationPercentage: project.progressPercentage
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
      message: 'Project dashboard data retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving project dashboard',
      error: error.message
    });
  }
};

// Helper functions for permission checking
function hasProjectAccess(user, project) {
  if (user.role === 'super_admin' || user.role === 'central_admin') {
    return true;
  }
  
  if (user.jurisdiction.state && project.location.state !== user.jurisdiction.state) {
    return false;
  }
  
  if (user.jurisdiction.district && project.location.district !== user.jurisdiction.district) {
    return false;
  }
  
  return true;
}

function canCreateProject(user, projectData) {
  if (user.role === 'super_admin' || user.role === 'central_admin') {
    return true;
  }
  
  if (user.role === 'state_nodal_admin' || user.role === 'state_sc_corporation_admin') {
    return user.jurisdiction.state === projectData.location.state;
  }
  
  if (user.role === 'district_collector' || user.role === 'district_pacc_admin') {
    return user.jurisdiction.state === projectData.location.state &&
           user.jurisdiction.district === projectData.location.district;
  }
  
  return false;
}

function canUpdateProject(user, project) {
  return hasProjectAccess(user, project) && 
         ['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector'].includes(user.role);
}

function canDeleteProject(user, project) {
  return hasProjectAccess(user, project) && 
         ['super_admin', 'central_admin'].includes(user.role);
}

// @desc    Get projects pending PACC approval
// @route   GET /api/projects/pending-pacc-approval
// @access  Private (District PACC Admin only)
exports.getPendingPACCApprovals = async (req, res) => {
  try {
    // Only District PACC Admin can access this
    if (req.user.role !== 'district_pacc_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to District PACC Admins'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    
    // Filter projects by user's district and pending PACC approval
    const query = {
      'location.state': req.user.jurisdiction.state,
      'location.district': req.user.jurisdiction.district,
      'approvals.paccApprovalStatus': 'Pending',
      status: 'Awaiting PACC Approval'
    };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { 'approvals.submittedForPACCOn': 1 }, // Oldest submissions first
      populate: [
        { path: 'createdBy', select: 'name email role' },
        { path: 'approvals.submittedBy', select: 'name email role' }
      ]
    };

    const pendingProjects = await Project.paginate(query, options);

    res.status(200).json({
      success: true,
      data: pendingProjects,
      message: 'Pending PACC approvals retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving pending PACC approvals',
      error: error.message
    });
  }
};

// @desc    Approve or reject project by PACC
// @route   POST /api/projects/:id/pacc-decision
// @access  Private (District PACC Admin only)
exports.makePACCDecision = async (req, res) => {
  try {
    // Only District PACC Admin can make decisions
    if (req.user.role !== 'district_pacc_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to District PACC Admins'
      });
    }

    const { id } = req.params;
    const { decision, comments, technicalScore, financialScore, socialScore } = req.body;

    // Validate decision
    if (!['Approved', 'Rejected'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Decision must be either "Approved" or "Rejected"'
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project is in user's jurisdiction
    if (project.location.state !== req.user.jurisdiction.state || 
        project.location.district !== req.user.jurisdiction.district) {
      return res.status(403).json({
        success: false,
        message: 'Project is not in your jurisdiction'
      });
    }

    // Check if project is pending PACC approval
    if (project.approvals.paccApprovalStatus !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Project is not pending PACC approval'
      });
    }

    // Update project approval status
    project.approvals.paccApprovalStatus = decision;
    project.approvals.paccApprovalDate = new Date();
    project.approvals.approvedBy = req.user._id;

    // Add appraisal scores if provided
    if (technicalScore || financialScore || socialScore) {
      project.appraisalScores = {
        technicalScore: technicalScore || 0,
        financialScore: financialScore || 0,
        socialScore: socialScore || 0,
        overallScore: Math.round(((technicalScore || 0) + (financialScore || 0) + (socialScore || 0)) / 3),
        appraisedBy: req.user._id,
        appraisalDate: new Date(),
        comments: comments || ''
      };
    }

    // Update project status based on decision
    if (decision === 'Approved') {
      project.status = 'Planned'; // Ready to move to next stage
      // Trigger state-level approval workflow
      project.approvals.stateApprovalStatus = 'Pending';
    } else {
      project.status = 'On Hold'; // Rejected projects go on hold
    }

    await project.save();

    // Populate the updated project
    await project.populate([
      { path: 'createdBy', select: 'name email role' },
      { path: 'approvals.submittedBy', select: 'name email role' },
      { path: 'approvals.approvedBy', select: 'name email role' }
    ]);

    // Send notifications based on decision
    if (decision === 'Approved') {
      console.log(`Project ${project.projectName} approved by PACC and forwarded to state level`);
      // Notify GP user about approval
      socketService.notifyProjectApproval(project._id, project.createdBy._id, {
        projectName: project.projectName,
        approvedBy: req.user.name,
        approvalDate: project.approvals.paccApprovalDate,
        comments: comments
      });
    } else {
      // Create rejection message for GP user
      const gpUserId = project.createdBy._id;
      const conversationId = Message.generateConversationId(project._id, gpUserId, req.user._id);

      const rejectionContent = `Project "${project.projectName}" has been rejected by District PACC.\n\n${comments ? `Reason: ${comments}` : 'No specific reason provided.'}\n\nYou can discuss this decision and ask questions using this chat. Please address the concerns mentioned above and resubmit your project proposal if needed.`;

      const rejectionMessage = new Message({
        conversationId,
        projectId: project._id,
        senderId: req.user._id,
        receiverId: gpUserId,
        senderRole: 'district_pacc_admin',
        receiverRole: 'gram_panchayat_user',
        messageType: 'rejection_reason',
        content: rejectionContent,
        priority: 'high',
        relatedAction: 'project_rejection',
        metadata: {
          projectStatus: project.status,
          rejectionReason: comments || 'No reason provided',
          queryType: 'rejection_notification',
          technicalScore: technicalScore || 0,
          financialScore: financialScore || 0,
          socialScore: socialScore || 0
        }
      });

      await rejectionMessage.save();
      await rejectionMessage.populate([
        { path: 'senderId', select: 'name email role' },
        { path: 'receiverId', select: 'name email role' },
        { path: 'projectId', select: 'projectName status' }
      ]);

      // Send real-time notification
      socketService.notifyNewMessage(rejectionMessage);
      socketService.notifyProjectRejection(project._id, gpUserId, req.user._id, {
        projectName: project.projectName,
        rejectedBy: req.user.name,
        rejectionDate: project.approvals.paccApprovalDate,
        reason: comments,
        conversationId
      });
    }

    res.status(200).json({
      success: true,
      data: project,
      message: `Project ${decision.toLowerCase()} successfully`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error making PACC decision',
      error: error.message
    });
  }
};

// @desc    Get PACC appraisal summary for dashboard
// @route   GET /api/projects/pacc-summary
// @access  Private (District PACC Admin only)
exports.getPACCSummary = async (req, res) => {
  try {
    if (req.user.role !== 'district_pacc_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to District PACC Admins'
      });
    }

    const districtFilter = {
      'location.state': req.user.jurisdiction.state,
      'location.district': req.user.jurisdiction.district
    };

    // Get summary statistics
    const [
      totalProjects,
      pendingApprovals,
      approvedProjects,
      rejectedProjects,
      projectsByScheme,
      recentApprovals
    ] = await Promise.all([
      Project.countDocuments(districtFilter),
      Project.countDocuments({ ...districtFilter, 'approvals.paccApprovalStatus': 'Pending' }),
      Project.countDocuments({ ...districtFilter, 'approvals.paccApprovalStatus': 'Approved' }),
      Project.countDocuments({ ...districtFilter, 'approvals.paccApprovalStatus': 'Rejected' }),
      Project.aggregate([
        { $match: districtFilter },
        { $group: { _id: '$schemeType', count: { $sum: 1 } } }
      ]),
      Project.find({ ...districtFilter, 'approvals.paccApprovalStatus': { $in: ['Approved', 'Rejected'] } })
        .sort({ 'approvals.paccApprovalDate': -1 })
        .limit(10)
        .populate('createdBy', 'name email')
        .populate('approvals.approvedBy', 'name email')
    ]);

    const summary = {
      statistics: {
        totalProjects,
        pendingApprovals,
        approvedProjects,
        rejectedProjects,
        approvalRate: totalProjects > 0 ? Math.round((approvedProjects / (approvedProjects + rejectedProjects)) * 100) : 0
      },
      projectsByScheme: projectsByScheme.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentApprovals
    };

    res.status(200).json({
      success: true,
      data: summary,
      message: 'PACC summary retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving PACC summary',
      error: error.message
    });
  }
};