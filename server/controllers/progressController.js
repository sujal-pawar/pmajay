const ProgressUpdate = require('../models/ProgressUpdate');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const { v4: uuidv4 } = require('uuid');

// Get progress updates for a project
exports.getProgressUpdatesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      updateType, 
      startDate, 
      endDate,
      milestoneId 
    } = req.query;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Build query
    const query = { projectId };
    if (updateType) query.updateType = updateType;
    if (milestoneId) query.milestoneId = milestoneId;
    if (startDate || endDate) {
      query.updateDate = {};
      if (startDate) query.updateDate.$gte = new Date(startDate);
      if (endDate) query.updateDate.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { updateDate: -1 },
      populate: [
        { path: 'updatedBy', select: 'name email role' },
        { path: 'milestoneId', select: 'milestoneName category' },
        { path: 'issues.assignedTo', select: 'name email role' },
        { path: 'qualityParameters.checkedBy', select: 'name email role' }
      ]
    };

    const progressUpdates = await ProgressUpdate.paginate(query, options);

    res.status(200).json({
      success: true,
      data: progressUpdates,
      message: 'Progress updates retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving progress updates',
      error: error.message
    });
  }
};

// Get single progress update
exports.getProgressUpdateById = async (req, res) => {
  try {
    const progressUpdate = await ProgressUpdate.findById(req.params.updateId)
      .populate('projectId', 'projectName projectId')
      .populate('milestoneId', 'milestoneName category')
      .populate('updatedBy', 'name email role')
      .populate('issues.assignedTo', 'name email role')
      .populate('qualityParameters.checkedBy', 'name email role');

    if (!progressUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Progress update not found'
      });
    }

    res.status(200).json({
      success: true,
      data: progressUpdate,
      message: 'Progress update retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving progress update',
      error: error.message
    });
  }
};

// Create new progress update
exports.createProgressUpdate = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!canCreateProgressUpdate(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create progress updates for this project'
      });
    }

    // Verify milestone exists if provided
    if (req.body.milestoneId) {
      const milestone = await Milestone.findById(req.body.milestoneId);
      if (!milestone || milestone.projectId.toString() !== projectId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid milestone for this project'
        });
      }
    }

    const updateData = {
      ...req.body,
      projectId,
      updateId: req.body.updateId || `UPD-${Date.now()}-${uuidv4().substr(0, 8)}`,
      updatedBy: req.user._id
    };

    const progressUpdate = new ProgressUpdate(updateData);
    await progressUpdate.save();

    // Update milestone progress if applicable
    if (progressUpdate.milestoneId && progressUpdate.workCompleted.quantitativeMetrics.percentageCompleted) {
      await Milestone.findByIdAndUpdate(
        progressUpdate.milestoneId,
        { 
          completionPercentage: progressUpdate.workCompleted.quantitativeMetrics.percentageCompleted,
          $set: progressUpdate.workCompleted.quantitativeMetrics.percentageCompleted === 100 
            ? { status: 'Completed', actualCompletionDate: new Date() }
            : { status: 'In Progress' }
        }
      );
    }

    await progressUpdate.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'milestoneId', select: 'milestoneName category' },
      { path: 'updatedBy', select: 'name email role' }
    ]);

    res.status(201).json({
      success: true,
      data: progressUpdate,
      message: 'Progress update created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating progress update',
      error: error.message
    });
  }
};

// Update progress update
exports.updateProgressUpdate = async (req, res) => {
  try {
    const progressUpdate = await ProgressUpdate.findById(req.params.updateId)
      .populate('projectId');
    
    if (!progressUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Progress update not found'
      });
    }

    // Check permissions
    if (!canUpdateProgressUpdate(req.user, progressUpdate)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this progress update'
      });
    }

    // Update progress update
    Object.assign(progressUpdate, req.body);
    await progressUpdate.save();

    await progressUpdate.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'milestoneId', select: 'milestoneName category' },
      { path: 'updatedBy', select: 'name email role' }
    ]);

    res.status(200).json({
      success: true,
      data: progressUpdate,
      message: 'Progress update updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating progress update',
      error: error.message
    });
  }
};

// Delete progress update
exports.deleteProgressUpdate = async (req, res) => {
  try {
    const progressUpdate = await ProgressUpdate.findById(req.params.updateId)
      .populate('projectId');
    
    if (!progressUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Progress update not found'
      });
    }

    // Check permissions - only creator or admin can delete
    if (!canDeleteProgressUpdate(req.user, progressUpdate)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete this progress update'
      });
    }

    await ProgressUpdate.findByIdAndDelete(req.params.updateId);

    res.status(200).json({
      success: true,
      message: 'Progress update deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting progress update',
      error: error.message
    });
  }
};

// Get project progress summary
exports.getProjectProgressSummary = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Aggregate progress data
    const [updateStats, issueStats, recentUpdates] = await Promise.all([
      ProgressUpdate.aggregate([
        { $match: { projectId: project._id } },
        { 
          $group: {
            _id: '$updateType',
            count: { $sum: 1 },
            avgProgress: { $avg: '$workCompleted.quantitativeMetrics.percentageCompleted' }
          }
        }
      ]),
      ProgressUpdate.aggregate([
        { $match: { projectId: project._id } },
        { $unwind: '$issues' },
        {
          $group: {
            _id: '$issues.severity',
            count: { $sum: 1 },
            resolved: {
              $sum: {
                $cond: [
                  { $in: ['$issues.resolutionStatus', ['Resolved', 'Closed']] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]),
      ProgressUpdate.find({ projectId })
        .sort({ updateDate: -1 })
        .limit(5)
        .populate('updatedBy', 'name role')
        .select('updateType updateDate workCompleted.description updatedBy')
    ]);

    const summary = {
      project: {
        name: project.projectName,
        id: project.projectId,
        status: project.status,
        overallProgress: project.progressPercentage
      },
      updateStatistics: updateStats,
      issueStatistics: issueStats,
      recentActivity: recentUpdates
    };

    res.status(200).json({
      success: true,
      data: summary,
      message: 'Project progress summary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving project progress summary',
      error: error.message
    });
  }
};

// Get issues across projects
exports.getIssues = async (req, res) => {
  try {
    const { severity, status, assignedTo, projectId } = req.query;
    
    const matchStage = {};
    if (projectId) matchStage.projectId = projectId;
    
    // Apply role-based filtering
    if (req.user.role !== 'super_admin' && req.user.role !== 'central_admin') {
      const locationQuery = {};
      if (req.user.jurisdiction.state) {
        locationQuery['location.state'] = req.user.jurisdiction.state;
      }
      if (req.user.jurisdiction.district) {
        locationQuery['location.district'] = req.user.jurisdiction.district;
      }
      
      const projects = await Project.find(locationQuery).select('_id');
      const projectIds = projects.map(p => p._id);
      matchStage.projectId = { $in: projectIds };
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: '$issues' },
      {
        $match: {
          ...(severity && { 'issues.severity': severity }),
          ...(status && { 'issues.resolutionStatus': status }),
          ...(assignedTo && { 'issues.assignedTo': assignedTo })
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'issues.assignedTo',
          foreignField: '_id',
          as: 'assignedUser'
        }
      },
      {
        $project: {
          projectName: { $arrayElemAt: ['$project.projectName', 0] },
          projectId: { $arrayElemAt: ['$project.projectId', 0] },
          updateDate: 1,
          issue: '$issues',
          assignedUser: { $arrayElemAt: ['$assignedUser', 0] }
        }
      },
      { $sort: { 'issue.severity': -1, updateDate: -1 } }
    ];

    const issues = await ProgressUpdate.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: issues,
      count: issues.length,
      message: 'Issues retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving issues',
      error: error.message
    });
  }
};

// Helper functions
function canCreateProgressUpdate(user, project) {
  if (['super_admin', 'central_admin'].includes(user.role)) {
    return true;
  }
  
  // State level users
  if (['state_nodal_admin', 'state_sc_corporation_admin'].includes(user.role)) {
    return user.jurisdiction.state === project.location.state;
  }
  
  // District and implementation level users
  if (['district_collector', 'district_pacc_admin', 'implementing_agency_user', 'contractor_vendor'].includes(user.role)) {
    return user.jurisdiction.state === project.location.state &&
           user.jurisdiction.district === project.location.district;
  }
  
  // Village level users
  if (user.role === 'gram_panchayat_user') {
    return user.jurisdiction.state === project.location.state &&
           user.jurisdiction.district === project.location.district &&
           user.jurisdiction.village === project.location.village;
  }
  
  return false;
}

function canUpdateProgressUpdate(user, progressUpdate) {
  // Creator can always update their own updates
  if (progressUpdate.updatedBy.toString() === user._id.toString()) {
    return true;
  }
  
  // Admin roles can update any progress update
  if (['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector'].includes(user.role)) {
    return true;
  }
  
  return false;
}

function canDeleteProgressUpdate(user, progressUpdate) {
  // Creator can delete their own updates within 24 hours
  const hoursSinceCreation = (new Date() - progressUpdate.createdAt) / (1000 * 60 * 60);
  if (progressUpdate.updatedBy.toString() === user._id.toString() && hoursSinceCreation <= 24) {
    return true;
  }
  
  // Only admin roles can delete any progress update
  return ['super_admin', 'central_admin'].includes(user.role);
}

// @desc    Get all progress updates with role-based filtering
// @route   GET /api/progress/dashboard
// @access  Private
exports.getDashboardProgressUpdates = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, updateType } = req.query;
    const user = await User.findById(req.user.id);
    
    // Build project filter based on user role and jurisdiction
    const projectQuery = {};
    
    if (user.role !== 'super_admin' && user.role !== 'central_admin') {
      if (user.jurisdiction?.state && user.jurisdiction.state !== 'All') {
        projectQuery['location.state'] = user.jurisdiction.state;
      }
      if (user.jurisdiction?.district && user.jurisdiction.district !== 'All') {
        projectQuery['location.district'] = user.jurisdiction.district;
      }
      if (user.jurisdiction?.village) {
        projectQuery['location.village'] = user.jurisdiction.village;
      }
    }
    
    // Get accessible projects
    const accessibleProjects = await Project.find(projectQuery).select('_id');
    const projectIds = accessibleProjects.map(p => p._id);
    
    // Build progress update query
    const query = { projectId: { $in: projectIds } };
    if (status) query.status = status;
    if (updateType) query.updateType = updateType;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: [
        { path: 'projectId', select: 'projectName location status' },
        { path: 'updatedBy', select: 'name role' },
        { path: 'milestoneId', select: 'milestoneName category' }
      ],
      sort: { updateDate: -1 }
    };

    const progressUpdates = await ProgressUpdate.paginate(query, options);

    res.status(200).json({
      success: true,
      data: progressUpdates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress updates',
      error: error.message
    });
  }
};

// @desc    Create progress update with automatic fund flow trigger
// @route   POST /api/progress/create-with-flow
// @access  Private
exports.createProgressUpdateWithFlow = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { projectId, milestoneId, workCompleted, qualityParameters, issues = [] } = req.body;

    // Verify project and milestone
    const project = await Project.findById(projectId);
    const milestone = await Milestone.findById(milestoneId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    // Check permissions
    if (!canCreateProgressUpdate(user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this project'
      });
    }

    // Create progress update
    const progressUpdate = await ProgressUpdate.create({
      updateId: `UPD-${Date.now()}-${require('crypto').randomBytes(4).toString('hex')}`,
      projectId,
      milestoneId,
      updatedBy: user._id,
      updateDate: new Date(),
      updateType: 'Progress',
      workCompleted,
      qualityParameters,
      issues: issues.map(issue => ({
        ...issue,
        reportedBy: user._id,
        reportedDate: new Date(),
        status: 'Open'
      }))
    });

    // Check if milestone is completed and trigger fund flow
    const completionPercentage = workCompleted?.quantitativeMetrics?.percentageCompleted || 0;
    
    if (completionPercentage >= 100) {
      // Update milestone status
      milestone.status = 'Completed';
      milestone.actualCompletionDate = new Date();
      milestone.completionPercentage = 100;
      await milestone.save();

      // Trigger fund flow if milestone is significant
      await triggerFundFlow(project, milestone, user);
      
      // Update project progress
      await updateProjectProgress(project);
    } else if (completionPercentage > (milestone.completionPercentage || 0)) {
      // Update milestone progress
      milestone.completionPercentage = completionPercentage;
      await milestone.save();
    }

    const populatedUpdate = await ProgressUpdate.findById(progressUpdate._id)
      .populate('projectId', 'projectName location')
      .populate('updatedBy', 'name role')
      .populate('milestoneId', 'milestoneName category');

    res.status(201).json({
      success: true,
      data: populatedUpdate,
      message: 'Progress update created successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating progress update',
      error: error.message
    });
  }
};

// Helper function to trigger fund flow based on milestone completion
async function triggerFundFlow(project, milestone, user) {
  try {
    const FundManagement = require('../models/FundManagement');
    
    // Calculate fund release amount based on milestone
    const milestoneValue = milestone.financials?.allocatedAmount || 
                          (project.financials.sanctionedAmount * 0.25); // 25% per major milestone
    
    // Create fund release record from State Treasury to Implementing Agency
    const fundRelease = await FundManagement.create({
      transactionId: `FR-${Date.now()}-${milestone.milestoneId}`,
      projectId: project._id,
      milestoneId: milestone._id,
      transactionType: 'Release',
      amount: milestoneValue,
      transactionDate: new Date(),
      sourceAgency: 'State Treasury',
      destinationAgency: project.assignedAgencies?.implementingAgency || 'Implementing Agency',
      approvedBy: user._id,
      purpose: `Milestone completion fund release: ${milestone.milestoneName}`,
      status: 'Pending',
      utilizationDetails: {
        category: 'Milestone Payment',
        description: `Fund release for completed milestone: ${milestone.milestoneName}`
      },
      pfmsReferenceNumber: `PFMS-${Date.now()}`,
      documents: [{
        type: 'Milestone Completion Certificate',
        documentNumber: `MCC-${milestone.milestoneId}-${Date.now()}`
      }]
    });

    // Update project financials
    project.financials.totalReleased += milestoneValue;
    await project.save();

    console.log(`Fund flow triggered: ₹${milestoneValue} for milestone ${milestone.milestoneName}`);
    
  } catch (error) {
    console.error('Error triggering fund flow:', error);
  }
}

// Helper function to update overall project progress
async function updateProjectProgress(project) {
  try {
    const milestones = await Milestone.find({ projectId: project._id });
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
    
    const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
    
    // Update project status based on progress
    if (overallProgress === 100) {
      project.status = 'Completed';
      project.timeline.actualEndDate = new Date();
    } else if (overallProgress > 0) {
      project.status = 'In Progress';
    }
    
    // Store progress percentage (you might want to add this field to the Project model)
    project.overallProgress = overallProgress;
    await project.save();
    
  } catch (error) {
    console.error('Error updating project progress:', error);
  }
}